/* ═══════════════════════════════════════════════
   dijkstra-table.js — Tabel Dijkstra real-time
   - Draggable, bisa dipindah-pindah
   - Desain bersih tanpa emoji di tabel
   - Kolom: Node | Jarak | Dari | Status
   ═══════════════════════════════════════════════ */

let _dtableVisible = false;
let _dtDist = {}, _dtPrev = {}, _dtVis = new Set(), _dtNodes = [];
let _dtCalcLog = {}; // Log perhitungan: { "B": { from: "A", addDist: 85, prevDist: 0, chain: [85] } }
let _dtCalcHistory = {}; // History semua update: { "C": [{from:"B", weight:95, total:180}, {from:"A", weight:280, total:280}] }

/* ── Inisialisasi tabel untuk run baru ── */
function dtableInit(nodes, startNode) {
  _dtNodes = nodes.slice().sort();
  _dtDist  = {}; _dtPrev = {}; _dtVis = new Set(); _dtCalcLog = {}; _dtCalcHistory = {};
  for (const n of _dtNodes) { _dtDist[n] = Infinity; _dtPrev[n] = '—'; }
  _dtDist[startNode] = 0;
  dtableRender();
  dtableShow();
}

/* ── Update isi tabel setiap langkah Dijkstra ── */
function dtableUpdate(dist, prev, vis, lastUpdatedNode = null, fromNode = null, edgeWeight = null) {
  _dtDist = Object.assign({}, dist);
  _dtPrev = {};
  for (const n of _dtNodes) _dtPrev[n] = prev[n] || '—';
  _dtVis  = new Set(vis);

  // Log perhitungan untuk semua node
  for (const node of _dtNodes) {
    if (dist[node] < Infinity) {
      const prevNode = prev[node];
      if (prevNode && prevNode !== '—') {
        // Cari edge weight dari prevNode ke node
        let edgeW = 0;
        if (lastUpdatedNode === node && edgeWeight !== null) {
          edgeW = edgeWeight;
        }

        // Update log terakhir untuk node ini
        _dtCalcLog[node] = {
          from: prevNode,
          prevDist: dist[prevNode],
          addDist: edgeW || (dist[node] - (dist[prevNode] || 0)),
          total: dist[node]
        };

        // Simpan ke history
        if (!_dtCalcHistory[node]) _dtCalcHistory[node] = [];
        // Cek duplikasi dengan last entry
        const lastEntry = _dtCalcHistory[node][_dtCalcHistory[node].length - 1];
        const isNew = !lastEntry ||
                      lastEntry.from !== prevNode ||
                      lastEntry.total !== dist[node];

        if (isNew) {
          _dtCalcHistory[node].push({
            from: prevNode,
            weight: _dtCalcLog[node].addDist,
            total: dist[node],
            timestamp: Date.now()
          });
        }
      } else if (dist[node] === 0) {
        // Node start
        _dtCalcLog[node] = { from: '—', prevDist: 0, addDist: 0, total: 0 };
        if (!_dtCalcHistory[node]) _dtCalcHistory[node] = [];
        if (_dtCalcHistory[node].length === 0) {
          _dtCalcHistory[node].push({ from: '—', weight: 0, total: 0, timestamp: Date.now() });
        }
      }
    }
  }

  dtableRender();
}

/* ── Render ulang isi tbody ── */
function _buildCalcChain(node) {
  // Membangun rantai perhitungan dari start ke node saat ini
  const history = _dtCalcHistory[node];
  if (!history || history.length === 0) return null;

  const lastUpdate = history[history.length - 1];

  // Cari jalur terpendek dari start ke node
  let path = [];
  let current = node;

  while (current && current !== '—' && _dtPrev[current] !== '—') {
    path.unshift(current);
    current = _dtPrev[current];
  }
  if (current) path.unshift(current);

  // Buat ekspresi perhitungan
  if (path.length < 2) {
    return `0 + ${lastUpdate.weight} = ${lastUpdate.total}`;
  }

  // Ekstrak edge weights dari path
  let parts = ['0'];
  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];

    let weight = 0;
    for (const h of (_dtCalcHistory[to] || [])) {
      if (h.from === from && _dtDist[to] === h.total) {
        weight = h.weight;
        break;
      }
    }
    parts.push(weight.toString());
  }

  return parts.join(' + ') + ' = ' + lastUpdate.total;
}

