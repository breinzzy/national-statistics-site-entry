// Page views for Statistik Indonesia. Every view is a function of the shared data
// plus the page's own control state (economy year, regions search/sort). All text
// is escaped before it goes into the page.

import {
  KPI, YEARS, GDP_GROWTH, INFLATION_DEC, INFLATION_AVG, UNEMPLOYMENT, POVERTY,
  HDI, POPULATION, GDP_BY_YEAR, SECTORS, ISLANDS, TRADE, EMPLOYMENT, PYRAMID,
  PROVINCES, RELEASES, FINDINGS, META, FIGURE_COUNT, MAP_BINS,
} from './data.js';
import { lineChart, hbars, vbars, pyramid } from './charts.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const fmt = (n) => n.toLocaleString('en-US');

// Sparkline for a KPI card: the indicator's 2015-2024 annual series as a
// small line, so the trend is visible on the card itself.
const SPARKS = { 'Population': POPULATION, 'GDP growth': GDP_GROWTH, 'Inflation': INFLATION_DEC, 'Unemployment': UNEMPLOYMENT, 'Poverty rate': POVERTY, 'Human Development Index': HDI };
function sparkline(values) {
  const min = Math.min(...values), max = Math.max(...values), span = (max - min) || 1;
  const pts = values.map((v, i) => `${((i / (values.length - 1)) * 100).toFixed(1)},${((1 - (v - min) / span) * 24 + 2).toFixed(1)}`).join(' ');
  const lx = 100, ly = (1 - (values[values.length - 1] - min) / span) * 24 + 2;
  return `<svg class="spark" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="#0b5fff" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${lx}" cy="${ly.toFixed(1)}" r="2.6" fill="#0b5fff"/></svg>`;
}

// A decade of change, computed from the site's own 2015-2024 series (not new
// figures — the deltas reuse points already counted in FIGURE_COUNT).
function decadeLine() {
  const popD = POPULATION[9] - POPULATION[0];
  const povD = POVERTY[9] - POVERTY[0];
  const avgG = GDP_GROWTH.reduce((a, b) => a + b, 0) / GDP_GROWTH.length;
  const unD = UNEMPLOYMENT[9] - UNEMPLOYMENT[0];
  return `Since 2015: +${popD.toFixed(1)}m people · poverty ${povD.toFixed(2)} pts · growth ${avgG.toFixed(1)}% a year · unemployment ${unD.toFixed(2)} pts`;
}

function kpiCards(side = false) {
  return `<section class="kpis${side ? ' side' : ''}">${KPI.map((k) => `<a class="kpi" href="${k.href}"><span class="kpi-top"><span class="kpi-label">${esc(k.label)}</span><span class="stamp">${esc(k.src)}</span></span><span class="kpi-value">${esc(k.value)}</span><span class="kpi-sub">${esc(k.sub)}</span>${SPARKS[k.label] ? sparkline(SPARKS[k.label]) : ''}<span class="kpi-change">${esc(k.change)}</span></a>`).join('')}</section>`;
}

// stamp: the source + year badge every figure carries, e.g. "BPS 2024".
function card(title, sub, body, extra = '', stamp = '') {
  return `<section class="card ${extra}"><header class="card-head"><div class="card-titles"><h2>${esc(title)}</h2><p>${esc(sub)}</p></div>${stamp ? `<span class="stamp big">${esc(stamp)}</span>` : ''}</header>${body}</section>`;
}

function binFor(pop) {
  return MAP_BINS.find((b) => pop >= b.min);
}

