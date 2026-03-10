// ═══════════════════════════════════════════════════════════════
//  SKYWARD — lf.js  (Load Factor Engine v3)
//
//  Depends on (must load before this file):
//    competition-index.js  → COMP_MAP, AIRLINE_TIER
//    game-config.js        → FS
//    routes.js             → ROUTES
//    routes-index.js       → AL_IDX, AP_IDX
//    airlines.js           → AIRLINES
//
//  Exposes (called from main HTML and module files):
//    invalidateLFCache()
//    getHubDensityMap()
//    getBaseLF(routeData, pairKey, airlineCode)
//    getMaturityBonus(key)
//    getPromotionBonus(key)
//    calcRouteLFByKey(key)
//    routeLFBreakdown(key)
//    calcAirlineLF(code)
//    calcNetworkLF()
//    calcDailyEarnings()
//    lfLabel(lf)
//    projectedLF(code, willBeAdjacent)
// ═══════════════════════════════════════════════════════════════

'use strict';

// ── Cache ──────────────────────────────────────────────────────

let _hubDensityCache = null;
let _earnCache       = null;

function invalidateLFCache() {
  _hubDensityCache = null;
  _earnCache       = null;
}

// ── Hub Density Map ────────────────────────────────────────────
// Counts player-owned routes per airport across ALL owned airlines.
// Cached; cleared whenever the player unlocks a route or acquires an airline.

function getHubDensityMap() {
  if (_hubDensityCache) return _hubDensityCache;
  const map = {};
  const allKeys = [...(DEMO.unlockedRoutes || []), ...(DEMO.acquiredStarting || [])];
  for (const key of allKeys) {
    const [a, b] = key.split('|');
    map[a] = (map[a] || 0) + 1;
    map[b] = (map[b] || 0) + 1;
  }
  _hubDensityCache = map;
  return map;
}

// ── Flow Bonus ─────────────────────────────────────────────────
// Log-scale bonus from hub density at a single endpoint.
// At 30 routes through an airport the flow bonus caps at +0.096.
// Reflects real-world data: regional hub (~5 routes) ≈10% connecting pax,
// major hub (~30 routes) ≈35% connecting pax, translated to LF impact.

const _FLOW_CAP    = 0.096;  // max flow bonus per endpoint
const _FLOW_SCALE  = Math.log(31); // log(30+1), normaliser

function _flowCurve(n) {
  if (!n || n <= 0) return 0;
  return _FLOW_CAP * Math.log(n + 1) / _FLOW_SCALE;
}

// ── Base LF ────────────────────────────────────────────────────
// Competition-driven base, replacing the old distance-band model.
// Competition level is the primary real-world driver of LF:
//   sole operator → pricing power, no alternative → high fill rate
//   2-3 airlines  → proven demand, moderate price pressure
//   4-5 airlines  → trunk route commoditisation, yield management game
//   6+ airlines   → heavy competition, lowest base
//
// Frequency is a demand signal: a route with 4x/day has demonstrated
// strong O&D demand and tends to attract more connecting traffic.
//
// Airline tier modifier reflects yield management capability:
//   Large airlines have loyalty programmes, better YM tools → slight edge
//   Small airlines as sole operator on thin routes → their speciality → boost
//   Small airlines competing against Large on same route → disadvantaged

function getBaseLF(routeData, pairKey, airlineCode) {
  const nAirlines = (pairKey && COMP_MAP[pairKey]) || 1;
  const freq      = routeData[3] || 1;
  const tier      = AIRLINE_TIER[airlineCode] || 'M';

  // Competition base
  let base;
  if      (nAirlines === 1) base = 0.72;
  else if (nAirlines === 2) base = 0.65;
  else if (nAirlines === 3) base = 0.61;
  else if (nAirlines <= 5)  base = 0.58;
  else                      base = 0.55;

  // Frequency bonus (demand signal)
  let freqBonus;
  if      (freq >= 5) freqBonus = 0.10;
  else if (freq === 4) freqBonus = 0.08;
  else if (freq === 3) freqBonus = 0.06;
  else if (freq === 2) freqBonus = 0.03;
  else                 freqBonus = 0;

  // Airline tier modifier
  let tierMod = 0;
  if (tier === 'L') {
    tierMod = 0.02; // Large: loyalty + YM edge on any route
  } else if (tier === 'S') {
    if (nAirlines === 1) tierMod =  0.05; // Small sole operator: niche specialist
    else if (nAirlines >= 3) tierMod = -0.04; // Small vs large competition: outgunned
  }

  return Math.min(0.76, base + freqBonus + tierMod);
}

