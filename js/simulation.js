/* ═══════════════════════════════════════════════
   simulation.js — Dijkstra, animasi rute, kontrol
                   simulasi (start/pause/stop/replay)
   ═══════════════════════════════════════════════ */

let simState = {
  status: 'idle', path: null, distance: 0,
  points: [], cumulative: [], totalLength: 0,
  startTime: 0, pausedAt: 0, pausedTotal: 0,
  rafId: null, currentIndex: 0,
  rainSegments: [], cancelled: false,
  animFn: null, travelDist: 0, lastFrameTime: null
};
let currentTool = null;

/* ── Hentikan requestAnimationFrame aktif ── */
function stopRaf() {
  if (simState.rafId !== null) {
    cancelAnimationFrame(simState.rafId);
    simState.rafId = null;
  }
}

/* ── Finish rute ── */
function finishRoute(stateLabel) {
  stopRaf();
  simState.status = stateLabel;
  updateRouteButtons(stateLabel);
}

/* ── Dijkstra sederhana ── */
function dijkstra(g, start, end) {
  const dist = {}, prev = {}, vis = new Set();
  for (let n in g) dist[n] = Infinity;
  dist[start] = 0;
  while (true) {
    let u = null;
    for (let n in dist) if (!vis.has(n) && (u === null || dist[n] < dist[u])) u = n;
    if (!u || u === end) break;
    vis.add(u);
    for (let nb of g[u]) {
      const nd = dist[u] + nb.weight;
      if (nd < dist[nb.node]) { dist[nb.node] = nd; prev[nb.node] = u; }
    }
  }
  const path = []; let cur = end;
  while (cur) { path.unshift(cur); cur = prev[cur]; }
  return { path, distance: dist[end] };
}

/* ── Animasi replay (tanpa follow scan) ── */
function animateRoute(now) {
  if (simState.status !== 'running') return;
  if (!simState.startTime) simState.startTime = now;
  const elapsed = now - simState.startTime - simState.pausedTotal;
  const travel  = Math.min(simState.totalLength, elapsed * 0.16);
  const point   = pointAtLength(simState.points, simState.cumulative, travel);
  if (point) { setCarTo(point); panToWorld(point.x, point.y); }
  if (travel >= simState.totalLength) {
    simState.currentIndex = simState.points.length - 1;
    finishRoute('done');
    statusLog(`✅ Rute selesai. Klik <b>Ulang</b> untuk memutar lagi.`, 'ok');
    return;
  }
  simState.rafId = requestAnimationFrame(animateRoute);
}

/* ── Start animasi rute (dipakai saat replay) ── */
function startRouteAnimation(path, distance) {
  const built = buildRouteSamples(path);
  simState.path         = path.slice();
  simState.distance     = distance;
  simState.points       = built.points;
  simState.cumulative   = built.cumulative;
  simState.totalLength  = built.totalLength;
  simState.startTime    = 0;
  simState.pausedAt     = 0;
  simState.pausedTotal  = 0;
  simState.currentIndex = 0;
  simState.status       = 'running';
  simState.animFn       = animateRoute;
  statusLog(`🚗 <b>Rute:</b> ${path.join(' ➔ ')} &nbsp;|&nbsp; 📏 <b>Jarak Total:</b> ${distance} km`, 'ok');
  updateRouteButtons('running');
  const first = simState.points[0] || { x: positions[path[0]].x, y: positions[path[0]].y, angle: 0 };
  setCarTo(first);
  stopRaf();
  simState.rafId = requestAnimationFrame(animateRoute);
}

/* ── Pause / resume ── */
function togglePause() {
  if (simState.status === 'running') {
    simState.status   = 'paused';
    simState.pausedAt = performance.now();
    stopRaf();
    updateRouteButtons('paused');
    statusLog(`⏸ Animasi dijeda. Klik <b>Lanjut</b> untuk terus.`, 'warn');
    return;
  }
  if (simState.status === 'paused') {
    if (simState.pausedAt) simState.pausedTotal += performance.now() - simState.pausedAt;
    simState.pausedAt      = 0;
    simState.lastFrameTime = null;
    simState.status        = 'running';
    updateRouteButtons('running');
    const fn = simState.animFn || animateRoute;
    simState.rafId = requestAnimationFrame(fn);
  }
}

