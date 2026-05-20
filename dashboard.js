/* ============================================================
   dashboard.js — Live metrics, chart updates, WS listener
   ============================================================ */

import { getSensorData, getAlerts } from './api.js';
import { on } from './websocket.js';
import { createCO2Chart, createTHChart, createHistChart, updateGauge } from './charts.js';

/* ── State ─────────────────────────────────────────────────── */
const state = {
  co2: 847, temp: 22.4, hum: 58, ir: false,
  history: { labels: [], co2: [], temp: [], hum: [] },
};

let co2Chart = null;
let thChart  = null;

/* ── Helpers ───────────────────────────────────────────────── */
function rand(a, b) { return a + Math.random() * (b - a); }

function seedHistory() {
  const now = Date.now();
  for (let i = 59; i >= 0; i--) {
    const t = new Date(now - i * 60000);
    state.history.labels.push(t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    state.history.co2.push(Math.round(rand(680, 980)));
    state.history.temp.push(+rand(21.5, 23.5).toFixed(1));
    state.history.hum.push(+rand(52, 65).toFixed(1));
  }
}

function last30(arr) { return arr.slice(-30); }

/* ── Update DOM metrics ────────────────────────────────────── */
function updateMetrics() {
  document.getElementById('val-co2').textContent  = state.co2;
  document.getElementById('val-temp').textContent = state.temp;
  document.getElementById('val-hum').textContent  = state.hum;

  const irEl = document.getElementById('val-ir');
  irEl.textContent = state.ir ? 'MOTION' : 'CLEAR';
  irEl.className   = state.ir ? 'metric-value metric-value--ir text-red' : 'metric-value metric-value--ir text-muted';

  document.getElementById('last-seen').textContent = 'just now';
}

/* ── Push new data point to history ───────────────────────── */
function pushHistory(co2, temp, hum) {
  const label = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  state.history.labels.push(label);
  state.history.co2.push(co2);
  state.history.temp.push(temp);
  state.history.hum.push(hum);
}

/* ── Update charts ─────────────────────────────────────────── */
function updateCharts() {
  if (co2Chart) {
    co2Chart.data.labels             = last30(state.history.labels);
    co2Chart.data.datasets[0].data   = last30(state.history.co2);
    co2Chart.update('none');
  }
  if (thChart) {
    thChart.data.labels              = last30(state.history.labels);
    thChart.data.datasets[0].data    = last30(state.history.temp);
    thChart.data.datasets[1].data    = last30(state.history.hum);
    thChart.update('none');
  }
  document.getElementById('co2-pill').textContent = state.co2 + ' ppm';
}

/* ── Render recent alerts ──────────────────────────────────── */
function renderAlerts(alerts) {
  const container = document.getElementById('dash-alerts');
  if (!container) return;
  const active = alerts.filter(a => !a.is_resolved).slice(0, 3);
  container.innerHTML = active.map(a => `
    <div class="alert-row">
      <div class="alert-stripe alert-stripe--${a.severity === 'critical' ? 'crit' : 'warn'}"></div>
      <div class="alert-body">
        <div class="alert-msg">${a.message}</div>
        <div class="alert-meta">${a.device_id} · ${new Date(a.created_at).toLocaleString()}</div>
      </div>
      <span class="badge badge--${a.severity === 'critical' ? 'crit' : 'warn'}">${a.severity}</span>
    </div>
  `).join('');

  const badge = document.getElementById('alert-count-badge');
  if (badge) badge.textContent = alerts.filter(a => !a.is_resolved).length;
}

/* ── Simulate live tick (remove when real WS is connected) ─── */
function simulateTick() {
  state.co2  = Math.round(Math.max(400, Math.min(2000, state.co2  + rand(-35, 35))));
  state.temp = +Math.max(18,  Math.min(30, state.temp + rand(-0.2, 0.2))).toFixed(1);
  state.hum  = +Math.max(20,  Math.min(90, state.hum  + rand(-1.2, 1.2))).toFixed(1);
  state.ir   = Math.random() < 0.05;

  pushHistory(state.co2, state.temp, state.hum);
  updateMetrics();
  updateCharts();
  updateGauge(state.co2, {
    fillId:   'gauge-fill',
    needleId: 'gauge-needle',
    valueId:  'gauge-value',
    pillId:   'aq-pill',
  });
}

/* ── Init ──────────────────────────────────────────────────── */
export async function initDashboard() {
  seedHistory();

  co2Chart = createCO2Chart('co2-chart', last30(state.history.labels), last30(state.history.co2));
  thChart  = createTHChart('th-chart',   last30(state.history.labels), last30(state.history.temp), last30(state.history.hum));

  // Histogram with simulated 24h data
  const data24h = Array.from({ length: 1440 }, () => Math.round(rand(400, 1400)));
  createHistChart('hist-chart', data24h);

  // Initial gauge
  updateGauge(state.co2, {
    fillId:   'gauge-fill',
    needleId: 'gauge-needle',
    valueId:  'gauge-value',
    pillId:   'aq-pill',
  });

  updateMetrics();

  // Real WebSocket data
  on('sensor_data', (data) => {
    state.co2  = data.co2;
    state.temp = data.temperature;
    state.hum  = data.humidity;
    state.ir   = data.infrared;
    pushHistory(state.co2, state.temp, state.hum);
    updateMetrics();
    updateCharts();
    updateGauge(state.co2, {
      fillId: 'gauge-fill', needleId: 'gauge-needle',
      valueId: 'gauge-value', pillId: 'aq-pill',
    });
  });

  // Fallback simulation when no device connected
  setInterval(simulateTick, 5000);

  // Load alerts
  try {
    const res = await getAlerts({ resolved: false, limit: 5 });
    renderAlerts(res.alerts);
  } catch {
    renderAlerts(MOCK_ALERTS);
  }
}

/* ── Mock data (shown when API is unreachable) ─────────────── */
const MOCK_ALERTS = [
  { id:'1', device_id:'esp8266_01', type:'co2_high',     severity:'warning',  message:'CO₂ 1087 ppm exceeds 1000 ppm threshold', created_at: new Date(Date.now()-3600000).toISOString(), is_resolved:false },
  { id:'2', device_id:'esp8266_01', type:'humidity_high', severity:'warning',  message:'Humidity 73% exceeds maximum 70%',          created_at: new Date(Date.now()-7200000).toISOString(), is_resolved:false },
  { id:'3', device_id:'esp8266_02', type:'device_offline',severity:'critical', message:'Device esp8266_02 has gone offline',         created_at: new Date(Date.now()-10800000).toISOString(),is_resolved:false },
];