export function provinceMap(selectedCode, metric) {
  const tiles = PROVINCES.map((p) => {
    const bin = binFor(p.pop);
    const sel = p.code === selectedCode ? ' sel' : '';
    return `<button class="tile${sel}" style="grid-column:${p.map[0] + 1};grid-row:${p.map[1] + 1};background:${bin.color};color:${bin.dark ? '#fff' : '#0a2540'}" data-code="${p.code}" title="${esc(p.name)} — ${p.pop.toFixed(1)}m people">${p.code}</button>`;
  }).join('');
  const sel = PROVINCES.find((p) => p.code === selectedCode) ?? PROVINCES[0];
  const rank = [...PROVINCES].sort((a, b) => b.pop - a.pop).findIndex((p) => p.code === sel.code) + 1;
  const share = ((sel.pop / 281.6) * 100).toFixed(1);
  const labels = metric === 'share'
    ? ['14.2%+', '3.6–14.2%', '1.8–3.6%', '0.7–1.8%', 'Under 0.7%']
    : MAP_BINS.map((b) => b.label);
  const legend = MAP_BINS.map((b, i) => `<span class="leg"><span class="sw" style="background:${b.color}"></span>${labels[i]}</span>`).join('');
  const unit = metric === 'share' ? 'Share of Indonesia, % · mid-2024 · BPS 2024' : 'Population, millions · mid-2024 · BPS 2024';
  return `<div class="map-controls"><button class="pill ${metric === 'pop' ? 'on' : ''}" data-metric="pop">Population</button><button class="pill ${metric === 'share' ? 'on' : ''}" data-metric="share">Share of Indonesia</button><span class="map-note">Schematic tile map — one tile per province, placed west to east, north to south. Tap a tile.</span></div>
  <div class="tilemap">${tiles}</div>
  <div class="map-legend">${legend}<span class="leg">${unit}</span></div>
  <p class="map-detail"><strong>${esc(sel.name)}</strong> — ${esc(sel.island)} · Population <strong>${sel.pop.toFixed(1)}m</strong> · <strong>${share}%</strong> of Indonesia · Rank <strong>#${rank} of 38</strong> <span class="stamp">BPS 2024</span></p>`;
}

function provRows(list) {
  return list.map((p, i) => `<tr><td>${i + 1}</td><td>${esc(p.name)}</td><td>${esc(p.island)}</td><td class="num">${p.pop.toFixed(1)}</td><td class="num">${((p.pop / 281.6) * 100).toFixed(1)}%</td></tr>`).join('');
}

function provTable(list, caption) {
  return `<table class="tbl"><caption>${esc(caption)}</caption><thead><tr><th>#</th><th>Province</th><th>Island group</th><th class="num">Population (m)</th><th class="num">Share</th></tr></thead><tbody>${provRows(list)}</tbody></table>`;
}

export function dashboard() {
  const top = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 8);
  return `
  <section class="hero"><p class="eyebrow">Official statistics · Indonesia</p>
  <h1>Indonesia in numbers</h1>
  <p class="lede">281.6 million people, 38 provinces — every figure stamped with its source and year.</p>
  <p class="hero-links"><a class="btn" href="#/economy">Explore the economy →</a><a class="btn ghost" href="#/data">Download the data</a></p></section>
  <section class="proof"><div><strong>38</strong><span>provinces, one map</span></div><div><strong>${FIGURE_COUNT}</strong><span>figures, all stamped</span></div><div><strong>2</strong><span>publishers, read 26 Nov 2026</span></div><div><strong>10 yrs</strong><span>series, 2015–2024</span></div></section>
  <div class="grid-map">
  <section class="card map-card"><header class="card-head"><div class="card-titles"><h2>Indonesia by province, 2024</h2><p>Population by province, millions · tap a tile for the detail</p></div><span class="stamp big">BPS 2024</span></header><div id="provincemap">${provinceMap('WJ', 'pop')}</div><p class="map-decade">${decadeLine()}</p></section>
  ${kpiCards(true)}
  </div>
  <div class="grid2">
  ${card('Economic growth, 2015–2024', 'Real GDP growth, % per year · 2020 trough −2.07%, 2022 peak 5.31%', lineChart({ labels: YEARS.map(String), series: [GDP_GROWTH], yLabel: 'GDP growth' }), '', 'BPS 2024')}
  ${card('Where people live', 'Population by island group, millions · 2024', hbars({ rows: ISLANDS.map((i) => ({ name: i.name, value: i.pop })), suffix: 'm' }), '', 'BPS 2024')}
  </div>
  <div class="grid2">
  ${card('Largest provinces', 'Mid-2024 estimates, millions', provTable(top, 'The eight largest provinces hold two-thirds of the population.'), '', 'BPS 2024')}
  <section class="card"><header class="card-head"><h2>Key findings</h2><p>What the latest releases show</p></header><ul class="findings">${FINDINGS.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
  <h3 class="subhead">Latest releases</h3><ul class="releases">${RELEASES.slice(0, 4).map((r) => `<li><span class="rel-date">${esc(r.date)}</span><strong>${esc(r.title)}</strong><span>${esc(r.detail)}</span></li>`).join('')}</ul></section>
  </div>
  <p class="src">Sources: BPS — Statistics Indonesia (bps.go.id); Bank Indonesia (bi.go.id). Every figure on this site is stamped with its source and year. Updated ${esc(META.updated)}.</p>`;
}

