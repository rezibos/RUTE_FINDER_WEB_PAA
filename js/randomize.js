/* ═══════════════════════════════════════════════
   randomize.js — Acak peta baru (26 kota A–Z)
   Versi fixed: semua jalan/node dijamin terhubung
   - Tidak ada node terpencil
   - Minimal tiap kota punya 2 jalan jika memungkinkan
   - Jalan dibuat masuk akal: jarak dekat diprioritaskan
   ═══════════════════════════════════════════════ */

function randomWeight(p1, p2) {
  const d    = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const base = Math.round(d * 0.22);
  return Math.max(40, base + Math.round((Math.random() - 0.5) * base * 0.3));
}

function countEdges(g) {
  let c = 0; const s = new Set();
  for (let u in g) for (let e of g[u]) {
    const p = [u, e.node].sort().join('-');
    if (!s.has(p)) { s.add(p); c++; }
  }
  return c;
}

function graphComponents(g, nodes) {
  const seen = new Set();
  const comps = [];
  for (const start of nodes) {
    if (seen.has(start)) continue;
    const comp = [];
    const stack = [start];
    seen.add(start);
    while (stack.length) {
      const u = stack.pop();
      comp.push(u);
      for (const e of (g[u] || [])) {
        if (!seen.has(e.node)) {
          seen.add(e.node);
          stack.push(e.node);
        }
      }
    }
    comps.push(comp);
  }
  return comps;
}

