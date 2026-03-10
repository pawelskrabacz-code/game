// ═══════════════════════════════════════════════════════════════
//  SKYWARD — achievements.js
//  Achievement check helpers, fireAchievement, Screen 2 rendering.
//  Depends on: game-config.js (MONEY_ACHIEVEMENTS, TROPHY_ACHIEVEMENTS)
// ═══════════════════════════════════════════════════════════════

function renderHubAchievements() {
  if (typeof renderMoneyAchievements === 'function') renderMoneyAchievements('hub-ach-money-grid');
}





// ── Achievement state ─────────────────────────────────
// (initialized in DEMO object above)

// ── Check helpers ─────────────────────────────────────
function totalActiveRoutes() {
  return DEMO.unlockedRoutes.size + DEMO.acquiredStarting.size;
}
function hasAllAlliances() {
  if (typeof AIRLINES === 'undefined') return false;
  const alliances = new Set();
  for (const code of DEMO.ownedAirlines) {
    const al = AIRLINES[code];
    if (al && al.alliance && al.alliance !== 'None') alliances.add(al.alliance);
  }
  return alliances.size >= 3;
}
function networkFleetFamilies() {
  if (typeof AP_IDX === 'undefined') return new Set();
  const families = new Set();
  for (const key of [...DEMO.unlockedRoutes, ...DEMO.acquiredStarting]) {
    const [a, b] = key.split('|');
    const idxs = AP_IDX[a] || [];
    for (const i of idxs) {
      const r = ROUTES[i];
      if ((r[0]===a&&r[1]===b)||(r[0]===b&&r[1]===a)) {
        const ac = AIRCRAFT[r[9]];
        if (ac) families.add(ac.family || r[9]);
        break;
      }
    }
  }
  return families.size;
}
function hasNetworkAcType(type) {
  if (typeof AP_IDX === 'undefined') return false;
  for (const key of [...DEMO.unlockedRoutes, ...DEMO.acquiredStarting]) {
    const [a, b] = key.split('|');
    const idxs = AP_IDX[a] || [];
    for (const i of idxs) {
      const r = ROUTES[i];
      if ((r[0]===a&&r[1]===b)||(r[0]===b&&r[1]===a)) {
        const ac = AIRCRAFT[r[9]];
        if (ac && ac.type === type) return true;
        break;
      }
    }
  }
  return false;
}
function networkContinents() {
  if (typeof AIRPORTS === 'undefined') return new Set();
  const conts = new Set();
  for (const key of [...DEMO.unlockedRoutes, ...DEMO.acquiredStarting]) {
    const [a, b] = key.split('|');
    const apA = AIRPORTS[a], apB = AIRPORTS[b];
    if (apA && apA.continent && apA.continent !== '?') conts.add(apA.continent);
    if (apB && apB.continent && apB.continent !== '?') conts.add(apB.continent);
  }
  return conts.size;
}

