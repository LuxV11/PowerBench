/* ============================================================
   alerts.js — Alerts page logic
   ============================================================ */

import { getAlerts, resolveAlert } from './api.js';

let allAlerts = [];

/* ── Render table ──────────────────────────────────────────── */
function renderTable(alerts) {
  const tbody = document.getElementById('alerts-tbody');
  if (!tbody) return;

  tbody.innerHTML = alerts.map(a => `
    <tr>
      <td>${new Date(a.created_at).toLocaleString()}</td>
      <td>${a.device_id}</td>
      <td class="text-muted">${a.type.replace(/_/g, ' ')}</td>
      <td>${a.value ?? '—'}</td>
      <td>${a.threshold ?? '—'}</td>
      <td><span class="badge badge--${a.severity === 'critical' ? 'crit' : 'warn'}">${a.severity}</span></td>
      <td>
        ${a.is_resolved
          ? '<span class="text-ok font-cond uppercase" style="font-size:10px;font-weight:700;letter-spacing:1px">Resolved</span>'
          : `<button class="btn--resolve" onclick="handleResolve('${a.id}')">Resolve</button>`
        }
      </td>
    </tr>
  `).join('');

  const active = alerts.filter(a => !a.is_resolved).length;
  const pill   = document.getElementById('alerts-count-pill');
  if (pill) pill.textContent = `${active} unresolved`;
}

/* ── Resolve handler (global for inline onclick) ───────────── */
window.handleResolve = async (id) => {
  try {
    await resolveAlert(id);
  } catch {
    // optimistic update if API fails
  }
  const alert = allAlerts.find(a => a.id === id);
  if (alert) alert.is_resolved = true;
  renderTable(allAlerts);
};

/* ── Init ──────────────────────────────────────────────────── */
export async function initAlerts() {
  const tbody = document.getElementById('alerts-tbody');
  if (!tbody) return;

  try {
    const res = await getAlerts({ limit: 100 });
    allAlerts = res.alerts;
  } catch {
    allAlerts = MOCK_ALERTS;
  }

  renderTable(allAlerts);
}

const MOCK_ALERTS = [
  { id:'1', device_id:'esp8266_01', type:'co2_high',     severity:'warning',  message:'CO₂ 1087 ppm exceeds 1000 ppm threshold', value:1087, threshold:1000, created_at:new Date(Date.now()-3600000).toISOString(),  is_resolved:false },
  { id:'2', device_id:'esp8266_01', type:'humidity_high', severity:'warning',  message:'Humidity 73% exceeds maximum 70%',          value:73,   threshold:70,  created_at:new Date(Date.now()-7200000).toISOString(),  is_resolved:false },
  { id:'3', device_id:'esp8266_02', type:'device_offline',severity:'critical', message:'Device esp8266_02 has gone offline',         value:null, threshold:null,created_at:new Date(Date.now()-10800000).toISOString(), is_resolved:false },
  { id:'4', device_id:'esp8266_01', type:'co2_high',     severity:'critical', message:'CO₂ 1543 ppm — critical level',             value:1543, threshold:1000, created_at:new Date(Date.now()-18000000).toISOString(), is_resolved:true  },
];
