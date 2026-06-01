/* ═══════════════════════════════════════════════
   probe.js — Animasi probe lines Dijkstra di SVG
   ═══════════════════════════════════════════════ */

let probeAnimId = null;
let probeLines  = []; // { from, to, progress, color }

/* ── Hapus semua probe ── */
function clearProbes() {
  if (probeAnimId) { cancelAnimationFrame(probeAnimId); probeAnimId = null; }
  document.getElementById('probe-layer').innerHTML = '';
  probeLines = [];
}

/* ── Loop animasi probe ── */
function animateProbes() {
  const layer = document.getElementById('probe-layer');
  layer.innerHTML = '';
  let allDone = true;

  for (const pl of probeLines) {
    pl.progress = Math.min(1, pl.progress + 0.035);
    if (pl.progress < 1) allDone = false;

    const p1 = positions[pl.from], p2 = positions[pl.to];
    if (!p1 || !p2) continue;

    const t    = pl.progress;
    const segs = buildEdgePts(p1, p2, pl.from, pl.to, 12);
    const endIdx = Math.floor(t * (segs.length - 1));
    const frac   = t * (segs.length - 1) - endIdx;

    let d = `M ${segs[0].x} ${segs[0].y}`;
    for (let i = 1; i <= endIdx; i++) d += ` L ${segs[i].x} ${segs[i].y}`;

    if (endIdx < segs.length - 1) {
      const ex = segs[endIdx].x + (segs[endIdx+1].x - segs[endIdx].x) * frac;
      const ey = segs[endIdx].y + (segs[endIdx+1].y - segs[endIdx].y) * frac;
      d += ` L ${ex} ${ey}`;
      layer.innerHTML += `<circle cx="${ex}" cy="${ey}" r="16" fill="${pl.color}" opacity="0.7"/>
        <circle cx="${ex}" cy="${ey}" r="8" fill="#fff" opacity="0.9"/>`;
    }

    layer.innerHTML += `<path d="${d}" stroke="${pl.color}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.5"/>
      <path d="${d}" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7" stroke-dasharray="18 10"/>`;

    if (t > 0.8) {
      const op = (t - 0.8) / 0.2;
      layer.innerHTML += `<circle cx="${p2.x}" cy="${p2.y}" r="${28 + op * 20}" fill="none" stroke="${pl.color}" stroke-width="4" opacity="${op * 0.6}"/>`;
    }
  }

  if (!allDone) probeAnimId = requestAnimationFrame(animateProbes);
  else probeAnimId = null;
}

/* ── Tambah satu probe edge, tunggu selesai ── */
async function probeEdge(fromNode, toNode, color) {
  probeLines.push({ from: fromNode, to: toNode, progress: 0, color: color || '#2e7d32' });
  if (!probeAnimId) probeAnimId = requestAnimationFrame(animateProbes);
  await new Promise(r => {
    const check = setInterval(() => {
      const pl = probeLines.find(p => p.from === fromNode && p.to === toNode);
      if (!pl || pl.progress >= 1) { clearInterval(check); r(); }
    }, 50);
  });
}