// Trophy checks on flight log
function trophyCheck_wheelsUp()    { return DEMO.flightLog.length >= 1; }
function trophyCheck_bizClass()    { return DEMO.flightLog.some(f => f.seatClass === 'business'); }
function trophyCheck_jetSetter()   { return new Set(DEMO.flightLog.map(f => f.from+'|'+f.to)).size >= 10; }
function trophyCheck_frequent()    { return DEMO.flightLog.length >= 25; }
function trophyCheck_aroundWorld() {
  const conts = new Set();
  for (const f of DEMO.flightLog) {
    const a = AIRPORTS[f.from], b = AIRPORTS[f.to];
    if (a && a.continent !== '?') conts.add(a.continent);
    if (b && b.continent !== '?') conts.add(b.continent);
  }
  return conts.size >= 6;
}
function trophyCheck_widebody()    { return DEMO.flightLog.some(f => { const ac = AIRCRAFT[getFlightAcCode(f)]; return ac && ac.type==='Wide'; }); }
function trophyCheck_turboprop()   { return DEMO.flightLog.some(f => { const ac = AIRCRAFT[getFlightAcCode(f)]; return ac && ac.type==='Turbo'; }); }
function trophyCheck_allAlliances(){ const a=new Set(DEMO.flightLog.map(f=>{ const al=AIRLINES[f.airline]; return al?al.alliance:'None'; }).filter(a=>a!=='None')); return a.size>=3; }
function trophyCheck_ownAirline()  { return DEMO.flightLog.some(f => DEMO.ownedAirlines.includes(f.airline)); }
function trophyCheck_miles10k()    { return totalMilesFlown() >= 10000; }
function trophyCheck_miles50k()    { return totalMilesFlown() >= 50000; }
function trophyCheck_miles100k()   { return totalMilesFlown() >= 100000; }
function trophyCheck_acCollector() { return new Set(DEMO.flightLog.map(f=>f.aircraft)).size >= 10; }
function trophyCheck_kangaroo()    { return DEMO.flightLog.some(f => (f.from==='SYD'&&f.to==='LHR')||(f.from==='LHR'&&f.to==='SYD')); }
function trophyCheck_islandHop()   {
  return DEMO.flightLog.some(f => {
    const ac = AIRCRAFT[getFlightAcCode(f)];
    if (!ac || ac.type !== 'Turbo') return false;
    const a = AIRPORTS[f.from], b = AIRPORTS[f.to];
    return a && b && a.continent === b.continent && (a.continent === 'OC' || a.continent === 'AS');
  });
}

function totalMilesFlown() { return DEMO.flightLog.reduce((s,f) => s+(f.distMi||0), 0); }
function getFlightAcCode(f) {
  // Try to find equipment code from routes for this flight
  const opts = getFlightOptions(f.from, f.to);
  const match = opts.find(o => o.airlineCode === f.airline);
  return match ? match.equipCode : '';
}

const TROPHY_CHECKS = {
  wheels_up: trophyCheck_wheelsUp, biz_class: trophyCheck_bizClass,
  jet_setter: trophyCheck_jetSetter, frequent: trophyCheck_frequent,
  around_world: trophyCheck_aroundWorld, widebody_ride: trophyCheck_widebody,
  turboprop_surv: trophyCheck_turboprop, all_alliances: trophyCheck_allAlliances,
  own_airline: trophyCheck_ownAirline, miles_10k: trophyCheck_miles10k,
  miles_50k: trophyCheck_miles50k, miles_100k: trophyCheck_miles100k,
  ac_collector: trophyCheck_acCollector, kangaroo: trophyCheck_kangaroo,
  island_hop: trophyCheck_islandHop,
};

// ── Run achievement checks ────────────────────────────
function checkAllAchievements() {
  let anythingUnlocked = false;
  // Money achievements
  for (const ach of MONEY_ACHIEVEMENTS) {
    if (DEMO.unlockedAch.has(ach.id)) continue;
    if (ach.check()) {
      DEMO.unlockedAch.add(ach.id);
      DEMO.balance += ach.reward;
      document.getElementById('hud-bal').textContent = fmt$(DEMO.balance);
      fireAchievement(ach, 'money');
      anythingUnlocked = true;
    }
  }
  // Trophy achievements
  for (const ach of TROPHY_ACHIEVEMENTS) {
    if (DEMO.unlockedAch.has(ach.id)) continue;
    const checkFn = TROPHY_CHECKS[ach.id];
    if (checkFn && checkFn()) {
      DEMO.unlockedAch.add(ach.id);
      fireAchievement(ach, 'trophy');
      anythingUnlocked = true;
    }
  }
  if (anythingUnlocked) saveGame(); // achievement unlocked — save immediately
  // Refresh screen 2 if open
  if (document.getElementById('screen2').classList.contains('open')) renderScreen2();
}

