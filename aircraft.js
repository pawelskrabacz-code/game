// ═══════════════════════════════════════════════════════════════
//  SKYWARD — aircraft.js
//  100 unique equipment codes used across 30,988 routes
//
//  Usage:
//    const ac = AIRCRAFT['77W'];
//    // → { mfr:'Boeing', type:'Wide', family:'B777', model:'B777-300ER' }
//
//  type values: 'Wide' | 'Narrow' | 'RJ' | 'Turbo'
// ═══════════════════════════════════════════════════════════════

const AIRCRAFT = {
  // ── Wide Body ───────────────────────────────────────────────
  "AB6":{"mfr":"Airbus","type":"Wide","family":"A300","model":"A300-600"},
  "330":{"mfr":"Airbus","type":"Wide","family":"A330","model":"A330"},
  "332":{"mfr":"Airbus","type":"Wide","family":"A330","model":"A330-200"},
  "333":{"mfr":"Airbus","type":"Wide","family":"A330","model":"A330-300"},
  "338":{"mfr":"Airbus","type":"Wide","family":"A330","model":"A330-800neo"},
  "339":{"mfr":"Airbus","type":"Wide","family":"A330","model":"A330-900neo"},
  "343":{"mfr":"Airbus","type":"Wide","family":"A340","model":"A340-300"},
  "346":{"mfr":"Airbus","type":"Wide","family":"A340","model":"A340-600"},
  "350":{"mfr":"Airbus","type":"Wide","family":"A350","model":"A350"},
  "351":{"mfr":"Airbus","type":"Wide","family":"A350","model":"A350-1000"},
  "359":{"mfr":"Airbus","type":"Wide","family":"A350","model":"A350-900"},
  "388":{"mfr":"Airbus","type":"Wide","family":"A380","model":"A380-800"},
  "744":{"mfr":"Boeing","type":"Wide","family":"B747","model":"B747-400"},
  "74H":{"mfr":"Boeing","type":"Wide","family":"B747","model":"B747-8"},
  "767":{"mfr":"Boeing","type":"Wide","family":"B767","model":"B767"},
  "763":{"mfr":"Boeing","type":"Wide","family":"B767","model":"B767-300"},
  "76W":{"mfr":"Boeing","type":"Wide","family":"B767","model":"B767-300"},
  "764":{"mfr":"Boeing","type":"Wide","family":"B767","model":"B767-400"},
  "777":{"mfr":"Boeing","type":"Wide","family":"B777","model":"B777"},
  "772":{"mfr":"Boeing","type":"Wide","family":"B777","model":"B777-200ER"},
  "77L":{"mfr":"Boeing","type":"Wide","family":"B777","model":"B777-200LR"},
  "773":{"mfr":"Boeing","type":"Wide","family":"B777","model":"B777-300"},
  "77W":{"mfr":"Boeing","type":"Wide","family":"B777","model":"B777-300ER"},
  "787":{"mfr":"Boeing","type":"Wide","family":"B787","model":"B787"},
  "781":{"mfr":"Boeing","type":"Wide","family":"B787","model":"B787-10"},
  "788":{"mfr":"Boeing","type":"Wide","family":"B787","model":"B787-8"},
  "789":{"mfr":"Boeing","type":"Wide","family":"B787","model":"B787-9"},

  // ── Narrow Body ─────────────────────────────────────────────
  "220":{"mfr":"Airbus","type":"Narrow","family":"A220","model":"A220"},
  "221":{"mfr":"Airbus","type":"Narrow","family":"A220","model":"A220-100"},
  "223":{"mfr":"Airbus","type":"Narrow","family":"A220","model":"A220-300"},
  "319":{"mfr":"Airbus","type":"Narrow","family":"A320","model":"A319"},
  "31N":{"mfr":"Airbus","type":"Narrow","family":"A320","model":"A319neo"},
  "320":{"mfr":"Airbus","type":"Narrow","family":"A320","model":"A320"},
  "32A":{"mfr":"Airbus","type":"Narrow","family":"A320","model":"A320"},
  "32N":{"mfr":"Airbus","type":"Narrow","family":"A320","model":"A320neo"},
  "321":{"mfr":"Airbus","type":"Narrow","family":"A320","model":"A321"},
  "32S":{"mfr":"Airbus","type":"Narrow","family":"A320","model":"A321"},
  "32B":{"mfr":"Airbus","type":"Narrow","family":"A320","model":"A321"},
  "32Q":{"mfr":"Airbus","type":"Narrow","family":"A320","model":"A321neo"},
  "717":{"mfr":"Boeing","type":"Narrow","family":"B717","model":"B717-200"},
  "737":{"mfr":"Boeing","type":"Narrow","family":"B737","model":"B737"},
  "73M":{"mfr":"Boeing","type":"Narrow","family":"B737","model":"B737-200"},
  "73L":{"mfr":"Boeing","type":"Narrow","family":"B737","model":"B737-200"},
  "73C":{"mfr":"Boeing","type":"Narrow","family":"B737","model":"B737-300"},
  "733":{"mfr":"Boeing","type":"Narrow","family":"B737","model":"B737-300"},
  "734":{"mfr":"Boeing","type":"Narrow","family":"B737","model":"B737-400"},
  "73E":{"mfr":"Boeing","type":"Narrow","family":"B737","model":"B737-500"},
  "736":{"mfr":"Boeing","type":"Narrow","family":"B737","model":"B737-600"},
  "7S7":{"mfr":"Boeing","type":"Narrow","family":"B737","model":"B737-7"},
  "73G":{"mfr":"Boeing","type":"Narrow","family":"B737","model":"B737-700"},
  "7S8":{"mfr":"Boeing","type":"Narrow","family":"B737","model":"B737-8"},
  "73H":{"mfr":"Boeing","type":"Narrow","family":"B737","model":"B737-800"},
  "738":{"mfr":"Boeing","type":"Narrow","family":"B737","model":"B737-800"},
  "739":{"mfr":"Boeing","type":"Narrow","family":"B737","model":"B737-900"},
  "73J":{"mfr":"Boeing","type":"Narrow","family":"B737","model":"B737-900"},
  "7M8":{"mfr":"Boeing","type":"Narrow","family":"B737","model":"B737 Max 8"},
  "7M9":{"mfr":"Boeing","type":"Narrow","family":"B737","model":"B737 Max 9"},
  "73W":{"mfr":"Boeing","type":"Narrow","family":"B737","model":"B737-700"},
  "757":{"mfr":"Boeing","type":"Narrow","family":"B757","model":"B757"},
  "752":{"mfr":"Boeing","type":"Narrow","family":"B757","model":"B757-200"},
  "75W":{"mfr":"Boeing","type":"Narrow","family":"B757","model":"B757-200"},
  "753":{"mfr":"Boeing","type":"Narrow","family":"B757","model":"B757-300"},
  "CRK":{"mfr":"Bombardier","type":"Narrow","family":"CRJ","model":"CRJ-1000"},
  "919":{"mfr":"Comac","type":"Narrow","family":"Comac","model":"C919"},
  "C09":{"mfr":"Comac","type":"Narrow","family":"Comac","model":"Comac 909"},
  "909":{"mfr":"Comac","type":"Narrow","family":"Comac","model":"Comac 909"},
  "E90":{"mfr":"Embraer","type":"Narrow","family":"E-Jet","model":"E-190"},
  "290":{"mfr":"Embraer","type":"Narrow","family":"E-Jet","model":"E-190 E2"},
  "E95":{"mfr":"Embraer","type":"Narrow","family":"E-Jet","model":"E-195"},
  "295":{"mfr":"Embraer","type":"Narrow","family":"E-Jet","model":"E-195 E2"},
  "100":{"mfr":"Fokker","type":"Narrow","family":"Fokker 70/100","model":"F-100"},

  // ── Regional Jet ────────────────────────────────────────────
  "CRJ":{"mfr":"Bombardier","type":"RJ","family":"CRJ","model":"CRJ"},
  "CR5":{"mfr":"Bombardier","type":"RJ","family":"CRJ","model":"CRJ-550"},
  "CR7":{"mfr":"Bombardier","type":"RJ","family":"CRJ","model":"CRJ-700"},
  "CR9":{"mfr":"Bombardier","type":"RJ","family":"CRJ","model":"CRJ-900"},
  "E70":{"mfr":"Embraer","type":"RJ","family":"E-Jet","model":"E-170"},
  "E7W":{"mfr":"Embraer","type":"RJ","family":"E-Jet","model":"E-175"},
  "E75":{"mfr":"Embraer","type":"RJ","family":"E-Jet","model":"E-175"},
  "ER3":{"mfr":"Embraer","type":"RJ","family":"ERJ","model":"ERJ-135"},
  "ERJ":{"mfr":"Embraer","type":"RJ","family":"ERJ","model":"ERJ-135"},
  "ERD":{"mfr":"Embraer","type":"RJ","family":"ERJ","model":"ERJ-140"},
  "ER4":{"mfr":"Embraer","type":"RJ","family":"ERJ","model":"ERJ-145"},
  "F70":{"mfr":"Fokker","type":"RJ","family":"Fokker 70/100","model":"F-70"},
  "SU9":{"mfr":"Sukhoi","type":"RJ","family":"SuperJet","model":"SuperJet-100-95"},

  // ── Turboprop / Piston ───────────────────────────────────────
  "AT4":{"mfr":"ATR","type":"Turbo","family":"ATR","model":"ATR-42-300"},
  "ATR":{"mfr":"ATR","type":"Turbo","family":"ATR","model":"ATR-42/72"},
  "AT7":{"mfr":"ATR","type":"Turbo","family":"ATR","model":"ATR-72"},
  "BE1":{"mfr":"Beechcraft","type":"Turbo","family":"Beechcraft","model":"Beechcraft"},
  "CN1":{"mfr":"Cessna","type":"Turbo","family":"Cessna","model":"Cessna"},
  "CNC":{"mfr":"Cessna","type":"Turbo","family":"Cessna","model":"Cessna"},
  "CNA":{"mfr":"Cessna","type":"Turbo","family":"Cessna","model":"Cessna"},
  "DHT":{"mfr":"Bombardier","type":"Turbo","family":"DeHavilland","model":"DHC-6"},
  "DH8":{"mfr":"Bombardier","type":"Turbo","family":"DeHavilland","model":"DHC-8"},
  "DH1":{"mfr":"Bombardier","type":"Turbo","family":"DeHavilland","model":"DHC-8-100"},
  "DH2":{"mfr":"Bombardier","type":"Turbo","family":"DeHavilland","model":"DHC-8-200"},
  "DH3":{"mfr":"Bombardier","type":"Turbo","family":"DeHavilland","model":"DHC-8-300"},
  "DH4":{"mfr":"Bombardier","type":"Turbo","family":"DeHavilland","model":"DHC-8-400"},
  "BNI":{"mfr":"Britten-Norman","type":"Turbo","family":"Norman Islander","model":"Norman BN-2A/BN-2B Islander"},
  "SF3":{"mfr":"Saab","type":"Turbo","family":"Saab","model":"Saab 340"},
  "T12":{"mfr":"Tecnam","type":"Turbo","family":"Tecnam","model":"Tecnam P2012 Traveler"}
};

