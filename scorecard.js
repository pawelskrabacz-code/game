// ═══════════════════════════════════════════════════════════════
//  SKYWARD — scorecard.js
//  Score card modal: empire stats, copy-to-clipboard, challenge code.
//  Depends on: game-config.js, game-utils.js
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════

function getScoreCardData() {
  const totalRoutes = DEMO.unlockedRoutes.size + DEMO.acquiredStarting.size;
  const totalEarned  = DEMO.totalEarned || 0;
  const dailyEarn    = calcDailyEarnings();
  const ceoMiles     = (DEMO.flightLog||[]).reduce((s,f)=>s+(f.distMi||0),0);
  const continents   = (DEMO.unlockedContinents||new Set()).size;
  const regions      = (DEMO.completedRegions||new Set()).size;
  const day          = DEMO.day || 1;
  const airlines     = (DEMO.ownedAirlines||[]).length;

  // Best single day from history
  const bestDay = Math.max(...(DEMO.earningsHistory||[0]), dailyEarn);

  // Top earning route
  let topRoute = null, topEarn = 0;
  const allKeys = [...DEMO.unlockedRoutes, ...DEMO.acquiredStarting];
  const seen = new Set();
  for (const key of allKeys) {
    if (seen.has(key)) continue; seen.add(key);
    const [a, b, code] = key.split('|');
    const lf = calcAirlineLF(code);
    const idxs = AL_IDX[code] || AP_IDX[a] || [];
    for (const i of idxs) {
      const r = ROUTES[i];
      if ((r[0]===a&&r[1]===b)||(r[0]===b&&r[1]===a)) {
        const earn = Math.round((r[7]||0) * FS * lf * getRegionBonus(a, b));
        if (earn > topEarn) { topEarn = earn; topRoute = { from: a, to: b, earn }; }
        break;
      }
    }
  }

  // Wings tier
  let wingsLabel = 'No Wings';
  for (const ms of CEO_MILE_MILESTONES) { if (ceoMiles >= ms.miles) wingsLabel = ms.label; }

  // Title from salary milestones
  let title = 'New CEO';
  for (const ms of SALARY_MILESTONES) { if (totalRoutes >= ms.routes) title = ms.stage; }

  // Score formula
  const score = Math.round(
    dailyEarn * 0.4 +
    totalRoutes * 500 +
    airlines * 2000 +
    ceoMiles * 0.1 +
    regions * 5000 +
    (DEMO.unlockedAch ? DEMO.unlockedAch.size * 1000 : 0)
  );

  // Rank
  let rank = 'F';
  if (score >= 2000000) rank = 'S+';
  else if (score >= 800000) rank = 'S';
  else if (score >= 400000) rank = 'A';
  else if (score >= 180000) rank = 'B';
  else if (score >= 60000)  rank = 'C';
  else if (score >= 15000)  rank = 'D';

  // Challenge code: AIRLINE-DAYXXX-SCORE
  const scoreK = score >= 1000 ? Math.round(score/1000)+'K' : score;
  const challengeCode = DEMO.airlineCode + '-D' + String(day).padStart(2,'0') + '-' + scoreK;

  return { totalRoutes, dailyEarn, bestDay, airlines, ceoMiles, continents, regions,
           day, score, rank, title, topRoute, topEarn, wingsLabel, challengeCode };
}

