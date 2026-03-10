// ═══════════════════════════════════════════════════════════════
//  SKYWARD — onboarding.js
//  Airline picker, budget selector, onboarding flow, launchGame().
//  Depends on: game-config.js (FEATURED_AIRLINES), airlines.js, airports.js
// ═══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════
//  PHASE 8 — INTEGRATION, POLISH & GAME LOOP
//  Onboarding · Tutorial · Save/Load · Polish
// ══════════════════════════════════════════════════════

// ── Onboarding data ───────────────────────────────────
let obSelectedBudget  = 300000;
let obCurrentCat      = 'Small';
let obShowingAll      = false;


/* ═══ STEP-1 FULL-SCREEN PICKER JS ═══ */
let ob1Cat = 'Small', ob1SortMode = 'routes', ob1AllianceFilter = 'all';

function ob1SetCat(cat, el) {
  ob1Cat = cat;
  const si = document.getElementById('ob1-search');
  if (si) si.value = '';
  document.querySelectorAll('.ob1-catrow').forEach(r => r.classList.remove('active'));
  el.classList.add('active');
  ob1Render();
}

function ob1Sort(mode) {
  ob1SortMode = mode;
  ob1Render();
}

function ob1ToggleFilter(el, type, val) {
  ob1AllianceFilter = val;
  document.querySelectorAll('#ob1-alliance-filters label span').forEach(s => s.style.color = 'transparent');
  el.querySelector('span').style.color = '#F5A623';
  ob1Render();
}

function ob1GetFleetText(al) {
  if (!al) return '';
  const fleet = al.fleet || {};
  const labels = { Wide:'Wide-body', Narrow:'Narrow-body', RJ:'Regional jet', Turbo:'Turboprop' };
  const parts = [];
  for (const [k,v] of Object.entries(fleet)) {
    if (v > 0) parts.push(`<span class="fi">${labels[k]||k} ×${v}</span>`);
  }
  return parts.join('<span style="margin:0 4px;color:rgba(26,37,53,0.2)">·</span>') ||
    '<span style="color:rgba(26,37,53,0.3)">Fleet data loading…</span>';
}

function ob1AllianceCls(a) {
  return a==='Star Alliance'?'all-star':a==='SkyTeam'?'all-sky':a==='oneworld'?'all-one':'all-none';
}

function ob1UpdateCounts() {
  if (typeof AIRLINES === 'undefined') return;
  ['Small','Medium','Large'].forEach(cat => {
    const n = Object.values(AIRLINES).filter(a => a.category === cat).length;
    const el = document.getElementById('ob1-cnt-' + cat);
    if (el) el.textContent = n;
  });
}

function ob1Render() {
  if (typeof AIRLINES === 'undefined') return;
  ob1UpdateCounts();

  const q = (document.getElementById('ob1-search')?.value || '').toLowerCase().trim();
  let list = Object.values(AIRLINES).filter(a => a.category === ob1Cat);

  if (ob1AllianceFilter !== 'all') {
    list = list.filter(a => (a.alliance || 'None') === ob1AllianceFilter);
  }

  if (q) {
    list = Object.values(AIRLINES).filter(a =>
      (a.name||'').toLowerCase().includes(q) ||
      (a.code||'').toLowerCase().includes(q) ||
      (a.primaryHub||'').toLowerCase().includes(q) ||
      (a.hubs||[]).some(h => h.toLowerCase().includes(q))
    );
  }

  if (ob1SortMode === 'routes') {
    list.sort((a,b) => (b.routes||0) - (a.routes||0));
  } else {
    list.sort((a,b) => (a.name||'').localeCompare(b.name||''));
  }

  document.getElementById('ob1-showing').textContent = list.length;
  document.getElementById('ob1-total').textContent = q
    ? Object.values(AIRLINES).length
    : Object.values(AIRLINES).filter(a => a.category === ob1Cat).length;

  const container = document.getElementById('ob1-list');
  if (!list.length) {
    container.innerHTML = `<div class="ob1-noresults">No airlines found</div>`;
    return;
  }

  container.innerHTML = list.map(al => {
    const isSel = al.code === obSelectedAirline;
    const alBadge = al.alliance && al.alliance !== 'None'
      ? `<span class="ob-alliance-badge ${ob1AllianceCls(al.alliance)}" style="margin-left:6px;font-size:7px">${al.alliance}</span>` : '';
    return `<div class="ob1-alrow${isSel?' selected':''}" onclick="ob1Pick('${al.code}')">
      <div class="ob1-iata-col"><span class="ob1-iata">${al.code}</span></div>
      <div class="ob1-albody">
        <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:3px">
          <span class="ob1-alname">${al.name||al.code}</span>${alBadge}
        </div>
        <div class="ob1-almeta">
          <span>HUB</span><span class="dot">·</span><span class="val">${al.primaryHub||'—'}</span>
          <span class="dot">  ·  </span>
          <span>AVG</span><span class="dot">·</span><span class="val">${(al.avgMiles||0).toLocaleString()} mi</span>
        </div>

      </div>
      <div class="ob1-alroutes-col">
        <div class="ob1-alroutes-num">${(al.routes||0).toLocaleString()}</div>
        <div class="ob1-alroutes-lbl">routes</div>
      </div>
    </div>`;
  }).join('');
}

