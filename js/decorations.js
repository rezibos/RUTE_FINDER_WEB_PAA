/* ═══════════════════════════════════════════════
   decorations.js — Fungsi SVG elemen dekorasi peta
                    (pohon, bangunan, alam, dsb)
   ═══════════════════════════════════════════════ */

// ── Pohon & Tanaman ────────────────────────────

function svgOak(x, y, sc) {
  sc = sc || 1;
  return `<g class="deco-active" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(2)})">
    <rect x="-3.5" y="5" width="7" height="16" fill="#6d4c41"/>
    <circle cx="0" cy="-7" r="18" fill="#2e7d32" opacity="0.92"/>
    <circle cx="-10" cy="-2" r="12" fill="#388e3c" opacity="0.82"/>
    <circle cx="10" cy="-2" r="12" fill="#388e3c" opacity="0.82"/>
    <circle cx="0" cy="-16" r="10" fill="#43a047" opacity="0.88"/>
  </g>`;
}

function svgPine(x, y, sc) {
  sc = sc || 1;
  return `<g class="deco-active" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(2)})">
    <rect x="-3" y="14" width="6" height="12" fill="#6d4c41"/>
    <polygon points="0,-32 -13,2 13,2" fill="#1b5e20"/>
    <polygon points="0,-23 -16,8 16,8" fill="#2e7d32"/>
    <polygon points="0,-14 -18,16 18,16" fill="#388e3c"/>
  </g>`;
}

function svgPalm(x, y, sc) {
  sc = sc || 1;
  return `<g class="deco-active" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(2)})">
    <path d="M0,22 Q4,-12 0,-30" stroke="#8d6e63" stroke-width="4.5" fill="none"/>
    <ellipse cx="-16" cy="-28" rx="16" ry="5.5" fill="#558b2f" transform="rotate(-28,-16,-28)"/>
    <ellipse cx="16" cy="-28" rx="16" ry="5.5" fill="#558b2f" transform="rotate(28,16,-28)"/>
    <ellipse cx="-7" cy="-38" rx="13" ry="4.5" fill="#33691e" transform="rotate(-52,-7,-38)"/>
    <ellipse cx="7" cy="-38" rx="13" ry="4.5" fill="#33691e" transform="rotate(52,7,-38)"/>
    <circle cx="0" cy="-30" r="5" fill="#f9a825"/>
  </g>`;
}

function svgWillow(x, y, sc) {
  sc = sc || 1;
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(2)})">
    <rect x="-3" y="0" width="6" height="20" fill="#795548"/>
    <ellipse cx="0" cy="-9" rx="20" ry="13" fill="#558b2f" opacity="0.85"/>
    <path d="M-18,-3 Q-22,20 -16,28" stroke="#33691e" stroke-width="2.5" fill="none"/>
    <path d="M-9,-8 Q-13,18 -9,26" stroke="#33691e" stroke-width="2" fill="none"/>
    <path d="M0,-12 Q0,20 2,30" stroke="#33691e" stroke-width="2" fill="none"/>
    <path d="M9,-8 Q13,18 9,26" stroke="#33691e" stroke-width="2" fill="none"/>
    <path d="M18,-3 Q22,20 16,28" stroke="#33691e" stroke-width="2.5" fill="none"/>
  </g>`;
}

function svgCherry(x, y, sc) {
  sc = sc || 1;
  return `<g class="deco-active" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(2)})">
    <rect x="-3" y="2" width="6" height="16" fill="#795548"/>
    <circle cx="0" cy="-11" r="16" fill="#f48fb1" opacity="0.87"/>
    <circle cx="-10" cy="-6" r="10" fill="#f06292" opacity="0.78"/>
    <circle cx="10" cy="-6" r="10" fill="#f06292" opacity="0.78"/>
    <circle cx="0" cy="-22" r="9" fill="#fce4ec" opacity="0.9"/>
  </g>`;
}

function svgBamboo(x, y, sc) {
  sc = sc || 1;
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(2)})">
    <rect x="-2" y="-40" width="4" height="60" fill="#558b2f" rx="2"/>
    <line x1="-2" y1="-30" x2="-2" y2="-25" stroke="#388e3c" stroke-width="1.5"/>
    <line x1="-2" y1="-15" x2="-2" y2="-10" stroke="#388e3c" stroke-width="1.5"/>
    <line x1="-2" y1="0" x2="-2" y2="5" stroke="#388e3c" stroke-width="1.5"/>
    <ellipse cx="-10" cy="-32" rx="10" ry="4" fill="#7cb342" transform="rotate(-20,-10,-32)"/>
    <ellipse cx="-10" cy="-17" rx="9" ry="3.5" fill="#7cb342" transform="rotate(-15,-10,-17)"/>
  </g>`;
}

