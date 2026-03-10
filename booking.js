// ═══════════════════════════════════════════════════════════════
//  SKYWARD — booking.js
//  Booking modal · Boarding pass · Flight tracker
//  Depends on: game-config.js, game-utils.js, airports.js, airlines.js
// ═══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════
//  PHASE 5 — FLYING EXPERIENCE
//  Booking · Boarding Pass · Flight Tracker
// ══════════════════════════════════════════════════════

// (initialized in DEMO object above)

// Current booking state
let bkFrom = null, bkTo = null;
let bkSelectedFlight = null, bkSelectedClass = null;
let bkAllFlights = [], bkSort = 'time';

// Active flight state
let activeFlightData = null;  // {from,to,airline,flightNo,ac,distMi,durMs,startMs,fare,seatClass}

// Get all destinations reachable from fromIata on ANY airline (full open world booking)
function getNetworkDestinations(fromIata) {
  const idxs = AP_IDX[fromIata] || [];
  const seen = new Set();
  const dests = [];
  for (const i of idxs) {
    const r = ROUTES[i];
    const dest = r[_O] === fromIata ? r[_D] : r[_O];
    if (!seen.has(dest) && AIRPORTS[dest]) {
      seen.add(dest);
      dests.push(dest);
    }
  }
  return dests;
}

// ── BOOKING MODAL ─────────────────────────────────────
const bookOverlay = document.getElementById('book-overlay');

function openBookingModal(from, to) {
  bkFrom = from;
  bkTo   = to;
  bkSelectedFlight = null;
  bkSelectedClass  = null;
  fireTutHook('booking_opened', from, to);

  // Clear destination search on every open
  const searchEl = document.getElementById('bk-dest-search');
  if (searchEl) searchEl.value = '';

  document.getElementById('bk-from').textContent = from;
  document.getElementById('bk-to').textContent   = to || '?';
  document.getElementById('bk-eyebrow').textContent = to ? 'Book a Flight' : 'Choose Destination';
  document.getElementById('bk-ceo-bal').textContent = fmt$(DEMO.ceoBalance);

  const destPicker  = document.getElementById('bk-dest-picker');
  const flightsView = document.getElementById('bk-flights-view');

  if (!to) {
    // Show destination grid
    destPicker.style.display  = 'block';
    flightsView.style.display = 'none';
    renderDestGrid(from);
  } else {
    destPicker.style.display  = 'none';
    flightsView.style.display = 'flex';
    renderFlightList(from, to);
  }

  bookOverlay.classList.add('open');
}


function closeBookingModal() {
  bookOverlay.classList.remove('open');
  bkFrom = bkTo = null;
  bkSelectedFlight = bkSelectedClass = null;
}
bookOverlay.addEventListener('click', e => {
  if (e.target === bookOverlay) closeBookingModal();
});

// Destination search filter
document.getElementById('bk-dest-search').addEventListener('input', function() {
  renderDestGrid(bkFrom, this.value.trim().toLowerCase());
});

