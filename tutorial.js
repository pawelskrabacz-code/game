// ═══════════════════════════════════════════════════════════════
//  SKYWARD — tutorial.js
//  TUT_STEPS definition, tutorial engine, welcome popup.
//  Depends on: game-config.js, game-utils.js
// ═══════════════════════════════════════════════════════════════

// ── WELCOME POPUP + GUIDED TUTORIAL ──────────────────

/* ── State ── */
let _tutActive     = false;  // guided tutorial running
let _tutStepId     = null;   // current step key
let _tutWaitFor    = null;   // {type, done} — action the player must complete
let _tutSkipped    = false;

/* ── Attach hooks so tutorial can detect player actions ── */
const _tutHooks = {};
function tutHook(name, fn) { _tutHooks[name] = fn; }
function fireTutHook(name, ...args) {
  if (_tutActive && _tutHooks[name]) _tutHooks[name](...args);
}

/* ── Step definitions ──────────────────────────────── */
const TUT_STEPS = {

  // ─── Phase 1: Map orientation ─────────────────────
  map_intro: {
    title: 'The map',
    bullets: [
      'Every dot is a real airport.',
      'Large dots = major hubs. Small dots = regional airports.',
      'Click any airport to open its details panel.',
    ],
    pos: 'top-center',
    next: 'map_hub',
    nextLabel: 'Next →',
  },

  map_hub: {
    title: 'Your hub airport',
    bullets: [
      'Your hub pulses with a ring on the map.',
      'You start there as CEO.',
      'All your starting routes operate from here.',
    ],
    pos: 'top-center',
    spotlightEl: () => document.getElementById('hud-loc'),
    next: 'map_click_hub',
    nextLabel: 'Got it →',
  },

  map_click_hub: {
    title: 'Open your hub',
    bullets: [
      'Click your hub airport on the map now.',
      `It's labelled <strong>${DEMO.hub}</strong>.`,
    ],
    pos: 'top-center',
    waitFor: 'airport_opened',
    waitLabel: 'Waiting for you…',
    waitCheck: (iata) => iata === DEMO.hub,
    onWaitDone: 'ap_overview',
  },

  // ─── Phase 2: Airport panel ────────────────────────
  ap_overview: {
    title: 'Airport panel — Overview',
    bullets: [
      'Shows stats: region, connections, load factor.',
      'Load factor = how full your flights are.',
      'Higher load factor → more revenue per route.',
    ],
    pos: 'right',
    spotlightEl: () => document.getElementById('ap-panel'),
    next: 'ap_routes_tab',
    nextLabel: 'Next →',
  },

  ap_routes_tab: {
    title: 'Airport panel — Routes tab',
    bullets: [
      'Lists all airports you can fly to from here.',
      'Green = routes you already operate.',
      'Click a destination to unlock a new route.',
    ],
    pos: 'right',
    spotlightEl: () => document.querySelector('.ap-tab[data-tab="routes"]'),
    action: () => { const t = document.querySelector('.ap-tab[data-tab="routes"]'); if(t) t.click(); },
    next: 'unlock_intro',
    nextLabel: 'Next →',
  },

  // ─── Phase 3: Buying a route ──────────────────────
  unlock_intro: {
    title: 'Unlock your first new route',
    bullets: [
      'Click any destination in the Routes tab.',
      'A route costs money upfront — but earns every day.',
      'Payback period is roughly 25 days.',
    ],
    pos: 'right',
    waitFor: 'unlock_modal_opened',
    waitLabel: 'Open a route…',
    onWaitDone: 'unlock_confirm',
  },

  unlock_confirm: {
    title: 'Confirm the route',
    bullets: [
      'Review the daily earnings and upfront cost.',
      'Press <strong>Unlock Route</strong> to buy it.',
      'The route starts earning immediately.',
    ],
    pos: 'center',
    waitFor: 'route_unlocked',
    waitLabel: 'Unlock a route…',
    onWaitDone: 'route_bought',
  },

  route_bought: {
    title: 'Route active! ✓',
    bullets: [
      'It now earns every game day automatically.',
      'More routes = faster balance growth.',
      'The HUD shows your total daily earnings.',
    ],
    pos: 'top-center',
    spotlightEl: () => document.getElementById('hud-bal'),
    next: 'hud_tour',
    nextLabel: 'Next →',
  },

  // ─── Phase 4: HUD ─────────────────────────────────
  hud_tour: {
    title: 'The HUD — Airline side',
    bullets: [
      '<strong>Balance</strong> — your airline\'s cash.',
      '<strong>Routes</strong> — total active routes.',
      '<strong>Day</strong> — current game day. Click to change speed.',
    ],
    pos: 'top-center',
    spotlightEl: () => document.getElementById('hud-left'),
    next: 'hud_ceo',
    nextLabel: 'Next →',
  },

  hud_ceo: {
    title: 'The HUD — CEO side',
    bullets: [
      '<strong>Salary</strong> — you earn this personally every day.',
      '<strong>Bank</strong> — your personal savings.',
      'CEO funds are separate from the airline.',
    ],
    pos: 'top-center',
    spotlightEl: () => document.getElementById('hud-right'),
    next: 'ceo_intro',
    nextLabel: 'Next →',
  },

  // ─── Phase 5: CEO flying ──────────────────────────
  ceo_intro: {
    title: 'You are the CEO',
    bullets: [
      'You\'re a real person in this world.',
      'Your location matters — shown in the HUD.',
      'To unlock routes <em>from a new city</em>, you must fly there first.',
    ],
    pos: 'top-center',
    next: 'ceo_why_fly',
    nextLabel: 'Next →',
  },

  ceo_why_fly: {
    title: 'Why fly as CEO?',
    bullets: [
      'Visiting airports unlocks their continent.',
      'Unlocked continents = rival airlines you can acquire.',
      'Flying also builds your traveler achievements.',
    ],
    pos: 'top-center',
    next: 'ceo_book_flight',
    nextLabel: 'Got it →',
  },

  ceo_book_flight: {
    title: 'Take your first flight',
    bullets: [
      'Click any airport connected to your hub.',
      'In the panel, press <strong>Book Flight</strong>.',
      'Personal flights cost your CEO cash, not airline funds.',
    ],
    pos: 'top-center',
    waitFor: 'booking_opened',
    waitLabel: 'Open a booking…',
    onWaitDone: 'ceo_confirm_flight',
  },

  ceo_confirm_flight: {
    title: 'Confirm your flight',
    bullets: [
      'Choose Economy or Business class.',
      'Business costs more but earns a personal milestone.',
      'Press <strong>Book Flight</strong> to depart.',
    ],
    pos: 'center',
    waitFor: 'flight_booked',
    waitLabel: 'Book the flight…',
    onWaitDone: 'ceo_in_flight',
  },

  ceo_in_flight: {
    title: 'Wheels up! ✈',
    bullets: [
      'The tracker bar shows your flight progress.',
      'Watch your location update when you land.',
      'From your new city, you can unlock more routes.',
    ],
    pos: 'bottom-center',
    spotlightEl: () => document.getElementById('tracker-bar'),
    next: 'further_help',
    nextLabel: 'Next →',
  },

  // ─── Phase 6: What's next ─────────────────────────
  further_help: {
    title: 'Want to keep learning?',
    bullets: [],
    pos: 'center',
    isFurtherHelp: true,
  },

  // ─── Optional advanced topics ─────────────────────
  advanced_acquire: {
    title: 'Acquiring airlines',
    bullets: [
      'Open the Hub panel (top-left button).',
      'Go to the <strong>Prospects</strong> tab.',
      'Buy rival airlines to grow your empire and earnings.',
    ],
    pos: 'top-center',
    next: 'advanced_promotions',
    nextLabel: 'Next →',
  },

  advanced_promotions: {
    title: 'Running promotions',
    bullets: [
      'Promotions temporarily boost a route\'s load factor.',
      'Higher load factor = more passengers = more revenue.',
      'Open any route in the airport panel to launch one.',
    ],
    pos: 'top-center',
    next: 'advanced_loan',
    nextLabel: 'Next →',
  },

  advanced_loan: {
    title: 'Taking a loan',
    bullets: [
      'Need capital fast? Take a loan from the bank.',
      'Click the bank icon (💰) in the top-right HUD.',
      'Loans unlock faster expansion — but cost interest.',
    ],
    pos: 'top-center',
    next: 'advanced_score',
    nextLabel: 'Next →',
  },

  advanced_score: {
    title: 'Your score card',
    bullets: [
      'Click your airline name in the HUD to open it.',
      'Score ranks your growth, network, and CEO performance.',
      'Aim for S rank by day 100.',
    ],
    pos: 'top-center',
    next: 'done',
    nextLabel: 'I\'m ready →',
  },

  done: {
    title: 'You\'re ready. Good luck.',
    bullets: [
      'Build routes. Fly as CEO. Acquire rivals.',
      'Check the daily report each night for your progress.',
      'The world is yours to connect.',
    ],
    pos: 'center',
    isDone: true,
  },
};