function svgBush(x, y, sc) {
  sc = sc || 1;
  return `<g class="deco-active" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(2)})">
    <circle cx="0" cy="0" r="11" fill="#558b2f" opacity="0.9"/>
    <circle cx="-9" cy="2" r="8" fill="#689f38" opacity="0.85"/>
    <circle cx="9" cy="2" r="8" fill="#689f38" opacity="0.85"/>
    <circle cx="0" cy="-7" r="7" fill="#7cb342" opacity="0.82"/>
  </g>`;
}

function svgFlowers(x, y) {
  const fc = ['#e91e63','#ff9800','#9c27b0','#ffeb3b','#f44336','#00bcd4','#ff5722'];
  let s = '';
  for (let i = 0; i < 6; i++) {
    const fx = x + rnd(-16, 16), fy = y + rnd(-10, 10), col = fc[ri(0, fc.length - 1)];
    s += `<circle cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" r="4.5" fill="${col}" opacity="0.95"/>`;
    s += `<line x1="${fx.toFixed(1)}" y1="${fy.toFixed(1)}" x2="${fx.toFixed(1)}" y2="${(fy+10).toFixed(1)}" stroke="#388e3c" stroke-width="1.5"/>`;
  }
  return s;
}

// ── Air / Danau ────────────────────────────────

function svgLake(cx, cy, rx, ry) {
  return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx}" ry="${ry}" fill="#1e88e5" opacity="0.68" stroke="#1565c0" stroke-width="2.5"/>
  <ellipse cx="${(cx-rx*0.2).toFixed(1)}" cy="${(cy-ry*0.2).toFixed(1)}" rx="${(rx*0.5).toFixed(1)}" ry="${(ry*0.32).toFixed(1)}" fill="#64b5f6" opacity="0.5"/>
  <ellipse cx="${(cx+rx*0.1).toFixed(1)}" cy="${(cy+ry*0.15).toFixed(1)}" rx="${(rx*0.25).toFixed(1)}" ry="${(ry*0.15).toFixed(1)}" fill="#90caf9" opacity="0.4"/>`;
}

function svgPond(cx, cy, r) {
  return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${r}" ry="${(r*0.65).toFixed(1)}" fill="#29b6f6" opacity="0.70" stroke="#0277bd" stroke-width="2"/>
  <ellipse cx="${(cx-r*0.18).toFixed(1)}" cy="${(cy-r*0.15).toFixed(1)}" rx="${(r*0.42).toFixed(1)}" ry="${(r*0.27).toFixed(1)}" fill="#4fc3f7" opacity="0.45"/>
  <ellipse cx="${(cx+r*0.1).toFixed(1)}" cy="${(cy+r*0.12).toFixed(1)}" rx="${(r*0.18).toFixed(1)}" ry="${(r*0.12).toFixed(1)}" fill="#b3e5fc" opacity="0.5"/>`;
}

function svgPool(cx, cy) {
  const rx = 42, ry = 22;
  let s = `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx}" ry="${ry}" fill="#1976d2" stroke="#0d47a1" stroke-width="2.5" opacity="0.85"/>`;
  s += `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${(rx-5).toFixed(1)}" ry="${(ry-4).toFixed(1)}" fill="none" stroke="#64b5f6" stroke-width="1" opacity="0.6"/>`;
  for (let i = -1; i <= 1; i++) {
    const ly = cy + i * (ry * 0.45);
    const halfLen = Math.sqrt(Math.max(0, rx*rx*(1-(i*ry*0.45)*(i*ry*0.45)/(ry*ry)))) * 0.85;
    s += `<line x1="${(cx-halfLen).toFixed(1)}" y1="${ly.toFixed(1)}" x2="${(cx+halfLen).toFixed(1)}" y2="${ly.toFixed(1)}" stroke="#90caf9" stroke-width="1.2" opacity="0.7"/>`;
  }
  s += `<ellipse cx="${(cx-rx*0.3).toFixed(1)}" cy="${(cy-ry*0.35).toFixed(1)}" rx="${(rx*0.28).toFixed(1)}" ry="${(ry*0.22).toFixed(1)}" fill="#e3f2fd" opacity="0.35"/>`;
  return s;
}

