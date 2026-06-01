/* ═══════════════════════════════════════════════
   graph-data.js — Data default graf & posisi kota
   ═══════════════════════════════════════════════ */

const W = 4200, H = 2800;

const defaultGraph = {
  "A": [{ node: "C", weight: 280 }, { node: "B", weight: 220 }, { node: "H", weight: 300 }],
  "B": [{ node: "A", weight: 220 }, { node: "E", weight: 290 }, { node: "D", weight: 230 }, { node: "H", weight: 150 }],
  "C": [{ node: "A", weight: 280 }, { node: "E", weight: 260 }, { node: "F", weight: 370 }, { node: "I", weight: 200 }],
  "D": [{ node: "B", weight: 230 }, { node: "G", weight: 600 }, { node: "J", weight: 100 }],
  "E": [{ node: "B", weight: 290 }, { node: "C", weight: 260 }, { node: "F", weight: 230 }, { node: "G", weight: 370 }],
  "F": [{ node: "C", weight: 370 }, { node: "E", weight: 230 }, { node: "G", weight: 260 }, { node: "I", weight: 250 }, { node: "K", weight: 200 }],
  "G": [{ node: "D", weight: 600 }, { node: "E", weight: 370 }, { node: "F", weight: 260 }, { node: "K", weight: 250 }],
  "H": [{ node: "A", weight: 300 }, { node: "B", weight: 150 }],
  "I": [{ node: "C", weight: 200 }, { node: "F", weight: 250 }],
  "J": [{ node: "D", weight: 100 }],
  "K": [{ node: "F", weight: 200 }, { node: "G", weight: 250 }]
};

const defaultPositions = {
  "A": { x: 1500, y: 140 }, "B": { x: 860, y: 900 }, "C": { x: 1650, y: 510 },
  "D": { x: 610, y: 980 }, "E": { x: 1830, y: 1090 }, "F": { x: 2580, y: 960 },
  "G": { x: 1510, y: 1530 }, "H": { x: 190, y: 630 }, "I": { x: 2250, y: 310 },
  "J": { x: 340, y: 1790 }, "K": { x: 2880, y: 1750 }
};

// State global graf (dimutasi oleh randomizeMap & kondisi jalan)
let originalGraph = JSON.parse(JSON.stringify(defaultGraph));
let graph = JSON.parse(JSON.stringify(defaultGraph));
let positions = JSON.parse(JSON.stringify(defaultPositions));
let brokenRoads = [], roadStates = {};