/* ── Render a tutorial step ──────────────────────────── */
function _tutRender(stepId) {
  _tutStepId = stepId;
  _tutHooks  && (Object.keys(_tutHooks).forEach(k => delete _tutHooks[k]));
  const step = TUT_STEPS[stepId];
  if (!step) { _tutDismiss(); return; }

  // Remove old spotlight
  document.querySelectorAll('.tut-spotlight').forEach(e => e.remove());

  // Spotlight element if specified
  if (step.spotlightEl) {
    const el = step.spotlightEl();
    if (el) {
      const r = el.getBoundingClientRect();
      const pad = 8;
      const sp = document.createElement('div');
      sp.className = 'tut-spotlight';
      sp.style.cssText = `left:${r.left - pad}px;top:${r.top - pad}px;width:${r.width + pad*2}px;height:${r.height + pad*2}px;border-radius:8px;`;
      document.getElementById('tutorial').appendChild(sp);
    }
  }

  // Fire any side-effect action (e.g. click a tab)
  if (step.action) setTimeout(step.action, 120);

  // Install wait hook
  if (step.waitFor) {
    tutHook(step.waitFor, (...args) => {
      if (!step.waitCheck || step.waitCheck(...args)) {
        _tutRender(step.onWaitDone);
      }
    });
  }

  // Build bubble HTML
  const bullets = step.bullets.map(b => `<div class="tut-bullet">• ${b}</div>`).join('');
  const posStyle = _tutPosStyle(step.pos);

  let footer = '';
  if (step.isFurtherHelp) {
    footer = `
      <div class="tut-further-row">
        <button class="tut-btn-yes" onclick="_tutRender('advanced_acquire')">Yes, show me more →</button>
        <button class="tut-btn-no"  onclick="_tutDismiss()">No thanks, I'm good</button>
      </div>`;
  } else if (step.isDone) {
    footer = `<button class="tut-btn-done" onclick="_tutDismiss()">Start playing ✓</button>`;
  } else if (step.waitFor) {
    footer = `
      <div class="tut-wait-row">
        <span class="tut-wait-label">⏳ ${step.waitLabel || 'Complete the action…'}</span>
        <button class="tut-btn-skip" onclick="_tutDismiss()">Skip tutorial</button>
      </div>`;
  } else {
    footer = `
      <div class="tut-btn-row">
        <button class="tut-btn-next" onclick="_tutRender('${step.next}')">${step.nextLabel || 'Next →'}</button>
        <button class="tut-btn-skip" onclick="_tutDismiss()">Skip</button>
      </div>`;
  }

  const phaseLabel = _tutPhase(stepId);

  document.getElementById('tutorial').innerHTML = `
    <div class="tut-step" style="${posStyle}">
      <div class="tut-phase-label">${phaseLabel}</div>
      <div class="tut-step-title">${step.title}</div>
      <div class="tut-bullets">${bullets}</div>
      ${footer}
    </div>`;
}