// ── Maturity Bonus ─────────────────────────────────────────────
// Routes ramp up over 10 days as the market learns they exist.
// Acquired routes are pre-mature (established operations).

function getMaturityBonus(key) {
  const openDay = DEMO.routeOpenDays[key];
  if (openDay == null) return 0.03; // acquired routes: fully mature
  const age = Math.max(0, DEMO.day - openDay);
  if (age <= 2)  return 0;
  if (age <= 4)  return 0.005;
  if (age <= 6)  return 0.015;
  if (age <= 10) return 0.025;
  return 0.03;
}

// ── Promotion Bonus ────────────────────────────────────────────
// Stacks flash (route-specific), hub (airport-specific), global promotions.

function getPromotionBonus(key) {
  if (!DEMO.activePromotions || !DEMO.activePromotions.length) return 0;
  const [a, b] = key.split('|');
  let bonus = 0;
  for (const p of DEMO.activePromotions) {
    if (p.expiresDay <= DEMO.day) continue;
    if (p.type === 'flash'  && p.target === key)                         bonus += p.bonus;
    if (p.type === 'hub'    && (p.target === a || p.target === b))       bonus += p.bonus;
    if (p.type === 'global')                                              bonus += p.bonus;
  }
  return bonus;
}

// ── Shared route-data lookup ────────────────────────────────────

function _findRouteData(a, b, code) {
  const idxs = AL_IDX[code] || AP_IDX[a] || [];
  for (const i of idxs) {
    const r = ROUTES[i];
    if ((r[0]===a && r[1]===b) || (r[0]===b && r[1]===a)) return r;
  }
  return null;
}

// ── Full per-route LF ──────────────────────────────────────────
// Final formula:
//   LF = clamp(baseLF + flowBonus(A) + flowBonus(B) + maturity + promo + penalty, 0.30, 0.98)
//
// Flow bonus replaces the old connBonusFromN. It uses the hub density map
// (player routes at each endpoint across all airlines) and a log curve.
// Isolation penalty applies when hub density at BOTH endpoints is zero.

function calcRouteLFByKey(key) {
  const [a, b, code] = key.split('|');
  const routeData    = _findRouteData(a, b, code);
  if (!routeData) return 0.55;

  const pairKey   = [a, b].sort().join('|');
  const base      = getBaseLF(routeData, pairKey, code);
  const density   = getHubDensityMap();
  const dA        = (density[a] || 0) - 1; // exclude this route itself
  const dB        = (density[b] || 0) - 1;
  const flowA     = _flowCurve(Math.max(0, dA));
  const flowB     = _flowCurve(Math.max(0, dB));
  const isolated  = dA <= 0 && dB <= 0;
  const penalty   = isolated ? -0.08 : 0;
  const maturity  = getMaturityBonus(key);
  const promo     = getPromotionBonus(key);

  return Math.min(0.98, Math.max(0.30, base + flowA + flowB + maturity + promo + penalty));
}

// ── Breakdown object (for daily report + CEO panel) ────────────

function routeLFBreakdown(key) {
  const [a, b, code] = key.split('|');
  const routeData    = _findRouteData(a, b, code);
  if (!routeData) return null;

  const pairKey  = [a, b].sort().join('|');
  const base     = getBaseLF(routeData, pairKey, code);
  const density  = getHubDensityMap();
  const dA       = Math.max(0, (density[a] || 0) - 1);
  const dB       = Math.max(0, (density[b] || 0) - 1);
  const flowA    = _flowCurve(dA);
  const flowB    = _flowCurve(dB);
  const isolated = dA <= 0 && dB <= 0;
  const penalty  = isolated ? -0.08 : 0;
  const maturity = getMaturityBonus(key);
  const promo    = getPromotionBonus(key);
  const total    = Math.min(0.98, Math.max(0.30, base + flowA + flowB + maturity + promo + penalty));
  const age      = DEMO.routeOpenDays[key] != null ? Math.max(0, DEMO.day - DEMO.routeOpenDays[key]) : null;
  const nComp    = COMP_MAP[pairKey] || 1;

  return { base, flowA, flowB, dA, dB, isolated, penalty, maturity, promo, total, age, nComp };
}

