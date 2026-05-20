/* ============================================================
   websocket.js — WebSocket client with auto-reconnect
   ============================================================ */

const WS_BASE = 'ws://localhost:3001';

let socket = null;
const listeners = new Map(); // eventType -> Set of callbacks

/* ── Connect ───────────────────────────────────────────────── */
export function connect(token) {
  if (socket && socket.readyState === WebSocket.OPEN) return;

  socket = new WebSocket(`${WS_BASE}/ws?token=${encodeURIComponent(token)}`);

  socket.addEventListener('open', () => {
    console.log('[WS] Connected');
    _emit('connection', { status: 'open' });
  });

  socket.addEventListener('message', (event) => {
    try {
      const msg = JSON.parse(event.data);
      _emit(msg.type, msg.data);
      _emit('*', msg); // wildcard listeners
    } catch (err) {
      console.warn('[WS] Parse error:', err);
    }
  });

  socket.addEventListener('close', () => {
    console.warn('[WS] Disconnected — retrying in 3s');
    _emit('connection', { status: 'closed' });
    setTimeout(() => {
      const token = localStorage.getItem('token');
      if (token) connect(token);
    }, 3000);
  });

  socket.addEventListener('error', (err) => {
    console.error('[WS] Error:', err);
  });
}

/* ── Disconnect ────────────────────────────────────────────── */
export function disconnect() {
  socket?.close();
  socket = null;
}

/* ── Subscribe ─────────────────────────────────────────────── */
export function on(eventType, callback) {
  if (!listeners.has(eventType)) listeners.set(eventType, new Set());
  listeners.get(eventType).add(callback);
  return () => listeners.get(eventType)?.delete(callback); // returns unsubscribe fn
}

/* ── Emit internally ───────────────────────────────────────── */
function _emit(type, data) {
  listeners.get(type)?.forEach(cb => cb(data));
}