function svgFountain(cx, cy) {
  return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="24" fill="#29b6f6" stroke="#0288d1" stroke-width="2.5" opacity="0.72"/>
  <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="10" fill="#b3e5fc" stroke="#0288d1" stroke-width="2"/>
  <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${(cy-26).toFixed(1)}" stroke="#29b6f6" stroke-width="3"/>
  <circle cx="${cx.toFixed(1)}" cy="${(cy-28).toFixed(1)}" r="5" fill="#64b5f6" opacity="0.75"/>`;
}

// ── Pertanian ──────────────────────────────────

function svgRiceField(cx, cy, w, h) {
  w = w || 90; h = h || 60;
  let s = `<rect x="${(cx-w/2).toFixed(1)}" y="${(cy-h/2).toFixed(1)}" width="${w}" height="${h}" fill="#a5d6a7" stroke="#66bb6a" stroke-width="1.5" opacity="0.82"/>`;
  const rows = Math.floor(h / 12), cols = Math.floor(w / 14);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const px = cx - w/2 + 8 + c*14, py = cy - h/2 + 7 + r*12;
    s += `<line x1="${px.toFixed(1)}" y1="${(py+4).toFixed(1)}" x2="${px.toFixed(1)}" y2="${(py-4).toFixed(1)}" stroke="#2e7d32" stroke-width="2" stroke-linecap="round"/>`;
    s += `<ellipse cx="${px.toFixed(1)}" cy="${(py-5).toFixed(1)}" rx="3" ry="2" fill="#558b2f" opacity="0.85"/>`;
  }
  return s;
}

function svgFarm(cx, cy, sc) {
  sc = sc || 1;
  const cols = ['#c8b560','#d4a843','#e8c96a'], col = cols[ri(0,cols.length-1)];
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)}) scale(${sc.toFixed(2)})">
    <rect x="-40" y="-20" width="80" height="40" fill="${col}" stroke="#8d7a2a" stroke-width="1.5" opacity="0.88"/>
    <line x1="-40" y1="-7" x2="40" y2="-7" stroke="#8d7a2a" stroke-width="1" opacity="0.5"/>
    <line x1="-40" y1="7" x2="40" y2="7" stroke="#8d7a2a" stroke-width="1" opacity="0.5"/>
    <line x1="-13" y1="-20" x2="-13" y2="20" stroke="#8d7a2a" stroke-width="1" opacity="0.5"/>
    <line x1="13" y1="-20" x2="13" y2="20" stroke="#8d7a2a" stroke-width="1" opacity="0.5"/>
    <rect x="-26" y="-30" width="18" height="22" fill="#b5651d" stroke="#6d4c41" stroke-width="1.5" rx="1"/>
    <polygon points="-17,-38 -34,-8 0,-8" fill="#8d3b1b"/>
  </g>`;
}

function svgWindmill(cx, cy, sc) {
  sc = sc || 1;
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)}) scale(${sc.toFixed(2)})">
    <rect x="-5" y="-10" width="10" height="50" fill="#b0bec5" stroke="#607d8b" stroke-width="1.5"/>
    <circle cx="0" cy="-10" r="5" fill="#90a4ae"/>
    <line x1="0" y1="-10" x2="0" y2="-42" stroke="#78909c" stroke-width="4" stroke-linecap="round"/>
    <line x1="0" y1="-10" x2="28" y2="4" stroke="#78909c" stroke-width="4" stroke-linecap="round"/>
    <line x1="0" y1="-10" x2="-28" y2="4" stroke="#78909c" stroke-width="4" stroke-linecap="round"/>
  </g>`;
}

function svgBarn(cx, cy, sc) {
  sc = sc || 1;
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)}) scale(${sc.toFixed(2)})">
    <rect x="-32" y="-14" width="64" height="38" fill="#c62828" stroke="#6d1e1e" stroke-width="2"/>
    <polygon points="0,-40 -36,-14 36,-14" fill="#b71c1c" stroke="#6d1e1e" stroke-width="1.5"/>
    <rect x="-9" y="2" width="18" height="22" fill="#5d4037" rx="2"/>
    <rect x="-27" y="-4" width="12" height="10" fill="#ffe082" rx="1" opacity="0.85"/>
    <rect x="15" y="-4" width="12" height="10" fill="#ffe082" rx="1" opacity="0.85"/>
    <line x1="0" y1="-40" x2="0" y2="-52" stroke="#5d4037" stroke-width="2.5"/>
  </g>`;
}

function svgAnimal(cx, cy, type) {
  if (type === 1) return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})"><ellipse cx="0" cy="0" rx="12" ry="9" fill="#eceff1" stroke="#bdbdbd" stroke-width="1.5"/><circle cx="-10" cy="-5" r="6" fill="#eceff1" stroke="#bdbdbd" stroke-width="1.5"/><line x1="-7" y1="9" x2="-9" y2="17" stroke="#bdbdbd" stroke-width="1.5"/><line x1="0" y1="9" x2="-1" y2="17" stroke="#bdbdbd" stroke-width="1.5"/><line x1="7" y1="9" x2="9" y2="17" stroke="#bdbdbd" stroke-width="1.5"/></g>`;
  if (type === 2) return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})"><ellipse cx="0" cy="2" rx="8" ry="6" fill="#fff8e1" stroke="#bdbdbd" stroke-width="1"/><circle cx="-6" cy="-4" r="4" fill="#fff8e1" stroke="#bdbdbd" stroke-width="1"/><polygon points="-8,-6 -10,-2 -6,-3" fill="#ef9a9a"/><circle cx="-4" cy="-4" r="1" fill="#333"/></g>`;
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})"><ellipse cx="0" cy="0" rx="14" ry="9" fill="#8d6e63" stroke="#5d4037" stroke-width="1.5"/><circle cx="-12" cy="-5" r="7" fill="#8d6e63" stroke="#5d4037" stroke-width="1.5"/><line x1="-8" y1="8" x2="-10" y2="18" stroke="#5d4037" stroke-width="2"/><line x1="2" y1="8" x2="1" y2="18" stroke="#5d4037" stroke-width="2"/><line x1="10" y1="8" x2="12" y2="18" stroke="#5d4037" stroke-width="2"/><line x1="-12" y1="-14" x2="-10" y2="-22" stroke="#5d4037" stroke-width="2"/><line x1="-8" y1="-14" x2="-6" y2="-22" stroke="#5d4037" stroke-width="2"/></g>`;
}