function _tutPhase(id) {
  const phases = {
    map_intro:'Phase 1 · The Map', map_hub:'Phase 1 · The Map', map_click_hub:'Phase 1 · The Map',
    ap_overview:'Phase 2 · Airport Panel', ap_routes_tab:'Phase 2 · Airport Panel',
    unlock_intro:'Phase 3 · Your First Route', unlock_confirm:'Phase 3 · Your First Route', route_bought:'Phase 3 · Your First Route',
    hud_tour:'Phase 4 · The HUD', hud_ceo:'Phase 4 · The HUD',
    ceo_intro:'Phase 5 · CEO Flying', ceo_why_fly:'Phase 5 · CEO Flying',
    ceo_book_flight:'Phase 5 · CEO Flying', ceo_confirm_flight:'Phase 5 · CEO Flying', ceo_in_flight:'Phase 5 · CEO Flying',
    further_help:'Almost done!',
    advanced_acquire:'Advanced · Acquiring', advanced_promotions:'Advanced · Promotions',
    advanced_loan:'Advanced · Bank', advanced_score:'Advanced · Scoring',
    done:'Ready to fly',
  };
  return phases[id] || 'Tutorial';
}

function _tutPosStyle(pos) {
  // ── Detect open UI layers ──────────────────────────────────────────────
  const modalOpen    = document.querySelector(
    '#unlock-overlay.open, #acq-overlay.open, #book-overlay.open, ' +
    '#bp-overlay.open, #bank-overlay.open, #promo-overlay.open, #arrival-overlay.show'
  ) !== null;
  const apPanelOpen  = document.getElementById('ap-panel')?.classList.contains('open');
  const ceoPanelOpen = document.getElementById('ceo-panel')?.classList.contains('open');
  const trackerOpen  = document.getElementById('tracker-bar')?.classList.contains('open');

  // ── Position constants ────────────────────────────────────────────────
  const TOP_LEFT     = 'top:70px;left:20px';
  const TOP_CENTER   = 'top:70px;left:50%;transform:translateX(-50%)';
  const TOP_RIGHT    = 'top:70px;right:20px';
  const BOTTOM_RIGHT = 'bottom:90px;right:20px';
  const BOTTOM_LEFT  = 'bottom:90px;left:20px';
  const CENTER       = 'top:50%;left:50%;transform:translate(-50%,-50%)';

  switch (pos) {

    case 'top-center':
      // Modal is centred — shift left to avoid header overlap
      if (modalOpen)    return TOP_LEFT;
      // AP panel occupies right side — go left
      if (apPanelOpen)  return TOP_LEFT;
      // CEO panel occupies left side — go right
      if (ceoPanelOpen) return TOP_RIGHT;
      return TOP_CENTER;

    case 'right':
      // Step is designed to sit beside the airport panel (400 px from right)
      if (apPanelOpen)  return 'top:120px;right:420px';
      if (modalOpen)    return BOTTOM_LEFT;
      return TOP_RIGHT;

    case 'center':
      // Modals are centred — dodge to safe corner instead
      if (modalOpen)    return BOTTOM_RIGHT;
      if (apPanelOpen)  return TOP_LEFT;
      if (ceoPanelOpen) return TOP_RIGHT;
      return CENTER;

    case 'bottom-center':
      // Tracker bar is full-width at the bottom — push up if open
      if (trackerOpen)  return 'bottom:160px;left:50%;transform:translateX(-50%)';
      if (modalOpen)    return BOTTOM_RIGHT;
      if (apPanelOpen)  return BOTTOM_LEFT;
      return 'bottom:90px;left:50%;transform:translateX(-50%)';

    default:
      return TOP_CENTER;
  }
}

