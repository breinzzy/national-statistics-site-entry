// Router and controls for Statistik Indonesia. Hash routes, one per section:
//   #/              dashboard
//   #/population    population
//   #/economy       economy (year selector)
//   #/prices        prices & inflation
//   #/labour        labour
//   #/social        society & living standards
//   #/regions       provinces (search + sort)
//   #/data          data & methodology
//
// window.__shotReady is false while a page renders and true once it is on screen,
// so a screenshot script knows when to capture.

import { PROVINCES, YEARS, GDP_GROWTH, INFLATION_DEC, INFLATION_AVG, UNEMPLOYMENT, POVERTY, HDI, POPULATION } from './data.js';
import { dashboard, population, economy, prices, labour, social, regions, dataPage, missing } from './views.js';

const app = document.getElementById('app');
const state = { year: 2024, q: '', sort: 'pop' };

const ROUTES = {
  '/': { view: dashboard, title: 'Statistik Indonesia — Indonesia in numbers' },
  '/population': { view: population, title: 'Population | Statistik Indonesia' },
  '/economy': { view: () => economy(state), title: 'Economy | Statistik Indonesia' },
  '/prices': { view: prices, title: 'Prices & inflation | Statistik Indonesia' },
  '/labour': { view: labour, title: 'Labour | Statistik Indonesia' },
  '/social': { view: social, title: 'Society & living standards | Statistik Indonesia' },
  '/regions': { view: () => regions(state), title: 'Regions | Statistik Indonesia' },
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
}

function download(kind) {
  let csv, name;
  if (kind === 'provinces') {
    name = 'indonesia-provinces-2024.csv';
    csv = 'Province,Island group,Population (millions),Share of national (%)\n' +
      PROVINCES.map((p) => `${p.name},${p.island},${p.pop.toFixed(1)},${((p.pop / 281.6) * 100).toFixed(1)}`).join('\n');
  } else {
    name = 'indonesia-annual-indicators-2015-2024.csv';
    const rows = YEARS.map((y, i) => [y, GDP_GROWTH[i], INFLATION_DEC[i], INFLATION_AVG[i], UNEMPLOYMENT[i], POVERTY[i], HDI[i], POPULATION[i]].join(','));
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
