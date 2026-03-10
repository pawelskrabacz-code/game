// ═══════════════════════════════════════════════════════════════
//  SKYWARD — daily-report.js
//  Daily report modal: earnings summary, LF, advisor highlights.
//  Depends on: game-config.js, game-utils.js
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════
//  DAILY REPORT
// ═══════════════════════════════════════════════════════

function buildDailyReport(prevLF, prevEarn, todayEarn) {
  const allKeys = [...new Set([...DEMO.unlockedRoutes, ...DEMO.acquiredStarting])];
  const routeChanges = [];

  for (const key of allKeys) {
    const [a, b, code] = key.split('|');
    const oldLF  = prevLF[key] || 0;
    const newLF  = calcRouteLFByKey(key);
    const bd     = routeLFBreakdown(key);
    const delta  = newLF - oldLF;

    // Find base earnings for this route
    let baseEarn = 0;
    const idxs = AL_IDX[code] || AP_IDX[a] || [];
    for (const i of idxs) {
      const r = ROUTES[i];
      if ((r[0]===a&&r[1]===b)||(r[0]===b&&r[1]===a)) { baseEarn = (r[7]||0)*FS; break; }
    }

    const dailyEarn  = Math.round(baseEarn * newLF * getRegionBonus(a, b));
    const reasons    = [];
    if (bd) {
      // Competition signal (always shown)
      const compLabel = bd.nComp === 1 ? 'Monopoly route' : `${bd.nComp} airlines competing`;

      // Delta-driven reasons (what changed today)
      if (Math.abs(delta) > 0.001) {
        if (delta > 0 && bd.maturity > 0 && bd.age != null && bd.age <= 10)
          reasons.push(`+${(bd.maturity*100).toFixed(1)}% route maturity (day ${bd.age})`);
        if (delta > 0 && (bd.flowA + bd.flowB) > 0.01)
          reasons.push(`+${((bd.flowA+bd.flowB)*100).toFixed(1)}% hub flow (${bd.dA}+${bd.dB} connections)`);
        if (bd.promo > 0)
          reasons.push(`+${(bd.promo*100).toFixed(0)}% promotion active`);
        if (delta < 0 && bd.promo === 0 && !bd.isolated)
          reasons.push('Promotion expired');
      }
      if (bd.isolated)  reasons.push('−8% isolated — connect to a hub');
      if (bd.age === 10) reasons.push('✓ Fully mature');
    }

    routeChanges.push({ key, a, b, code, oldLF, newLF, delta, dailyEarn, reasons, isolated: bd ? bd.isolated : false });
  }

  // Sort by delta descending — biggest improvements first
  routeChanges.sort((x, y) => y.delta - x.delta);

  // Network summary
  const avgLF     = allKeys.length ? allKeys.reduce((s, k) => s + calcRouteLFByKey(k), 0) / allKeys.length : 0;
  const isolated  = routeChanges.filter(r => r.isolated);
  const maturingRoutes = allKeys.filter(k => {
    const od = DEMO.routeOpenDays[k];
    if (od == null) return false;
    const age = DEMO.day - od;
    return age > 0 && age <= 7;
  });

  // Active promotions
  const activePromos = (DEMO.activePromotions || []).filter(p => p.expiresDay > DEMO.day);

  // Hub density snapshot — find airports that grew today (new routes opened)
  const dMap = getHubDensityMap();
  const hubGrowth = [];
  for (const key of allKeys) {
    const [a, b] = key.split('|');
    const od = DEMO.routeOpenDays[key];
    if (od === DEMO.day - 1) {
      // This route opened yesterday — so dA/dB grew by 1 for all sibling routes
      for (const ap of [a, b]) {
        const n = dMap[ap] || 0;
        if (n >= 2) {
          // Count sibling routes (excluding current)
          const siblings = allKeys.filter(k => k !== key && (k.startsWith(ap+'|') || k.split('|')[1] === ap)).length;
          if (siblings > 0) {
            const gainPer = _flowCurve(n) - _flowCurve(n - 1);
            if (gainPer > 0.001) hubGrowth.push({ ap, n, siblings, gainPer });
          }
        }
      }
    }
  }

  return {
    day: DEMO.day,
    todayEarn, prevEarn,
    earnDelta: todayEarn - prevEarn,
    avgLF,
    routeChanges,
    isolated,
    maturingRoutes,
    activePromos,
    hubGrowth,
    topRoute: routeChanges.slice().sort((a,b) => b.dailyEarn - a.dailyEarn)[0] || null,
  };
}

