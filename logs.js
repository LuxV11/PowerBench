/* ============================================================
   logs.js — Logs page logic + filter
   ============================================================ */

import { getLogs } from './api.js';

let allLogs   = [];
let activeFilter = '';

/* ── Render ────────────────────────────────────────────────── */
function renderLogs(logs) {
  const container = document.getElementById('logs-container');
  const countPill = document.getElementById('log-count-pill');
  if (!container) return;

  const filtered = activeFilter ? logs.filter(l => l.level === activeFilter) : logs;

  container.innerHTML = [...filtered].reverse().map(l => `
    <div class="log-row">
      <span class="log-time">${new Date(l.time).toLocaleTimeString()}</span>
      <span class="log-level log-level--${l.level}">${l.level}</span>
      <span class="log-source">${l.source}</span>
      <span class="log-msg">${l.message}</span>
    </div>
  `).join('');

  if (countPill) countPill.textContent = `${filtered.length} entries`;
}

/* ── Filter ────────────────────────────────────────────────── */
function setFilter(level) {
  activeFilter = level;

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.level === level);
  });

  renderLogs(allLogs);
}

/* ── Init ──────────────────────────────────────────────────── */
export async function initLogs() {
  const container = document.getElementById('logs-container');
  if (!container) return;

  // Bind filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.level || ''));
  });

  try {
    const res = await getLogs({ limit: 200 });
    allLogs = res.logs;
  } catch {
    allLogs = MOCK_LOGS;
  }

  renderLogs(allLogs);
}

/* ── Mock data ─────────────────────────────────────────────── */
const msgs = [
  ['info',  'api',              'POST /api/v1/sensor/data → 201'],
  ['info',  'device:esp8266_01','Sensor: CO₂=847 T=22.4 H=58'],
  ['warn',  'alertService',     'CO₂ threshold exceeded: 1087 > 1000'],
  ['info',  'websocket',        'Client connected (total: 2)'],
  ['debug', 'db',               'Query 12ms: SELECT time_bucket(…)'],
  ['error', 'device:esp8266_02','Device offline — last seen 2h ago'],
  ['info',  'alertService',     'Alert co2_high auto-resolved'],
  ['info',  'api',              'GET /api/v1/devices → 200'],
];
const MOCK_LOGS = Array.from({ length: 80 }, (_, i) => {
  const [level, source, message] = msgs[i % msgs.length];
  return { level, source, message, time: new Date(Date.now() - (80 - i) * 45000).toISOString() };
});