function _tutDismiss() {
  _tutActive = false;
  _tutStepId = null;
  Object.keys(_tutHooks).forEach(k => delete _tutHooks[k]);
  document.getElementById('tutorial').innerHTML = '';
  document.querySelectorAll('.tut-spotlight').forEach(e => e.remove());
  showToast('info', 'Tutorial dismissed', 'Click any airport to get started.');
}

/* ── Welcome popup (shown right after game launch) ──── */
function showWelcomePopup() {
  const airline = AIRLINES[DEMO.airlineCode] || {};
  const routes  = [...DEMO.acquiredStarting];

  // Header
  document.getElementById('wl-airline-name').textContent = airline.name || DEMO.airlineCode;
  document.getElementById('wl-tagline').textContent =
    `${airline.alliance && airline.alliance !== 'None' ? airline.alliance + ' · ' : ''}Hub: ${DEMO.hub} · ${routes.length} starting routes`;

  // Route rows
  let totalEarn = 0;
  const routeHTML = routes.map(key => {
    const [a, b] = key.split('|');
    const idxs = AP_IDX[a] || [];
    let route = null;
    for (const i of idxs) {
      const r = ROUTES[i];
      if ((r[0]===a&&r[1]===b)||(r[0]===b&&r[1]===a)) { route = r; break; }
    }
    if (!route) return '';
    const earn = (route[_EARN] || 0) * FS;
    totalEarn += earn;
    const apA  = AIRPORTS[a] || {};
    const apB  = AIRPORTS[b] || {};
    const ac   = AIRCRAFT[route[_EQ]] || {};
    const fromCity = apA.city || a;
    const toCity   = apB.city || b;
    const dist = route[_MI] ? route[_MI].toLocaleString() + ' mi' : '—';
    return `<div class="wl-route-row">
      <div class="wl-route-pair">${a} → ${b}</div>
      <div class="wl-route-mid">
        <div class="wl-route-name">${fromCity} → ${toCity}</div>
        <div class="wl-route-ac">${ac.model || route[_EQ] || '—'} · ${dist}</div>
      </div>
      <div class="wl-route-earn">+${fmt$(earn)}/day</div>
    </div>`;
  }).join('');

  document.getElementById('wl-routes').innerHTML = routeHTML;
  document.getElementById('wl-total-earn').textContent = fmt$(totalEarn) + '/day';
  document.getElementById('welcome-overlay').style.display = 'flex';
}

function closeWelcomePopup() {
  const el = document.getElementById('welcome-overlay');
  el.style.transition = 'opacity .25s';
  el.style.opacity = '0';
  setTimeout(() => { el.style.display = 'none'; el.style.opacity = ''; }, 260);

  // Show first-time prompt
  setTimeout(() => _tutShowFirstTimePrompt(), 500);
}

/* ── First-time prompt ──────────────────────────────── */
function _tutShowFirstTimePrompt() {
  const tut = document.getElementById('tutorial');
  tut.innerHTML = `
    <div class="tut-step tut-welcome-prompt" style="top:50%;left:50%;transform:translate(-50%,-50%)">
      <div class="tut-prompt-icon">✈</div>
      <div class="tut-step-title">Is this your first time playing?</div>
      <div class="tut-prompt-sub">We can walk you through the map, routes, and CEO flying — step by step.</div>
      <div class="tut-prompt-row">
        <button class="tut-btn-yes" onclick="_tutStart()">Yes, show me how to play</button>
        <button class="tut-btn-no"  onclick="_tutDismiss()">No thanks, I know what I'm doing</button>
      </div>
    </div>`;
}

function _tutStart() {
  _tutActive = true;
  _tutRender('map_intro');
}

