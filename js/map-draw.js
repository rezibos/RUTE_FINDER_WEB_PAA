/* ═══════════════════════════════════════════════
   map-draw.js — Render peta, terrain, dekorasi,
                 jalan, label bobot, dan node
   ═══════════════════════════════════════════════ */

// ── Terrain ────────────────────────────────────
function drawTerrain() {
  const layer = document.getElementById('terrain-layer');
  let h = '';
  const gCols = ['#6aab4a','#72b550','#5ea03a','#7dba58','#65a845'];
  for (let i = 0; i < 22; i++) {
    const gx = rnd(0,W), gy = rnd(0,H), gr = rnd(90,280);
    h += `<ellipse cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" rx="${gr.toFixed(1)}" ry="${(gr*rnd(0.45,1.3)).toFixed(1)}" fill="${gCols[ri(0,gCols.length-1)]}" opacity="0.45"/>`;
  }
  for (let i = 0; i < 8; i++) {
    const dx = rnd(100,W-100), dy = rnd(100,H-100);
    h += `<ellipse cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" rx="${rnd(60,150).toFixed(1)}" ry="${rnd(40,100).toFixed(1)}" fill="#c8a96e" opacity="0.25"/>`;
  }
  layer.innerHTML = h;
}

// ── City overlay (bangunan per node) ──────────
function buildCityOverlay(name) {
  const p = positions[name];
  const degree = (originalGraph[name] || []).length;
  let h = '';
  const placedBuildings = [];

  function tooCloseToPlaced(x, y, min) {
    min = min || 52;
    for (const b of placedBuildings) if (Math.hypot(x-b.x, y-b.y) < (b.min||min)) return true;
    for (const g of placedDecorations) if (Math.hypot(x-g.x, y-g.y) < (g.min||min)) return true;
    return false;
  }

  const ROAD_CLR = 75;

  const PR = degree >= 4 ? 150 : degree >= 2 ? 100 : 68;
  h += svgPark(p.x, p.y, PR);

  function tryPlace(fn, searchR, roadClear, minSep, attempts) {
    roadClear = roadClear || ROAD_CLR; minSep = minSep || 65; attempts = attempts || 10;
    for (let t = 0; t < attempts; t++) {
      const pos = safePlaceNear(p.x, p.y, searchR, roadClear, 0, 50);
      if (!pos) continue;
      if (tooCloseToPlaced(pos.x, pos.y, minSep)) continue;
      h += fn(pos.x, pos.y);
      const rec = { x: pos.x, y: pos.y, min: minSep };
      placedBuildings.push(rec); placedDecorations.push(rec);
      return true;
    }
    return false;
  }
  function tryPlaceSc(fn, searchR, sc, roadClear, minSep, attempts) {
    roadClear = roadClear || ROAD_CLR; minSep = minSep || 65; attempts = attempts || 10;
    for (let t = 0; t < attempts; t++) {
      const pos = safePlaceNear(p.x, p.y, searchR, roadClear, 0, 50);
      if (!pos) continue;
      if (tooCloseToPlaced(pos.x, pos.y, minSep)) continue;
      h += fn(pos.x, pos.y, sc);
      const rec = { x: pos.x, y: pos.y, min: minSep };
      placedBuildings.push(rec); placedDecorations.push(rec);
      return true;
    }
    return false;
  }

  if (degree >= 4) {
    for (let i = 0; i < ri(3,5); i++) {
      const pos = safePlaceNear(p.x, p.y, 140, ROAD_CLR, 0, 80);
      if (pos && !tooCloseToPlaced(pos.x, pos.y, 70)) {
        const bw = ri(22,36), bh = ri(50,100); h += svgOffice(pos.x, pos.y, bw, bh);
        const rec = { x: pos.x, y: pos.y, min: 70 }; placedBuildings.push(rec); placedDecorations.push(rec);
      }
    }
    tryPlace((x,y) => svgChurch(x,y), 130, ROAD_CLR, 75);
    tryPlace((x,y) => svgSchool(x,y), 150, ROAD_CLR, 85);
    tryPlace((x,y) => svgHospital(x,y), 150, ROAD_CLR, 85);
    tryPlace((x,y) => svgMosque(x,y), 160, ROAD_CLR, 75);
    tryPlaceSc((x,y,s) => svgShop(x,y,s), 120, 1, ROAD_CLR, 60);
    tryPlace((x,y) => svgParking(x,y), 140, ROAD_CLR, 65);
    tryPlace((x,y) => svgCemetery(x,y,1.0), 190, ROAD_CLR, 90);
    tryPlace((x,y) => svgHotel(x,y), 160, ROAD_CLR, 80);
    tryPlace((x,y) => svgPoliceStation(x,y), 150, ROAD_CLR, 80);
    tryPlace((x,y) => svgFireStation(x,y), 160, ROAD_CLR, 80);
    tryPlace((x,y) => svgMarket(x,y), 140, ROAD_CLR, 80);
    tryPlace((x,y) => svgApartment(x,y,ri(4,8)), 170, ROAD_CLR, 75);
    tryPlace((x,y) => svgApartment(x,y,ri(3,6)), 180, ROAD_CLR, 75);
    tryPlace((x,y) => svgPlayground(x,y), 130, ROAD_CLR, 70);
    for (let i = 0; i < ri(5,8); i++) tryPlace((x,y) => svgHouse(x,y,rnd(0.7,1.0)), 200, ROAD_CLR, 60, 80);
    tryPlace((x,y) => svgBush(x,y,rnd(0.9,1.2)), 100, ROAD_CLR, 55);
  } else if (degree >= 2) {
    for (let i = 0; i < ri(3,5); i++) tryPlace((x,y) => svgOffice(x,y,ri(18,28),ri(28,60)), 110, ROAD_CLR, 90, 80);
    for (let i = 0; i < ri(4,7); i++) tryPlace((x,y) => svgHouse(x,y,rnd(0.6,0.9)), 130, ROAD_CLR, 60, 80);
    tryPlaceSc((x,y,s) => svgShop(x,y,s), 110, 0.9, ROAD_CLR, 60);
    tryPlace((x,y) => svgChurch(x,y), 110, ROAD_CLR, 70);
    tryPlace((x,y) => svgSchool(x,y), 120, ROAD_CLR, 80);
    if (Math.random() > 0.5) tryPlace((x,y) => svgGasStation(x,y), 85, ROAD_CLR, 65);
    if (Math.random() > 0.6) tryPlace((x,y) => svgCemetery(x,y,0.75), 130, ROAD_CLR, 80);
  } else {
    for (let i = 0; i < ri(2,4); i++) tryPlace((x,y) => svgHouse(x,y,rnd(0.5,0.8)), 80, ROAD_CLR, 55, 80);
    if (Math.random() > 0.5) tryPlace((x,y) => svgGasStation(x,y), 85, ROAD_CLR, 65);
    if (Math.random() > 0.6) tryPlace((x,y) => svgCemetery(x,y,0.75), 130, ROAD_CLR, 80);
  }
  return h;
}