function _getCalcExpression(node) {
  if (_dtDist[node] === Infinity) return null;
  if (_dtDist[node] === 0) return '0 = 0';

  // Gunakan buildCalcChain untuk mendapatkan ekspresi kumulatif
  return _buildCalcChain(node);
}

function dtableRender() {
  const tbody = document.getElementById('dt-tbody');
  if (!tbody) return;

  // Filter: hanya node yang sudah di-scan (visited) atau memiliki jarak terjangkau
  const filteredNodes = _dtNodes.filter(n => _dtVis.has(n) || _dtDist[n] < Infinity);

  if (filteredNodes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;color:#888;">Menunggu scan...</td></tr>';
    return;
  }

  let html = '';
  for (const n of filteredNodes) {
    const d    = _dtDist[n];
    const dStr = d === Infinity ? '∞' : d;
    const vis  = _dtVis.has(n);
    const cls  = vis ? 'dt-vis' : 'dt-reach';

    // Tampilkan perhitungan step-by-step jika ada log
    let distHtml = `<span class="dt-total">${dStr}</span>`;
    if (!vis && d < Infinity) {
      const expr = _getCalcExpression(n);
      if (expr) {
        const parts = expr.split(' = ');
        if (parts.length === 2) {
          distHtml = `<span class="dt-calc">${parts[0]}</span><br><span class="dt-total">= ${parts[1]}</span>`;
        }
      }
    }

    const statusText = vis ? '🔒 Terkunci' : '🔍 Dijangkau';

    html += `<tr class="${cls}" data-node="${n}">
      <td class="dt-node"><span class="dt-node-badge">${n}</span></td>
      <td class="dt-dist">${distHtml}</td>
      <td class="dt-prev">${_dtPrev[n]}</td>
      <td class="dt-status"><span class="dt-badge ${cls}">${statusText}</span></td>
    </tr>`;
  }
  tbody.innerHTML = html;

  // Scroll ke row terakhir
  const lastRow = tbody.lastElementChild;
  if (lastRow) lastRow.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/* ── Tampilkan panel ── */
function dtableShow() {
  const panel = document.getElementById('dijkstra-table-panel');
  if (!panel) return;
  panel.style.display = 'flex';
  _dtableVisible = true;
}

/* ── Sembunyikan panel ── */
function dtableHide() {
  const panel = document.getElementById('dijkstra-table-panel');
  if (!panel) return;
  panel.style.display = 'none';
  _dtableVisible = false;
}

/* ── Reset total ── */
function dtableReset() {
  _dtDist = {}; _dtPrev = {}; _dtVis = new Set(); _dtNodes = []; _dtCalcLog = {}; _dtCalcHistory = {};
  const tbody = document.getElementById('dt-tbody');
  if (tbody) tbody.innerHTML = '';
  dtableHide();
}

/* ── Toggle dari tombol ── */
function dtableToggle() {
  _dtableVisible ? dtableHide() : dtableShow();
}

/* ── Draggable logic ── */
(function initDraggable() {
  let dragEl = null, startX, startY, origLeft, origTop;

  function onMouseDown(e) {
    const panel = document.getElementById('dijkstra-table-panel');
    if (!panel || e.target.tagName === 'BUTTON') return;
    dragEl = panel;

    // Pastikan posisi absolute aktif
    if (panel.style.position !== 'fixed') {
      const rect = panel.getBoundingClientRect();
      panel.style.position = 'fixed';
      panel.style.left = rect.left + 'px';
      panel.style.top  = rect.top  + 'px';
      panel.style.width = rect.width + 'px';
      panel.style.margin = '0';
      panel.style.zIndex = '999';
    }
    startX = e.clientX;
    startY = e.clientY;
    origLeft = parseInt(panel.style.left) || 0;
    origTop  = parseInt(panel.style.top)  || 0;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',   onMouseUp);
    e.preventDefault();
  }

  function onMouseMove(e) {
    if (!dragEl) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    dragEl.style.left = (origLeft + dx) + 'px';
    dragEl.style.top  = (origTop  + dy) + 'px';
  }

  function onMouseUp() {
    dragEl = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup',   onMouseUp);
  }

  // Init setelah DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('dt-header');
    if (header) header.addEventListener('mousedown', onMouseDown);
  });

  // Fallback jika DOMContentLoaded sudah lewat
  if (document.readyState !== 'loading') {
    setTimeout(() => {
      const header = document.getElementById('dt-header');
      if (header && !header._dragInit) {
        header._dragInit = true;
        header.addEventListener('mousedown', onMouseDown);
      }
    }, 100);
  }
})();