// ── Bangunan Kota ──────────────────────────────

function svgHouse(cx, cy, sc) {
  sc = sc || 1;
  const cols = ['#ef9a9a','#ffe082','#a5d6a7','#90caf9','#ce93d8','#ffcc80','#f48fb1','#80cbc4'];
  const col = cols[ri(0, cols.length-1)];
  return `<g class="deco-active" transform="translate(${cx.toFixed(1)},${cy.toFixed(1)}) scale(${sc.toFixed(2)})">
    <rect x="-18" y="0" width="36" height="25" fill="${col}" stroke="#555" stroke-width="1.5"/>
    <polygon points="0,-16 -22,0 22,0" fill="#c62828" stroke="#555" stroke-width="1.2"/>
    <rect x="-6" y="9" width="12" height="16" fill="#8d6e63" rx="1.5"/>
    <rect x="-16" y="3" width="9" height="8" fill="#b3e5fc" stroke="#555" stroke-width="1" rx="1"/>
    <rect x="7" y="3" width="9" height="8" fill="#b3e5fc" stroke="#555" stroke-width="1" rx="1"/>
  </g>`;
}

function svgOffice(cx, cy, w, h) {
  const BCOLS = ['#90a4ae','#78909c','#b0bec5','#607d8b','#546e7a'];
  const col = BCOLS[ri(0, BCOLS.length-1)];
  let s = `<rect x="${(cx-w/2).toFixed(1)}" y="${(cy-h).toFixed(1)}" width="${w}" height="${h}" fill="${col}" stroke="#444" stroke-width="1.5" rx="3"/>`;
  const rows = Math.floor(h / 15);
  for (let r = 0; r < rows; r++) {
    const wy = cy - h + 7 + r * 14;
    for (let c = 0; c < 3; c++) {
      const wx = cx - w/2 + 5 + c * (w-10) / 2.5;
      const lit = Math.random() > 0.28;
      s += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="${((w-10)/3.5).toFixed(1)}" height="9" fill="${lit ? '#fff9c4' : '#37474f'}" opacity="0.88" rx="1.5"/>`;
    }
  }
  return s;
}

function svgApartment(cx, cy, floors) {
  floors = floors || ri(4, 8);
  const h = floors * 12 + 14, w = ri(36, 52);
  const cols = ['#90a4ae','#a5d6a7','#ffe082','#ef9a9a','#ce93d8','#80cbc4'];
  const col = cols[ri(0, cols.length-1)];
  let s = `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">`;
  s += `<rect x="${-w/2}" y="${-h}" width="${w}" height="${h}" fill="${col}" stroke="#546e7a" stroke-width="1.5" rx="2"/>`;
  for (let f = 0; f < floors; f++) {
    const fy = -h + 6 + f * 12;
    for (let c = 0; c < 3; c++) {
      const wx = -w/2 + 5 + c * (w-10) / 2.5;
      s += `<rect x="${wx.toFixed(1)}" y="${fy.toFixed(1)}" width="${((w-10)/3.5).toFixed(1)}" height="8" fill="${Math.random()>0.35?'#fff9c4':'#37474f'}" opacity="0.9" rx="1"/>`;
    }
  }
  s += `<rect x="-8" y="-4" width="16" height="4" fill="#5d4037" rx="1"/></g>`;
  return s;
}

function svgShop(cx, cy, sc) {
  sc = sc || 1;
  const scols = ['#ff8a65','#4db6ac','#7986cb','#aed581','#f06292','#ffb300'];
  const col = scols[ri(0, scols.length-1)];
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)}) scale(${sc.toFixed(2)})">
    <rect x="-20" y="-12" width="40" height="30" fill="${col}" stroke="#444" stroke-width="1.5" rx="3"/>
    <rect x="-20" y="-12" width="40" height="11" fill="#37474f" rx="2"/>
    <rect x="-11" y="5" width="22" height="13" fill="#b3e5fc" rx="1.5"/>
    <rect x="-1" y="5" width="2" height="13" fill="#546e7a"/>
  </g>`;
}

function svgChurch(cx, cy) {
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <rect x="-20" y="-10" width="40" height="34" fill="#eceff1" stroke="#546e7a" stroke-width="1.5"/>
    <polygon points="0,-34 -22,-10 22,-10" fill="#cfd8dc" stroke="#546e7a" stroke-width="1.2"/>
    <rect x="-4" y="-48" width="8" height="16" fill="#546e7a"/>
    <line x1="-7" y1="-42" x2="7" y2="-42" stroke="#546e7a" stroke-width="2.5"/>
    <rect x="-7" y="6" width="14" height="18" fill="#8d6e63" rx="3"/>
    <rect x="-16" y="-7" width="11" height="10" fill="#b3e5fc" stroke="#546e7a" stroke-width="1" rx="1"/>
    <rect x="5" y="-7" width="11" height="10" fill="#b3e5fc" stroke="#546e7a" stroke-width="1" rx="1"/>
  </g>`;
}