function fireAchievement(ach, type) {
  const el = document.createElement('div');
  el.className = 'ach-notif';
  const isMoney = type === 'money';
  el.innerHTML = `
    <div class="ach-notif-icon">${ach.icon || (isMoney ? '💰' : '🏆')}</div>
    <div class="ach-notif-body">
      <div class="ach-notif-label">${isMoney ? 'Achievement — Reward Earned' : 'Trophy Unlocked'}</div>
      <div class="ach-notif-title">${ach.title}</div>
      ${isMoney ? `<div class="ach-notif-reward">+${fmt$(ach.reward)} credited to balance</div>` : ''}
    </div>`;
  document.getElementById('ach-notify').appendChild(el);
  setTimeout(() => {
    el.style.animation = 'toastOut .3s ease forwards';
    setTimeout(() => el.remove(), 320);
  }, 4500);
}

// Hook achievement checks to key events
// Achievement checker starts after data loads (see _waitForData below)
let _achieveAfterUnlock = null;

// ── Screen 2 navigation ───────────────────────────────
function openScreen2() {
  renderScreen2();
  document.getElementById('screen2').classList.add('open');
}
function closeScreen2() {
  document.getElementById('screen2').classList.remove('open');
}

// Tab switching
document.querySelectorAll('.s2-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.s2-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.s2-pane').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('pane-' + tab.dataset.pane).classList.add('active');
  });
});

// Sort flight log
document.getElementById('fl-sort').addEventListener('change', renderFlightLogPane);

// ── Render Screen 2 ───────────────────────────────────
function renderScreen2() {
  renderFlightLogPane();
  renderMoneyAchievements();
  renderTrophyAchievements();
  renderExplorerPane();
}

