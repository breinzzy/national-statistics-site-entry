// Router and controls for Statistik Indonesia (v4). Hash routes, one per section:
//   #/              dashboard
//   #/population    population (year slider)
//   #/economy       economy (year selector)
//   #/prices        prices & inflation
//   #/labour        labour
//   #/social        society & living standards
//   #/regions       provinces (search + sort)
//   #/duel          duel two provinces
//   #/indicators    indicator browser (search + filter + detail)
//   #/data          data & methodology
//
// window.__shotReady is false while a page renders and true once it is on screen,
// so a screenshot script knows when to capture.

import { PROVINCES, PROV_TOTAL, YEARS, GDP_GROWTH, INFLATION_DEC, INFLATION_AVG, UNEMPLOYMENT, POVERTY, HDI, POPULATION } from './data.js';
import { dashboard, population, economy, prices, labour, social, regions, duel, indicators, dataPage, missing, provinceMap } from './views.js';

const app = document.getElementById('app');
const state = { year: 2025, q: '', sort: 'pop', mapSel: 'WJ', mapMetric: 'pop', duelA: 'WJ', duelB: 'EJ', indQ: '', indFilter: 'all', indSort: 'change', indSel: 'population', popYear: 2025 };

const ROUTES = {
  '/': { view: dashboard, title: 'Statistik Indonesia — Indonesia in numbers' },
  '/population': { view: () => population(state), title: 'Population | Statistik Indonesia' },
  '/economy': { view: () => economy(state), title: 'Economy | Statistik Indonesia' },
  '/prices': { view: prices, title: 'Prices & inflation | Statistik Indonesia' },
  '/labour': { view: labour, title: 'Labour | Statistik Indonesia' },
  '/social': { view: social, title: 'Society & living standards | Statistik Indonesia' },
  '/regions': { view: () => regions(state), title: 'Regions | Statistik Indonesia' },
  '/duel': { view: () => duel(state), title: 'Duel two provinces | Statistik Indonesia' },
  '/indicators': { view: () => indicators(state), title: 'Browse the indicators | Statistik Indonesia' },
  '/data': { view: dataPage, title: 'Data & methodology | Statistik Indonesia' },
};

function render() {
  window.__shotReady = false;
  const path = location.hash.replace(/^#/, '') || '/';
  const route = ROUTES[path];
  document.title = route ? route.title : 'Page not found | Statistik Indonesia';
  app.innerHTML = route ? route.view() : missing();
  document.querySelectorAll('nav a').forEach((a) => a.classList.toggle('on', a.getAttribute('href') === `#${path}`));
  bind();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function bind() {
  app.querySelectorAll('[data-year]').forEach((b) => b.addEventListener('click', () => { state.year = Number(b.dataset.year); render(); }));
  const q = document.getElementById('q');
  if (q) q.addEventListener('input', () => { state.q = q.value; render(); const nq = document.getElementById('q'); nq.focus(); nq.setSelectionRange(nq.value.length, nq.value.length); });
  const sort = document.getElementById('sort');
  if (sort) sort.addEventListener('change', () => { state.sort = sort.value; render(); });
  app.querySelectorAll('[data-download]').forEach((b) => b.addEventListener('click', () => download(b.dataset.download)));
  bindMap();
  bindDuel();
  bindIndicators();
  bindPopYear();
}

// The province tile map updates in place (no full re-render, so the page
// does not scroll back to the top when a tile is tapped).
function bindMap() {
  const box = document.getElementById('provincemap');
  if (!box) return;
  const redraw = () => { box.innerHTML = provinceMap(state.mapSel, state.mapMetric); bindMap(); };
  box.querySelectorAll('[data-code]').forEach((b) => b.addEventListener('click', () => { state.mapSel = b.dataset.code; redraw(); }));
  box.querySelectorAll('[data-metric]').forEach((b) => b.addEventListener('click', () => { state.mapMetric = b.dataset.metric; redraw(); }));
}

function bindDuel() {
  const a = document.getElementById('duel-a');
  if (a) a.addEventListener('change', () => { state.duelA = a.value; render(); });
  const b = document.getElementById('duel-b');
  if (b) b.addEventListener('change', () => { state.duelB = b.value; render(); });
  const s = document.getElementById('duel-swap');
  if (s) s.addEventListener('click', () => { const t = state.duelA; state.duelA = state.duelB; state.duelB = t; render(); });
}

function bindIndicators() {
  const q = document.getElementById('ind-q');
  if (q) q.addEventListener('input', () => { state.indQ = q.value; render(); const nq = document.getElementById('ind-q'); nq.focus(); nq.setSelectionRange(nq.value.length, nq.value.length); });
  const sort = document.getElementById('ind-sort');
  if (sort) sort.addEventListener('change', () => { state.indSort = sort.value; render(); });
  app.querySelectorAll('[data-ind-filter]').forEach((b) => b.addEventListener('click', () => { state.indFilter = b.dataset.indFilter; render(); }));
  app.querySelectorAll('[data-ind]').forEach((b) => b.addEventListener('click', () => { state.indSel = b.dataset.ind; render(); }));
}

function bindPopYear() {
  const s = document.getElementById('pop-year');
  if (s) s.addEventListener('change', () => { state.popYear = Number(s.value); render(); });
}

function download(kind) {
  let csv, name;
  if (kind === 'provinces') {
    name = 'indonesia-provinces-2025.csv';
    csv = 'Province,Island group,Population (millions),Share of national (%)\n' +
      PROVINCES.map((p) => `${p.name},${p.island},${p.pop.toFixed(1)},${((p.pop / PROV_TOTAL) * 100).toFixed(1)}`).join('\n');
  } else {
    name = 'indonesia-annual-indicators-2015-2025.csv';
    const rows = YEARS.map((y, i) => [y, GDP_GROWTH[i], INFLATION_DEC[i], INFLATION_AVG[i] ?? '', UNEMPLOYMENT[i], POVERTY[i], HDI[i], POPULATION[i]].join(','));
    csv = 'Year,GDP growth (%),Inflation Dec yoy (%),Inflation annual avg (%),Unemployment (%),Poverty (%),HDI,Population (millions)\n' + rows.join('\n');
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

window.addEventListener('hashchange', render);
render();
