// ═══════════════════════════════════════════════════════════════
//  SKYWARD — routes-helpers.js
//  Query functions for routes, airports, and network logic.
//  Depends on: routes.js, routes-index.js, airlines.js, aircraft.js
//
//  Load order in HTML:
//    <script src="js/routes.js"></script>
//    <script src="js/routes-index.js"></script>
//    <script src="js/aircraft.js"></script>
//    <script src="js/airlines.js"></script>
//    <script src="js/routes-helpers.js"></script>
// ═══════════════════════════════════════════════════════════════

// ── Column index aliases (mirrors routes.js) ─────────────────
const _O=0,_D=1,_C=2,_F=3,_MI=4,_E=5,_B=6,_EARN=7,_UNL=8,_EQ=9;

// ── Airport Queries ───────────────────────────────────────────

/**
 * Get all routes touching an airport.
 * Returns full route objects (enriched with index).
 */
function getRoutesAtAirport(iata) {
  return (AP_IDX[iata] || []).map(i => routeObj(i));
}

/**
 * Get all airlines serving an airport.
 * Returns array of { code, name, alliance, routeCount }
 */
function getAirlinesAtAirport(iata) {
  const idxs = AP_IDX[iata] || [];
  const map = {};
  for (const i of idxs) {
    const code = ROUTES[i][_C];
    if (!map[code]) {
      const a = AIRLINES[code];
      map[code] = { code, name: a ? a.name : code, alliance: a ? a.alliance : 'None', routeCount: 0 };
    }
    map[code].routeCount++;
  }
  return Object.values(map).sort((a,b) => b.routeCount - a.routeCount);
}

/**
 * Get all destinations from an airport (unique, with route details).
 * Returns array of { iata, carriers[], bestEarn, bestUnlock, distMi }
 */
function getDestinationsFromAirport(iata) {
  const idxs = AP_IDX[iata] || [];
  const map = {};
  for (const i of idxs) {
    const r = ROUTES[i];
    const dest = r[_O] === iata ? r[_D] : r[_O];
    if (!map[dest]) map[dest] = { iata: dest, carriers: [], bestEarn: 0, bestUnlock: 0, distMi: r[_MI] };
    map[dest].carriers.push(r[_C]);
    if (r[_EARN] > map[dest].bestEarn) {
      map[dest].bestEarn   = r[_EARN];
      map[dest].bestUnlock = r[_UNL];
    }
  }
  return Object.values(map).sort((a,b) => b.bestEarn - a.bestEarn);
}

/**
 * Get all aircraft types serving an airport.
 * Returns array of { equipCode, model, type, mfr, routeCount }
 */
function getFleetAtAirport(iata) {
  const idxs = AP_IDX[iata] || [];
  const map = {};
  for (const i of idxs) {
    const eq = ROUTES[i][_EQ];
    if (!map[eq]) {
      const ac = AIRCRAFT[eq];
      map[eq] = {
        equipCode: eq,
        model:     ac ? ac.model  : eq,
        type:      ac ? ac.type   : 'Unknown',
        mfr:       ac ? ac.mfr    : 'Unknown',
        routeCount: 0
      };
    }
    map[eq].routeCount++;
  }
  return Object.values(map).sort((a,b) => b.routeCount - a.routeCount);
}

// ── Airline Queries ───────────────────────────────────────────

/**
 * Get all routes for an airline.
 */
function getRoutesForAirline(code) {
  return (AL_IDX[code] || []).map(i => routeObj(i));
}

/**
 * Get top N routes for an airline, sorted by daily earnings (desc).
 * Used when selecting the 5 starting routes on acquisition.
 */
function getTopRoutes(airlineCode, n = 5) {
  const idxs = AL_IDX[airlineCode] || [];
  return idxs
    .slice()
    .sort((a,b) => ROUTES[b][_EARN] - ROUTES[a][_EARN])
    .slice(0, n)
    .map(i => routeObj(i));
}

