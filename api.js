/* ============================================================
   api.js — Fetch helpers, JWT token management
   ============================================================ */

const API_BASE = 'http://localhost:3001/api/v1';

/* ── Token helpers ─────────────────────────────────────────── */
export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

/* ── Base request ──────────────────────────────────────────── */
async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearToken();
    window.location.href = '/pages/login.html';
    return;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

/* ── Auth ──────────────────────────────────────────────────── */
export async function login(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

/* ── Sensor data ───────────────────────────────────────────── */
export function getSensorData(deviceId, params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/sensor/data/${deviceId}${qs ? '?' + qs : ''}`);
}

/* ── Devices ───────────────────────────────────────────────── */
export function getDevices() {
  return request('/devices');
}

/* ── Alerts ────────────────────────────────────────────────── */
export function getAlerts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/alerts${qs ? '?' + qs : ''}`);
}

export function resolveAlert(id) {
  return request(`/alerts/${id}/resolve`, { method: 'PATCH' });
}

/* ── Logs ──────────────────────────────────────────────────── */
export function getLogs(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/logs${qs ? '?' + qs : ''}`);
}
