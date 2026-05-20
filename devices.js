/* ============================================================
   devices.js — Devices page logic
   ============================================================ */

import { getDevices } from './api.js';

/* ── Render ────────────────────────────────────────────────── */
function renderDevices(devices) {
  const grid = document.getElementById('devices-grid');
  if (!grid) return;

  grid.innerHTML = devices.map(d => {
    const online = d.is_online || (d.last_seen_at
      ? (Date.now() - new Date(d.last_seen_at).getTime()) < 60000
      : false);

    return `
      <div class="device-card ${online ? 'device-card--online' : ''}">
        <div class="device-card-top">
          <div>
            <div class="device-name">${d.name}</div>
            <div class="device-id">${d.device_id}</div>
          </div>
          <span class="badge badge--${online ? 'on' : 'off'}">${online ? 'Online' : 'Offline'}</span>
        </div>
        <div class="device-meta">${d.location || '—'} · FW ${d.firmware_version || 'unknown'}</div>
        <div class="device-stats">
          <div class="device-stat">
            <div class="device-stat-label">CO₂</div>
            <div class="device-stat-value text-blue">${d.last_co2 ? d.last_co2 + ' ppm' : '—'}</div>
          </div>
          <div class="device-stat">
            <div class="device-stat-label">Temp</div>
            <div class="device-stat-value text-warn">${d.last_temp ? d.last_temp + '°C' : '—'}</div>
          </div>
          <div class="device-stat">
            <div class="device-stat-label">Humidity</div>
            <div class="device-stat-value text-ok">${d.last_hum ? d.last_hum + '%' : '—'}</div>
          </div>
          <div class="device-stat">
            <div class="device-stat-label">Last seen</div>
            <div class="device-stat-value text-muted" style="font-size:12px">
              ${d.last_seen_at ? new Date(d.last_seen_at).toLocaleTimeString() : '—'}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ── Init ──────────────────────────────────────────────────── */
export async function initDevices() {
  const grid = document.getElementById('devices-grid');
  if (!grid) return;

  try {
    const res = await getDevices();
    renderDevices(res.devices);
  } catch {
    renderDevices(MOCK_DEVICES);
  }
}

const MOCK_DEVICES = [
  { device_id:'esp8266_01', name:'Lab Sensor A', location:'Lab A – Desk 4', is_online:true,  firmware_version:'1.0.2', last_seen_at: new Date().toISOString() },
  { device_id:'esp8266_02', name:'Server Room',  location:'Rack B – Row 2', is_online:false, firmware_version:'1.0.1', last_seen_at: new Date(Date.now()-7200000).toISOString() },
  { device_id:'esp8266_03', name:'Lobby Sensor', location:'Entrance Hall',  is_online:false, firmware_version:'1.0.0', last_seen_at: null },
];