function svgMosque(cx, cy) {
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <rect x="-22" y="-6" width="44" height="30" fill="#e8f5e9" stroke="#388e3c" stroke-width="1.5"/>
    <ellipse cx="0" cy="-6" rx="18" ry="12" fill="#a5d6a7" stroke="#388e3c" stroke-width="1.5"/>
    <rect x="-3" y="-38" width="6" height="34" fill="#388e3c"/>
    <ellipse cx="0" cy="-40" rx="5" ry="6" fill="#43a047"/>
    <rect x="-16" y="-52" width="4" height="20" fill="#4caf50"/>
    <rect x="12" y="-52" width="4" height="20" fill="#4caf50"/>
  </g>`;
}

function svgSchool(cx, cy) {
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <rect x="-36" y="-18" width="72" height="42" fill="#fff9c4" stroke="#f9a825" stroke-width="2"/>
    <rect x="-36" y="-18" width="72" height="14" fill="#f9a825"/>
    <text x="0" y="-8" font-size="9" font-weight="bold" fill="white" text-anchor="middle">SCHOOL</text>
    <rect x="-9" y="5" width="18" height="19" fill="#a5d6a7" rx="1.5"/>
    <rect x="-30" y="-3" width="13" height="11" fill="#b3e5fc" stroke="#f9a825" stroke-width="1" rx="1"/>
    <rect x="17" y="-3" width="13" height="11" fill="#b3e5fc" stroke="#f9a825" stroke-width="1" rx="1"/>
  </g>`;
}

function svgHospital(cx, cy) {
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <rect x="-28" y="-16" width="56" height="40" fill="#e3f2fd" stroke="#1565c0" stroke-width="2"/>
    <rect x="-28" y="-16" width="56" height="13" fill="#1565c0" rx="1"/>
    <text x="0" y="-6" font-size="8" font-weight="bold" fill="white" text-anchor="middle">HOSPITAL</text>
    <rect x="-6" y="-5" width="3" height="16" fill="#e53935"/>
    <rect x="-11" y="0" width="13" height="3" fill="#e53935"/>
    <rect x="-10" y="8" width="20" height="16" fill="#90caf9" rx="1"/>
  </g>`;
}

function svgPoliceStation(cx, cy) {
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <rect x="-28" y="-18" width="56" height="42" fill="#e3f2fd" stroke="#1565c0" stroke-width="2"/>
    <rect x="-28" y="-18" width="56" height="13" fill="#1565c0"/>
    <text x="0" y="-7" font-size="7" font-weight="bold" fill="white" text-anchor="middle">POLISI</text>
    <rect x="-8" y="6" width="16" height="18" fill="#90caf9" rx="1"/>
    <rect x="-24" y="-4" width="12" height="10" fill="#bbdefb" rx="1"/>
    <rect x="12" y="-4" width="12" height="10" fill="#bbdefb" rx="1"/>
    <rect x="-1" y="-30" width="2" height="14" fill="#1565c0"/>
    <rect x="-5" y="-30" width="12" height="4" fill="#e53935" opacity="0.85"/>
  </g>`;
}

