// ═══════════════════════════════════════════════════════════════
//  SKYWARD — game-config.js
//  Pure data constants. No DOM access. No DEMO references.
//  Must load before game-utils.js and the main game script.
// ═══════════════════════════════════════════════════════════════

// ── Persistence ──────────────────────────────────────────────
const SAVE_KEY = 'skyward_v1';

// ── Economy ──────────────────────────────────────────────────
const FS = 4; // Airline finance scale multiplier (CEO fares/salary unaffected)

const PULSE_FRACTIONS = [0.25, 0.5, 0.75, 1.0];

// ── Loan options ─────────────────────────────────────────────
const loanRateOptions = [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5];

// ── Plane SVG markers ────────────────────────────────────────
const _PLANE_SVG = `<svg width="18" height="18" viewBox="0 0 28 44" xmlns="http://www.w3.org/2000/svg"><path d="M14 5.5 C15.2 5.5 16 6.8 16 8.5 L16.2 16 L27.5 25 L27.5 27.5 L16.2 23.5 L16 35 L20 37 L20 38.5 L14 37 L8 38.5 L8 37 L12 35 L11.8 23.5 L0.5 27.5 L0.5 25 L11.8 16 L12 8.5 C12 6.8 12.8 5.5 14 5.5 Z" fill="#FFD580" filter="drop-shadow(0 0 2px rgba(0,0,0,0.5))"/></svg>`;
const _CEO_PLANE_SVG = `<svg width="18" height="18" viewBox="0 0 28 44" xmlns="http://www.w3.org/2000/svg"><path d="M14 5.5 C15.2 5.5 16 6.8 16 8.5 L16.2 16 L27.5 25 L27.5 27.5 L16.2 23.5 L16 35 L20 37 L20 38.5 L14 37 L8 38.5 L8 37 L12 35 L11.8 23.5 L0.5 27.5 L0.5 25 L11.8 16 L12 8.5 C12 6.8 12.8 5.5 14 5.5 Z" fill="#1A2535" filter="drop-shadow(0 0 2.5px rgba(30,50,80,0.15))"/></svg>`;

// ── Salary milestones ─────────────────────────────────────────
const SALARY_MILESTONES = [
  { routes:   5, salary:   200, stage: 'Start',          label: 'Your journey begins.' },
  { routes:   8, salary:   400, stage: 'First Expansion', label: 'The board has noticed.' },
  { routes:  12, salary:   700, stage: 'Taking Shape',    label: 'A real operation now.' },
  { routes:  16, salary:  1100, stage: 'Established',     label: 'Long haul is within reach.' },
  { routes:  22, salary:  1800, stage: 'Mid-Size',        label: 'Daily long haul economy.' },
  { routes:  30, salary:  2800, stage: 'Serious Carrier', label: 'Business class is calling.' },
  { routes:  40, salary:  4200, stage: 'Major Regional',  label: 'Daily business class.' },
  { routes:  55, salary:  6500, stage: 'Full Network',    label: 'Ultra long haul accessible.' },
  { routes:  75, salary: 10000, stage: 'Industry Player', label: 'Business class globally.' },
  { routes: 100, salary: 16000, stage: 'Global CEO',      label: 'Anything. Anywhere. Anytime.' },
];

const ACQ_SALARY_BONUSES = { Small: 3000, Medium: 5000, Large: 7500 };