export function population() {
  return `
  <section class="pagehead"><h1>Population</h1><p>281.6 million people in mid-2024 — the world's fourth-largest population, still growing at about 1% a year.</p></section>
  ${kpiCards()}
  <div class="grid2">
  ${card('Age structure, 2024', 'Share of total population, % · BPS estimates', pyramid({ rows: PYRAMID }), '', 'BPS 2024')}
  ${card('Population growth', 'Millions, 2015–2024', lineChart({ labels: YEARS.map(String), series: [POPULATION], yLabel: 'Population', color: '#12b76a', ymin: 240 }), '', 'BPS 2024')}
  </div>
  ${card('All 38 provinces', 'Mid-2024 estimates, millions · sorted largest first', provTable([...PROVINCES].sort((a, b) => b.pop - a.pop), 'Java holds 55% of the population on about 7% of the land.'), '', 'BPS 2024')}
  <p class="src">${esc(META.sourceNote)}</p>`;
}

export function economy(state) {
  const y = state.year;
  const g = GDP_BY_YEAR[y];
  const years = Object.keys(GDP_BY_YEAR).map(Number);
  return `
  <section class="pagehead"><h1>Economy</h1><p>Gross domestic product, growth, trade and the structure of the economy — with a year selector that updates every figure on this page.</p></section>
  <div class="controls" role="group" aria-label="Choose a year">${years.map((yy) => `<button class="pill ${yy === y ? 'on' : ''}" data-year="${yy}">${yy}</button>`).join('')}</div>
  <section class="kpis">
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">GDP, ${y} (current prices)</span><span class="stamp">BPS ${y}</span></span><span class="kpi-value">Rp${fmt(g.gdp)} trillion</span><span class="kpi-sub">US$${(g.gdp / 16.162).toFixed(0)} billion at end-2024 rate</span><span class="kpi-change">Per capita Rp${fmt(g.perCapita)}</span></div>
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Real growth, ${y}</span><span class="stamp">BPS ${y}</span></span><span class="kpi-value">${g.growth.toFixed(2)}%</span><span class="kpi-sub">Year on year, constant prices</span><span class="kpi-change">2024: 5.03% · 2023: 5.05%</span></div>
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Exports, ${y}</span><span class="stamp">BPS ${y}</span></span><span class="kpi-value">US$${(TRADE.find((t) => t.year === y) ?? TRADE[4]).exports.toFixed(2)}bn</span><span class="kpi-sub">Trade surplus US$${(TRADE.find((t) => t.year === y) ?? TRADE[4]).balance.toFixed(2)}bn</span><span class="kpi-change">Imports US$${(TRADE.find((t) => t.year === y) ?? TRADE[4]).imports.toFixed(2)}bn</span></div>
  </section>
  <div class="grid2">
  ${card('Growth, 2015–2024', 'Real GDP growth, % · the 2020 contraction and the recovery', vbars({ labels: YEARS.map((v) => String(v).slice(2)), values: GDP_GROWTH, suffix: '%' }), '', 'BPS 2024')}
  ${card('What the economy makes', 'Share of GDP by sector, % · 2024', hbars({ rows: SECTORS.map((s) => ({ name: s.name, value: s.share })), suffix: '%', color: '#12b76a' }), '', 'BPS 2024')}
  </div>
  ${card('Trade balance', 'Exports, imports and surplus, US$ billion · Bank Indonesia / BPS', `<table class="tbl"><thead><tr><th>Year</th><th class="num">Exports</th><th class="num">Imports</th><th class="num">Balance</th></tr></thead><tbody>${TRADE.map((t) => `<tr><td>${t.year}</td><td class="num">${t.exports.toFixed(2)}</td><td class="num">${t.imports.toFixed(2)}</td><td class="num">+${t.balance.toFixed(2)}</td></tr>`).join('')}</tbody></table>`, '', 'BPS 2024')}
  <p class="src">${esc(META.sourceNote)} Exchange rate: Rp16,162 per US$ at end-2024 (Bank Indonesia).</p>`;
}