function svgFireStation(cx, cy) {
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <rect x="-30" y="-18" width="60" height="42" fill="#ffcdd2" stroke="#c62828" stroke-width="2"/>
    <rect x="-30" y="-18" width="60" height="13" fill="#c62828"/>
    <text x="0" y="-7" font-size="7" font-weight="bold" fill="white" text-anchor="middle">PEMADAM</text>
    <rect x="-26" y="2" width="22" height="22" fill="#ef9a9a" stroke="#c62828" stroke-width="1" rx="2"/>
    <rect x="4" y="2" width="22" height="22" fill="#ef9a9a" stroke="#c62828" stroke-width="1" rx="2"/>
    <rect x="-3" y="-30" width="6" height="14" fill="#c62828"/>
    <line x1="-6" y1="-23" x2="6" y2="-23" stroke="#c62828" stroke-width="2"/>
  </g>`;
}

function svgHotel(cx, cy) {
  const windows = [[-18,-30],[-6,-30],[6,-30],[18,-30],[-18,-16],[-6,-16],[6,-16],[18,-16],[-18,-2],[-6,-2],[6,-2],[18,-2]];
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <rect x="-26" y="-50" width="52" height="74" fill="#78909c" stroke="#455a64" stroke-width="1.5" rx="2"/>
    <rect x="-26" y="-50" width="52" height="14" fill="#455a64" rx="1"/>
    <text x="0" y="-39" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">HOTEL</text>
    ${windows.map(([wx,wy]) => `<rect x="${wx-5}" y="${wy}" width="9" height="9" fill="${Math.random()>0.3?'#fff9c4':'#37474f'}" rx="1" opacity="0.88"/>`).join('')}
    <rect x="-9" y="14" width="18" height="10" fill="#6d4c41" rx="1"/>
  </g>`;
}

function svgMarket(cx, cy) {
  const awningCols = ['#e53935','#1e88e5','#f9a825','#43a047'];
  let s = `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">`;
  s += `<rect x="-50" y="-18" width="100" height="36" fill="#fff9c4" stroke="#f9a825" stroke-width="2" rx="3"/>`;
  const stalls = [[-36,-18],[-12,-18],[12,-18],[36,-18]];
  for (let i = 0; i < stalls.length; i++) {
    const [sx] = stalls[i], col = awningCols[i % awningCols.length];
    s += `<polygon points="${sx-10},-18 ${sx+10},-18 ${sx+14},-4 ${sx-14},-4" fill="${col}" opacity="0.85"/>`;
  }
  s += `<rect x="-8" y="8" width="16" height="10" fill="#8d6e63" rx="1"/></g>`;
  return s;
}

function svgGasStation(cx, cy) {
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <rect x="-26" y="-18" width="52" height="36" fill="#fff9c4" stroke="#f57f17" stroke-width="2" rx="3"/>
    <rect x="-26" y="-18" width="52" height="11" fill="#f57f17" rx="2"/>
    <rect x="-15" y="0" width="13" height="18" fill="#ff8f00" rx="2"/>
    <text x="0" y="-9" font-size="8" font-weight="bold" fill="white" text-anchor="middle">GAS</text>
  </g>`;
}

function svgParking(cx, cy) {
  return `<rect x="${(cx-22).toFixed(1)}" y="${(cy-18).toFixed(1)}" width="44" height="36" fill="#eceff1" stroke="#90a4ae" stroke-width="1.5" rx="4"/>
  <text x="${cx.toFixed(1)}" y="${(cy+8).toFixed(1)}" font-size="26" font-weight="bold" fill="#1565c0" text-anchor="middle">P</text>`;
}

function svgFactory(cx, cy) {
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <rect x="-30" y="-12" width="60" height="36" fill="#b0bec5" stroke="#546e7a" stroke-width="1.5"/>
    <rect x="-26" y="-32" width="11" height="22" fill="#90a4ae" stroke="#546e7a" stroke-width="1"/>
    <rect x="-7" y="-25" width="11" height="15" fill="#90a4ae" stroke="#546e7a" stroke-width="1"/>
    <rect x="13" y="-34" width="11" height="24" fill="#90a4ae" stroke="#546e7a" stroke-width="1"/>
    <ellipse cx="-20" cy="-34" rx="5.5" ry="3" fill="#e0e0e0" opacity="0.65"/>
    <ellipse cx="-1" cy="-27" rx="5.5" ry="3" fill="#e0e0e0" opacity="0.65"/>
    <ellipse cx="18" cy="-36" rx="5.5" ry="3" fill="#e0e0e0" opacity="0.65"/>
  </g>`;
}

