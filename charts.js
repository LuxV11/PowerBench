/* ============================================================
   charts.js — Chart.js default config + factory functions
   ============================================================ */

/* ── Global defaults ───────────────────────────────────────── */
Chart.defaults.color        = '#5a5a6e';
Chart.defaults.borderColor  = '#1e1e24';
Chart.defaults.font.family  = "'Barlow Condensed', sans-serif";
Chart.defaults.font.size    = 10;
Chart.defaults.font.weight  = '600';

const COLORS = {
  blue:    '#0078D4',
  red:     '#E8001D',
  ok:      '#22C55E',
  warn:    '#F59E0B',
  muted:   '#5a5a6e',
  border:  '#1e1e24',
  surface: '#18181c',
};

/* ── CO2 line chart ────────────────────────────────────────── */
export function createCO2Chart(canvasId, labels, data) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'CO₂ (ppm)',
        data,
        borderColor: COLORS.blue,
        backgroundColor: 'rgba(0,120,212,0.07)',
        borderWidth: 1.5,
        pointRadius: 0,
        fill: true,
        tension: .35,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 300 },
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: COLORS.border }, ticks: { maxTicksLimit: 6 } },
        y: { grid: { color: COLORS.border } },
      },
    },
  });
}

/* ── Temp + Humidity dual-axis chart ───────────────────────── */
export function createTHChart(canvasId, labels, tempData, humData) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Temp (°C)',
          data: tempData,
          borderColor: COLORS.warn,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          pointRadius: 0,
          tension: .35,
          yAxisID: 'y',
        },
        {
          label: 'Hum (%)',
          data: humData,
          borderColor: COLORS.ok,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          pointRadius: 0,
          tension: .35,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 300 },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { boxWidth: 8, padding: 14, font: { size: 10, weight: '600' } },
        },
      },
      scales: {
        x:  { grid: { color: COLORS.border }, ticks: { maxTicksLimit: 6 } },
        y:  { grid: { color: COLORS.border } },
        y1: { position: 'right', grid: { drawOnChartArea: false, color: COLORS.border }, min: 0, max: 100 },
      },
    },
  });
}

/* ── CO2 histogram (distribution bar chart) ────────────────── */
export function createHistChart(canvasId, data24h) {
  const bins   = [400, 600, 800, 1000, 1200, 1500, 2000];
  const counts = new Array(bins.length - 1).fill(0);

  data24h.forEach(v => {
    for (let i = 0; i < bins.length - 1; i++) {
      if (v >= bins[i] && v < bins[i + 1]) { counts[i]++; break; }
    }
  });

  const ctx = document.getElementById(canvasId).getContext('2d');
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: bins.slice(0, -1).map((b, i) => `${b}–${bins[i + 1]}`),
      datasets: [{
        data: counts,
        backgroundColor: counts.map((_, i) =>
          i < 2 ? 'rgba(34,197,94,.3)' : i < 4 ? 'rgba(0,120,212,.3)' : 'rgba(232,0,29,.3)'
        ),
        borderColor: counts.map((_, i) =>
          i < 2 ? COLORS.ok : i < 4 ? COLORS.blue : COLORS.red
        ),
        borderWidth: 1,
        borderRadius: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: COLORS.border } },
        y: { grid: { color: COLORS.border } },
      },
    },
  });
}

/* ── Gauge (SVG-based, not Chart.js) ───────────────────────── */
export function updateGauge(co2, { fillId, needleId, valueId, pillId }) {
  const pct    = Math.min(Math.max((co2 - 400) / 1600, 0), 1);
  const color  = co2 < 800 ? COLORS.ok : co2 < 1000 ? COLORS.blue : co2 < 1500 ? COLORS.warn : COLORS.red;
  const label  = co2 < 800 ? 'EXCELLENT' : co2 < 1000 ? 'GOOD' : co2 < 1500 ? 'POOR' : 'HAZARDOUS';

  const fill   = document.getElementById(fillId);
  const needle = document.getElementById(needleId);
  const valEl  = document.getElementById(valueId);
  const pill   = document.getElementById(pillId);

  if (fill)   { fill.style.strokeDashoffset = 226 - pct * 226; fill.style.stroke = color; }
  if (needle) { needle.setAttribute('transform', `rotate(${-90 + pct * 180} 88 98)`); }
  if (valEl)  { valEl.textContent = co2; }
  if (pill)   {
    pill.textContent = label;
    pill.className   = 'pill';
    if (co2 < 1000)      pill.classList.add('pill--ok');
    else if (co2 < 1500) { pill.style.cssText = 'background:rgba(245,158,11,.08);border-color:rgba(245,158,11,.2);color:#F59E0B'; }
    else                 pill.classList.add('pill--red');
  }
}