// ── Helper Functions ─────────────────────────────────────────

/** Look up an aircraft by equipment code. Returns null if not found. */
function getAircraft(equipCode) {
  return AIRCRAFT[equipCode] || null;
}

/** Get display label for aircraft type */
function getTypeLabel(type) {
  const labels = { Wide:'Wide Body', Narrow:'Narrow Body', RJ:'Regional Jet', Turbo:'Turboprop' };
  return labels[type] || type;
}

/** Get color token for aircraft type (matches design system) */
function getTypeColor(type) {
  const colors = { Wide:'#2D6FA8', Narrow:'#5C8A7A', RJ:'#C8923C', Turbo:'#7A5C8A' };
  return colors[type] || '#A89E94';
}

/** Get all aircraft of a given type */
function getByType(type) {
  return Object.entries(AIRCRAFT)
    .filter(([,v]) => v.type === type)
    .map(([k,v]) => ({ code:k, ...v }));
}

/** Summarise a list of equip codes into type breakdown */
function summariseFleet(equipCodes) {
  const counts = { Wide:0, Narrow:0, RJ:0, Turbo:0, Unknown:0 };
  const families = new Set();
  const models   = new Set();
  for (const code of equipCodes) {
    const ac = AIRCRAFT[code];
    if (ac) {
      counts[ac.type] = (counts[ac.type] || 0) + 1;
      families.add(ac.family);
      models.add(ac.model);
    } else {
      counts.Unknown++;
    }
  }
  return { counts, families: [...families], models: [...models] };
}

// ── Stats (useful for debug / UI) ───────────────────────────
const AIRCRAFT_STATS = {
  total: Object.keys(AIRCRAFT).length,
  byType: {
    Wide:   Object.values(AIRCRAFT).filter(a => a.type === 'Wide').length,
    Narrow: Object.values(AIRCRAFT).filter(a => a.type === 'Narrow').length,
    RJ:     Object.values(AIRCRAFT).filter(a => a.type === 'RJ').length,
    Turbo:  Object.values(AIRCRAFT).filter(a => a.type === 'Turbo').length,
  }
};
// → { total:100, byType:{ Wide:27, Narrow:42, RJ:13, Turbo:18 } }

if (typeof module !== 'undefined') {
  module.exports = { AIRCRAFT, AIRCRAFT_STATS, getAircraft, getTypeLabel, getTypeColor, getByType, summariseFleet };
}
