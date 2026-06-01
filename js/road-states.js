/* ═══════════════════════════════════════════════
   road-states.js — Kondisi jalan (rusak, hujan,
                    macet, perbaikan) & render SVG
   ═══════════════════════════════════════════════ */

// ── Build edge list dari graph ─────────────────
function buildAllEdgePts() {
  const list = [], drawn = new Set();
  for (let u in graph) for (let e of graph[u]) {
    const pair = [u, e.node].sort().join('-');
    if (!drawn.has(pair)) {
      drawn.add(pair);
      list.push({ pts: buildEdgePts(positions[u], positions[e.node], u, e.node, 10), from: u, to: e.node });
    }
  }
  return list;
}

// ── Render invisible hit-paths untuk klik kondisi ──
function renderRoadHitPaths(edgeList) {
  const layer = document.getElementById('road-hit-layer');
  layer.innerHTML = '';
  for (const { from, to } of edgeList) {
    const d = `M ${positions[from].x} ${positions[from].y} ${getNaturalPath(positions[from], positions[to], from, to)}`;
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    p.setAttribute('class', 'road-hit');
    p.setAttribute('fill', 'none');
    p.dataset.from = from;
    p.dataset.to = to;
    p.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (['running','paused','scanning','done'].includes(simState.status)) {
        statusLog(`⛔ Tidak bisa mengubah kondisi jalan saat simulasi berjalan.`, 'warn');
        return;
      }
      const id = pairId(ev.currentTarget.dataset.from, ev.currentTarget.dataset.to);
      if (!currentTool) return;
      if (!roadStates[id]) roadStates[id] = {};
      if (roadStates[id][currentTool]) delete roadStates[id][currentTool];
      else roadStates[id][currentTool] = true;
      if (Object.keys(roadStates[id]).length === 0) delete roadStates[id];
      rebuildGraphWithStates();
      drawRoadStates();
      populateSelects();
      const [nA, nB] = id.split('-');
      const tLabel = { rusak:'🔴 Jalan Rusak', perbaikan:'🟡 Sedang Perbaikan', hujan:'🔵 Hujan', macet:'🟠 Macet' }[currentTool];
      const active = roadStates[id] && roadStates[id][currentTool];
      const allF = roadStates[id] ? Object.keys(roadStates[id]).map(k => ({rusak:'Rusak',perbaikan:'Perbaikan',hujan:'Hujan',macet:'Macet'}[k])).join(' + ') : 'Normal';
      statusLog(active
        ? `${tLabel} diterapkan pada jalan <b>${nA}–${nB}</b>. Kondisi: <b>${allF}</b>`
        : `✅ Kondisi <b>${currentTool}</b> dihapus dari jalan <b>${nA}–${nB}</b>. Kondisi: <b>${allF || 'Normal'}</b>`,
        active ? 'highlight' : 'ok');
    });
    layer.appendChild(p);
  }
}

// ── Render overlay visual kondisi jalan ───────
function drawRoadStates() {
  const layer = document.getElementById('road-states-layer');
  layer.innerHTML = '';
  for (const p in roadStates) {
    const [u, v] = p.split('-'), flags = roadStates[p];
    const p1 = positions[u], p2 = positions[v];
    const d = `M ${p1.x} ${p1.y} ${getNaturalPath(p1, p2, u, v)}`;
    if (flags.rusak)     layer.innerHTML += `<path d="${d}" stroke="#ff4d4d" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`;
    if (flags.perbaikan) layer.innerHTML += `<path d="${d}" stroke="#ffb74d" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85" stroke-dasharray="18 12"/>`;
    if (flags.hujan)     layer.innerHTML += `<path d="${d}" stroke="#4fc3f7" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.72" stroke-dasharray="5 12"/>`;
    if (flags.macet)     layer.innerHTML += `<path d="${d}" stroke="#ff6f00" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.75" stroke-dasharray="8 8"/>`;
    if (flags.perbaikan) layer.innerHTML += drawRepairSigns(p1, p2, u, v);
    if (flags.rusak)     layer.innerHTML += drawCrackPath(p1, p2, u, v);
    if (flags.hujan)     layer.innerHTML += drawRainCloud(p1, p2, u, v);
    if (flags.macet)     layer.innerHTML += drawTrafficJam(p1, p2, u, v);
  }
}

// ── Visual helpers tiap kondisi ────────────────

function drawCrackPath(p1, p2, n1, n2) {
  const pts = buildEdgePts(p1, p2, n1, n2, 14);
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++)
    d += ` L ${(pts[i].x+(Math.random()-0.5)*20).toFixed(1)} ${(pts[i].y+(i%2?-16:16)+(Math.random()-0.5)*9).toFixed(1)}`;
  return `<path d="${d}" stroke="#7b1f1f" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"/>
          <path d="${d}" stroke="#ffd54f" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>`;
}