function renderDestGrid(from, filter) {
  const dests = getNetworkDestinations(from);
  const grid  = document.getElementById('bk-dest-grid');
  if (!dests.length) { grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:rgba(26,37,53,0.45);padding:20px;font-size:11px">No routes found from this airport.</div>'; return; }

  const net = getNetworkAirports();

  // Sort: own-network free flights first, then alphabetical
  let sorted = [...dests].sort((a, b) => {
    const aNet = net.has(a), bNet = net.has(b);
    if (aNet && !bNet) return -1;
    if (!aNet && bNet) return 1;
    return a.localeCompare(b);
  });

  // Apply search filter
  if (filter) {
    sorted = sorted.filter(d => {
      const ap = AIRPORTS[d] || {};
      return d.toLowerCase().includes(filter) || (ap.city||'').toLowerCase().includes(filter);
    });
  }

  if (!sorted.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:rgba(26,37,53,0.45);padding:20px;font-size:11px">No destinations match "${filter}".</div>`;
    return;
  }

  grid.innerHTML = sorted.map(d => {
    const ap = AIRPORTS[d] || {};
    const flights = getFlightOptions(from, d);
    const hasFree = flights.some(f => f.freeTravel);
    const minFare = flights.length ? Math.min(...flights.map(f => f.ecoFare)) : 0;
    const badge   = hasFree
      ? `<div class="dest-btn-earn" style="color:var(--dm-green);font-weight:700">FREE · your airline</div>`
      : `<div class="dest-btn-earn">From ${fmt$(minFare)}</div>`;
    const onNet = net.has(d);
    return `<button class="dest-btn ${onNet ? 'dest-btn-network' : ''}" onclick="selectDest('${d}')">
      <div class="dest-btn-iata">${d}</div>
      <div class="dest-btn-city">${ap.city || d}</div>
      ${badge}
    </button>`;
  }).join('');
}

function selectDest(iata) {
  bkTo = iata;
  document.getElementById('bk-to').textContent = iata;
  document.getElementById('bk-eyebrow').textContent = 'Book a Flight';
  document.getElementById('bk-dest-picker').style.display  = 'none';
  document.getElementById('bk-flights-view').style.display = 'flex';
  renderFlightList(bkFrom, iata);
}

function renderFlightList(from, to) {
  bkAllFlights = getFlightOptions(from, to);
  if (!bkAllFlights.length) {
    document.getElementById('bk-flight-list').innerHTML =
      '<div style="padding:24px;text-align:center;color:rgba(26,37,53,0.45);font-size:11px">No flights found on this route.</div>';
    return;
  }
  sortAndRenderFlights();
}

function sortAndRenderFlights() {
  let sorted = [...bkAllFlights];
  if (bkSort === 'price')  sorted.sort((a,b) => a.ecoFare - b.ecoFare);
  if (bkSort === 'dur')    sorted.sort((a,b) => a.distMi  - b.distMi);
  // default 'time': sort by dailyFreq desc (proxy for scheduled times)
  if (bkSort === 'time')   sorted.sort((a,b) => b.dailyFreq - a.dailyFreq);

  const distMi = sorted[0] ? sorted[0].distMi : 0;
  const durMs  = flightDurationMs(distMi);

  document.getElementById('bk-flight-list').innerHTML = sorted.map((f, i) => {
    const depHour = (6 + i * 2) % 24;
    const depMin  = i % 2 === 0 ? '00' : '30';
    const arrHour = (depHour + Math.round(durMs/3600000)) % 24;
    const arrMin  = depMin;
    const isSel   = bkSelectedFlight && bkSelectedFlight.routeIdx === f.routeIdx;
    const ac      = AIRCRAFT[f.equipCode] || {};
    const ownBadge = f.freeTravel ? '<span style="font-size:8px;font-family:\'Montserrat\',sans-serif;font-weight:700;letter-spacing:.06em;color:var(--dm-green);background:rgba(92,138,122,0.12);border:1px solid rgba(92,138,122,0.3);border-radius:3px;padding:1px 5px;margin-left:5px">YOUR AIRLINE · FREE</span>' : '';
    const ecoPrice = f.freeTravel ? '<span style="color:var(--dm-green);font-weight:800">FREE</span>' : fmt$(f.ecoFare);
    const bizPrice = f.freeTravel ? '<span style="color:var(--dm-green);font-weight:800">FREE</span>' : fmt$(f.bizFare);
    return `<div class="flight-row ${isSel ? 'selected' : ''} ${f.freeTravel ? 'own-airline-row' : ''}" data-ridx="${f.routeIdx}">
      <div class="fr-airline">${f.airlineCode}</div>
      <div class="fr-info">
        <div class="fr-name">${f.airlineName} · ${flightNo(f.airlineCode, f.routeIdx)}${ownBadge}</div>
        <div class="fr-times"><span class="dep">${depHour}:${depMin}</span> → ${arrHour}:${arrMin} · ${fmtDuration(durMs)}</div>
        <div class="fr-aircraft">${ac.model || f.equipCode} · ${f.distMi.toLocaleString()} mi</div>
      </div>
      <div class="fr-fares">
        <div class="fare-opt" onclick="selectFlight(${f.routeIdx},'economy');event.stopPropagation()">
          <div class="fare-label">ECO</div>
          <div class="fare-price">${ecoPrice}</div>
          <div class="fare-radio ${isSel && bkSelectedClass==='economy'?'sel':''}"></div>
        </div>
        <div class="fare-opt" onclick="selectFlight(${f.routeIdx},'business');event.stopPropagation()">
          <div class="fare-label">BIZ</div>
          <div class="fare-price biz">${bizPrice}</div>
          <div class="fare-radio ${isSel && bkSelectedClass==='business'?'sel':''}"></div>
        </div>
      </div>
    </div>`;
  }).join('');

  // Wire row clicks
  document.querySelectorAll('.flight-row').forEach(row => {
    row.addEventListener('click', () => {
      const ridx = parseInt(row.dataset.ridx);
      const f = bkAllFlights.find(x => x.routeIdx === ridx);
      if (f) selectFlight(ridx, bkSelectedClass || 'economy');
    });
  });
}

function selectFlight(routeIdx, seatClass) {
  bkSelectedFlight = bkAllFlights.find(f => f.routeIdx === routeIdx);
  bkSelectedClass  = seatClass;
  const fare = seatClass === 'business' ? bkSelectedFlight.bizFare : bkSelectedFlight.ecoFare;
  document.getElementById('bk-sel-info').innerHTML =
    `<strong>${bkSelectedFlight.airlineName}</strong> · ${seatClass === 'business' ? 'Business' : 'Economy'} · <strong>${fmt$(fare)}</strong>`;
  document.getElementById('bk-confirm').disabled = false;
  sortAndRenderFlights(); // re-render to update radio state
}

// Sort buttons
document.querySelectorAll('.bk-sort-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.bk-sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    bkSort = btn.dataset.bksort;
    sortAndRenderFlights();
  });
});

