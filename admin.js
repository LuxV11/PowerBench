/* ============================================================
   admin.js — Admin page: threshold sliders
   ============================================================ */

const thresholds = { co2: 1000, humMin: 30, humMax: 70, tempMax: 30 };

/* ── Bind a slider ─────────────────────────────────────────── */
function bindSlider(sliderId, valueId, unit, key) {
  const slider = document.getElementById(sliderId);
  const valueEl = document.getElementById(valueId);
  if (!slider || !valueEl) return;

  slider.addEventListener('input', () => {
    thresholds[key] = parseFloat(slider.value);
    valueEl.textContent = slider.value + ' ' + unit;
  });
}

/* ── Save handler ──────────────────────────────────────────── */
function handleSave() {
  const btn = document.getElementById('save-btn');
  if (!btn) return;

  // TODO: PUT /api/v1/devices/:id with threshold values

  btn.textContent = 'Saved ✓';
  btn.style.background   = 'var(--ok)';
  btn.style.borderColor  = 'var(--ok)';

  setTimeout(() => {
    btn.textContent      = 'Save Thresholds';
    btn.style.background = '';
    btn.style.borderColor = '';
  }, 2000);
}

/* ── Init ──────────────────────────────────────────────────── */
export function initAdmin() {
  bindSlider('slider-co2',    'val-co2',    'ppm', 'co2');
  bindSlider('slider-hummin', 'val-hummin', '%',   'humMin');
  bindSlider('slider-hummax', 'val-hummax', '%',   'humMax');
  bindSlider('slider-tempmax','val-tempmax','°C',  'tempMax');

  const btn = document.getElementById('save-btn');
  if (btn) btn.addEventListener('click', handleSave);
}
