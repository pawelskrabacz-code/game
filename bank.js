// ═══════════════════════════════════════════════════════════════
//  SKYWARD — bank.js
//  Loan/bank modal, CEO mile milestones, playtime tracking.
//  Depends on: game-config.js (loanRateOptions, CEO_MILE_MILESTONES)
// ═══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════
//  BANK / LOAN SYSTEM
// ══════════════════════════════════════════

// ── DEV HELPER: simulate game state to test loan → acquire flow ──
// Call devSimAcquireReady() in the browser console to inject a realistic
// mid-game state: day 12, ~$420k balance, 10 routes, ready to acquire.
window.devSimAcquireReady = function() {
  if (!DEMO.airlineCode) { console.warn('[DEV] Launch a game first'); return; }

  // Unlock 5 extra routes beyond the starting 5 (from own airline if possible)
  const hub = DEMO.hub;
  const ownCode = DEMO.airlineCode;
  const hubIdxs = AP_IDX[hub] || [];
  const owned = new Set(DEMO.ownedAirlines);
  let added = 0;
  for (const i of hubIdxs) {
    if (added >= 5) break;
    const r = ROUTES[i];
    if (!r || !owned.has(r[_C])) continue;
    const dest = r[0] === hub ? r[1] : r[0];
    const key = routeKey(hub, dest, r[_C]);
    if (!DEMO.acquiredStarting.has(key) && !DEMO.unlockedRoutes.has(key)) {
      DEMO.unlockedRoutes.add(key);
      added++;
    }
  }

  DEMO.balance = 420000;
  DEMO.day = 12;
  DEMO.dayProgress = 0.3;
  invalidateEarnCache(); invalidateNetCache();

  document.getElementById('hud-bal').textContent = fmt$(DEMO.balance);
  document.getElementById('hud-day').textContent = DEMO.day;
  document.getElementById('hud-routes').textContent = DEMO.unlockedRoutes.size + DEMO.acquiredStarting.size;
  syncRouteLines();
  updatePlayerMarker();
  buildPlaneFleet();

  const daily = calcDailyEarnings();
  const acquirable = getAcquirableAirlines(DEMO.ownedAirlines);
  console.log('[DEV] State injected — Day', DEMO.day, '| Balance:', fmt$(DEMO.balance));
  console.log('[DEV] Daily earnings:', fmt$(daily), '| Routes:', DEMO.unlockedRoutes.size + DEMO.acquiredStarting.size);
  console.log('[DEV] Acquirable airlines:', acquirable.length, acquirable.slice(0,5));
  if (acquirable.length === 0) console.warn('[DEV] No adjacent airlines found — check AL_AIRPORTS proxy.');
};




function openBankModal() {
  const overlay = document.getElementById('bank-overlay');
  overlay.classList.add('open');
  renderBankBody();
}

function closeBankModal() {
  document.getElementById('bank-overlay').classList.remove('open');
}

document.getElementById('bank-close').onclick = closeBankModal;
document.getElementById('bank-overlay').addEventListener('click', function(e) {
  if (e.target === document.getElementById('bank-overlay')) closeBankModal();
});

function renderBankBody() {
  const body = document.getElementById('bank-body');

  if (DEMO.loan) {
    const l = DEMO.loan;
    const pct = Math.max(0, Math.min(100, (1 - l.remaining / l.principal) * 100));
    body.innerHTML = `
      <div class="loan-active-card">
        <div class="loan-active-title">Active Loan</div>
        <div class="bank-offer-rows">
          <div class="bank-offer-row"><span>Original loan</span><strong>${fmt$(l.principal)}</strong></div>
          <div class="bank-offer-row"><span>Remaining balance</span><strong style="color:#e05a4e">${fmt$(l.remaining)}</strong></div>
          <div class="bank-offer-row"><span>Daily payment</span><strong>${fmt$(l.dailyPayment)}/day</strong></div>
          <div class="bank-offer-row"><span>Interest rate</span><strong>${l.rate}%/week</strong></div>
          <div class="bank-offer-row"><span>Days remaining</span><strong>${l.daysLeft} game days</strong></div>
        </div>
        <div class="loan-progress-bar-wrap">
          <div class="loan-progress-bar-fill" style="width:${pct}%"></div>
        </div>
        <div class="bank-terms-note">${pct.toFixed(0)}% repaid · Payments debited automatically each game day.</div>
        <div class="bank-actions">
          <button class="bank-btn-accept" onclick="repayLoanEarly()">Pay Off Early — ${fmt$(l.remaining)}</button>
          <button class="bank-btn-cancel" onclick="closeBankModal()">Close</button>
        </div>
      </div>
      <div class="bank-no-offer" style="font-size:10px;padding:12px 0">One loan at a time. Repay to apply for a new one.</div>
    `;
    return;
  }

  const dailyEarn = calcDailyEarnings();
  if (dailyEarn < 5000) {
    body.innerHTML = `<div class="bank-no-offer">
      <div style="font-size:28px;margin-bottom:12px">📋</div>
      <div>Build your route network first.</div>
      <div style="margin-top:6px;font-size:10px">We need at least a few active routes before we can extend credit.</div>
    </div>`;
    return;
  }

  const maxLoan = Math.floor(dailyEarn * 0.50 / 1000) * 1000 * 7;
  const minLoan = Math.max(1000, Math.floor(maxLoan * 0.1 / 1000) * 1000);
  const rate = loanRateOptions[Math.floor(Math.random() * loanRateOptions.length)];
  window._bankLoanRate = rate;
  window._bankMaxLoan = maxLoan;
  window._bankMinLoan = minLoan;
  window._bankDailyEarn = dailyEarn;

  const initAmount = Math.floor(maxLoan * 0.5 / 1000) * 1000;

  body.innerHTML = `
    <div class="bank-offer-card">
      <div class="bank-offer-title">How much would you like?</div>
      <div class="bank-slider-amount" id="bank-slider-display">${fmt$(initAmount)}</div>
      <div class="bank-slider-range">
        <span>${fmt$(minLoan)}</span>
        <span>${fmt$(maxLoan)}</span>
      </div>
      <input type="range" class="bank-slider" id="bank-loan-slider"
        min="${minLoan}" max="${maxLoan}" step="1000" value="${initAmount}"
        oninput="updateLoanPreview(this.value)">
      <div class="bank-offer-sub" style="margin-top:14px">7-day term · deposited instantly</div>
      <div class="bank-offer-rows" id="bank-loan-preview"></div>
      <div class="bank-terms-note">
        Interest is fixed at ${rate}%/week. Payments are automatically debited each game morning for 7 game days. Early repayment has no penalty. One loan at a time.
      </div>
      <div class="bank-actions">
        <button class="bank-btn-accept" id="bank-accept-btn" onclick="updateLoanPreview(document.getElementById('bank-loan-slider').value)">Borrow ${fmt$(initAmount)}</button>
        <button class="bank-btn-cancel" onclick="closeBankModal()">No thanks</button>
      </div>
    </div>
  `;
  updateLoanPreview(initAmount);
}

