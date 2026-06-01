/* ═══════════════════════════════════════════════
   bezier.js — Helper geometri, bezier, road clearance
   ═══════════════════════════════════════════════ */

// ── Utility dasar ──────────────────────────────
function rnd(a, b)     { return a + Math.random() * (b - a); }
function ri(a, b)      { return Math.floor(rnd(a, b + 1)); }
function pairId(a, b)  { return [a, b].sort().join('-'); }

// ── Bezier helpers ─────────────────────────────
function getCurveParams(p1, p2, n1, n2) {
  const dx = p2.x - p1.x, dy = p2.y - p1.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 1) return null;
  const flip = (n1.charCodeAt(0) + n2.charCodeAt(0)) % 2 === 0 ? 1 : -1;
  const ci = Math.min(dist * 0.22, 120) * flip;
  const nx = (-dy / dist) * ci, ny = (dx / dist) * ci;
  return {
    cx1: p1.x + dx * 0.3 + nx, cy1: p1.y + dy * 0.3 + ny,
    cx2: p1.x + dx * 0.7 - nx, cy2: p1.y + dy * 0.7 - ny
  };
}

function getNaturalPath(p1, p2, n1, n2) {
  const c = getCurveParams(p1, p2, n1, n2);
  if (!c) return `L ${p2.x} ${p2.y}`;
  return `C ${c.cx1} ${c.cy1} ${c.cx2} ${c.cy2} ${p2.x} ${p2.y}`;
}

function bezierPoint(p1, p2, n1, n2, t) {
  const c = getCurveParams(p1, p2, n1, n2);
  if (!c) return { x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t };
  const mt = 1 - t;
  return {
    x: mt*mt*mt*p1.x + 3*mt*mt*t*c.cx1 + 3*mt*t*t*c.cx2 + t*t*t*p2.x,
    y: mt*mt*mt*p1.y + 3*mt*mt*t*c.cy1 + 3*mt*t*t*c.cy2 + t*t*t*p2.y
  };
}

function buildEdgePts(p1, p2, n1, n2, SEGS = 10) {
  const pts = [];
  for (let i = 0; i <= SEGS; i++) pts.push(bezierPoint(p1, p2, n1, n2, i / SEGS));
  return pts;
}

// ── Segment intersection ────────────────────────
function segIntersect(ax, ay, bx, by, cx, cy, dx, dy) {
  const d1x = bx - ax, d1y = by - ay, d2x = dx - cx, d2y = dy - cy;
  const cross = d1x * d2y - d1y * d2x;
  if (Math.abs(cross) < 1e-9) return false;
  const tx = ((cx - ax) * d2y - (cy - ay) * d2x) / cross;
  const ty = ((cx - ax) * d1y - (cy - ay) * d1x) / cross;
  const E = 0.04;
  return tx > E && tx < 1 - E && ty > E && ty < 1 - E;
}

function ptSegDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, lenSq = dx * dx + dy * dy;
  if (lenSq < 1) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function pointNearEdge(px, py, pts, cl) {
  for (let i = 0; i < pts.length - 1; i++)
    if (ptSegDist(px, py, pts[i].x, pts[i].y, pts[i+1].x, pts[i+1].y) < cl) return true;
  return false;
}

function edgeCrosses(el, p1, p2, n1, n2) {
  const np = buildEdgePts(p1, p2, n1, n2, 8);
  for (const { pts, from, to } of el) {
    if (from === n1 || from === n2 || to === n1 || to === n2) continue;
    for (let i = 0; i < np.length - 1; i++)
      for (let j = 0; j < pts.length - 1; j++)
        if (segIntersect(np[i].x, np[i].y, np[i+1].x, np[i+1].y,
                         pts[j].x, pts[j].y, pts[j+1].x, pts[j+1].y)) return true;
  }
  return false;
}

// ── Road / node clearance ───────────────────────
let _roadPolylines = [];

function isTooCloseToRoad(px, py, clearance) {
  for (const pts of _roadPolylines)
    if (pointNearEdge(px, py, pts, clearance)) return true;
  return false;
}

function isTooCloseToNode(px, py, clearance) {
  for (const name in positions)
    if (Math.hypot(px - positions[name].x, py - positions[name].y) < clearance) return true;
  return false;
}

function isInUrbanArea(px, py, extraClearance) {
  const buffer = extraClearance || 0;
  for (const name in positions) {
    const degree = (originalGraph[name] || []).length;
    if (degree < 2) continue;
    const baseRadius = degree >= 4 ? 1200 : 900;
    if (Math.hypot(px - positions[name].x, py - positions[name].y) < baseRadius + buffer) return true;
  }
  return false;
}

function isOuterMapBand(px, py, margin) {
  return px < margin || py < margin || px > (W - margin) || py > (H - margin);
}

function isFarFromUrbanWaterZone(px, py) {
  return !isInUrbanArea(px, py, 1200) && !isTooCloseToNode(px, py, 1100);
}

// Global placed decoration registry (reset saat drawDecorations)
let placedDecorations = [];

function safePlaceNear(cx, cy, searchRadius, roadClear, nodeClear, tries) {
  tries = tries || 60;
  for (let i = 0; i < tries; i++) {
    const ang = Math.random() * Math.PI * 2;
    const r   = rnd(0, searchRadius);
    const px = cx + Math.cos(ang) * r;
    const py = cy + Math.sin(ang) * r;
    if (px < 80 || px > W - 80 || py < 80 || py > H - 80) continue;
    if (isTooCloseToRoad(px, py, roadClear)) continue;
    if (nodeClear && isTooCloseToNode(px, py, nodeClear)) continue;
    let clash = false;
    for (const d of placedDecorations)
      if (Math.hypot(px - d.x, py - d.y) < (d.min || 55)) { clash = true; break; }
    if (clash) continue;
    return { x: px, y: py };
  }
  return null;
}
