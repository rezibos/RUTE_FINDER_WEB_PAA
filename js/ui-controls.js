/* ═══════════════════════════════════════════════
   ui-controls.js — Tombol, select, tool selector,
                    update state tombol simulasi
   ═══════════════════════════════════════════════ */

/* ── Pilih tool kondisi jalan ── */
function setTool(t) {
  currentTool = t;
  ['tool-rusak','tool-perbaikan','tool-hujan','tool-macet'].forEach(id =>
    document.getElementById(id).classList.remove('selected')
  );
  document.getElementById('tool-' + t).classList.add('selected');
}

/* ── Isi dropdown start/end ── */
function populateSelects() {
  const nodes = Object.keys(positions).sort();
  const ss = document.getElementById('start'), se = document.getElementById('end');
  const pS = ss.value, pE = se.value;
  ss.innerHTML = se.innerHTML = '';
  nodes.forEach(n => {
    ss.innerHTML += `<option value="${n}">${n}</option>`;
    se.innerHTML += `<option value="${n}">${n}</option>`;
  });
  if (nodes.includes(pS)) ss.value = pS;
  const fb = nodes.find(n => n !== ss.value) || nodes[1] || nodes[0];
  se.value = (nodes.includes(pE) && pE !== ss.value) ? pE : fb;

  ss.onchange = function () {
    if (simState.status === 'idle') {
      const sp = positions[this.value];
      if (sp) setCarTo({ x: sp.x, y: sp.y, angle: 0 });
    }
  };
}

/* ── Update visibilitas & state tombol ── */
function updateRouteButtons(state) {
  const routeBtn    = document.getElementById('route-btn');
  const pauseBtn    = document.getElementById('pause-btn');
  const stopBtn     = document.getElementById('stop-btn');
  const replayBtn   = document.getElementById('replay-btn');
  const toolsRow    = document.getElementById('tools-row');
  const startSel    = document.getElementById('start');
  const endSel      = document.getElementById('end');
  const resetBtn    = document.querySelector('button.reset-btn:not(#stop-btn):not(#kembali-btn):not(#cancel-scan-btn)');
  const randomBtn   = document.querySelector('button.random-btn:not(#replay-btn)');
  const cancelScanBtn = document.getElementById('cancel-scan-btn');

  const locked = ['running','paused','scanning','done'].includes(state);
  toolsRow.style.opacity      = locked ? '0.4' : '1';
  toolsRow.style.pointerEvents = locked ? 'none' : '';
  startSel.disabled = locked;
  endSel.disabled   = locked;
  if (resetBtn)  { resetBtn.disabled  = locked; resetBtn.style.opacity  = locked ? '0.4' : '1'; }
  if (randomBtn) { randomBtn.disabled = locked; randomBtn.style.opacity = locked ? '0.4' : '1'; }

  if (cancelScanBtn) cancelScanBtn.style.display = 'none';

  if (state === 'idle') {
    routeBtn.style.display = 'inline-block';
    routeBtn.textContent   = '▶ Cari Rute';
    routeBtn.disabled      = false; routeBtn.style.opacity = '1';
    pauseBtn.style.display = 'none';
    stopBtn.style.display  = 'none';
    replayBtn.style.display = 'none';

  } else if (state === 'scanning') {
    routeBtn.style.display = 'inline-block';
    routeBtn.textContent   = '⏳ Mencari...';
    routeBtn.disabled      = true; routeBtn.style.opacity = '0.5';
    pauseBtn.style.display = 'none';
    stopBtn.style.display  = 'none';
    if (cancelScanBtn) {
      cancelScanBtn.style.display = 'inline-block';
      cancelScanBtn.disabled      = false;
      cancelScanBtn.style.opacity = '1';
    }
    replayBtn.style.display = 'none';

  } else if (state === 'running') {
    routeBtn.style.display = 'inline-block';
    routeBtn.textContent   = '⏸ Pause';
    routeBtn.disabled      = false; routeBtn.style.opacity = '1';
    pauseBtn.style.display = 'none';
    stopBtn.style.display  = 'inline-block';
    replayBtn.style.display = 'none';

  } else if (state === 'paused') {
    routeBtn.style.display = 'inline-block';
    routeBtn.textContent   = '▶ Lanjut';
    routeBtn.disabled      = false; routeBtn.style.opacity = '1';
    pauseBtn.style.display = 'none';
    stopBtn.style.display  = 'inline-block';
    replayBtn.style.display = 'none';

  } else if (state === 'done') {
    routeBtn.style.display  = 'none';
    pauseBtn.style.display  = 'none';
    stopBtn.style.display   = 'none';
    replayBtn.style.display = 'inline-block';
    const kb = document.getElementById('kembali-btn');
    kb.style.display = 'inline-block';
    kb.disabled      = false;
    kb.style.opacity = '1';
  }

  if (state !== 'done') {
    const kembaliBtn = document.getElementById('kembali-btn');
    if (kembaliBtn) kembaliBtn.style.display = 'none';
  }
}