/* ── Stop simulasi ── */
function stopSimulation() {
  if (simState.status === 'idle') return;
  stopRaf();
  document.getElementById('highlight-path').setAttribute('d', '');
  const startNode = document.getElementById('start').value;
  const sp = positions[startNode] || Object.values(positions)[0];
  setCarTo({ x: sp.x, y: sp.y, angle: 0 });
  simState.status = 'idle';
  simState.path   = null;
  updateRouteButtons('idle');
  dtableHide();
  statusLog(`⏹ Animasi dihentikan. Mobil kembali ke <b>${startNode}</b>.`, 'warn');
  resetView();
}

/* ── Batal scan Dijkstra ── */
function cancelScanning() {
  if (simState.status !== 'scanning') return;
  simState.cancelled = true;
}

function _abortScan(startNode) {
  clearProbes();
  document.getElementById('highlight-path').setAttribute('d', '');
  const sp = positions[startNode] || Object.values(positions)[0];
  setCarTo({ x: sp.x, y: sp.y, angle: 0 });
  simState.status    = 'idle';
  simState.path      = null;
  simState.cancelled = false;
  updateRouteButtons('idle');
  resetView();
  statusLog(`✖ Pencarian rute dibatalkan. Kembali ke <b>${startNode}</b>.`, 'warn');
}

/* ── Replay ── */
function replaySimulation() {
  if (!simState.path || simState.path.length < 2) return;
  const startNode = simState.path[0];
  const startPos  = positions[startNode];
  smoothZoomToWorld(startPos.x, startPos.y, 0.85, 600).then(() => {
    startRouteAnimation(simState.path, simState.distance);
  });
}

/* ── Kembali ke idle ── */
function kembaliIdle() {
  stopRaf();
  resetCarState();
  const startNode = document.getElementById('start').value;
  const sp = positions[startNode] || Object.values(positions)[0];
  setCarTo({ x: sp.x, y: sp.y, angle: 0 });
  resetView();
  document.getElementById('highlight-path').setAttribute('d', '');
  simState.status = 'idle';
  simState.path   = null;
  updateRouteButtons('idle');
  dtableHide();
  chatLog('sys', `⬅️ Kembali ke awal. Pilih rute baru untuk memulai.`, 'ok');
}

/* ── Tombol route multi-state ── */
function routeButtonAction() {
  if (simState.status === 'idle')    { startSimulation(); return; }
  if (simState.status === 'running' || simState.status === 'paused') { togglePause(); return; }
  if (simState.status === 'done')    { replaySimulation(); }
}