function renderFlightLogPane() {
  const log = [...DEMO.flightLog];
  const sort = document.getElementById('fl-sort').value;
  if (sort === 'miles') log.sort((a,b) => (b.distMi||0) - (a.distMi||0));
  if (sort === 'fare')  log.sort((a,b) => (b.fare||0) - (a.fare||0));
  // default: most recent (already in order)

  const totalMiles = log.reduce((s,f)=>s+(f.distMi||0),0);
  const uniqueRoutes = new Set(log.map(f=>f.from+'|'+f.to)).size;
  const uniqueTypes  = new Set(log.map(f=>f.aircraft)).size;

  document.getElementById('th-flights').textContent = log.length;
  checkCeoMileMilestones(totalMiles);
  document.getElementById('th-miles').textContent   = totalMiles >= 1000 ? Math.round(totalMiles/1000).toLocaleString()+'k' : totalMiles;
  // Set CEO wings tier label
  const _msTier = [...CEO_MILE_MILESTONES].reverse().find(m => totalMiles >= m.miles);
  const _tierEl = document.getElementById('th-miles-tier');
  if (_tierEl) _tierEl.textContent = _msTier ? _msTier.label : 'No wings yet';
  document.getElementById('th-routes').textContent  = uniqueRoutes;
  document.getElementById('th-types').textContent   = uniqueTypes;
  document.getElementById('fl-count').textContent   = log.length;

  const empty = document.getElementById('fl-empty');
  const table = document.getElementById('fl-table');
  const tbody = document.getElementById('fl-tbody');

  if (!log.length) {
    empty.style.display = 'block';
    table.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  table.style.display = 'table';

  tbody.innerHTML = log.slice().reverse().map(f => {
    const classCls = f.seatClass === 'business' ? 'fl-class-biz' : 'fl-class-eco';
    const al = AIRLINES[f.airline] || {};
    return `<tr>
      <td><div class="fl-route">${f.from} → ${f.to}</div></td>
      <td><div class="fl-airline">${al.name || f.airline}</div></td>
      <td style="font-size:10px;color:rgba(26,37,53,0.45)">${f.aircraft || '—'}</td>
      <td><span class="${classCls}" style="font-size:9px;font-weight:700;text-transform:uppercase">${f.seatClass || 'eco'}</span></td>
      <td style="font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;color:var(--dm-green)">${(f.distMi||0).toLocaleString()}</td>
      <td style="font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;color:var(--dm-amber)">${fmt$(f.fare||0)}</td>
      <td style="font-size:9px;color:rgba(26,37,53,0.45)">${f.day||'—'}</td>
    </tr>`;
  }).join('');
}

function renderMoneyAchievements(targetId) {
  const total = totalActiveRoutes();
  let unlocked = 0;
  const html = MONEY_ACHIEVEMENTS.map(ach => {
    const done = DEMO.unlockedAch.has(ach.id);
    if (done) unlocked++;
    // Progress bar value
    let pct = 0, progLabel = '';
    if (ach.id === 'first_flight')   { pct = Math.min(100, total*100); }
    else if (ach.id === 'off_ground') { pct = Math.min(100, total/5*100); progLabel = total+'/5'; }
    else if (ach.id === 'building_net') { pct = Math.min(100, total/10*100); progLabel = total+'/10'; }
    else if (ach.id === 'regional')   { pct = Math.min(100, total/25*100); progLabel = total+'/25'; }
    else if (ach.id === 'major_carrier'){ pct = Math.min(100, total/50*100); progLabel = total+'/50'; }
    else if (ach.id === 'global_net') { pct = Math.min(100, total/100*100); progLabel = total+'/100'; }
    else if (ach.id === 'first_acq')  { pct = Math.min(100, DEMO.ownedAirlines.length/2*100); progLabel = DEMO.ownedAirlines.length+'/2 airlines'; }
    else if (ach.id === 'portfolio')  { pct = Math.min(100, DEMO.ownedAirlines.length/3*100); progLabel = DEMO.ownedAirlines.length+'/3 airlines'; }
    else if (ach.id === 'empire')     { pct = Math.min(100, DEMO.ownedAirlines.length/5*100); progLabel = DEMO.ownedAirlines.length+'/5 airlines'; }
    else if (ach.id === 'first_hour') { pct = Math.min(100, DEMO.day/4*100); progLabel = 'Day '+DEMO.day+'/4'; }
    else if (ach.id === 'dedicated_ceo') { pct = Math.min(100, DEMO.day/24*100); progLabel = 'Day '+DEMO.day+'/24'; }
    else { pct = done ? 100 : 0; }

    const fillCls = done ? 'done' : 'prog';
    return `<div class="ach-money-card ${done?'unlocked':''}">
      <div class="acm-header">
        <div class="acm-title">${ach.title}</div>
        <div class="acm-reward">${fmt$(ach.reward)}</div>
      </div>
      <div class="acm-trigger">${ach.trigger}</div>
      <div class="acm-progress-bar"><div class="acm-progress-fill ${fillCls}" style="width:${pct}%"></div></div>
      <div class="acm-status ${done?'done':'prog'}">${done ? '✓ Reward claimed' : (progLabel || 'In progress')}</div>
    </div>`;
  }).join('');
  const gridId = targetId || 'ach-money-grid';
  const grid = document.getElementById(gridId);
  if (grid) grid.innerHTML = html;
  // Always update the count in the traveler tab too
  const countEl = document.getElementById('ach-money-count');
  if (countEl) countEl.textContent = unlocked + ' / ' + MONEY_ACHIEVEMENTS.length;
}

function renderTrophyAchievements() {
  let unlocked = 0;
  const html = TROPHY_ACHIEVEMENTS.map(ach => {
    const done = DEMO.unlockedAch.has(ach.id);
    if (done) unlocked++;
    return `<div class="ach-trophy-card ${done?'unlocked':''}">
      <div class="act-icon">${ach.icon}</div>
      <div class="act-title">${ach.title}</div>
      <div class="act-trigger">${ach.trigger}</div>
    </div>`;
  }).join('');
  document.getElementById('ach-trophy-grid').innerHTML = html;
  document.getElementById('ach-trophy-count').textContent = unlocked + ' / ' + TROPHY_ACHIEVEMENTS.length;
}