// ── World decorations ──────────────────────────
function drawDecorations(allEdgePts) {
  const decoLayer = document.getElementById('deco-under');
  const cityLayer = document.getElementById('city-overlays');
  let cityH = '', decoH = '';

  _roadPolylines = allEdgePts.map(e => e.pts);
  placedDecorations = [];

  for (const name in positions) cityH += buildCityOverlay(name);
  cityLayer.innerHTML = cityH;

  const ROAD_CLEAR = 100, DECO_MIN_SEP = 55;
  function isClear(x, y, cl) {
    cl = cl || ROAD_CLEAR;
    for (const pts of _roadPolylines) if (pointNearEdge(x, y, pts, cl)) return false;
    for (const name in positions) if (Math.hypot(x-positions[name].x, y-positions[name].y) < 180) return false;
    for (const d of placedDecorations) if (Math.hypot(x-d.x, y-d.y) < (d.min||DECO_MIN_SEP)) return false;
    return true;
  }
  function placeScattered(x, y, fn, sep) {
    sep = sep || DECO_MIN_SEP;
    if (!isClear(x, y, ROAD_CLEAR)) return false;
    decoH += fn(x, y); placedDecorations.push({ x, y, min: sep }); return true;
  }
  function tryRandom(fn, sep, count, margin) {
    margin = margin || 100; sep = sep || DECO_MIN_SEP;
    for (let i = 0; i < count * 8; i++) {
      const x = rnd(margin,W-margin), y = rnd(margin,H-margin);
      if (placeScattered(x, y, fn, sep)) count--;
      if (count <= 0) break;
    }
  }

  // Forests
  const forestSeeds = [{x:200,y:880},{x:700,y:1600},{x:1250,y:260},{x:2200,y:420},{x:2820,y:880},
    {x:1720,y:1830},{x:120,y:1420},{x:2600,y:220},{x:350,y:350},{x:1900,y:1400},
    {x:2400,y:1500},{x:1050,y:1850},{x:3050,y:700},{x:3100,y:1800},{x:600,y:2600},{x:2000,y:2700}];
  for (const fs of forestSeeds) {
    for (let i = 0; i < ri(18,30); i++) {
      const tx = fs.x+rnd(-180,180), ty = fs.y+rnd(-130,130), t = ri(0,5);
      if (t===0) placeScattered(tx, ty, (x,y) => svgOak(x,y,rnd(0.55,1.1)), 48);
      else if (t===1) placeScattered(tx, ty, (x,y) => svgPine(x,y,rnd(0.55,1.0)), 44);
      else if (t===2) placeScattered(tx, ty, (x,y) => svgCherry(x,y,rnd(0.5,0.88)), 44);
      else if (t===3) placeScattered(tx, ty, (x,y) => svgPalm(x,y,rnd(0.5,0.85)), 48);
      else if (t===4) placeScattered(tx, ty, (x,y) => svgBamboo(x,y,rnd(0.55,0.9)), 38);
      else placeScattered(tx, ty, (x,y) => svgWillow(x,y,rnd(0.5,0.85)), 50);
    }
  }

  // Rice fields
  const riceSeeds = [{x:900,y:600},{x:1700,y:1000},{x:2500,y:1300},{x:400,y:1400},{x:3000,y:500},{x:1200,y:2200},{x:2800,y:2200}];
  for (const rs of riceSeeds) {
    const rx2=rs.x+rnd(-60,60), ry2=rs.y+rnd(-40,40), fw=ri(80,130), fh=ri(55,85);
    if (isClear(rx2, ry2, ROAD_CLEAR+fw/2)) {
      decoH += svgRiceField(rx2, ry2, fw, fh);
      placedDecorations.push({ x:rx2, y:ry2, min: Math.max(fw,fh)/2+30 });
    }
  }

  // Farms & barns
  const farmSeeds = [{x:600,y:700},{x:1400,y:1800},{x:2600,y:900},{x:3000,y:1600},{x:200,y:2200},{x:2100,y:2500}];
  for (const fs of farmSeeds) {
    placeScattered(fs.x, fs.y, (x,y) => svgFarm(x,y,rnd(0.85,1.15)), 110);
    placeScattered(fs.x+rnd(100,150), fs.y+rnd(-50,50), (x,y) => svgBarn(x,y,rnd(0.85,1.1)), 100);
    for (let a = 0; a < ri(3,6); a++) {
      const ax=fs.x+rnd(-100,100), ay=fs.y+rnd(-80,80);
      if (isClear(ax,ay,65)) { decoH += svgAnimal(ax,ay,ri(0,2)); placedDecorations.push({x:ax,y:ay,min:30}); }
    }
    placeScattered(fs.x+rnd(-120,120), fs.y+rnd(-90,90), (x,y) => svgWindmill(x,y,rnd(0.8,1.2)), 85);
  }

  // Windmills standalone
  [[800,400],[2200,1200],[1500,2400],[3100,1000]].forEach(([x,y]) => placeScattered(x,y,(cx,cy)=>svgWindmill(cx,cy,rnd(0.9,1.3)),85));

  // Water towers
  [[1100,900],[2400,700],[600,2000],[2900,1900]].forEach(([x,y]) => placeScattered(x,y,(cx,cy)=>svgWaterTower(cx,cy),80));

  // Solar panels
  [[400,900],[1800,300],[2700,1700],[900,2400],[3000,1200]].forEach(([x,y]) => placeScattered(x,y,(cx,cy)=>svgSolarPanel(cx,cy),75));

  // Factories
  [{x:300,y:1100},{x:2700,y:600},{x:1800,y:200},{x:2500,y:1800},{x:450,y:2500},{x:3050,y:400}]
    .forEach(fs => placeScattered(fs.x,fs.y,(x,y)=>svgFactory(x,y),110));

  // Train stations
  [[1000,1500],[2300,500],[700,2300]].forEach(([x,y]) => placeScattered(x,y,(cx,cy)=>svgTrainStation(cx,cy),120));

  // Hotels
  [[1600,400],[900,1200],[2500,1500]].forEach(([x,y]) => placeScattered(x,y,(cx,cy)=>svgHotel(cx,cy),95));

  // Apartments clusters
  [{x:1200,y:800},{x:2000,y:1400},{x:800,y:1700},{x:2700,y:1100}].forEach(ac => {
    for (let i = 0; i < ri(2,4); i++) {
      const ax=ac.x+rnd(-100,100), ay=ac.y+rnd(-80,80);
      placeScattered(ax,ay,(x,y)=>svgApartment(x,y,ri(3,7)),75);
    }
  });

  // Sports
  [[1300,600],[2200,900],[500,1800],[2800,1300]].forEach(([x,y]) => placeScattered(x,y,(cx,cy)=>svgSoccerField(cx,cy),120));
  [[1700,1200],[900,2100],[2100,2200]].forEach(([x,y]) => placeScattered(x,y,(cx,cy)=>svgBasketballCourt(cx,cy),90));

  // Playgrounds
  [[600,1000],[1500,1600],[2400,2000],[1000,2500]].forEach(([x,y]) => placeScattered(x,y,(cx,cy)=>svgPlayground(cx,cy),85));

  // Markets
  [[1100,1300],[2000,600],[700,2100],[2600,1800]].forEach(([x,y]) => placeScattered(x,y,(cx,cy)=>svgMarket(cx,cy),100));

  // Police & fire
  [[1400,1000],[2100,1700],[800,2400]].forEach(([x,y]) => placeScattered(x,y,(cx,cy)=>svgPoliceStation(cx,cy),90));
  [[1700,700],[2700,1400],[400,2100]].forEach(([x,y]) => placeScattered(x,y,(cx,cy)=>svgFireStation(cx,cy),90));

  // Mosques/Churches
  [{x:1000,y:400},{x:2000,y:800},{x:700,y:1300},{x:2200,y:1600},{x:1600,y:2100},{x:3000,y:900}]
    .forEach(cs => placeScattered(cs.x,cs.y,(x,y)=>Math.random()>0.5?svgChurch(x,y):svgMosque(x,y),100));

  // Cemeteries
  [{x:500,y:500},{x:2400,y:300},{x:1600,y:1700},{x:3000,y:1400},{x:150,y:1700},{x:2000,y:2600},{x:1100,y:2700}]
    .forEach(cs => placeScattered(cs.x,cs.y,(x,y)=>svgCemetery(x,y,rnd(0.85,1.15)),110));

  // Parking lots
  [{x:1100,y:700},{x:2100,y:1100},{x:800,y:1800},{x:2700,y:1500},{x:1500,y:2300},{x:3000,y:700}]
    .forEach(ps => placeScattered(ps.x,ps.y,(x,y)=>svgParking(x,y),90));

  // Billboards & street lamps
  tryRandom((x,y) => svgBillboard(x,y), 55, 14);
  tryRandom((x,y) => svgStreetLamp(x,y), 38, 30);
  tryRandom((x,y) => svgCampfire(x,y), 42, 10);
  tryRandom((x,y) => svgTent(x,y,rnd(0.8,1.2)), 50, 10);

  // Scattered rural houses
  for (let i = 0; i < 40; i++) {
    const x = rnd(100,W-100), y = rnd(100,H-100);
    placeScattered(x, y, (cx,cy) => svgHouse(cx,cy,rnd(0.55,0.9)), 62);
  }

  // Bridges near rivers
  [[1100,600],[2300,1500],[900,1900],[1800,2400]].forEach(([x,y]) => placeScattered(x,y,(cx,cy)=>svgBridge(cx,cy,ri(60,90)),80));

  // Dense fill: bushes, flowers, trees
  for (let i = 0; i < 400; i++) {
    const bx = rnd(80,W-80), by = rnd(80,H-80);
    if (!isClear(bx, by, 72)) continue;
    const r = ri(0,5);
    if (r===0)      { decoH += svgBush(bx,by,rnd(0.45,1.0)); placedDecorations.push({x:bx,y:by,min:36}); }
    else if (r===1) { decoH += svgFlowers(bx,by); placedDecorations.push({x:bx,y:by,min:26}); }
    else if (r===2) { decoH += svgOak(bx,by,rnd(0.38,0.7)); placedDecorations.push({x:bx,y:by,min:42}); }
    else if (r===3) { decoH += svgPine(bx,by,rnd(0.38,0.68)); placedDecorations.push({x:bx,y:by,min:40}); }
    else if (r===4) { decoH += svgCherry(bx,by,rnd(0.38,0.65)); placedDecorations.push({x:bx,y:by,min:38}); }
    else            { decoH += svgBush(bx,by,rnd(0.35,0.75)); placedDecorations.push({x:bx,y:by,min:32}); }
  }

  // Corner palms
  [[W-120,120],[120,H-120],[W-120,H-120],[W/2,80],[W/2,H-80],[80,H/2],[W-80,H/2]].forEach(([x,y]) => {
    if (isClear(x,y,90)) { decoH += svgPalm(x,y,rnd(0.9,1.4)); placedDecorations.push({x,y,min:70}); }
  });

  decoLayer.innerHTML = decoH;
}