function drawRepairSigns(p1, p2, n1, n2) {
  function signAt(pt) {
    return `<g transform="translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)})">
      <rect x="-11" y="-32" width="22" height="18" rx="3" fill="#ffeb3b" stroke="#333" stroke-width="1.5"/>
      <rect x="-2" y="-14" width="4" height="20" fill="#6b6b6b"/>
    </g>`;
  }
  return signAt(bezierPoint(p1, p2, n1, n2, 0.12)) + signAt(bezierPoint(p1, p2, n1, n2, 0.88));
}

function drawRainCloud(p1, p2, n1, n2) {
  const mid = bezierPoint(p1, p2, n1, n2, 0.5);
  const cx = mid.x, cy = mid.y - 26;
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <ellipse cx="-9" cy="7" rx="13" ry="8" fill="#cddcec" stroke="#9fb5d9"/>
    <ellipse cx="9" cy="7" rx="11" ry="7" fill="#cddcec" stroke="#9fb5d9"/>
    <ellipse cx="0" cy="3" rx="16" ry="9" fill="#cddcec" stroke="#9fb5d9"/>
    <line x1="-9" y1="17" x2="-9" y2="28" stroke="#4fc3f7" stroke-width="2.5"/>
    <line x1="0" y1="17" x2="0" y2="31" stroke="#4fc3f7" stroke-width="2.5"/>
    <line x1="9" y1="17" x2="9" y2="28" stroke="#4fc3f7" stroke-width="2.5"/>
  </g>`;
}

function drawTrafficJam(p1, p2, n1, n2) {
  const carCols = ['#e53935','#fb8c00','#fdd835','#42a5f5','#ab47bc','#26a69a','#ef5350','#ffca28'];
  let s = '';
  const steps = 7;
  for (let i = 0; i < steps; i++) {
    const t = 0.1 + (i / (steps + 1)) * 0.8;
    const pt  = bezierPoint(p1, p2, n1, n2, t);
    const pt2 = bezierPoint(p1, p2, n1, n2, Math.min(1, t + 0.05));
    const ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
    const col = carCols[i % carCols.length];
    s += `<g transform="translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)}) rotate(${ang.toFixed(1)})">
      <rect x="-13" y="-6" width="26" height="12" fill="${col}" rx="3" opacity="0.93"/>
      <rect x="-5" y="-5" width="11" height="9" fill="#fff" rx="1" opacity="0.65"/>
      <circle cx="-8" cy="6" r="3" fill="#222"/>
      <circle cx="8" cy="6" r="3" fill="#222"/>
    </g>`;
  }
  return s;
}

// ── Label bobot jalan ─────────────────────────
function drawWeightLabels() {
  const layer = document.getElementById('weight-labels-layer');
  layer.innerHTML = '';
  const drawn = new Set();
  for (let u in originalGraph) for (let e of originalGraph[u]) {
    const pair = [u, e.node].sort().join('-');
    if (!drawn.has(pair)) {
      drawn.add(pair);
      const mid = bezierPoint(positions[u], positions[e.node], u, e.node, 0.5);
      layer.innerHTML += `<rect x="${(mid.x-22).toFixed(1)}" y="${(mid.y-11).toFixed(1)}" width="44" height="20" rx="6" fill="#222" opacity="0.82"/>
      <text class="weight-label" x="${mid.x.toFixed(1)}" y="${(mid.y+1).toFixed(1)}">${e.weight}</text>`;
    }
  }
}

// ── Rebuild graph dari roadStates ─────────────
function rebuildGraphWithStates() {
  graph = JSON.parse(JSON.stringify(originalGraph));
  for (const p in roadStates) {
    const [u, v] = p.split('-'), flags = roadStates[p];
    if (flags.rusak) {
      if (graph[u]) graph[u] = graph[u].filter(x => x.node !== v);
      if (graph[v]) graph[v] = graph[v].filter(x => x.node !== u);
    } else {
      let pen = 0;
      if (flags.perbaikan) pen += 800;
      if (flags.hujan)     pen += 150;
      if (flags.macet)     pen += 400;
      const eu = graph[u] && graph[u].find(x => x.node === v);
      const ev = graph[v] && graph[v].find(x => x.node === u);
      if (eu) eu.weight += pen;
      if (ev) ev.weight += pen;
    }
  }
}

// ── Clear semua kondisi ───────────────────────
function clearAllConditions() {
  roadStates = {};
  brokenRoads = [];
  rebuildGraphWithStates();
  drawRoadStates();
  document.getElementById('broken-roads-layer').innerHTML = '';
  document.getElementById('road-states-layer').innerHTML = '';
  statusLog(`🗑️ Semua kondisi jalan dihapus.`, 'ok');
}