function svgTrainStation(cx, cy) {
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <rect x="-44" y="-22" width="88" height="50" fill="#eceff1" stroke="#546e7a" stroke-width="2" rx="3"/>
    <polygon points="-44,-22 0,-52 44,-22" fill="#cfd8dc" stroke="#546e7a" stroke-width="1.5"/>
    <text x="0" y="-30" font-size="7" font-weight="bold" fill="#37474f" text-anchor="middle">STASIUN</text>
    <rect x="-38" y="-12" width="14" height="14" fill="#b3e5fc" stroke="#546e7a" stroke-width="1" rx="1"/>
    <rect x="-12" y="-12" width="14" height="14" fill="#b3e5fc" stroke="#546e7a" stroke-width="1" rx="1"/>
    <rect x="14" y="-12" width="14" height="14" fill="#b3e5fc" stroke="#546e7a" stroke-width="1" rx="1"/>
    <rect x="-14" y="8" width="28" height="20" fill="#8d6e63" rx="2"/>
    <line x1="-44" y1="28" x2="44" y2="28" stroke="#546e7a" stroke-width="4" stroke-linecap="round"/>
    <line x1="-44" y1="34" x2="44" y2="34" stroke="#546e7a" stroke-width="4" stroke-linecap="round"/>
  </g>`;
}

// ── Infrastruktur ──────────────────────────────

function svgBridge(cx, cy, w) {
  w = w || 70;
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <rect x="${-w/2}" y="-6" width="${w}" height="12" fill="#90a4ae" stroke="#546e7a" stroke-width="2"/>
    <line x1="${-w/2}" y1="-6" x2="${-w/2+10}" y2="-18" stroke="#546e7a" stroke-width="2.5"/>
    <line x1="${w/2}" y1="-6" x2="${w/2-10}" y2="-18" stroke="#546e7a" stroke-width="2.5"/>
    <line x1="${-w/2+10}" y1="-18" x2="${w/2-10}" y2="-18" stroke="#546e7a" stroke-width="2.5"/>
    <line x1="-5" y1="-18" x2="-5" y2="-6" stroke="#546e7a" stroke-width="1.5"/>
    <line x1="5" y1="-18" x2="5" y2="-6" stroke="#546e7a" stroke-width="1.5"/>
  </g>`;
}

function svgSolarPanel(cx, cy) {
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <rect x="-22" y="-14" width="44" height="28" fill="#1565c0" stroke="#0d47a1" stroke-width="1.5" rx="2" opacity="0.88"/>
    <line x1="-22" y1="0" x2="22" y2="0" stroke="#0d47a1" stroke-width="1" opacity="0.6"/>
    <line x1="0" y1="-14" x2="0" y2="14" stroke="#0d47a1" stroke-width="1" opacity="0.6"/>
    <rect x="-21" y="-13" width="20" height="12" fill="#1976d2" opacity="0.6" rx="1"/>
    <rect x="1" y="-13" width="20" height="12" fill="#1976d2" opacity="0.6" rx="1"/>
    <rect x="-21" y="1" width="20" height="12" fill="#1976d2" opacity="0.6" rx="1"/>
    <rect x="1" y="1" width="20" height="12" fill="#1976d2" opacity="0.6" rx="1"/>
    <rect x="-3" y="14" width="6" height="12" fill="#607d8b"/>
  </g>`;
}

function svgWaterTower(cx, cy) {
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <line x1="-16" y1="0" x2="0" y2="-38" stroke="#78909c" stroke-width="3"/>
    <line x1="16" y1="0" x2="0" y2="-38" stroke="#78909c" stroke-width="3"/>
    <line x1="-16" y1="0" x2="16" y2="0" stroke="#78909c" stroke-width="2"/>
    <line x1="-10" y1="-19" x2="10" y2="-19" stroke="#78909c" stroke-width="1.5"/>
    <ellipse cx="0" cy="-44" rx="18" ry="10" fill="#90a4ae" stroke="#607d8b" stroke-width="2"/>
    <rect x="-16" y="-44" width="32" height="14" fill="#90a4ae" stroke="#607d8b" stroke-width="2"/>
    <ellipse cx="0" cy="-30" rx="18" ry="10" fill="#b0bec5" stroke="#607d8b" stroke-width="2"/>
  </g>`;
}

// ── Rekreasi ───────────────────────────────────

function svgPark(cx, cy, r) {
  return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="#a5d6a7" stroke="#4caf50" stroke-width="2.5" opacity="0.68"/>
  <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(r*0.42).toFixed(1)}" fill="#c8e6c9" opacity="0.55"/>`;
}

function svgSoccerField(cx, cy) {
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <rect x="-55" y="-35" width="110" height="70" fill="#4caf50" stroke="#388e3c" stroke-width="2" opacity="0.85"/>
    <ellipse cx="0" cy="0" rx="18" ry="18" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
    <line x1="0" y1="-35" x2="0" y2="35" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
    <rect x="-55" y="-16" width="16" height="32" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
    <rect x="39" y="-16" width="16" height="32" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
    <circle cx="0" cy="0" r="3" fill="#fff" opacity="0.8"/>
  </g>`;
}

function svgBasketballCourt(cx, cy) {
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <rect x="-40" y="-28" width="80" height="56" fill="#e8a847" stroke="#c47d20" stroke-width="2" opacity="0.9"/>
    <ellipse cx="0" cy="0" rx="14" ry="14" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.75"/>
    <rect x="-18" y="-28" width="36" height="18" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.75"/>
    <rect x="-18" y="10" width="36" height="18" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.75"/>
    <line x1="-40" y1="0" x2="40" y2="0" stroke="#fff" stroke-width="1.5" opacity="0.75"/>
    <circle cx="-40" cy="0" r="5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.75"/>
    <circle cx="40" cy="0" r="5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.75"/>
  </g>`;
}