// ── Promotion messages ────────────────────────────────────────
const PROMO_MESSAGES = {
  5:   { msg: 'The board has noticed. Five routes in operation, passengers in seats, and money flowing in. Your CEO compensation package begins today — <strong>$200 per day</strong>, effective immediately. This is only the beginning.', sub: 'Milestone: 5 routes unlocked · Salary begins' },
  8:   { msg: 'Eight routes and a growing reputation. The board has reviewed your performance and approved your first salary increase to <strong>$400 per day</strong>. Keep building.', sub: 'Milestone: 8 routes unlocked' },
  12:  { msg: 'Twelve routes and a real operation. You\'re no longer experimenting — you\'re building. Your compensation rises to <strong>$700 per day</strong>. Long-haul is within reach.', sub: 'Milestone: 12 routes unlocked' },
  16:  { msg: 'Sixteen routes. Established. The industry has started to notice your name. The board rewards your progress with <strong>$1,100 per day</strong>. Start thinking bigger.', sub: 'Milestone: 16 routes unlocked' },
  22:  { msg: 'Twenty-two routes. Mid-size status achieved. An analyst just called your network "a legitimate regional force." The board agrees — your compensation rises to <strong>$1,800 per day</strong>. Start planning your next move.', sub: 'Milestone: 22 routes unlocked' },
  30:  { msg: 'Thirty routes. A serious carrier by any measure. Business class is now within your personal budget. The board recognises your achievements with <strong>$2,800 per day</strong>. The real game starts here.', sub: 'Milestone: 30 routes unlocked' },
  40:  { msg: 'Forty routes. A major regional force. Your network spans continents and your fleet carries thousands daily. The board elevates your compensation to <strong>$4,200 per day</strong>. You\'ve earned it.', sub: 'Milestone: 40 routes unlocked' },
  55:  { msg: 'Fifty-five routes. Full network status. Ultra long-haul is accessible. You can fly anywhere your airline reaches. The board responds with <strong>$6,500 per day</strong>. The sky is no longer the limit.', sub: 'Milestone: 55 routes unlocked' },
  75:  { msg: 'Seventy-five routes. Industry player. Business class globally, any alliance, any hub. The board is proud. Your compensation climbs to <strong>$10,000 per day</strong>. Very few have reached this altitude.', sub: 'Milestone: 75 routes unlocked' },
  100: { msg: 'One hundred routes. The industry is watching you now. You didn\'t just build an airline — you built an empire. The board is pleased. Your compensation reaches its peak: <strong>$16,000 per day</strong>. The question now is: how far can you take this?', sub: 'Milestone: 100 routes unlocked · Maximum salary reached' },
};

// ── CEO mile milestones ───────────────────────────────────────
const CEO_MILE_MILESTONES = [
  { miles:   500, label:'First Wings',    bonus:   1000 },
  { miles:  2000, label:'Silver Wings',   bonus:   3000 },
  { miles:  5000, label:'Gold Wings',     bonus:   7500 },
  { miles: 10000, label:'Platinum Wings', bonus:  15000 },
  { miles: 25000, label:'Diamond Wings',  bonus:  40000 },
  { miles: 50000, label:'Global Pioneer', bonus: 100000 },
];

// ── Acquisition messages ──────────────────────────────────────
const ACQ_MESSAGES = {
  Small:  ['A regional gem joins your portfolio. Every great empire starts somewhere.',
           'Small footprint, big ambitions. This network is yours to grow.',
           'Smart pick — regional carriers punch above their weight.'],
  Medium: ['A solid mid-size carrier. This opens up serious route potential.',
           'The board is impressed. Your network just took a meaningful step forward.',
           'Mid-market strength. This acquisition changes the shape of your empire.'],
  Large:  ['A marquee acquisition. The aviation world is watching.',
           'This is how empires are built. Welcome to the major leagues.',
           'A powerhouse joins your portfolio. The competition should be worried.'],
};
const ACQ_ICONS = { Small:'🛫', Medium:'✈️', Large:'🏆' };

// ── CEO Journey — continent names ─────────────────────────────
const CONTINENT_NAMES = {
  AF: { name:'Africa',        icon:'🌍', color:'#E67E22' },
  AS: { name:'Asia',          icon:'🌏', color:'#E74C3C' },
  EU: { name:'Europe',        icon:'🌍', color:'#3498DB' },
  ME: { name:'Middle East',   icon:'🕌', color:'#9B59B6' },
  NA: { name:'N. America',    icon:'🌎', color:'#27AE60' },
  OC: { name:'Oceania',       icon:'🌏', color:'#1ABC9C' },
  SA: { name:'S. America',    icon:'🌎', color:'#F39C12' },
  '?': { name:'Unknown',      icon:'❓', color:'#95A5A6' },
};