function ob1Pick(code) {
  obSelectedAirline = code;
  // Derive budget directly from airline's category — no separate picker
  const _pickAl = typeof AIRLINES !== 'undefined' ? AIRLINES[code] : null;
  if (_pickAl) obSelectedBudget = _pickAl.startingBudget || { Small:30000, Medium:75000, Large:150000 }[_pickAl.category] || 75000;
  ob1Render();
  const al = _pickAl;
  if (!al) return;
  document.getElementById('ob1-sel-status').innerHTML = `Selected: <strong>${al.name}</strong>`;
  document.getElementById('ob-al-next').disabled = false;
  ob1RenderDetail(al);
}

function ob1GetFleet(airlineCode) {
  if (typeof ROUTES === 'undefined' || typeof AIRCRAFT === 'undefined') return [];
  const seen = {};
  for (const r of ROUTES) {
    if (r[2] !== airlineCode) continue;
    const code = r[9];
    if (!code || seen[code]) continue;
    seen[code] = true;
  }
  // Group by family
  const families = {};
  for (const code of Object.keys(seen)) {
    const ac = AIRCRAFT[code];
    if (!ac) continue;
    const fam = ac.family;
    if (!families[fam]) families[fam] = { mfr: ac.mfr, type: ac.type, models: new Set() };
    families[fam].models.add(ac.model);
  }
  return Object.entries(families)
    .sort((a,b) => {
      const order = { Wide:0, Narrow:1, RJ:2, Turbo:3 };
      return (order[a[1].type]||9) - (order[b[1].type]||9);
    })
    .map(([fam, data]) => ({
      family: fam,
      mfr: data.mfr,
      type: data.type,
      models: [...data.models].sort()
    }));
}

function ob1RenderDetail(al) {
  const panel = document.getElementById('ob1-right');
  if (!al || !panel) return;



  const alBadge = al.alliance && al.alliance !== 'None'
    ? `<span class="ob-alliance-badge ${ob1AllianceCls(al.alliance)}">${al.alliance}</span>`
    : '<span style="font-family:\'DM Mono\',monospace;font-size:9px;color:rgba(26,37,53,0.4)">Independent</span>';

  const hubsHtml = [...new Set([al.primaryHub, ...(al.hubs||[])])].filter(Boolean)
    .map((h,i) => `<span class="ob1-hub${i===0?' primary':''}">${h}</span>`)
    .join('<span class="ob1-hub-sep">/</span>');

  const focusHtml = (al.focus||[]).length ? (al.focus||[]).join(' · ') : '';

  const tagline = al.tagline || `${al.category} carrier — your game starts at ${al.primaryHub||'—'}.`;

  panel.innerHTML = `
    <div class="ob1-dhead">
      <div class="ob1-deyebrow">${al.code} · ${al.category||''} carrier</div>
      <div class="ob1-dname">${al.name||al.code}</div>
      <div class="ob1-dtagline">${tagline}</div>
    </div>
    <div class="ob1-dbody">
      <div class="ob1-dsec">
        <div class="ob1-dseclbl">Network</div>
        <div class="ob1-drow"><span class="ob1-dk">Total routes</span><span class="ob1-dv big">${(al.routes||0).toLocaleString()}</span></div>
        <div class="ob1-drow"><span class="ob1-dk">Avg. route distance</span><span class="ob1-dv">${(al.avgMiles||0).toLocaleString()} mi</span></div>
        <div class="ob1-drow"><span class="ob1-dk">Alliance</span><span class="ob1-dv">${alBadge}</span></div>
        <div class="ob1-drow" style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(26,37,53,0.08)">
          <span class="ob1-dk">Starting capital</span>
          <span class="ob1-dv" style="font-family:'DM Mono',monospace;font-size:15px;font-weight:700;color:var(--dm-amber)">$${(obSelectedBudget).toLocaleString()}</span>
        </div>
        <div class="ob1-drow" style="margin-top:2px">
          <span class="ob1-dk" style="color:rgba(26,37,53,0.35)"></span>
          <span style="font-size:9px;color:rgba(26,37,53,0.4)">${al.category} airline starting budget</span>
        </div>
      </div>
      <div class="ob1-dsec">
        <div class="ob1-dseclbl">Starting hub &amp; bases</div>
        <div class="ob1-drow"><span class="ob1-dk">Starting hub</span><span class="ob1-dv" style="color:var(--dm-amber);font-family:'DM Mono',monospace">${al.primaryHub||'—'}</span></div>
        <div class="ob1-drow" style="align-items:flex-start"><span class="ob1-dk">All bases</span><div class="ob1-hubs-line">${hubsHtml}</div></div>
        ${focusHtml ? '<div class="ob1-drow"><span class="ob1-dk">Focus cities</span><span class="ob1-dv">'+focusHtml+'</span></div>' : ''}
      </div>
      ${(function(){ var fleet=ob1GetFleet(al.code); if(!fleet.length) return ''; return '<div class="ob1-dsec"><div class="ob1-dseclbl">Aircraft types</div>'+fleet.map(function(f){ return '<div class="ob1-drow ob1-fleet-row" style="align-items:flex-start"><span class="ob1-dk" style="padding-top:1px">'+f.family+'</span><span class="ob1-dv" style="display:flex;flex-direction:column;align-items:flex-end;gap:3px">'+f.models.map(function(m){ return '<span class="ob1-fleet-model">'+m+'</span>'; }).join('')+'</span></div>'; }).join('')+'</div>'; })()}
    </div>`;
}
/* ═══ END STEP-1 JS ═══ */