/* ── MAIN: AI Simulation dengan step-by-step Dijkstra ── */
async function startSimulation() {
  const start = document.getElementById('start').value;
  const end   = document.getElementById('end').value;
  document.getElementById('highlight-path').setAttribute('d', '');
  if (start === end) { alert('Start dan tujuan tidak boleh sama!'); return; }

  simState.status    = 'scanning';
  simState.cancelled = false;
  updateRouteButtons('scanning');
  chatClear();
  clearProbes();
  dtableReset();

  // Phase 1: Terima permintaan
  chatLog('sys', `<div class="tag">MULAI</div><br>Permintaan rute <b>${start}</b> → <b>${end}</b> diterima.`);
  await delay(400);
  if (simState.cancelled) { _abortScan(start); return; }
  chatTyping();
  await delay(800);
  if (simState.cancelled) { _abortScan(start); return; }
  chatLog('ai', `Oke! Saya akan <b>menyelidiki wilayah</b> terdekat dulu sebelum memilih rute tercepat. 🔍`);
  await delay(300);

  const startPos = positions[start];
  await smoothZoomToWorld(startPos.x, startPos.y, 0.3, 600);

  // Phase 2: Probe tetangga langsung
  const neighbors = graph[start] || [];
  chatTyping();
  await delay(600);
  if (simState.cancelled) { _abortScan(start); return; }
  chatLog('ai', `📡 Menyelidiki <b>${neighbors.length} jalur</b> dari kota <b>${start}</b>...`);
  await delay(200);

  const problematicNeighbors = [];
  for (let i = 0; i < neighbors.length; i++) {
    const nb  = neighbors[i];
    const pid = [start, nb.node].sort().join('-');
    const state = roadStates[pid] || {};
    probeEdge(start, nb.node, state.rusak ? '#c62828' : state.perbaikan ? '#f9a825' : '#2e7d32');
    if (state.rusak || state.perbaikan || state.hujan || state.macet)
      problematicNeighbors.push({ nb, state });
    await delay(120);
  }

  if (problematicNeighbors.length > 0) {
    await delay(300); chatTyping(); await delay(500);
    let issueHtml = `<div class="tag warn">⚠️ HAMBATAN</div><br>`;
    for (const { nb, state } of problematicNeighbors) {
      const label = state.rusak ? '⛔ Rusak' : state.perbaikan ? '🚧 Perbaikan' : state.hujan ? '🌧️ Hujan' : '🟠 Macet';
      issueHtml += `<b>${start}→${nb.node}</b>: ${label}<br>`;
    }
    chatLog('ai', issueHtml, 'warn');
  } else {
    await delay(400); chatTyping(); await delay(500);
    chatLog('ai', `✅ Semua jalur dari <b>${start}</b> kondisi baik.`);
  }

  // Phase 3: Dijkstra step-by-step
  await delay(400);
  if (simState.cancelled) { _abortScan(start); return; }
  chatTyping(); await delay(500);
  if (simState.cancelled) { _abortScan(start); return; }
  chatLog('ai', `🔍 Mulai menyelidiki dari <b>${start}</b>...`);

  // Init tabel Dijkstra real-time
  dtableInit(Object.keys(graph), start);
  dtableShow();

  const dist = {}, prev = {}, vis = new Set();
  for (let n in graph) dist[n] = Infinity;
  dist[start] = 0;
  const visitOrder = [];

  while (true) {
    if (simState.cancelled) { _abortScan(start); return; }
    let u = null;
    for (let n in dist) if (!vis.has(n) && (u === null || dist[n] < dist[u])) u = n;
    if (!u || dist[u] === Infinity) break;
    vis.add(u); visitOrder.push({ node: u, dist: dist[u] });
    dtableUpdate(dist, prev, vis);

    if (u !== start) {
      const fromNode = prev[u] || start;
      probeEdge(fromNode, u, '#43a047');
      await delay(120);
    }
    if (simState.cancelled) { _abortScan(start); return; }
    if (u === end) break;

    for (let nb of graph[u]) {
      const nd = dist[u] + nb.weight;
      if (nd < dist[nb.node]) { dist[nb.node] = nd; prev[nb.node] = u; }
      if (!vis.has(nb.node)) {
        const pid   = pairId(u, nb.node);
        const state = roadStates[pid] || {};
        const color = state.perbaikan ? '#f9a825' : state.hujan ? '#29b6f6' : '#66bb6a';
        probeEdge(u, nb.node, color);
        dtableUpdate(dist, prev, vis, nb.node, u, nb.weight);
        await delay(200);
      }
    }
    await delay(150);
  }
  dtableUpdate(dist, prev, vis);

  await delay(200); chatTyping(); await delay(300);
  chatLog('ai', `↳ <b>${visitOrder.length} node</b> dianalisis.`);

  // Phase 4: Kesimpulan
  const path = []; let cur = end;
  while (cur) { path.unshift(cur); cur = prev[cur]; }
  const totalDist = dist[end];

  if (totalDist === Infinity) {
    clearProbes();
    const blockedRoads = Object.entries(roadStates)
      .filter(([, flags]) => flags.rusak)
      .map(([id]) => id.split('-').join('–'));
    let blockMsg = `⛔ <b>Tidak ada rute</b> dari <b>${start}</b> ke <b>${end}</b>.`;
    if (blockedRoads.length > 0)
      blockMsg += `<br><span style="color:#c62828">Jalan rusak yang memblokir: <b>${blockedRoads.join(', ')}</b>.<br>Perbaiki kondisi jalan atau pilih rute lain.</span>`;
    chatLog('ai', blockMsg, 'warn');
    simState.status = 'idle';
    updateRouteButtons('idle');
    return;
  }

  // Cek kondisi rute
  const skippedBroken = Object.entries(roadStates).filter(([, f]) => f.rusak).map(([id]) => id);
  const avoidedRoads  = skippedBroken.filter(id => {
    const [a, b] = id.split('-');
    return originalGraph[a] && originalGraph[a].some(x => x.node === b);
  });
  const rainySegments = [], macetSegments = [];
  for (let i = 0; i < path.length - 1; i++) {
    const pid = pairId(path[i], path[i+1]);
    if (roadStates[pid]?.hujan)  rainySegments.push(`${path[i]}–${path[i+1]}`);
    if (roadStates[pid]?.macet)  macetSegments.push(`${path[i]}–${path[i+1]}`);
  }

  await delay(500); chatTyping(); await delay(900);

  let conclusionExtra = '';
  if (avoidedRoads.length > 0)  conclusionExtra += `<br>⛔ Menghindari jalan rusak: <b>${avoidedRoads.map(id=>id.split('-').join('–')).join(', ')}</b>`;
  if (rainySegments.length > 0) conclusionExtra += `<br>🌧️ Segmen hujan (mobil melambat): <b>${rainySegments.join(', ')}</b>`;
  if (macetSegments.length > 0) conclusionExtra += `<br>🟠 Segmen macet (mobil sangat lambat): <b>${macetSegments.join(', ')}</b>`;

  chatLog('ai', `
    <div class="tag ok">✅ KESIMPULAN</div><br>
    Rute tercepat ditemukan!
    <div class="route-path">${path.join(' → ')}</div>
    📏 Jarak total: <b>${totalDist} km</b>${conclusionExtra}
  `, 'highlight');

  await delay(600);

  // Phase 5: Animasi garis rute tumbuh (stroke-dashoffset) lalu zoom & siapkan mobil
  let hd = `M ${positions[path[0]].x} ${positions[path[0]].y} `;
  for (let i = 1; i < path.length; i++)
    hd += getNaturalPath(positions[path[i-1]], positions[path[i]], path[i-1], path[i]) + ' ';

  const hlPath = document.getElementById('highlight-path');
  hlPath.setAttribute('d', hd);

  // Ukur panjang path lalu animasikan dengan dashoffset
  await delay(200);
  const pathLen = hlPath.getTotalLength ? hlPath.getTotalLength() : 2000;
  hlPath.style.strokeDasharray  = `${pathLen}`;
  hlPath.style.strokeDashoffset = `${pathLen}`;
  hlPath.style.transition = 'none';
  // Force reflow
  void hlPath.getBoundingClientRect();
  hlPath.style.transition = `stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1)`;
  hlPath.style.strokeDashoffset = '0';

  await delay(1700);
  // Reset dasharray supaya tidak mempengaruhi tampilan setelah animasi
  hlPath.style.transition = 'none';
  hlPath.style.strokeDasharray  = '';
  hlPath.style.strokeDashoffset = '';

  clearProbes();
  // Tabel Dijkstra tetap tampil — tidak di-hide di sini
  await delay(300);

  await smoothZoomToWorld(startPos.x, startPos.y, 0.85, 800);
  resetCarState();
  setCarTo({ x: startPos.x, y: startPos.y, angle: 0 });
  await delay(400);

  // Phase 6: Animasi mobil dengan follow-cam & speed by condition
  statusLog(`🚗 <b>Rute:</b> ${path.join(' ➔ ')} &nbsp;|&nbsp; 📏 <b>Jarak Total:</b> ${totalDist} km`, 'ok');
  updateRouteButtons('running');

  const built = buildRouteSamples(path);
  Object.assign(simState, {
    path: path.slice(), distance: totalDist,
    points: built.points, cumulative: built.cumulative, totalLength: built.totalLength,
    startTime: 0, pausedAt: 0, pausedTotal: 0, currentIndex: 0,
    status: 'running', rainSegments: rainySegments, travelDist: 0, lastFrameTime: null
  });

  const rainSegSet  = new Set();
  const macetSegSet = new Set();
  for (let i = 0; i < path.length - 1; i++) {
    const pid = pairId(path[i], path[i+1]);
    if (roadStates[pid]?.hujan) rainSegSet.add(i);
    if (roadStates[pid]?.macet) macetSegSet.add(i);
  }

  const segLengths = [];
  for (let i = 0; i < path.length - 1; i++) {
    const segPts = buildEdgePts(positions[path[i]], positions[path[i+1]], path[i], path[i+1], 24);
    let len = 0;
    for (let s = 1; s < segPts.length; s++)
      len += Math.hypot(segPts[s].x - segPts[s-1].x, segPts[s].y - segPts[s-1].y);
    segLengths.push({ len, rainy: rainSegSet.has(i), macet: macetSegSet.has(i) });
  }

  stopRaf();
  let lastSegmentLogged = -1, lastRainLogged = -1;

  function animateWithFollow(now) {
    if (simState.status !== 'running') return;
    if (!simState.lastFrameTime) simState.lastFrameTime = now;
    const dt = now - simState.lastFrameTime;
    simState.lastFrameTime = now;

    let acc = 0, currentSegIdx = 0;
    for (let i = 0; i < segLengths.length; i++) {
      if (simState.travelDist < acc + segLengths[i].len) { currentSegIdx = i; break; }
      acc += segLengths[i].len;
      currentSegIdx = i;
    }
    const isRainy = segLengths[currentSegIdx]?.rainy;
    const isMacet = segLengths[currentSegIdx]?.macet;
    const speed   = isMacet ? 0.03 : isRainy ? 0.07 : 0.16;

    simState.travelDist = Math.min(simState.totalLength, simState.travelDist + dt * speed);
    const travel = simState.travelDist;
    const point  = pointAtLength(simState.points, simState.cumulative, travel);

    if (point) {
      setCarTo(point);
      panToWorld(point.x, point.y);
      const progress = travel / simState.totalLength;
      const segIdx   = Math.floor(progress * (path.length - 1));
      if (segIdx !== lastSegmentLogged && segIdx > 0 && segIdx < path.length) {
        lastSegmentLogged = segIdx;
        const node     = path[Math.min(segIdx, path.length - 1)];
        const segRainy = rainSegSet.has(segIdx - 1);
        const segMacet = macetSegSet.has(segIdx - 1);
        if (segMacet && lastRainLogged !== segIdx) {
          lastRainLogged = segIdx;
          chatLog('ai', `🟠 Melewati <b>${path[segIdx-1]}–${node}</b> — macet, kecepatan sangat lambat.`, 'warn');
        } else if (segRainy && lastRainLogged !== segIdx) {
          lastRainLogged = segIdx;
          chatLog('ai', `🌧️ Melewati <b>${path[segIdx-1]}–${node}</b> — hujan, kecepatan dikurangi.`, 'warn');
        } else {
          chatLog('ai', `📍 Melewati kota <b>${node}</b>...`);
        }
      }
    }

    if (travel >= simState.totalLength) {
      simState.currentIndex = simState.points.length - 1;
      finishRoute('done');
      statusLog(`✅ Rute selesai. Klik <b>Ulang</b> untuk memutar lagi atau <b>Kembali</b> untuk reset.`, 'ok');
      setTimeout(() => {
        chatLog('ai', `🏁 Tiba di <b>${end}</b>! Perjalanan selesai — <b>${totalDist} km</b> dilalui. ✅`, 'highlight');
      }, 500);
      return;
    }
    simState.rafId = requestAnimationFrame(animateWithFollow);
  }

  simState.animFn = animateWithFollow;
  simState.rafId  = requestAnimationFrame(animateWithFollow);
}

/* ── Reset semua jalan ── */
function resetRoads() {
  stopRaf();
  graph = JSON.parse(JSON.stringify(originalGraph));
  brokenRoads = []; roadStates = {};
  document.getElementById('broken-roads-layer').innerHTML = '';
  document.getElementById('road-states-layer').innerHTML = '';
  document.getElementById('highlight-path').setAttribute('d', '');
  const startNode = document.getElementById('start').value;
  const sp = positions[startNode] || Object.values(positions)[0];
  setCarTo({ x: sp.x, y: sp.y, angle: 0 });
  statusLog(`✅ Semua jalan kembali normal. Mobil kembali ke titik <b>${startNode}</b>.`, 'ok');
  const edgeList = buildAllEdgePts();
  renderRoadHitPaths(edgeList);
  drawWeightLabels();
  simState.status = 'idle'; simState.path = null;
  updateRouteButtons('idle');
}