/**
 * Get all routes for an airline that connect to a specific airport.
 * Used to show unlockable routes when player is at that airport.
 */
function getRoutesFromAirportForAirline(airlineCode, iata) {
  const alIdxs = new Set(AL_IDX[airlineCode] || []);
  const apIdxs = AP_IDX[iata] || [];
  return apIdxs
    .filter(i => alIdxs.has(i))
    .map(i => routeObj(i));
}

/**
 * Get fleet summary for an airline (all aircraft types operated).
 */
function getAirlineFleet(airlineCode) {
  const idxs = AL_IDX[airlineCode] || [];
  const map  = {};
  for (const i of idxs) {
    const eq = ROUTES[i][_EQ];
    if (!map[eq]) {
      const ac = AIRCRAFT[eq];
      map[eq] = {
        equipCode: eq,
        model:     ac ? ac.model  : eq,
        type:      ac ? ac.type   : 'Unknown',
        mfr:       ac ? ac.mfr    : 'Unknown',
        family:    ac ? ac.family : eq,
        routeCount: 0
      };
    }
    map[eq].routeCount++;
  }
  const fleet = Object.values(map).sort((a,b) => b.routeCount - a.routeCount);
  // Group by type
  const byType = { Wide:[], Narrow:[], RJ:[], Turbo:[], Unknown:[] };
  for (const ac of fleet) byType[ac.type] = [...(byType[ac.type]||[]), ac];
  return { fleet, byType };
}

// ── Network / Adjacency ───────────────────────────────────────

/**
 * Check if player's current owned airline network is adjacent to a target airline.
 * "Adjacent" = at least 1 airport in common.
 *
 * @param {string[]} playerAirports  - all airports in player's network
 * @param {string}   targetCode      - airline code to acquire
 * @returns {{ adjacent: boolean, sharedAirports: string[] }}
 */
function checkAdjacency(playerAirports, targetCode) {
  const targetAPs = new Set(AL_AIRPORTS[targetCode] || []);
  const shared    = playerAirports.filter(ap => targetAPs.has(ap));
  return { adjacent: shared.length > 0, sharedAirports: shared };
}

/**
 * Get all player's current airports across all owned airlines.
 * @param {string[]} ownedAirlineCodes
 * @returns {string[]} deduplicated airport list
 */
function getPlayerNetworkAirports(ownedAirlineCodes) {
  const all = new Set();
  for (const code of ownedAirlineCodes) {
    for (const ap of (AL_AIRPORTS[code] || [])) all.add(ap);
  }
  return [...all];
}

/**
 * Find all airlines the player can acquire right now (adjacent networks).
 * Excludes airlines already owned.
 * @param {string[]} ownedCodes
 * @returns {string[]} acquirable airline codes
 */
function getAcquirableAirlines(ownedCodes) {
  const playerAPs = getPlayerNetworkAirports(ownedCodes);
  const ownedSet  = new Set(ownedCodes);
  const results   = [];
  for (const code of Object.keys(AL_AIRPORTS)) {
    if (ownedSet.has(code)) continue;
    const { adjacent } = checkAdjacency(playerAPs, code);
    if (adjacent) results.push(code);
  }
  return results;
}

/**
 * Check if player can unlock a specific route.
 * Player must be at one of the two route endpoints.
 * @param {number}  routeIdx      - index into ROUTES[]
 * @param {string}  playerLocation - current player airport IATA
 * @returns {{ canUnlock: boolean, atEndpoint: string|null }}
 */
function checkRouteUnlockEligibility(routeIdx, playerLocation) {
  const r    = ROUTES[routeIdx];
  const orig = r[_O], dest = r[_D];
  if (playerLocation === orig) return { canUnlock: true, atEndpoint: orig };
  if (playerLocation === dest) return { canUnlock: true, atEndpoint: dest };
  return { canUnlock: false, atEndpoint: null, needsAirport: [orig, dest] };
}

// ── Booking ───────────────────────────────────────────────────