// ── Main drawMap ───────────────────────────────
function drawMap(animate, edgePtList) {
  const edgeList = edgePtList || buildAllEdgePts();
  _roadPolylines = edgeList.map(e => e.pts);

  let baseD = '';
  for (const { from, to } of edgeList)
    baseD += `M ${positions[from].x} ${positions[from].y} ${getNaturalPath(positions[from], positions[to], from, to)} `;

  document.getElementById('road-shadow').setAttribute('d', baseD);
  document.getElementById('road-base').setAttribute('d', baseD);
  document.getElementById('road-mid').setAttribute('d', baseD);
  document.getElementById('road-line').setAttribute('d', baseD);

  const ng = document.getElementById('nodes-group');
  ng.innerHTML = '';
  for (let name in positions) {
    const p = positions[name];
    ng.innerHTML += `<circle class="${animate ? 'node node-anim' : 'node'}" cx="${p.x}" cy="${p.y}" r="24"/>
    <text class="label-text" x="${p.x}" y="${p.y+1}">${name}</text>`;
  }

  drawWeightLabels();
  drawTerrain();
  drawDecorations(edgeList);

  const sp = positions[document.getElementById('start').value] || Object.values(positions)[0];
  document.getElementById('car').setAttribute('transform', `translate(${sp.x},${sp.y})`);
  document.getElementById('highlight-path').setAttribute('d', '');
  document.getElementById('broken-roads-layer').innerHTML = '';
  document.getElementById('road-states-layer').innerHTML = '';
  brokenRoads = [];
  renderRoadHitPaths(edgeList);
  drawRoadStates();
}