function openScoreCard() {
  const d = getScoreCardData();
  const rankColors = { 'S+':'#FFD700', 'S':'#F5A623', 'A':'#6EC6FF', 'B':'#7ED88F', 'C':'#C0C0C0', 'D':'#B07060', 'F':'#888' };
  const rc = rankColors[d.rank] || '#F5A623';

  // Populate header
  document.getElementById('sc-airline-code').textContent = DEMO.airlineCode;
  document.getElementById('sc-airline-name').textContent = DEMO.airlineName.toUpperCase();
  document.getElementById('sc-hub-day').textContent = 'HUB ' + DEMO.hub + ' · DAY ' + d.day;

  // Rank badge
  const badge = document.getElementById('sc-rank-badge');
  badge.textContent = d.rank;
  badge.style.cssText += `;background:radial-gradient(circle at 35% 35%,${rc}22,${rc}08);border:2px solid ${rc};box-shadow:0 0 20px ${rc}40,inset 0 0 10px ${rc}10;color:${rc}`;

  // Score
  document.getElementById('sc-score').textContent = d.score.toLocaleString();
  document.getElementById('sc-title').textContent = d.title;
  document.getElementById('sc-footer-day').textContent = 'DAY ' + String(d.day).padStart(4,'0');

  // Stats rows
  const fmt = (n) => n >= 1000000 ? '$'+(n/1000000).toFixed(1)+'M' : n >= 1000 ? '$'+(n/1000).toFixed(0)+'K' : '$'+n;
  const fmtMi = (n) => n >= 1000 ? (n/1000).toFixed(1)+'K mi' : n+' mi';
  document.getElementById('sc-stats').innerHTML = `
    <div class="sc-data-row"><span class="sc-dk">Daily Revenue</span><span class="sc-dv am">${fmt(d.dailyEarn)}/day</span></div>
    <div class="sc-data-row"><span class="sc-dk">Active Routes</span><span class="sc-dv">${d.totalRoutes} routes</span></div>
    <div class="sc-data-row"><span class="sc-dk">Airlines Owned</span><span class="sc-dv">${d.airlines} carriers</span></div>
    <div class="sc-data-row"><span class="sc-dk">CEO Mileage</span><span class="sc-dv">${fmtMi(d.ceoMiles)} · ${d.wingsLabel}</span></div>
    <div class="sc-data-row"><span class="sc-dk">Best Single Day</span><span class="sc-dv">${fmt(d.bestDay)}</span></div>
  `;

  // Continents
  const TOTAL_CONTINENTS = 7;
  document.getElementById('sc-cont-count').textContent = d.continents + '/' + TOTAL_CONTINENTS;
  const dotsEl = document.getElementById('sc-cont-dots');
  dotsEl.innerHTML = '';
  for (let i = 0; i < TOTAL_CONTINENTS; i++) {
    const dot = document.createElement('div');
    dot.className = 'sc-cont-dot';
    dot.style.background = i < d.continents ? '#F5A623' : 'rgba(240,245,250,0.1)';
    dotsEl.appendChild(dot);
  }
  document.getElementById('sc-regions-txt').textContent = d.regions + ' regions completed';

  // Top route
  const trEl = document.getElementById('sc-top-route');
  if (d.topRoute) {
    const fmt2 = fmt;
    trEl.innerHTML = `
      <span class="sc-route-pill">${d.topRoute.from}</span>
      <span style="font-size:10px;color:rgba(240,245,250,0.28)">→</span>
      <span class="sc-route-pill">${d.topRoute.to}</span>
      <span style="margin-left:auto;font-size:11px;color:rgba(240,245,250,0.45);font-family:'DM Mono',monospace">${fmt2(d.topEarn)}/day</span>
    `;
  } else {
    trEl.innerHTML = '<span style="font-size:10px;color:rgba(240,245,250,0.3);font-family:sans-serif">No routes yet</span>';
  }

  // Challenge code
  document.getElementById('sc-challenge-code').textContent = d.challengeCode;

  // Barcode (deterministic from challenge code)
  const bc = document.getElementById('sc-barcode');
  bc.innerHTML = '';
  const seed = d.challengeCode.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
  const widths = [2,1,3,1,2,1,1,2,3,1,2,1,3,2,1,1,3,1,2,1,2,3,1,2];
  widths.forEach((w,i) => {
    const bar = document.createElement('div');
    bar.className = 'sc-bc-bar';
    bar.style.width = (w * 1.5 + ((seed + i) % 2)) + 'px';
    bc.appendChild(bar);
  });

  // Show overlay
  const overlay = document.getElementById('scorecard-overlay');
  overlay.classList.add('open');

  // Animate stamp in after delay
  setTimeout(() => document.getElementById('sc-stamp').classList.add('in'), 700);

  // Close on backdrop click
  overlay.onclick = (e) => { if (e.target === overlay) closeScoreCard(); };
}

function closeScoreCard() {
  document.getElementById('scorecard-overlay').classList.remove('open');
  document.getElementById('sc-stamp').classList.remove('in');
  const btn = document.getElementById('sc-copy-btn');
  btn.classList.remove('copied');
  btn.textContent = '';
  btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy to clipboard';
}

function scoreCardCopy() {
  const d = getScoreCardData();
  const fmt = (n) => n >= 1000000 ? '$'+(n/1000000).toFixed(1)+'M' : n >= 1000 ? '$'+(n/1000).toFixed(0)+'K' : '$'+n;
  const fmtMi = (n) => n >= 1000 ? (n/1000).toFixed(1)+'K mi' : n+' mi';
  const arrow = d.topRoute ? d.topRoute.from + ' → ' + d.topRoute.to + ' (' + fmt(d.topEarn) + '/day)' : 'None yet';
  const stars = d.rank === 'S+' ? '⭐⭐⭐' : d.rank === 'S' ? '⭐⭐' : d.rank === 'A' ? '⭐' : '';

  const text = [
    '✈️  SKYWARD · DAY ' + d.day + '  ' + stars,
    DEMO.airlineName + ' (' + DEMO.airlineCode + ')  ·  Hub: ' + DEMO.hub,
    '────────────────────────',
    'Empire Score: ' + d.score.toLocaleString() + '  [' + d.rank + ' · ' + d.title + ']',
    fmt(d.dailyEarn) + '/day  ·  ' + d.totalRoutes + ' routes  ·  ' + d.airlines + ' airlines',
    'CEO: ' + fmtMi(d.ceoMiles) + '  ·  ' + d.continents + '/7 continents  ·  ' + d.regions + ' regions',
    'Best route: ' + arrow,
    '────────────────────────',
    'Challenge code: ' + d.challengeCode,
    'Can you beat it? 🏆',
  ].join("\n");

  navigator.clipboard?.writeText(text).then(() => {
    const btn = document.getElementById('sc-copy-btn');
    btn.classList.add('copied');
    btn.innerHTML = '✓ Copied!';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy to clipboard';
    }, 2500);
  });
}