export function prices() {
  return `
  <section class="pagehead"><h1>Prices &amp; inflation</h1><p>Consumer prices rose 1.57% in the year to December 2024 — the lowest year-end reading of the decade — after the 5.51% spike of 2022.</p></section>
  <section class="kpis">
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Inflation, Dec 2024</span><span class="stamp">BPS 2024</span></span><span class="kpi-value">1.57%</span><span class="kpi-sub">Year on year</span><span class="kpi-change">Within Bank Indonesia's 1.5–3.5% target</span></div>
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Annual average, 2024</span><span class="stamp">BPS 2024</span></span><span class="kpi-value">2.29%</span><span class="kpi-sub">Average CPI inflation</span><span class="kpi-change">2023: 3.69% · 2022: 4.21%</span></div>
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Peak of the decade</span><span class="stamp">BPS 2022</span></span><span class="kpi-value">5.51%</span><span class="kpi-sub">December 2022, year on year</span><span class="kpi-change">Driven by the fuel-price adjustment</span></div>
  </section>
  <div class="grid2">
  ${card('Inflation, year-end vs annual average', 'Consumer Price Index, % · BPS', lineChart({ labels: YEARS.map(String), series: [INFLATION_DEC, INFLATION_AVG], color: '#0b5fff', color2: '#f79009', yLabel: 'Inflation' }) + '<p class="legend"><span class="sw blue"></span>December, year on year &nbsp; <span class="sw amber"></span>Annual average</p>', '', 'BPS 2024')}
  ${card('Annual average inflation', '% per year · the 2022 spike stands out', vbars({ labels: YEARS.map((v) => String(v).slice(2)), values: INFLATION_AVG, color: '#f79009', suffix: '%' }), '', 'BPS 2024')}
  </div>
  <p class="src">${esc(META.sourceNote)} CPI base year 2022 = 100; 90 cities surveyed.</p>`;
}