function randomizeMap() {
  stopRaf();

  const PAD = 220;
  const MIN_DIST = 320;
  const MAX_EDGE = 1050;
  const MAX_DEGREE = 5;
  const MIN_DEGREE = 2;
  const nodeCount = 26;
  const nodeNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, nodeCount).split('');

  // 1. Tempatkan node dengan pola grid-jitter supaya terasa seperti wilayah kota.
  const newPos = {};
  const cols = 6, rows = Math.ceil(nodeCount / cols);
  const cellW = (W - PAD * 2) / cols, cellH = (H - PAD * 2) / rows;
  const shuffled = [...nodeNames].sort(() => Math.random() - 0.5);

  for (let i = 0; i < shuffled.length; i++) {
    const col = i % cols, row = Math.floor(i / cols);
    const cx = PAD + col * cellW + cellW / 2;
    const cy = PAD + row * cellH + cellH / 2;
    let placed = false;

    for (let t = 0; t < 80 && !placed; t++) {
      const px = cx + rnd(-cellW * 0.34, cellW * 0.34);
      const py = cy + rnd(-cellH * 0.34, cellH * 0.34);
      const clamped = {
        x: Math.round(Math.max(PAD, Math.min(W - PAD, px))),
        y: Math.round(Math.max(PAD, Math.min(H - PAD, py)))
      };

      let ok = true;
      for (const ep of Object.values(newPos)) {
        if (Math.hypot(clamped.x - ep.x, clamped.y - ep.y) < MIN_DIST) {
          ok = false;
          break;
        }
      }
      if (ok) { newPos[shuffled[i]] = clamped; placed = true; }
    }

    if (!newPos[shuffled[i]]) {
      newPos[shuffled[i]] = { x: Math.round(cx), y: Math.round(cy) };
    }
  }

  // 2. Siapkan graph kosong.
  const newGraph = {};
  for (const n of nodeNames) newGraph[n] = [];
  const edgePts = [];
  const addedPairs = new Set();
  const degree = {};
  for (const n of nodeNames) degree[n] = 0;

  function distUV(u, v) {
    return Math.hypot(newPos[u].x - newPos[v].x, newPos[u].y - newPos[v].y);
  }

  function addEdge(u, v, force = false) {
    if (u === v) return false;
    const pair = [u, v].sort().join('-');
    if (addedPairs.has(pair)) return false;

    if (!force) {
      if (degree[u] >= MAX_DEGREE || degree[v] >= MAX_DEGREE) return false;
      if (distUV(u, v) > MAX_EDGE) return false;
      if (edgeCrosses(edgePts, newPos[u], newPos[v], u, v)) return false;
    }

    const w = randomWeight(newPos[u], newPos[v]);
    newGraph[u].push({ node: v, weight: w });
    newGraph[v].push({ node: u, weight: w });
    edgePts.push({ pts: buildEdgePts(newPos[u], newPos[v], u, v, 10), from: u, to: v });
    addedPairs.add(pair);
    degree[u]++;
    degree[v]++;
    return true;
  }

  function tryAddNearest(u, candidates, forceFallback = true) {
    const sorted = candidates
      .filter(v => v !== u && !addedPairs.has([u, v].sort().join('-')))
      .map(v => ({ v, d: distUV(u, v) }))
      .sort((a, b) => a.d - b.d);

    for (const { v } of sorted) {
      if (addEdge(u, v, false)) return true;
    }

    // Fallback penting: kalau aturan visual terlalu ketat, tetap sambungkan.
    // Ini mencegah node/jalan terputus.
    if (forceFallback) {
      for (const { v } of sorted) {
        if (addEdge(u, v, true)) return true;
      }
    }
    return false;
  }

  // 3. Bangun spanning tree terlebih dahulu.
  // Ini inti agar semua kota berada dalam satu jaringan jalan.
  const inTree = new Set([nodeNames[0]]);
  const remaining = new Set(nodeNames.slice(1));

  while (remaining.size > 0) {
    let best = null;
    let bestD = Infinity;

    for (const u of inTree) {
      for (const v of remaining) {
        const d = distUV(u, v);
        const pair = [u, v].sort().join('-');
        if (addedPairs.has(pair)) continue;
        if (d < bestD && d <= MAX_EDGE && degree[u] < MAX_DEGREE && degree[v] < MAX_DEGREE) {
          if (!edgeCrosses(edgePts, newPos[u], newPos[v], u, v)) {
            bestD = d;
            best = { u, v, force: false };
          }
        }
      }
    }

    // Kalau tidak ada kandidat ideal, cari yang terdekat dan paksa sambung.
    if (!best) {
      for (const u of inTree) {
        for (const v of remaining) {
          const d = distUV(u, v);
          if (d < bestD) {
            bestD = d;
            best = { u, v, force: true };
          }
        }
      }
    }

    if (!best) break;
    addEdge(best.u, best.v, best.force);
    inTree.add(best.v);
    remaining.delete(best.v);
  }

  // 4. Tambah jalan ekstra agar tidak terlihat seperti satu jalur panjang.
  const allPairs = [];
  for (let i = 0; i < nodeNames.length; i++) {
    for (let j = i + 1; j < nodeNames.length; j++) {
      const u = nodeNames[i], v = nodeNames[j];
      allPairs.push({ u, v, d: distUV(u, v) });
    }
  }
  allPairs.sort((a, b) => a.d - b.d);

  const targetEdges = Math.max(nodeCount + 12, Math.floor(nodeCount * 1.55));
  for (const { u, v } of allPairs) {
    if (countEdges(newGraph) >= targetEdges) break;
    addEdge(u, v, false);
  }

  // 5. Pastikan tidak ada kota yang cuma punya 0/1 jalan.
  // Ini membuat map lebih masuk akal untuk perkotaan dan mengurangi jalan buntu.
  for (const u of nodeNames) {
    let guard = 0;
    while (degree[u] < MIN_DEGREE && guard < nodeNames.length) {
      tryAddNearest(u, nodeNames, true);
      guard++;
      if (degree[u] >= MIN_DEGREE) break;
    }
  }

  // 6. Validasi terakhir: kalau masih ada komponen terpisah, sambungkan komponen terdekat.
  let comps = graphComponents(newGraph, nodeNames);
  while (comps.length > 1) {
    let best = null, bestD = Infinity;
    const base = comps[0];
    const others = comps.slice(1).flat();

    for (const u of base) {
      for (const v of others) {
        const d = distUV(u, v);
        if (d < bestD) { bestD = d; best = { u, v }; }
      }
    }

    if (!best) break;
    addEdge(best.u, best.v, true);
    comps = graphComponents(newGraph, nodeNames);
  }

  // 7. Commit state baru.
  originalGraph = JSON.parse(JSON.stringify(newGraph));
  graph         = JSON.parse(JSON.stringify(newGraph));
  positions     = newPos;
  brokenRoads   = [];
  roadStates    = {};

  document.getElementById('broken-roads-layer').innerHTML = '';
  document.getElementById('highlight-path').setAttribute('d', '');
  populateSelects();
  drawMap(true, edgePts);
  simState.status = 'idle';
  simState.path = null;
  updateRouteButtons('idle');

  const minDegree = Math.min(...nodeNames.map(n => degree[n]));
  const connected = graphComponents(newGraph, nodeNames).length === 1;

  chatLog(
    'sys',
    `🎲 Peta diacak! <b>${nodeCount} kota</b>, <b>${countEdges(newGraph)} jalan</b>. ` +
    `Status: <b>${connected ? 'semua terhubung' : 'ada yang terpisah'}</b>, ` +
    `minimal koneksi/kota: <b>${minDegree}</b>.`,
    connected ? 'ok' : 'warn'
  );
}