document.getElementById('bk-confirm').onclick = () => {
  if (!bkSelectedFlight || !bkSelectedClass) return;

  // Capture everything before closeBookingModal nullifies the shared vars
  const flight   = bkSelectedFlight;
  const cls      = bkSelectedClass;
  const from     = bkFrom;
  const to       = bkTo;
  const fare     = cls === 'business' ? flight.bizFare : flight.ecoFare;
  const durMs    = flightDurationMs(flight.distMi);
  const fNo      = flightNo(flight.airlineCode, flight.routeIdx);
  const fromAp   = AIRPORTS[from] || {};
  const toAp     = AIRPORTS[to]   || {};
  const ac       = AIRCRAFT[flight.equipCode] || {};

  // Deduct from CEO personal account and track spending
  DEMO.ceoBalance    = Math.max(0, DEMO.ceoBalance - fare);
  DEMO.ceoTotalSpent = (DEMO.ceoTotalSpent || 0) + fare;
  document.getElementById('hud-ceo-bal').textContent = fmt$(DEMO.ceoBalance);

  closeBookingModal();

  showBoardingPass({
    from, fromCity: fromAp.city || from,
    to,   toCity:   toAp.city   || to,
    airline:     flight.airlineName,
    airlineCode: flight.airlineCode,
    flightNo:    fNo,
    gate:        randomGate(),
    seat:        randomSeat(cls),
    seatClass:   cls,
    departs:     fmtGameTime(DEMO.day, 0.3 + Math.random()*0.3),
    duration:    fmtDuration(durMs),
    aircraft:    ac.model || flight.equipCode,
    fare, durMs, distMi: flight.distMi,
    routeIdx:    flight.routeIdx,
  });
};

// ── BOARDING PASS ─────────────────────────────────────
const bpOverlay = document.getElementById('bp-overlay');

function showBoardingPass(data) {
  document.getElementById('bp-airline-name').textContent = data.airline;
  document.getElementById('bp-class-badge').textContent  = data.seatClass === 'business' ? 'Business' : 'Economy';
  document.getElementById('bp-class-badge').className    = 'bp-class-badge ' + (data.seatClass === 'business' ? 'bp-class-biz' : 'bp-class-eco');
  document.getElementById('bp-from-code').textContent    = data.from;
  document.getElementById('bp-from-city').textContent    = data.fromCity;
  document.getElementById('bp-to-code').textContent      = data.to;
  document.getElementById('bp-to-city').textContent      = data.toCity;
  document.getElementById('bp-flight-no').textContent    = data.flightNo;
  document.getElementById('bp-gate').textContent         = data.gate;
  document.getElementById('bp-seat').textContent         = data.seat;
  document.getElementById('bp-departs').textContent      = data.departs;
  document.getElementById('bp-duration').textContent     = data.duration;
  document.getElementById('bp-aircraft').textContent     = data.aircraft;
  document.getElementById('bp-fare').textContent         = fmt$(data.fare);

  // Generate fake barcode bars
  const barcode = document.getElementById('bp-barcode');
  let bars = '';
  for (let i = 0; i < 48; i++) {
    const h = 12 + Math.floor(Math.random() * 20);
    const w = Math.random() > 0.6 ? 3 : 2;
    bars += `<div class="bp-bar" style="height:${h}px;width:${w}px"></div>`;
  }
  barcode.innerHTML = bars;

  // Store for board action
  bpOverlay._pendingFlight = data;
  bpOverlay.classList.add('open');
}

document.getElementById('bp-board-btn').onclick = () => {
  const data = bpOverlay._pendingFlight;
  bpOverlay.classList.remove('open');
  if (data) startFlight(data);
};

// Tap anywhere on boarding pass to dismiss (without boarding)
bpOverlay.addEventListener('click', e => {
  if (e.target === bpOverlay) {
    bpOverlay.classList.remove('open');
    // Still start the flight
    if (bpOverlay._pendingFlight) startFlight(bpOverlay._pendingFlight);
  }
});

// ── FLIGHT TRACKER ────────────────────────────────────
const trackerBar = document.getElementById('tracker-bar');
let flightInterval = null;