function svgPlayground(cx, cy) {
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <rect x="-32" y="-22" width="64" height="44" fill="#ffe0b2" stroke="#ff9800" stroke-width="1.5" rx="4" opacity="0.82"/>
    <rect x="-28" y="-5" width="6" height="16" fill="#e53935" rx="1"/>
    <rect x="-28" y="-15" width="6" height="12" fill="#e53935" rx="1" transform="rotate(-15,-25,-9)"/>
    <line x1="-14" y1="-18" x2="-14" y2="10" stroke="#1565c0" stroke-width="3" stroke-linecap="round"/>
    <line x1="6" y1="-18" x2="6" y2="10" stroke="#1565c0" stroke-width="3" stroke-linecap="round"/>
    <line x1="-14" y1="-18" x2="6" y2="-18" stroke="#1565c0" stroke-width="2.5"/>
    <rect x="-10" y="-12" width="16" height="3" fill="#ffd740" rx="1"/>
    <rect x="-10" y="-4" width="16" height="3" fill="#ffd740" rx="1"/>
    <circle cx="22" cy="5" r="12" fill="none" stroke="#43a047" stroke-width="3" opacity="0.8"/>
  </g>`;
}

// ── Misc ───────────────────────────────────────

function svgStreetLamp(cx, cy) {
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <rect x="-2" y="-28" width="4" height="32" fill="#607d8b" rx="1"/>
    <path d="M0,-28 Q12,-28 12,-18" stroke="#607d8b" stroke-width="3" fill="none"/>
    <circle cx="12" cy="-18" r="5" fill="#fff9c4" opacity="0.9"/>
  </g>`;
}

function svgBillboard(cx, cy) {
  const msgs = ['SALE!','BUKA!','DISKON','OPEN','TOKO'];
  const cols = ['#e53935','#1e88e5','#f9a825','#43a047','#8e24aa'];
  const i = ri(0, msgs.length-1);
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <rect x="-2" y="-2" width="4" height="38" fill="#607d8b"/>
    <rect x="-26" y="-38" width="52" height="28" fill="${cols[i]}" stroke="#333" stroke-width="1.5" rx="3"/>
    <text x="0" y="-18" font-size="11" font-weight="bold" fill="white" text-anchor="middle">${msgs[i]}</text>
  </g>`;
}

function svgCemetery(cx, cy, sc) {
  sc = sc || 1;
  let s = `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)}) scale(${sc.toFixed(2)})">`;
  s += `<rect x="-36" y="-28" width="72" height="56" fill="#c8d8b8" stroke="#6b7c6b" stroke-width="2" rx="2" opacity="0.85"/>`;
  const graves = [[-20,-12],[0,-12],[20,-12],[-10,8],[10,8]];
  for (const [gx,gy] of graves) {
    s += `<rect x="${gx-2}" y="${gy-12}" width="4" height="15" fill="#8d8d8d" rx="1"/>`;
    s += `<rect x="${gx-7}" y="${gy-10}" width="14" height="3" fill="#8d8d8d" rx="1"/>`;
    s += `<rect x="${gx-9}" y="${gy+3}" width="18" height="4" fill="#5a7a5a" rx="1" opacity="0.7"/>`;
  }
  s += `<rect x="-6" y="20" width="12" height="8" fill="#7c6e52" stroke="#555" stroke-width="1" rx="1"/>`;
  s += `</g>`;
  return s;
}

function svgCampfire(cx, cy) {
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <ellipse cx="0" cy="6" rx="10" ry="4" fill="#5d4037" opacity="0.7"/>
    <line x1="-7" y1="6" x2="0" y2="-10" stroke="#6d4c41" stroke-width="3" stroke-linecap="round"/>
    <line x1="7" y1="6" x2="0" y2="-10" stroke="#6d4c41" stroke-width="3" stroke-linecap="round"/>
    <line x1="-4" y1="6" x2="4" y2="-8" stroke="#6d4c41" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="0" cy="2" rx="6" ry="5" fill="#ff6f00" opacity="0.9"/>
    <ellipse cx="-2" cy="-2" rx="4" ry="5" fill="#ffb300" opacity="0.85"/>
    <ellipse cx="1" cy="-1" rx="3" ry="4" fill="#fff176" opacity="0.8"/>
  </g>`;
}

function svgTent(cx, cy, sc) {
  sc = sc || 1;
  const cols = ['#e53935','#1e88e5','#43a047','#fb8c00','#8e24aa'];
  const col = cols[ri(0, cols.length-1)];
  return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)}) scale(${sc.toFixed(2)})">
    <polygon points="0,-28 -24,10 24,10" fill="${col}" stroke="#333" stroke-width="1.5"/>
    <polygon points="0,-28 -6,10 6,10" fill="rgba(0,0,0,0.15)"/>
    <rect x="-5" y="10" width="10" height="4" fill="#555"/>
  </g>`;
}