function ceoSalaryStage() {
  const routeCount = (DEMO.unlockedRoutes ? DEMO.unlockedRoutes.size : 0)
                   + (DEMO.acquiredStarting ? DEMO.acquiredStarting.size : 0);
  let current = null;
  for (let i = 0; i < SALARY_MILESTONES.length; i++) {
    if (routeCount >= SALARY_MILESTONES[i].routes) current = { ...SALARY_MILESTONES[i], idx: i };
    else break;
  }
  return current;
}

function showDailyReport() {
  const rpt = DEMO.lastDailyReport;
  if (!rpt) return;
  const el = document.getElementById('daily-report-overlay');
  if (!el) return;

  // Update day title
  const titleEl = document.getElementById('dr-day-title');
  if (titleEl) titleEl.textContent = `End of Day ${rpt.day - 1}`;
  const nextDayEl = document.getElementById('dr-next-day');
  if (nextDayEl) nextDayEl.textContent = rpt.day;

  const earn    = rpt.todayEarn;
  const delta   = rpt.earnDelta;
  const sign    = delta >= 0 ? '+' : '';
  const dCol    = delta >= 0 ? '#4caf7d' : '#e05a4e';
  const avgPct  = (rpt.avgLF * 100).toFixed(1);

  // ── DOD ACHIEVEMENTS ──────────────────────────────────
  const dod = [];

  // Revenue milestone
  if (earn >= 1000000)      dod.push({ icon:'💰', label:'Revenue Milestone', val: fmt$(earn)+' today', color:'#F5A623' });
  else if (earn >= 100000)  dod.push({ icon:'💵', label:'Strong Revenue Day', val: fmt$(earn)+' today', color:'#F5A623' });

  // Earn delta — big jump
  if (delta > 0 && rpt.prevEarn > 0) {
    const pct = ((delta / rpt.prevEarn) * 100).toFixed(0);
    if (delta / rpt.prevEarn >= 0.1) dod.push({ icon:'📈', label:'Revenue Up '+pct+'% DoD', val: sign+fmt$(delta)+' vs yesterday', color:'#4caf7d' });
  }

  // Routes count
  const totalRoutes = rpt.routeChanges.length;
  if (totalRoutes >= 20)      dod.push({ icon:'🌐', label:'Major Network', val: totalRoutes+' active routes', color:'#5A9FD4' });
  else if (totalRoutes >= 10) dod.push({ icon:'✈️', label:'Growing Network', val: totalRoutes+' active routes', color:'#5A9FD4' });

  // Matured routes
  const newlyMature = rpt.routeChanges.filter(r => r.reasons && r.reasons.some(x => x.includes('Fully mature')));
  if (newlyMature.length > 0)
    dod.push({ icon:'⭐', label: newlyMature.length === 1 ? '1 Route Fully Matured' : newlyMature.length+' Routes Fully Matured', val: 'Max LF bonus reached', color:'#F5A623' });

  // Promotions
  if (rpt.activePromos.length > 0)
    dod.push({ icon:'📣', label: rpt.activePromos.length+' Promo'+(rpt.activePromos.length>1?'s':'')+' Running', val: 'Boosting your LF now', color:'#a78bfa' });

  // Network LF threshold
  const lf = parseFloat(avgPct);
  if (lf >= 80)      dod.push({ icon:'🏆', label:'Elite Load Factor', val: avgPct+'% avg LF', color:'#F5A623' });
  else if (lf >= 70) dod.push({ icon:'🎯', label:'Strong Load Factor', val: avgPct+'% avg LF', color:'#4caf7d' });

  // Owned airlines
  if (DEMO.ownedAirlines && DEMO.ownedAirlines.length >= 3)
    dod.push({ icon:'🏢', label:'Airline Group', val: (DEMO.ownedAirlines.length+1)+' airlines owned', color:'#80d4e4' });

  // Balance milestone
  const bal = DEMO.balance;
  if (bal >= 10000000)     dod.push({ icon:'💎', label:'Cash Reserves: '+fmt$(bal), val: 'Financial fortress', color:'#F5A623' });
  else if (bal >= 1000000) dod.push({ icon:'🏦', label:'Balance: '+fmt$(bal), val: 'Solid cash position', color:'#4caf7d' });

  // CEO salary rank
  const stage = ceoSalaryStage();
  if (stage && stage.idx >= 4) dod.push({ icon:'👑', label:'CEO Stage: '+stage.label, val: fmt$(stage.salary)+'/day salary', color:'#F5A623' });

  // Isolation fixed
  if (rpt.isolated.length === 0 && totalRoutes > 0)
    dod.push({ icon:'🔗', label:'No Isolated Routes', val: 'Full connectivity bonus', color:'#4caf7d' });

  const dodHTML = dod.length > 0 ? `
    <div style="font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:rgba(26,37,53,0.22);margin-bottom:10px;display:flex;align-items:center;gap:8px;">
      <span style="flex:1;height:1px;background:rgba(30,78,122,0.10);"></span>
      Day ${rpt.day-1} Achievements
      <span style="flex:1;height:1px;background:rgba(30,78,122,0.10);"></span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:18px;">
      ${dod.slice(0,6).map(d => `
        <div style="display:flex;align-items:center;gap:9px;background:rgba(30,78,122,0.04);border:1px solid rgba(30,78,122,0.12);border-radius:7px;padding:9px 11px;">
          <span style="font-size:16px;flex-shrink:0;">${d.icon}</span>
          <div>
            <div style="font-size:9px;font-weight:700;color:${d.color};letter-spacing:.02em;">${d.label}</div>
            <div style="font-size:8px;color:rgba(26,37,53,0.40);margin-top:1px;">${d.val}</div>
          </div>
        </div>`).join('')}
    </div>` : '';

  // ── ROUTE CHANGES ─────────────────────────────────────
  const notable = rpt.routeChanges.filter(r => Math.abs(r.delta) > 0.001 || r.isolated || r.reasons.length);
  const routeRows = notable.slice(0, 8).map(r => {
    const arrow = r.delta > 0.001  ? `<span style="color:#4caf7d">▲ ${(r.delta*100).toFixed(1)}%</span>`
                : r.delta < -0.001 ? `<span style="color:#e05a4e">▼ ${(Math.abs(r.delta)*100).toFixed(1)}%</span>`
                : `<span style="color:rgba(26,37,53,0.35)">—</span>`;
    const reasonStr = r.reasons.length
      ? `<div style="font-size:8px;color:rgba(26,37,53,0.35);margin-top:2px;">${r.reasons.join(' · ')}</div>`
      : '';

    // LF component breakdown tags
    const bd = routeLFBreakdown(r.key);
    let breakdownHTML = '';
    if (bd) {
      const tags = [];
      const compColor = bd.nComp === 1 ? '#4caf7d' : bd.nComp <= 3 ? '#c8923c' : '#e05a4e';
      const compText  = bd.nComp === 1
        ? `Solo · ${(bd.base*100).toFixed(0)}% base`
        : `×${bd.nComp} airlines · ${(bd.base*100).toFixed(0)}% base`;
      tags.push({ text: compText, color: compColor });
      const totalFlow = bd.flowA + bd.flowB;
      if (totalFlow > 0.005) {
        const flowText = bd.dA > 0 && bd.dB > 0
          ? `Flow +${(totalFlow*100).toFixed(1)}% (${bd.dA}↔${bd.dB})`
          : `Flow +${(totalFlow*100).toFixed(1)}% (${bd.dA + bd.dB} conn)`;
        tags.push({ text: flowText, color: '#5A9FD4' });
      }
      if (bd.maturity > 0) {
        const matText = bd.age != null
          ? `Mature +${(bd.maturity*100).toFixed(1)}% (day ${bd.age})`
          : `Mature +${(bd.maturity*100).toFixed(1)}%`;
        tags.push({ text: matText, color: '#a78bfa' });
      }
      if (bd.promo > 0) tags.push({ text: `Promo +${(bd.promo*100).toFixed(0)}%`, color: '#F5A623' });
      if (bd.penalty < 0) tags.push({ text: `Isolated ${(bd.penalty*100).toFixed(0)}%`, color: '#e05a4e' });
      breakdownHTML = `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:5px;">${
        tags.map(t => `<span style="font-size:7.5px;padding:2px 6px;border-radius:3px;background:${t.color}18;border:1px solid ${t.color}40;color:${t.color};letter-spacing:.02em;">${t.text}</span>`).join('')
      }</div>`;
    }

    return `<div style="padding:8px 0;border-bottom:1px solid rgba(30,78,122,0.06);">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <span style="font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;color:#5A9FD4;">${r.a}</span>
          <span style="color:rgba(26,37,53,0.30);font-size:9px;"> → </span>
          <span style="font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;color:#5A9FD4;">${r.b}</span>
          ${r.isolated ? '<span style="margin-left:6px;font-size:8px;background:rgba(224,90,78,.12);border:1px solid rgba(224,90,78,.3);color:#e05a4e;padding:1px 5px;border-radius:3px;">ISOLATED</span>' : ''}
          ${reasonStr}
        </div>
        <div style="text-align:right;flex-shrink:0;margin-left:12px;">
          ${arrow}
          <div style="font-size:9px;color:rgba(26,37,53,0.40);margin-top:2px;">${(r.newLF*100).toFixed(1)}% LF · ${fmt$(r.dailyEarn)}/day</div>
        </div>
      </div>
      ${breakdownHTML}
    </div>`;
  }).join('');

  // ── PROMOTIONS ────────────────────────────────────────
  const promoRows = rpt.activePromos.map(p => {
    const daysLeft = p.expiresDay - rpt.day;
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid rgba(30,78,122,0.06);">
      <div style="font-size:10px;color:rgba(26,37,53,0.65);">${p.label}</div>
      <div style="font-size:9px;color:#a78bfa;">${daysLeft} day${daysLeft!==1?'s':''} remaining</div>
    </div>`;
  }).join('');

  // ── ADVISOR SNIPPET ───────────────────────────────────
  const topRec = generateAdvisorRecs(1)[0];
  const advisorSnippet = topRec ? `
    <div style="background:rgba(245,166,35,.05);border:1px solid rgba(245,166,35,.15);border-radius:8px;padding:12px 14px;margin-top:4px;">
      <div style="font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:rgba(245,166,35,.5);margin-bottom:6px;">TOP ADVISOR RECOMMENDATION</div>
      <div style="font-size:11px;color:rgba(26,37,53,0.75);line-height:1.5;margin-bottom:8px;">${topRec.action}</div>
      <div style="display:flex;gap:16px;">
        <div><div style="font-size:8px;color:rgba(26,37,53,0.40);margin-bottom:2px;">DAILY GAIN</div><div style="font-size:12px;font-weight:700;color:#4caf7d;font-family:'Montserrat',sans-serif;">+${fmt$(topRec.dailyGain)}</div></div>
        <div><div style="font-size:8px;color:rgba(26,37,53,0.40);margin-bottom:2px;">BREAK-EVEN</div><div style="font-size:12px;font-weight:700;color:#5A9FD4;font-family:'Montserrat',sans-serif;">${topRec.breakEvenDays === 0 ? 'Immediate' : topRec.breakEvenDays + 'd'}</div></div>
        <div><div style="font-size:8px;color:rgba(26,37,53,0.40);margin-bottom:2px;">30-DAY</div><div style="font-size:12px;font-weight:700;color:#F5A623;font-family:'Montserrat',sans-serif;">+${fmt$(topRec.gain30d)}</div></div>
      </div>
    </div>` : '';

  document.getElementById('dr-body').innerHTML = `
    <!-- DOD achievements -->
    ${dodHTML}

    <!-- Key metrics -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px;">
      <div style="background:rgba(30,78,122,0.04);border:1px solid rgba(30,78,122,0.12);border-radius:7px;padding:11px 13px;">
        <div style="font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:rgba(26,37,53,0.40);margin-bottom:4px;">Revenue</div>
        <div style="font-family:'Montserrat',sans-serif;font-size:19px;font-weight:800;color:#4caf7d;">${fmt$(earn)}</div>
        <div style="font-size:9px;color:${dCol};margin-top:2px;">${sign}${fmt$(delta)} DoD</div>
      </div>
      <div style="background:rgba(30,78,122,0.04);border:1px solid rgba(30,78,122,0.12);border-radius:7px;padding:11px 13px;">
        <div style="font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:rgba(26,37,53,0.40);margin-bottom:4px;">Avg LF</div>
        <div style="font-family:'Montserrat',sans-serif;font-size:19px;font-weight:800;color:#5A9FD4;">${avgPct}%</div>
        <div style="font-size:9px;color:rgba(26,37,53,0.40);margin-top:2px;">${totalRoutes} routes</div>
      </div>
      <div style="background:rgba(30,78,122,0.04);border:1px solid rgba(30,78,122,0.12);border-radius:7px;padding:11px 13px;">
        <div style="font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:rgba(26,37,53,0.40);margin-bottom:4px;">Best Route</div>
        <div style="font-family:'Montserrat',sans-serif;font-size:15px;font-weight:800;color:#F5A623;letter-spacing:.04em;">${rpt.topRoute ? rpt.topRoute.a+'→'+rpt.topRoute.b : '—'}</div>
        <div style="font-size:9px;color:rgba(26,37,53,0.40);margin-top:2px;">${rpt.topRoute ? fmt$(rpt.topRoute.dailyEarn)+'/day' : ''}</div>
      </div>
    </div>

    <!-- Isolated warning -->
    ${rpt.isolated.length ? `<div style="background:rgba(224,90,78,.07);border:1px solid rgba(224,90,78,.2);border-radius:7px;padding:10px 14px;margin-bottom:14px;font-size:11px;color:rgba(224,90,78,.85);">⚠️ ${rpt.isolated.length} isolated route${rpt.isolated.length>1?'s are':' is'} taking a −8% LF penalty. Connect them to a hub to fix this.</div>` : ''}

    <!-- Hub growth summary -->
    ${rpt.hubGrowth && rpt.hubGrowth.length ? `<div style="background:rgba(90,159,212,0.06);border:1px solid rgba(90,159,212,0.18);border-radius:7px;padding:10px 13px;margin-bottom:14px;">
      <div style="font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:rgba(90,159,212,0.6);margin-bottom:6px;">Hub Density Growth</div>
      ${rpt.hubGrowth.map(h => `<div style="font-size:10px;color:rgba(26,37,53,0.65);line-height:1.8;">▸ <strong style="color:#5A9FD4;">${h.ap}</strong> grew to ${h.n} routes — boosted ${h.siblings} existing route${h.siblings>1?'s':''} by <strong style="color:#4caf7d;">+${(h.gainPer*100).toFixed(1)}% LF</strong></div>`).join('')}
    </div>` : ''}

    <!-- Route changes -->
    ${notable.length ? `<div style="font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:rgba(26,37,53,0.22);margin-bottom:8px;">Route Changes</div>${routeRows}` : '<div style="font-size:11px;color:rgba(26,37,53,0.40);padding:8px 0;">No significant route changes today.</div>'}

    <!-- Promotions -->
    ${rpt.activePromos.length ? `<div style="font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:rgba(26,37,53,0.22);margin:14px 0 8px;">Active Promotions</div>${promoRows}` : ''}

    <!-- Advisor -->
    ${advisorSnippet}
  `;

  el.classList.add('open');
  el.style.display = 'flex';
}

function closeDailyReport() {
  const el = document.getElementById('daily-report-overlay');
  if (el) { el.classList.remove('open'); el.style.display = 'none'; }
}