function startFlight(data) {
  activeFlightData = { ...data, startMs: performance.now() };

  document.getElementById('trk-flight').textContent = data.flightNo;
  document.getElementById('trk-from').textContent   = data.from;
  document.getElementById('trk-to').textContent     = data.to;
  document.getElementById('trk-alt').textContent    = '35,000 ft';

  trackerBar.classList.add('open');
  closePanel();

  // Launch black CEO plane along the route
  startCeoPlane(data.from, data.to, data.durMs);

  // Log flight
  DEMO.flightLog.push({
    from: data.from, to: data.to,
    airline: data.airlineCode, flightNo: data.flightNo,
    seatClass: data.seatClass, fare: data.fare,
    distMi: data.distMi, day: DEMO.day,
    aircraft: data.aircraft,
  });

  fireTutHook('flight_booked', data);

  // Start tracker tick
  clearInterval(flightInterval);
  flightInterval = setInterval(() => tickFlight(), 500);

  showToast('info', 'Boarding complete', `${data.flightNo} · ${data.from} → ${data.to} · ${fmtDuration(data.durMs)}`);
}

function tickFlight() {
  if (!activeFlightData) return;
  const elapsed  = performance.now() - activeFlightData.startMs;
  const progress = Math.min(1, elapsed / activeFlightData.durMs);
  const remMs    = Math.max(0, activeFlightData.durMs - elapsed);

  document.getElementById('trk-fill').style.width = (progress * 100) + '%';
  document.getElementById('trk-rem').textContent  = fmtDuration(remMs);
  document.getElementById('trk-eta').textContent  = `ETA ${fmtDuration(remMs)}`;

  // Altitude: cruise at 35k, descend last 15%
  if (progress > 0.85) {
    const descent = Math.round(35000 * (1 - (progress - 0.85) / 0.15));
    document.getElementById('trk-alt').textContent = descent.toLocaleString() + ' ft';
  }

  if (progress >= 1) land();
}

function land() {
  clearInterval(flightInterval);
  const data = activeFlightData;
  activeFlightData = null;

  stopCeoPlane();

  // Update player location
  DEMO.playerLocation = data.to;
  document.getElementById('hud-loc').textContent = data.to;

  trackerBar.classList.remove('open');
  updatePlayerMarker();

  // Process first visit bonus (saves internally if new airport)
  const _fv = processFirstVisit(data.to);
  // Save on every landing — flightLog, ceoBalance, playerLocation all changed
  if (!_fv) saveGame(); // _fv already saved if it was a new airport

  // Show arrival modal
  const ap = AIRPORTS[data.to] || {};
  document.getElementById('arr-iata').textContent       = data.to;
  document.getElementById('arr-city').textContent       = ap.city || data.to;
  document.getElementById('arr-route-line').innerHTML   =
    `<strong>${data.from}</strong> → <strong>${data.to}</strong> · ${data.airline} · ${data.seatClass === 'business' ? 'Business' : 'Economy'}`;
  document.getElementById('arr-dist').textContent       = data.distMi ? Math.round(data.distMi).toLocaleString() + ' mi' : '—';
  document.getElementById('arr-routes').textContent     = ap.routeCount || '—';
  document.getElementById('arr-region').textContent     = (ap.region || ap.continent || '—').replace(/ .*/,''); // first word only for space
  // First visit bonus display
  const fvEl = document.getElementById('arr-first-visit');
  const fvMsg = document.getElementById('arr-first-visit-msg');
  const fvCont = document.getElementById('arr-continent-unlock');
  const fvReg = document.getElementById('arr-region-complete');
  if (_fv) {
    fvEl.style.display = 'block';
    fvMsg.textContent = `First time at ${ap.city ? ap.city.split(' ')[0] : data.to}! +$${_fv.bonus.toLocaleString()}`;
    if (_fv.continentUnlocked) {
      fvCont.style.display = 'block';
      fvCont.textContent = `🌍 ${_fv.continentUnlocked} airlines now available for acquisition!`;
    } else { fvCont.style.display = 'none'; }
    if (_fv.regionCompleted) {
      fvReg.style.display = 'block';
      fvReg.textContent = `✓ ${_fv.regionCompleted} region complete — +2% earnings bonus earned!`;
    } else { fvReg.style.display = 'none'; }
  } else {
    fvEl.style.display = 'none';
  }
  document.getElementById('arrival-overlay').classList.add('show');
}

document.getElementById('arr-dismiss').onclick = () => {
  document.getElementById('arrival-overlay').classList.remove('show');
  openAirportPanel(DEMO.playerLocation);
};

document.getElementById('trk-land-btn').onclick = land;

// Escape closes booking/boarding
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (bpOverlay.classList.contains('open')) {
      bpOverlay.classList.remove('open');
      if (bpOverlay._pendingFlight) startFlight(bpOverlay._pendingFlight);
    } else if (bookOverlay.classList.contains('open')) {
      closeBookingModal();
    }
  }
});