// ── Geo-explorer badges (check fns receive visitedAirports Set) ─
const GEO_BADGES = [
  { id:'pac_rim',     title:'Pacific Rim Explorer',    icon:'🗾', trigger:'Visit airports in Japan, South Korea & Taiwan',
    check: v => ['NRT','HND','KIX','ITM','GMP','ICN','PUS','TPE','TSA','KHH'].filter(a=>v.has(a)).length >= 6 },
  { id:'transatl',    title:'Transatlantic Pioneer',   icon:'🌊', trigger:'Land in both Europe and North America',
    check: v => [...v].some(a => (AIRPORTS[a]||{}).continent==='EU') && [...v].some(a => (AIRPORTS[a]||{}).continent==='NA') },
  { id:'arctic',      title:'Arctic Circle',           icon:'❄️', trigger:'Visit 5 Scandinavian airports',
    check: v => ['OSL','BGO','TRD','TOS','LYR','HEL','ARN','GOT','CPH','KEF'].filter(a=>v.has(a)).length >= 5 },
  { id:'silk_road',   title:'Silk Road',               icon:'🐪', trigger:'Visit airports across Central Asia',
    check: v => ['ALA','TSE','TAS','FRU','DYU','ASB'].filter(a=>v.has(a)).length >= 4 },
  { id:'island_hop',  title:'Island Hopper',           icon:'🏝️', trigger:'Visit 5 island airports (Caribbean or Pacific)',
    check: v => ['MBJ','NAS','POS','BGI','HAV','GUM','PPT','HNL','OGG','KOA','SJU','ANU'].filter(a=>v.has(a)).length >= 5 },
  { id:'africa_exp',  title:'African Safari',          icon:'🦁', trigger:'Visit airports in 4 African regions',
    check: v => {
      const regs = new Set([...[...v].map(a=>(AIRPORTS[a]||{}).region)].filter(r=>['North Africa','West Africa','East Africa','Southern Africa','Central Africa'].includes(r)));
      return regs.size >= 4;
    }},
  { id:'sa_wander',   title:'South American Wanderer', icon:'🦜', trigger:'Visit airports in 5 South American countries',
    check: v => ['EZE','GRU','SCL','BOG','LIM','UIO','MVD','ASU','CBB','CCS'].filter(a=>v.has(a)).length >= 5 },
  { id:'gulf_hopper', title:'Gulf State Navigator',    icon:'🕌', trigger:'Visit all UAE & Saudi airports in the dataset',
    check: v => ['DXB','AUH','SHJ','RUH','JED','DMM','MED','AKH'].filter(a=>v.has(a)).length >= 6 },
  { id:'oz_circuit',  title:'Oz Circuit',              icon:'🦘', trigger:'Visit 6 Australian airports',
    check: v => ['SYD','MEL','BNE','PER','ADL','CBR','OOL','CNS','DRW'].filter(a=>v.has(a)).length >= 6 },
  { id:'usa_coast',   title:'Coast to Coast',          icon:'🗽', trigger:'Visit airports on both US coasts',
    check: v => ['JFK','BOS','EWR','MIA','ATL','LAX','SFO','SEA','LAS','PDX'].filter(a=>v.has(a)).length >= 6 },
  { id:'india_grand', title:'Indian Subcontinent',     icon:'🕌', trigger:'Visit 8 airports across India',
    check: v => ['BOM','DEL','MAA','BLR','HYD','CCU','AMD','COK','GAU','IXC'].filter(a=>v.has(a)).length >= 8 },
  { id:'se_asia',     title:'Southeast Asia Trail',    icon:'🛕', trigger:'Visit airports in 5 SE Asian countries',
    check: v => ['BKK','DMK','SGN','HAN','KUL','SIN','CGK','MNL','RGN','DAD'].filter(a=>v.has(a)).length >= 5 },
  { id:'seven_cont',  title:'Seven Continents',        icon:'🌐', trigger:'Visit airports on all 7 continents',
    check: v => {
      const conts = new Set([...[...v].map(a=>(AIRPORTS[a]||{}).continent)].filter(c=>c&&c!=='?'));
      return conts.size >= 7;
    }},
  { id:'hub_crawler', title:'Hub Crawler',             icon:'🏢', trigger:'Visit 10 major international hubs',
    check: v => ['LHR','CDG','AMS','FRA','DXB','SIN','HKG','NRT','JFK','LAX','ORD','SYD','GRU','JNB','DEL'].filter(a=>v.has(a)).length >= 10 },
  { id:'globetrotter',title:'Globetrotter',            icon:'🌍', trigger:'Visit 100 airports worldwide',
    check: v => v.size >= 100 },
  { id:'centurion',   title:'Centurion',               icon:'💯', trigger:'Visit 250 airports worldwide',
    check: v => v.size >= 250 },
];