export function labour() {
  return `
  <section class="pagehead"><h1>Labour</h1><p>155 million people work in Indonesia. Unemployment fell to 4.76% in February 2025, its lowest in a decade, while agriculture still employs more than a quarter of workers.</p></section>
  <section class="kpis">
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Unemployment rate</span><span class="stamp">BPS 2025</span></span><span class="kpi-value">4.76%</span><span class="kpi-sub">February 2025</span><span class="kpi-change">7.21 million people unemployed</span></div>
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Labour force</span><span class="stamp">BPS 2025</span></span><span class="kpi-value">153.1m</span><span class="kpi-sub">February 2025</span><span class="kpi-change">Participation rate 70.6%</span></div>
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Informal workers</span><span class="stamp">BPS 2025</span></span><span class="kpi-value">57.6%</span><span class="kpi-sub">Of all employed, Feb 2025</span><span class="kpi-change">Formal employment 42.4%</span></div>
  </section>
  <div class="grid2">
  ${card('Unemployment, 2015–2024', 'Open unemployment rate, % · August each year', lineChart({ labels: YEARS.map(String), series: [UNEMPLOYMENT], yLabel: 'Unemployment', color: '#d92d20', ymin: 4 }), '', 'BPS 2024')}
  ${card('Where people work', 'Share of employment by sector, % · 2024', hbars({ rows: EMPLOYMENT.map((e) => ({ name: e.name, value: e.share })), suffix: '%', color: '#12b76a' }), '', 'BPS 2024')}
  </div>
  <p class="src">${esc(META.sourceNote)} Labour Force Survey (Sakernas), BPS.</p>`;
}

export function social() {
  return `
  <section class="pagehead"><h1>Society &amp; living standards</h1><p>Poverty is at its lowest on record, schooling keeps rising, and the Human Development Index reached 75.02 in 2024 — firmly in the high category.</p></section>
  <section class="kpis">
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Poverty rate</span><span class="stamp">BPS 2025</span></span><span class="kpi-value">8.47%</span><span class="kpi-sub">March 2025 · 24.06m people</span><span class="kpi-change">Rural 11.2% · Urban 7.0%</span></div>
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Life expectancy</span><span class="stamp">BPS 2024</span></span><span class="kpi-value">74.15 yrs</span><span class="kpi-sub">2024</span><span class="kpi-change">Up from 71.9 in 2019</span></div>
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Mean years of schooling</span><span class="stamp">BPS 2024</span></span><span class="kpi-value">9.21 yrs</span><span class="kpi-sub">2024 · expected 13.21 yrs</span><span class="kpi-change">Literacy 96.4% (ages 15+)</span></div>
  </section>
  <div class="grid2">
  ${card('Poverty rate, 2015–2024', '% of population · March each year', lineChart({ labels: YEARS.map(String), series: [POVERTY], yLabel: 'Poverty', color: '#0b5fff', ymin: 8 }), '', 'BPS 2025')}
  ${card('Human Development Index', 'Composite of health, education and income · BPS', lineChart({ labels: YEARS.map(String), series: [HDI], yLabel: 'HDI', color: '#12b76a', ymin: 68 }), '', 'BPS 2024')}
  </div>
  <p class="src">${esc(META.sourceNote)} Poverty line, March 2025: Rp609,160 per capita per month.</p>`;
}