// ── Per-airline LF (weighted average across owned routes) ───────

function calcAirlineLF(code) {
  const keys = [];
  for (const k of DEMO.unlockedRoutes)    if (k.split('|')[2] === code) keys.push(k);
  for (const k of DEMO.acquiredStarting)  if (k.split('|')[2] === code) keys.push(k);
  if (!keys.length) return 0.55;
  const sum = keys.reduce((acc, k) => acc + calcRouteLFByKey(k), 0);
  return sum / keys.length;
}

// ── Network-wide LF (earnings-weighted average) ─────────────────

function calcNetworkLF() {
  const allKeys = [...DEMO.unlockedRoutes, ...DEMO.acquiredStarting];
  if (!allKeys.length) return 0.55;
  let totalBase = 0, weightedLF = 0;
  for (const key of allKeys) {
    const [a, b, code] = key.split('|');
    const r = _findRouteData(a, b, code);
    const earn = r ? (r[7] || 0) * FS : 0;
    const lf   = calcRouteLFByKey(key);
    totalBase  += earn;
    weightedLF += lf * earn;
  }
  return totalBase > 0 ? weightedLF / totalBase : 0.55;
}

// ── Daily earnings (cached) ─────────────────────────────────────

function calcDailyEarnings() {
  if (_earnCache !== null) return _earnCache;
  let total = 0;
  const allKeys = new Set([...DEMO.unlockedRoutes, ...DEMO.acquiredStarting]);
  for (const key of allKeys) {
    const [a, b, code] = key.split('|');
    const lf   = calcRouteLFByKey(key);
    const idxs = AL_IDX[code] || AP_IDX[a] || [];
    for (const i of idxs) {
      const r = ROUTES[i];
      if ((r[0]===a&&r[1]===b)||(r[0]===b&&r[1]===a)) {
        total += (r[7]||0) * FS * lf * getRegionBonus(a, b); break;
      }
    }
  }
  _earnCache = Math.round(total);
  return _earnCache;
}

// ── LF label (UI display) ──────────────────────────────────────

function lfLabel(lf) {
  const pct = lf * 100;
  if (pct < 55) return { icon:'🔴', label:'Low',        color:'#e05a4e' };
  if (pct < 68) return { icon:'🟠', label:'Building',   color:'#e08a3a' };
  if (pct < 80) return { icon:'🟡', label:'Healthy',    color:'#c8923c' };
  if (pct < 92) return { icon:'🟢', label:'Strong',     color:'#4caf7d' };
  return              { icon:'✨', label:'Exceptional', color:'#5fd89a' };
}

// ── Projected LF for acquisition preview ───────────────────────
// Estimates LF for an airline before acquisition. Uses competition data
// for its routes plus adjacency to existing player network.

function projectedLF(code, willBeAdjacent) {
  const al = AIRLINES[code];
  if (!al) return 0.52;
  const tier = AIRLINE_TIER[code] || 'M';

  // Sample up to 5 routes for this airline to get a real competition average
  const alRoutes = [];
  const idxs = AL_IDX[code] || [];
  for (let i = 0; i < idxs.length && alRoutes.length < 10; i++) {
    alRoutes.push(ROUTES[idxs[i]]);
  }

  let baseEst = 0.60; // fallback
  if (alRoutes.length) {
    const bases = alRoutes.map(r => {
      const pairKey = [r[0], r[1]].sort().join('|');
      return getBaseLF(r, pairKey, code);
    });
    baseEst = bases.reduce((s, v) => s + v, 0) / bases.length;
  }

  // Day-1 flow: if adjacent, player's existing hub density at shared airports
  // gives some flow immediately; if isolated, no flow yet
  const density = getHubDensityMap();
  let flowEst = 0;
  if (willBeAdjacent && alRoutes.length) {
    const hubAp = al.primaryHub;
    const dHub = density[hubAp] || 0;
    flowEst = _flowCurve(dHub);
  }

  // No maturity on day 1
  const isolationPenalty = willBeAdjacent ? 0 : -0.08;

  return Math.min(0.98, Math.max(0.30, baseEst + flowEst + isolationPenalty));
}
