// ═══════════════════════════════════════════════════════════════
//  SKYWARD — game-utils.js
//  Pure utility functions. No DOM access. No DEMO side-effects.
//  Depends on: airports.js (AIRPORTS global for region helpers)
//  Must load after airports.js and before the main game script.
// ═══════════════════════════════════════════════════════════════

// ── Currency / number formatters ─────────────────────────────
function fmt$(n) { return '$'+Math.round(n).toLocaleString(); }
function fmtMi(n) { return Math.round(n).toLocaleString()+' mi'; }

// ── Duration / time formatters ───────────────────────────────
function fmtDuration(ms) {
  const totalMin = Math.round(ms / 60000);
  const h = Math.floor(totalMin / 60), m = totalMin % 60;
  return h + 'h ' + String(m).padStart(2,'0') + 'm';
}

function fmtGameTime(gameDay, progressFraction) {
  const totalHours = Math.floor(progressFraction * 24);
  const h = totalHours % 12 || 12;
  const ampm = totalHours < 12 ? 'AM' : 'PM';
  const min  = Math.floor((progressFraction * 24 * 60) % 60);
  return `${h}:${String(min).padStart(2,'0')} ${ampm}`;
}

function formatPlayTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h === 0) return m <= 1 ? '< 1 min played' : `~${m} min played`;
  if (h === 1) return m === 0 ? '~1h played' : `~1h ${m}m played`;
  return `~${h}h ${m > 0 ? m + 'm ' : ''}played`;
}

// ── Flight calculations ───────────────────────────────────────
function flightDurationMs(distMi) {
  // Speed tiers (mph) → duration in real ms (game-scaled for fun)
  // Actual duration in game time: ~0.3–0.8 game days
  // In real minutes at 1x: 4–12 real minutes per flight
  const mph = distMi < 500 ? 350 : distMi < 2000 ? 480 : distMi < 5000 ? 530 : 560;
  const hrs  = distMi / mph;
  // 1 game day = 15 real min → 1 game hour = 1.25 real min
  return hrs * 1.25 * 60 * 1000; // real ms
}

function flightNo(airlineCode, routeIdx) {
  return airlineCode + String(1000 + (routeIdx % 9000)).slice(1);
}

// ── Boarding pass randomisers ─────────────────────────────────
function randomGate() {
  const letters = 'ABCDEFGH';
  return letters[Math.floor(Math.random()*letters.length)] + (Math.floor(Math.random()*30)+1);
}

function randomSeat(seatClass) {
  if (seatClass === 'business') return (Math.floor(Math.random()*4)+1) + ['A','C','D','F'][Math.floor(Math.random()*4)];
  return (Math.floor(Math.random()*30)+10) + ['A','B','C','D','E','F'][Math.floor(Math.random()*6)];
}

// ── CEO Journey helpers ───────────────────────────────────────
// First-visit bonus by routeCount tier
function firstVisitBonus(ap) {
  const rc = ap.routeCount || 0;
  if (rc >= 100) return 5000;
  if (rc >= 50)  return 3000;
  if (rc >= 20)  return 2000;
  if (rc >= 10)  return 1000;
  if (rc >= 5)   return 500;
  return 250;
}

// Build region → [iata] map from AIRPORTS global
function buildRegionMap() {
  const map = {};
  for (const [iata, ap] of Object.entries(AIRPORTS)) {
    const r = ap.region || 'Unknown';
    if (!map[r]) map[r] = [];
    map[r].push(iata);
  }
  return map;
}
let _regionMap = null;
function getRegionMap() { return _regionMap || (_regionMap = buildRegionMap()); }