function updateLoanPreview(amount) {
  amount = Math.round(amount / 1000) * 1000;
  const rate = window._bankLoanRate || 3;
  const dailyEarn = window._bankDailyEarn || calcDailyEarnings();
  const totalOwed = Math.round(amount * (1 + rate / 100));
  const dailyPayment = Math.ceil(totalOwed / 7);
  const pctOfEarn = Math.round(dailyPayment / dailyEarn * 100);

  const display = document.getElementById('bank-slider-display');
  if (display) display.textContent = fmt$(amount);

  const preview = document.getElementById('bank-loan-preview');
  if (preview) preview.innerHTML = `
    <div class="bank-offer-row"><span>Interest rate</span><strong>${rate}%/week</strong></div>
    <div class="bank-offer-row"><span>Total repayment</span><strong>${fmt$(totalOwed)}</strong></div>
    <div class="bank-offer-row"><span>Daily payment</span><strong>${fmt$(dailyPayment)}/day <span style="opacity:.6;font-weight:400">(${pctOfEarn}% of earnings)</span></strong></div>
    <div class="bank-offer-row"><span>Your daily earnings</span><strong>${fmt$(dailyEarn)}/day</strong></div>
  `;

  const btn = document.getElementById('bank-accept-btn');
  if (btn) {
    btn.textContent = 'Borrow ' + fmt$(amount);
    btn.onclick = function() { acceptLoan(amount, rate, dailyPayment, totalOwed); };
  }
  // Update slider fill gradient
  const slider = document.getElementById('bank-loan-slider');
  if (slider) {
    const min = Number(slider.min), max = Number(slider.max);
    const pct = ((amount - min) / (max - min) * 100).toFixed(1) + '%';
    slider.style.setProperty('--pct', pct);
    slider.style.background = 'linear-gradient(90deg, var(--amber) ' + pct + ', rgba(26,37,53,0.15) ' + pct + ')';
  }
}

function acceptLoan(principal, rate, dailyPayment, totalOwed) {
  DEMO.loan = {
    principal,
    remaining:    totalOwed,
    dailyPayment,
    rate,
    daysLeft:     7,
    missedDays:   0,
    nextRollDay:  DEMO.day + 5,
  };
  DEMO.balance += principal;
  document.getElementById('hud-bal').textContent = fmt$(DEMO.balance);
  updateLoanHud();
  saveGame(); // loan created + balance change — save immediately
  closeBankModal();
  showBankAlert(`💰 ${fmt$(principal)} deposited! Repay ${fmt$(dailyPayment)}/day for 7 days.`);
}

function repayLoanEarly() {
  if (!DEMO.loan) return;
  const payoff = DEMO.loan.remaining;
  if (DEMO.balance < payoff) {
    showBankAlert(`⚠️ Need ${fmt$(payoff - DEMO.balance)} more to pay off.`);
    return;
  }
  DEMO.balance -= payoff;
  DEMO.loan = null;
  document.getElementById('hud-bal').textContent = fmt$(DEMO.balance);
  updateLoanHud();
  saveGame(); // loan cleared + balance change — save immediately
  closeBankModal();
  showBankAlert('✅ Loan fully repaid!');
}

function updateLoanHud() {
  const dot = document.getElementById('bank-loan-dot');
  if (dot) dot.style.display = DEMO.loan ? 'block' : 'none';
}

function getTotalPlayedMs() {
  return (DEMO.totalPlayedMs || 0) + (performance.now() - (DEMO._sessionStart || performance.now()));
}
function updatePlaytimeHud() {
  const el = document.getElementById('hud-playtime');
  if (el) el.textContent = formatPlayTime(getTotalPlayedMs());
}

function checkCeoMileMilestones(totalMiles) {
  for (const ms of CEO_MILE_MILESTONES) {
    const id = 'ceo_miles_' + ms.miles;
    if (totalMiles >= ms.miles && !DEMO.unlockedAch.has(id)) {
      DEMO.unlockedAch.add(id);
      DEMO.balance += ms.bonus;
      const balEl = document.getElementById('hud-bal');
      if (balEl) balEl.textContent = fmt$(DEMO.balance);
      showBankAlert(`✈ ${ms.label} — ${ms.miles.toLocaleString()} miles flown! +$${ms.bonus.toLocaleString()} bonus`);
      saveGame();
    }
  }
}

function showBankAlert(msg) {
  const toast = document.getElementById('bank-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3500);
}

