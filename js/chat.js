/* ═══════════════════════════════════════════════
   chat.js — Panel chat AI: log, typing, status
   ═══════════════════════════════════════════════ */

function chatLog(role, html, extraClass) {
  const log = document.getElementById('chat-log');
  const prev = log.querySelector('.typing-indicator');
  if (prev) prev.remove();
  const avatars = { ai: '🧠', sys: '⚙' };
  const cls = extraClass ? `chat-msg ${role} ${extraClass}` : `chat-msg ${role}`;
  const div = document.createElement('div');
  div.className = cls;
  div.innerHTML = `<div class="avatar">${avatars[role] || '⚙'}</div><div class="bubble">${html}</div>`;
  log.appendChild(div);
  try { log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' }); } catch (e) { log.scrollTop = log.scrollHeight; }
}

function statusLog(html, extraClass) {
  chatLog('sys', html, extraClass);
}

function chatTyping() {
  const log = document.getElementById('chat-log');
  const prev = log.querySelector('.typing-indicator');
  if (prev) prev.remove();
  const div = document.createElement('div');
  div.className = 'chat-msg ai typing-indicator';
  div.innerHTML = `<div class="avatar">🧠</div><div class="bubble"><div class="chat-typing"><span></span><span></span><span></span></div></div>`;
  log.appendChild(div);
  try { log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' }); } catch (e) { log.scrollTop = log.scrollHeight; }
}

function chatClear() {
  document.getElementById('chat-log').innerHTML = '';
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