// ── Money achievements ────────────────────────────────────────
// (check functions reference DEMO globals — safe because they are
//  only called at runtime, not at parse time)
const MONEY_ACHIEVEMENTS = [
  { id:'first_flight',    title:'First Flight',        trigger:'Unlock your first route',               reward:2000,   check:()=> totalActiveRoutes() >= 1 },
  { id:'off_ground',      title:'Getting Off the Ground', trigger:'Unlock 5 routes',                    reward:4000,   check:()=> totalActiveRoutes() >= 5 },
  { id:'building_net',    title:'Building the Network', trigger:'Unlock 10 routes',                     reward:10000,  check:()=> totalActiveRoutes() >= 10 },
  { id:'regional',        title:'Regional Carrier',    trigger:'Unlock 25 routes',                      reward:20000,  check:()=> totalActiveRoutes() >= 25 },
  { id:'major_carrier',   title:'Major Carrier',       trigger:'Unlock 50 routes',                      reward:40000,  check:()=> totalActiveRoutes() >= 50 },
  { id:'global_net',      title:'Global Network',      trigger:'Unlock 100 routes',                     reward:80000,  check:()=> totalActiveRoutes() >= 100 },
  { id:'first_acq',       title:'First Acquisition',   trigger:'Buy your first second airline',         reward:12000,  check:()=> DEMO.ownedAirlines.length >= 2 },
  { id:'portfolio',       title:'Portfolio Builder',   trigger:'Own 3 airlines',                        reward:30000,  check:()=> DEMO.ownedAirlines.length >= 3 },
  { id:'empire',          title:'Aviation Empire',     trigger:'Own 5 airlines',                        reward:60000,  check:()=> DEMO.ownedAirlines.length >= 5 },
  { id:'alliance_all',    title:'Alliance Member',     trigger:'Own an airline in each major alliance',  reward:40000,  check:()=> hasAllAlliances() },
  { id:'mixed_fleet',     title:'Mixed Fleet',         trigger:'Operate 3 different aircraft families',  reward:8000,   check:()=> networkFleetFamilies() >= 3 },
  { id:'widebody_op',     title:'Wide Body Operator',  trigger:'Operate at least one wide-body route',  reward:6000,   check:()=> hasNetworkAcType('Wide') },
  { id:'turboprop_op',    title:'Turboprop Territory', trigger:'Operate at least one turboprop route',  reward:4000,   check:()=> hasNetworkAcType('Turbo') },
  { id:'globe_trotter_op',title:'Globe Trotter',       trigger:'Have routes on 3 different continents', reward:20000,  check:()=> networkContinents() >= 3 },
  { id:'first_hour',      title:'First Hour',          trigger:'Play for 1 hour (4 game days)',         reward:4000,   check:()=> DEMO.day >= 4 },
  { id:'dedicated_ceo',   title:'Dedicated CEO',       trigger:'Play for 6 hours (24 game days)',       reward:80000,  check:()=> DEMO.day >= 24 },
];

const TROPHY_ACHIEVEMENTS = [
  { id:'wheels_up',      title:'Wheels Up',          trigger:'Take your first flight as CEO',          icon:'✈️' },
  { id:'biz_class',      title:'Business Class',     trigger:'Fly business class for the first time',  icon:'🥂' },
  { id:'jet_setter',     title:'Jet Setter',         trigger:'Fly on 10 different routes',              icon:'🌍' },
  { id:'frequent',       title:'Frequent Flyer',     trigger:'Take 25 flights total',                   icon:'🎫' },
  { id:'around_world',   title:'Around the World',   trigger:'Fly on every continent',                  icon:'🌐' },
  { id:'widebody_ride',  title:'Wide Body Rider',    trigger:'Fly on a wide-body aircraft',             icon:'✈' },
  { id:'turboprop_surv', title:'Turboprop Survivor', trigger:'Fly on a turboprop aircraft',             icon:'🛩️' },
  { id:'all_alliances',  title:'Alliance Collector', trigger:'Fly all three major alliances',           icon:'🏅' },
  { id:'own_airline',    title:'Your Own Airline',   trigger:'Fly a route on your own airline',         icon:'🏢' },
  { id:'miles_10k',      title:'10,000 Miles',       trigger:'Accumulate 10,000 miles flown',           icon:'📍' },
  { id:'miles_50k',      title:'50,000 Miles',       trigger:'Accumulate 50,000 miles flown',           icon:'🗺️' },
  { id:'miles_100k',     title:'100K Club',          trigger:'Accumulate 100,000 miles flown',          icon:'💎' },
  { id:'ac_collector',   title:'Aircraft Collector', trigger:'Fly on 10 different aircraft types',      icon:'🛫' },
  { id:'kangaroo',       title:'The Kangaroo Route', trigger:'Fly SYD ↔ LHR',                           icon:'🦘' },
  { id:'island_hop',     title:'Island Hopper',      trigger:'Fly a turboprop inter-island route',      icon:'🏝️' },
];

// ── Onboarding — featured airlines per category ───────────────
const FEATURED_AIRLINES = {
  Small:  ['WF','ZL','NT','SG','OU'],   // Wideroe, Rex, Binter, SpiceJet, Croatia
  Medium: ['VY','NK','DY','A3','VF'],   // Vueling, Spirit, Norwegian, Aegean, AJet
  Large:  ['AA','BA','UA','EK','QF'],   // American, British, United, Emirates, Qantas
};