function obShowCard() {
  document.getElementById('ob-welcome').style.display = 'none';
  const card = document.getElementById('ob-card');
  card.style.display = 'flex';
  card.style.flexDirection = 'column';
  card.style.maxWidth = 'none';
  card.style.width = '100%';
  card.style.height = '100%';
  card.style.borderRadius = '0';
  card.style.border = 'none';
  card.style.boxShadow = 'none';
  card.style.background = '#F2F6FA';
  card.style.overflow = 'hidden';
  document.getElementById('ob-dots').style.display = 'none';
  document.getElementById('onboarding').style.padding = '0';
  document.getElementById('onboarding').style.alignItems = 'stretch';
  document.getElementById('onboarding').style.justifyContent = 'stretch';
  ob1Render();
}

function obShowWelcome() {
  document.getElementById('ob-welcome').style.display = 'flex';
  const card = document.getElementById('ob-card');
  card.style.display = 'none';
  card.style.maxWidth = '';
  card.style.width = '';
  card.style.borderRadius = '';
  card.style.border = '';
  card.style.boxShadow = '';
  card.style.background = '';
  const ob = document.getElementById('onboarding');
  ob.style.padding = '24px';
  ob.style.alignItems = 'center';
  ob.style.justifyContent = 'center';
  document.getElementById('ob-dots').style.display = 'none';
  document.querySelectorAll('.ob-step').forEach(s => s.classList.remove('active'));
  document.getElementById('ob-step-1').classList.add('active');
  obSelectedAirline = null;
}

function obShowHowTo() { obShowCard(); }

function obSelectCat(cat, tabEl) {
  obCurrentCat = cat;
  obShowingAll = false;
  document.querySelectorAll('.ob-cat-tab').forEach(t => t.classList.remove('active'));
  tabEl.classList.add('active');
  renderAirlineCategory(cat);
}

function obToggleAll() {
  obShowingAll = !obShowingAll;
  renderAirlineCategory(obCurrentCat);
}

function updateCatCounts() {
  if (typeof AIRLINES === 'undefined') return;
  ['Small','Medium','Large'].forEach(cat => {
    const n = Object.values(AIRLINES).filter(al => al.category === cat).length;
    const el = document.getElementById('ob-count-' + cat);
    if (el) el.textContent = n + ' airlines';
  });
}