export function regions(state) {
  const q = state.q.toLowerCase();
  let list = PROVINCES.filter((p) => !q || p.name.toLowerCase().includes(q) || p.island.toLowerCase().includes(q));
  if (state.sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  else if (state.sort === 'island') list = [...list].sort((a, b) => a.island.localeCompare(b.island) || b.pop - a.pop);
  else list = [...list].sort((a, b) => b.pop - a.pop);
  return `
  <section class="pagehead"><h1>Regions</h1><p>All 38 provinces, searchable and sortable. Jakarta is the densest province; West Java the largest, with 50.4 million people — more than Spain.</p></section>
  <div class="controls"><input id="q" type="search" placeholder="Search a province or island group…" value="${esc(state.q)}" aria-label="Search provinces">
  <label>Sort by <select id="sort"><option value="pop" ${state.sort === 'pop' ? 'selected' : ''}>Population</option><option value="name" ${state.sort === 'name' ? 'selected' : ''}>Name A–Z</option><option value="island" ${state.sort === 'island' ? 'selected' : ''}>Island group</option></select></label>
  <span class="count">${list.length} of 38 provinces</span></div>
  ${card('Provinces of Indonesia', 'Mid-2024 population estimates, millions · BPS', provTable(list, list.length === 38 ? 'Sorted largest first. Shares are of the national 281.6 million.' : `${list.length} provinces match your search.`), '', 'BPS 2024')}
  <p class="src">${esc(META.sourceNote)}</p>`;
}

export function dataPage() {
  return `
  <section class="pagehead"><h1>Data &amp; methodology</h1><p>Every figure on this site, downloadable as CSV, with its source and the notes a careful reader needs.</p></section>
  <div class="grid2">
  ${card('Download the data', 'CSV files generated in your browser from the same data this site displays', `<p>Two files, no sign-up, no tracking.</p><p><button class="btn" data-download="provinces">↓ Provinces (38 rows, CSV)</button></p><p><button class="btn" data-download="annual">↓ Annual indicators 2015–2024 (CSV)</button></p><p class="fine">Downloads are generated locally from the site's own data — nothing is sent anywhere.</p>`)}
  ${card('Release calendar', 'The next scheduled releases', `<ul class="releases">${RELEASES.map((r) => `<li><span class="rel-date">${esc(r.date)}</span><strong>${esc(r.title)}</strong><span>${esc(r.detail)}</span></li>`).join('')}</ul>`)}
  </div>
  ${card('Methodology', 'How the figures are made', `<ul class="findings"><li><strong>Population:</strong> 2020 Population Census, updated with intercensal projections; provincial figures are mid-year estimates.</li><li><strong>GDP:</strong> national accounts at current and constant 2010 prices; growth is year on year in constant prices.</li><li><strong>Inflation:</strong> Consumer Price Index, base year 2022 = 100, surveyed monthly in 90 cities.</li><li><strong>Labour:</strong> National Labour Force Survey (Sakernas), held twice a year; unemployment is the open rate.</li><li><strong>Poverty:</strong> National Socio-Economic Survey (Susenas), March and September; the line is the cost of a minimum food and non-food basket.</li><li><strong>HDI:</strong> composite of life expectancy, expected and mean years of schooling, and adjusted per-capita expenditure.</li></ul>`)}
  ${card('Sources &amp; citation', 'Where every number comes from', `<table class="tbl"><thead><tr><th>Indicator</th><th>Publication</th><th>Year</th></tr></thead><tbody><tr><td>Population</td><td>BPS, Intercensal Population Projection</td><td>2024</td></tr><tr><td>GDP &amp; growth</td><td>BPS, National Accounts (GDP)</td><td>2024</td></tr><tr><td>Inflation</td><td>BPS, Consumer Price Index</td><td>2024</td></tr><tr><td>Unemployment</td><td>BPS, Labour Force Survey (Sakernas)</td><td>Feb 2025</td></tr><tr><td>Poverty</td><td>BPS, Socio-Economic Survey (Susenas)</td><td>Mar 2025</td></tr><tr><td>HDI &amp; life expectancy</td><td>BPS, Human Development Index</td><td>2024</td></tr><tr><td>Trade &amp; exchange rate</td><td>Bank Indonesia / BPS trade statistics</td><td>2024</td></tr></tbody></table><p>BPS — Statistics Indonesia (bps.go.id): population, GDP, CPI, Sakernas, Susenas, HDI. Bank Indonesia (bi.go.id): exchange rate and trade. Cite as: “Statistik Indonesia, figures from BPS — Statistics Indonesia, accessed November 2026.”</p><p class="fine">This site is an original presentation of published official statistics. It is not affiliated with BPS or the Government of Indonesia.</p>`)}
  <p class="src">${esc(META.sourceNote)}</p>`;
}

export function missing() {
  return `<section class="pagehead"><h1>Page not found</h1><p>There is no page at this address. Try one of the sections above — every page on this site is reached from the navigation.</p><p><a class="btn" href="#/">← Back to the dashboard</a></p></section>`;
}
