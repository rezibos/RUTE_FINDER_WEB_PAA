/* ═══════════════════════════════════════════════
   car.js — Animasi mobil, heading, roda, sampling
   ═══════════════════════════════════════════════ */

let _carHeading  = 0;
let _carFlipped  = false;
let _wheelAngle  = 0;
let _lastCarPos  = null;

/* ── Taruh mobil di koordinat dunia ── */
function setCarTo(point) {
  const car = document.getElementById('car');
  const rawAngle = (point.angle || 0) * 180 / Math.PI;

  // Normalisasi delta ke -180..180 supaya tidak berputar 360°
  let delta = rawAngle - _carHeading;
  while (delta >  180) delta -= 360;
  while (delta < -180) delta += 360;

  // Smoothing lebih responsif (0.35 lebih kencang dari 0.18)
  _carHeading += delta * 0.35;

  // Putar roda berdasarkan jarak tempuh
  if (_lastCarPos) {
    const dist = Math.hypot(point.x - _lastCarPos.x, point.y - _lastCarPos.y);
    _wheelAngle += dist / 6 * (180 / Math.PI);
  }
  _lastCarPos = { x: point.x, y: point.y };

  // Apply rotasi roda — gunakan transform sederhana tanpa re-parse
  const wheels = car.querySelectorAll('.wheel');
  wheels.forEach(w => {
    // Ambil translate dari attribute data-orig, bukan re-parse tiap frame
    if (!w._origTx) {
      const m = (w.getAttribute('transform') || '').match(/translate\(([-\d.]+),([-\d.]+)\)/);
      if (m) { w._origTx = parseFloat(m[1]); w._origTy = parseFloat(m[2]); }
      else   { w._origTx = 0; w._origTy = 0; }
    }
    w.setAttribute('transform',
      `translate(${w._origTx},${w._origTy}) rotate(${_wheelAngle.toFixed(1)})`
    );
  });

  car.setAttribute('transform',
    `translate(${point.x.toFixed(1)},${point.y.toFixed(1)}) rotate(${_carHeading.toFixed(2)})`
  );
}

/* ── Sample titik sepanjang path bezier ── */
function buildRouteSamples(path) {
  const points = [];
  const cumulative = [0];
  let total = 0;

  for (let i = 0; i < path.length; i++) {
    const name = path[i];
    const p = positions[name];
    if (i === 0) {
      points.push({ x: p.x, y: p.y, angle: 0 });
      continue;
    }
    const prev = path[i - 1];
    const segPts = buildEdgePts(positions[prev], positions[name], prev, name, 24);
    for (let s = 1; s < segPts.length; s++) {
      const a = segPts[s - 1], b = segPts[s];
      const d = Math.hypot(b.x - a.x, b.y - a.y);
      total += d;
      // Sudut dihitung dari segmen aktif, bukan dari titik sebelumnya lintas edge
      points.push({ x: b.x, y: b.y, angle: Math.atan2(b.y - a.y, b.x - a.x) });
      cumulative.push(total);
    }
  }
  return { points, cumulative, totalLength: total };
}

/* ── Interpolasi titik di sepanjang path ── */
function pointAtLength(points, cumulative, length) {
  if (!points.length) return null;
  if (length <= 0) return points[0];
  if (length >= cumulative[cumulative.length - 1]) return points[points.length - 1];
  let lo = 0, hi = cumulative.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (cumulative[mid] < length) lo = mid; else hi = mid;
  }
  const prevLen = cumulative[lo], nextLen = cumulative[hi];
  const ratio = (length - prevLen) / (nextLen - prevLen || 1);
  const p1 = points[lo], p2 = points[hi];

  // Normalisasi interpolasi sudut supaya tidak lompat melewati ±π
  let da = p2.angle - p1.angle;
  while (da >  Math.PI) da -= 2 * Math.PI;
  while (da < -Math.PI) da += 2 * Math.PI;

  return {
    x:     p1.x + (p2.x - p1.x) * ratio,
    y:     p1.y + (p2.y - p1.y) * ratio,
    angle: p1.angle + da * ratio
  };
}

/* ── Reset state car ── */
function resetCarState() {
  _carHeading = 0;
  _carFlipped = false;
  _wheelAngle = 0;
  _lastCarPos = null;
  // Bersihkan cache translate roda supaya di-init ulang
  const car = document.getElementById('car');
  if (car) car.querySelectorAll('.wheel').forEach(w => { delete w._origTx; delete w._origTy; });
}