function renderAirlineCategory(cat) {
  updateCatCounts();
  const grid  = document.getElementById('ob-airline-grid');
  const btn   = document.getElementById('ob-show-all-btn');
  if (!grid) return; // old element replaced by new 3-col layout
  const featuredCodes = FEATURED_AIRLINES[cat] || [];

  const all = typeof AIRLINES !== 'undefined'
    ? Object.values(AIRLINES).filter(al => al.category === cat)
        .sort((a, b) => (b.routes || 0) - (a.routes || 0))
    : featuredCodes.map(c => ({ code:c, name:c, primaryHub:'—', routes:0, alliance:'None', category:cat }));

  // Default: show only featured picks; expanded: show all
  const display = obShowingAll ? all : all.filter(al => featuredCodes.includes(al.code));

  grid.innerHTML = display.map(al => {
    const isFeatured = featuredCodes.includes(al.code);
    const isSel  = al.code === obSelectedAirline;
    const alCls  = al.alliance==='Star Alliance'?'all-star':al.alliance==='SkyTeam'?'all-sky':al.alliance==='oneworld'?'all-one':'all-none';
    const alBadge = al.alliance && al.alliance!=='None'
      ? `<div class="ob-alliance-badge ${alCls}">${al.alliance}</div>` : '';
    return `<div class="ob-airline-card${isFeatured?' featured':''}${isSel?' selected':''}" data-code="${al.code}" onclick="selectAirline('${al.code}')">
      <div class="ob-al-code">${al.code}</div>
      <div class="ob-al-mid">
        <div class="ob-al-name">${al.name}</div>
        <div class="ob-al-hub">Hub: ${al.primaryHub || '\u2014'}</div>
      </div>
      <div class="ob-al-right">
        <div class="ob-al-routes">${(al.routes||0).toLocaleString()} routes</div>
        ${alBadge}
      </div>
    </div>`;
  }).join('');

  const remaining = all.length - display.length;
  btn.textContent = obShowingAll
    ? `Show only top picks \u25b4`
    : `Show all ${all.length} ${cat.toLowerCase()} airlines \u2014 ${remaining} more \u25be`;
  btn.style.display = 'block'; // always visible
}

function selectAirline(code) {
  obSelectedAirline = code;
  document.querySelectorAll('.ob-airline-card').forEach(c => c.classList.remove('selected'));
  const el = document.querySelector(`.ob-airline-card[data-code="${code}"]`);
  if (el) el.classList.add('selected');
  document.getElementById('ob-al-next').disabled = false;
}