/**
 * Get all available flights between two airports.
 * Returns routes sorted by departure earnings (proxy for frequency/desirability).
 * Each result enriched with airline name, aircraft model, and schedule hint.
 */
function getFlightOptions(fromIata, toIata) {
  const fromIdxs = new Set(AP_IDX[fromIata] || []);
  const toIdxs   = AP_IDX[toIata] || [];
  return toIdxs
    .filter(i => fromIdxs.has(i))
    .filter(i => {
      const r = ROUTES[i];
      return (r[_O] === fromIata && r[_D] === toIata) ||
             (r[_O] === toIata   && r[_D] === fromIata);
    })
    .map(i => {
      const r  = ROUTES[i];
      const a  = AIRLINES[r[_C]];
      const ac = AIRCRAFT[r[_EQ]];
      return {
        routeIdx:    i,
        airlineCode: r[_C],
        airlineName: a  ? a.name    : r[_C],
        alliance:    a  ? a.alliance : 'None',
        equipCode:   r[_EQ],
        acModel:     ac ? ac.model  : r[_EQ],
        acType:      ac ? ac.type   : 'Unknown',
        ecoFare:     r[_E],
        bizFare:     r[_B],
        distMi:      r[_MI],
        dailyFreq:   r[_F]
      };
    })
    .sort((a,b) => b.dailyFreq - a.dailyFreq);
}

// ── Feasibility Document (Airline Acquisition) ────────────────

/**
 * Build the full feasibility data package for an airline acquisition modal.
 * @param {string} targetCode  - airline to acquire
 * @returns {object}           - all data needed to render the feasibility doc
 */
function buildFeasibilityDoc(targetCode) {
  const airline   = AIRLINES[targetCode];
  if (!airline) return null;
  const top5      = getTopRoutes(targetCode, 5);
  const { fleet, byType } = getAirlineFleet(targetCode);
  const day1Earn  = top5.reduce((s, r) => s + r.dailyEarn, 0);
  const avgEarn   = airline.totalDailyEarn / Math.max(airline.routes, 1);
  const payback   = airline.acquisitionCost / Math.max(day1Earn, 1);

  return {
    // Identity
    code:         targetCode,
    name:         airline.name,
    alliance:     airline.alliance,
    category:     airline.category,
    // Investment
    acquisitionCost: airline.acquisitionCost,
    // Revenue
    top5Routes:      top5,
    day1DailyEarn:   day1Earn,
    avgRouteEarn:    Math.round(avgEarn),
    totalRoutes:     airline.routes,
    paybackDays:     Math.round(payback),
    // Network
    primaryHub:    airline.primaryHub,
    hubs:          airline.hubs,
    focus:         airline.focus,
    airportCount:  (AL_AIRPORTS[targetCode] || []).length,
    // Fleet
    fleet,
    byType,
    uniqueTypes:   Object.entries(byType).filter(([,v]) => v.length > 0).map(([k]) => k),
  };
}

// ── Internal Utility ─────────────────────────────────────────

/** Convert a ROUTES array index to a rich object */
function routeObj(i) {
  const r = ROUTES[i];
  return {
    idx:         i,
    origin:      r[_O],
    destination: r[_D],
    airlineCode: r[_C],
    dailyFreq:   r[_F],
    distMi:      r[_MI],
    ecoFare:     r[_E],
    bizFare:     r[_B],
    dailyEarn:   r[_EARN],
    unlockCost:  r[_UNL],
    equipCode:   r[_EQ],
  };
}

if (typeof module !== 'undefined') {
  module.exports = {
    getRoutesAtAirport, getAirlinesAtAirport, getDestinationsFromAirport, getFleetAtAirport,
    getRoutesForAirline, getTopRoutes, getRoutesFromAirportForAirline, getAirlineFleet,
    checkAdjacency, getPlayerNetworkAirports, getAcquirableAirlines,
    checkRouteUnlockEligibility, getFlightOptions, buildFeasibilityDoc, routeObj
  };
}