function selectBudget(el) {
  document.querySelectorAll('.ob-budget-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  obSelectedBudget = parseInt(el.dataset.budget);
}

function obStep(n) {
  document.querySelectorAll('.ob-step').forEach(s => s.classList.remove('active'));
  document.getElementById('ob-step-' + n).classList.add('active');
  // Steps 2+3: shrink card back to modal style
  if (n > 1) {
    const card = document.getElementById('ob-card');
    card.style.maxWidth = '580px';
    card.style.width = '100%';
    card.style.borderRadius = '14px';
    card.style.border = '1px solid rgba(30,78,122,0.25)';
    card.style.boxShadow = '0 40px 100px rgba(30,50,80,0.5)';
    card.style.background = '#F0F5FA';
    const ob = document.getElementById('onboarding');
    ob.style.padding = '24px';
    ob.style.alignItems = 'center';
    document.getElementById('ob-dots').style.display = 'flex';
  }
  document.querySelectorAll('.ob-dot').forEach((d, i) => d.classList.toggle('active', i < n));
  if (n === 2) renderObSummary();
}

function renderObSummary() {
  const al = typeof AIRLINES !== 'undefined' ? (AIRLINES[obSelectedAirline] || {}) : {};
  document.getElementById('ob-summary').innerHTML = `
    <div class="ob-sum-cell"><div class="ob-sum-k">Airline</div><div class="ob-sum-v am">${al.name || obSelectedAirline}</div></div>
    <div class="ob-sum-cell"><div class="ob-sum-k">IATA Code</div><div class="ob-sum-v am">${obSelectedAirline}</div></div>
    <div class="ob-sum-cell"><div class="ob-sum-k">Home Hub</div><div class="ob-sum-v">${al.primaryHub || '\u2014'}</div></div>
    <div class="ob-sum-cell"><div class="ob-sum-k">Alliance</div><div class="ob-sum-v">${al.alliance || '\u2014'}</div></div>
    <div class="ob-sum-cell"><div class="ob-sum-k">Starting Capital</div><div class="ob-sum-v am">$${obSelectedBudget.toLocaleString()}</div></div>
    <div class="ob-sum-cell"><div class="ob-sum-k">Starting Day</div><div class="ob-sum-v">Day 1</div></div>`;
}

function launchGame() {
  const al = typeof AIRLINES !== 'undefined' ? AIRLINES[obSelectedAirline] : null;
  if (!al) return;

  // Configure DEMO from onboarding choices
  DEMO.airlineCode    = obSelectedAirline;
  DEMO.airlineName    = al.name;
  DEMO.hub            = al.primaryHub;
  DEMO.playerLocation = al.primaryHub;
  DEMO.balance        = obSelectedBudget;
  DEMO.day            = 1;
  DEMO.visitedAirports    = new Set();
  DEMO.unlockedContinents = new Set();
  DEMO.completedRegions   = new Set();
  DEMO.firstVisitLog      = [];
  // Stamp starting hub as visited + unlock its continent for free
  DEMO.visitedAirports.add(al.primaryHub);
  const _startAp = AIRPORTS[al.primaryHub] || {};
  if (_startAp.continent && _startAp.continent !== '?') DEMO.unlockedContinents.add(_startAp.continent);
  DEMO.unlockedRoutes = new Set();
  DEMO.acquiredRoutes  = new Set();
  DEMO.acquiredStarting = new Set();
  DEMO.ownedAirlines   = [obSelectedAirline];
  invalidateNetCache(); invalidateEarnCache();
  // Populate 5 starting routes: randomly pick from the top 15 by frequency
  // so each game starts with a different mix while still being viable routes
  const hub = al.primaryHub;
  // Collect routes from primary hub first
  const hubIdxs = AP_IDX[hub] || [];
  let airlineRoutes = hubIdxs
    .map(i => ROUTES[i])
    .filter(r => r && r[2] === obSelectedAirline)
    .sort((a, b) => (b[3] || 0) - (a[3] || 0));
  // Backfill from all airline routes if primary hub has fewer than 5
  if (airlineRoutes.length < 5) {
    const allAirlineRoutes = ROUTES
      .filter(r => r && r[2] === obSelectedAirline)
      .sort((a, b) => (b[3] || 0) - (a[3] || 0));
    const existing = new Set(airlineRoutes.map(r => r[0] + '|' + r[1]));
    for (const r of allAirlineRoutes) {
      if (airlineRoutes.length >= 5) break;
      if (!existing.has(r[0] + '|' + r[1])) {
        airlineRoutes.push(r);
        existing.add(r[0] + '|' + r[1]);
      }
    }
  }
  const pool = airlineRoutes.slice(0, Math.min(15, airlineRoutes.length));
  // Fisher-Yates shuffle the pool, then take first 5
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const starting5 = pool.slice(0, Math.min(5, pool.length));
  DEMO.routeOpenDays    = {};
  DEMO.activePromotions = [];
  DEMO.lastDailyReport  = null;
  for (const r of starting5) {
    const key = routeKey(r[0], r[1], obSelectedAirline);
    DEMO.acquiredStarting.add(key);
    // null = pre-game routes are fully mature from day 1
  }
  DEMO.ceoSalary       = 200;
  DEMO.ceoBalance      = 500;  // small personal seed
  DEMO.totalEarned     = 0;
  DEMO.ceoBonuses      = [];
  DEMO.earningsHistory = [];
  DEMO.flightLog       = [];
  DEMO.unlockedAch     = new Set(['first_flight', 'off_ground']); // already have 5 routes at start
  DEMO.lastSalaryMilestone = 0;  // start milestone already given
  DEMO.dayProgress     = 0;
  DEMO.gameSpeed       = 1;
  DEMO.gameStartTime   = performance.now();
  setTimeout(updateAirportCounter, 100);
  setTimeout(updatePlaytimeHud, 150);
  DEMO.loan            = null;  // always start fresh
  // First airline has no prior network → no adjacency bonus
  DEMO.airlineAdjacent = { [obSelectedAirline]: false };

  // Dismiss onboarding
  const ob = document.getElementById('onboarding');
  ob.style.transition = 'opacity .4s';
  ob.style.opacity = '0';
  setTimeout(() => { ob.style.display = 'none'; }, 420);

  // Update HUD immediately
  document.getElementById('hud-airline').textContent = al.name;
  document.getElementById('hud-loc').textContent     = al.primaryHub;
  document.getElementById('hud-bal').textContent     = '$' + obSelectedBudget.toLocaleString();
  document.getElementById('hud-day').textContent     = '1';
  document.getElementById('hud-routes').textContent  = DEMO.acquiredStarting.size;
  document.getElementById('hud-ceo-sal').textContent = '$200/day';
  document.getElementById('hud-ceo-bal').textContent = fmt$(DEMO.ceoBalance || 500);

  init().then(() => {
    flyTo(al.primaryHub, 2.2);
    setTimeout(() => showWelcomePopup(), 800);
  });
}

