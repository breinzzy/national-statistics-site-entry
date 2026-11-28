// Page views for Statistik Indonesia (v4 editorial redesign). Every view is a
// function of the shared data plus the page's own control state (economy year,
// regions search/sort, duel picks, indicator browser, population year). All
// text is escaped before it goes into the page.

import {
  KPI, YEARS, GDP_GROWTH, INFLATION_DEC, INFLATION_AVG, UNEMPLOYMENT, POVERTY,
  HDI, POPULATION, GDP_BY_YEAR, GDP_NOMINAL, GDP_PER_CAPITA, EXCHANGE_RATE,
  DENSITY, LIFE_EXPECTANCY, SECTORS, ISLANDS, TRADE, EMPLOYMENT, PYRAMID, PROVINCES, PROV_TOTAL, RELEASES,
  FINDINGS, META, FIGURE_COUNT, MAP_BINS, INDICATORS,
} from './data.js';
import { lineChart, hbars, vbars, pyramid } from './charts.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const fmt = (n) => n.toLocaleString('en-US');

// Sparkline for a KPI card: the indicator's 2015-2024 annual series as a
// small line, so the trend is visible on the card itself.
const SPARKS = { 'Population': POPULATION, 'GDP growth': GDP_GROWTH, 'Inflation': INFLATION_DEC, 'Unemployment': UNEMPLOYMENT, 'Poverty rate': POVERTY, 'Human Development Index': HDI, 'Life expectancy': LIFE_EXPECTANCY, 'Exports': TRADE.map((t) => t.exports) };
function sparkline(values) {
  const min = Math.min(...values), max = Math.max(...values), span = (max - min) || 1;
  const pts = values.map((v, i) => `${((i / (values.length - 1)) * 100).toFixed(1)},${((1 - (v - min) / span) * 24 + 2).toFixed(1)}`).join(' ');
  const lx = 100, ly = (1 - (values[values.length - 1] - min) / span) * 24 + 2;
  return `<svg class="spark" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="#1d6b4a" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${lx}" cy="${ly.toFixed(1)}" r="2.6" fill="#1d6b4a"/></svg>`;
}

// A decade of change, computed from the site's own 2015-2025 series (not new
// figures — the deltas reuse points already counted in FIGURE_COUNT).
function decadeLine() {
  const popD = POPULATION.at(-1) - POPULATION[0];
  const povD = POVERTY.at(-1) - POVERTY[0];
  const avgG = GDP_GROWTH.reduce((a, b) => a + b, 0) / GDP_GROWTH.length;
  const unD = UNEMPLOYMENT.at(-1) - UNEMPLOYMENT[0];
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
    return `<button class="tile${sel}" style="grid-column:${p.map[0] + 1};grid-row:${p.map[1] + 1};background:${bin.color};color:${bin.dark ? '#fff' : '#1c2420'}" data-code="${p.code}" title="${esc(p.name)} — ${p.pop.toFixed(1)}m people">${p.code}</button>`;
  }).join('');
  const sel = PROVINCES.find((p) => p.code === selectedCode) ?? PROVINCES[0];
  const rank = [...PROVINCES].sort((a, b) => b.pop - a.pop).findIndex((p) => p.code === sel.code) + 1;
  const share = ((sel.pop / PROV_TOTAL) * 100).toFixed(1);
  const pct = (m) => ((m / PROV_TOTAL) * 100).toFixed(1);
  const labels = metric === 'share'
    ? [`${pct(40)}%+`, `${pct(10)}–${pct(40)}%`, `${pct(5)}–${pct(10)}%`, `${pct(2)}–${pct(5)}%`, `Under ${pct(2)}%`]
    : MAP_BINS.map((b) => b.label);
  const legend = MAP_BINS.map((b, i) => `<span class="leg"><span class="sw" style="background:${b.color}"></span>${labels[i]}</span>`).join('');
  const unit = metric === 'share' ? 'Share of Indonesia, % · SUPAS 2025 · BPS' : 'Population, millions · SUPAS 2025 · BPS';
  return `<div class="map-controls"><button class="pill ${metric === 'pop' ? 'on' : ''}" data-metric="pop">Population</button><button class="pill ${metric === 'share' ? 'on' : ''}" data-metric="share">Share of Indonesia</button><span class="map-note">Schematic tile map — one tile per province, placed west to east, north to south. Tap a tile.</span></div>
  <div class="tilemap">${tiles}</div>
  <div class="map-legend">${legend}<span class="leg">${unit}</span></div>
  <p class="map-detail"><strong>${esc(sel.name)}</strong> — ${esc(sel.island)} · Population <strong>${sel.pop.toFixed(1)}m</strong> · <strong>${share}%</strong> of Indonesia · Rank <strong>#${rank} of 38</strong> <span class="stamp">SUPAS 2025</span></p>`;
}

function provRows(list) {
  return list.map((p, i) => `<tr><td>${i + 1}</td><td>${esc(p.name)}</td><td>${esc(p.island)}</td><td class="num">${p.pop.toFixed(1)}</td><td class="num">${((p.pop / PROV_TOTAL) * 100).toFixed(1)}%</td></tr>`).join('');
}

function provTable(list, caption) {
  return `<table class="tbl"><caption>${esc(caption)}</caption><thead><tr><th>#</th><th>Province</th><th>Island group</th><th class="num">Population (m)</th><th class="num">Share</th></tr></thead><tbody>${provRows(list)}</tbody></table>`;
}

export function dashboard() {
  const top = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 8);
  return `
  <section class="hero-band"><p class="eyebrow">National statistics · Indonesia · BPS 2025</p>
  <h1>The archipelago, <em>in numbers.</em></h1>
  <p class="lede">284.4 million people live across 38 provinces — from Aceh to Papua. In 2025 the economy grew 5.11% and poverty fell to 8.25%. Every figure is stamped with its source and year.</p>
  <p class="hero-links"><a class="btn" href="#/duel">Duel two provinces →</a><a class="btn ghost" href="#/indicators">Browse 14 indicators →</a><a class="btn ghost" href="#/population">Slide through 2015–2025 →</a></p></section>
  <section class="proof"><div><strong>38</strong><span>provinces, one map</span></div><div><strong>${FIGURE_COUNT}</strong><span>figures, all stamped</span></div><div><strong>14</strong><span>indicators, searchable</span></div><div><strong>11 yrs</strong><span>series, 2015–2025</span></div></section>
  <div class="grid-map">
  <section class="card map-card"><header class="card-head"><div class="card-titles"><h2>Indonesia by province, 2025</h2><p>Population by province, millions · tap a tile for the detail</p></div><span class="stamp big">SUPAS 2025</span></header><div id="provincemap">${provinceMap('WJ', 'pop')}</div><p class="map-decade">${decadeLine()}</p></section>
  ${kpiCards(true)}
  </div>
  <section class="stories">
  <article class="story"><p class="kicker">Where people live</p><h3>Java holds 56% of the people on 7% of the land</h3><p>158.4 million people live on Java — more than Russia. The other five island groups share the rest. <span class="stamp">SUPAS 2025</span></p></article>
  <article class="story"><p class="kicker">The decade</p><h3>Poverty is at its lowest on record</h3><p>8.25% in September 2025, down from 11.22% in 2015 — falling every year since 2021. <span class="stamp">BPS 2025</span></p></article>
  <article class="story"><p class="kicker">The economy</p><h3>Five percent a year, almost every year</h3><p>Growth has held near 5% since the 2020 contraction, reaching Rp23,821 trillion in 2025. <span class="stamp">BPS 2025</span></p></article>
  </section>
  <div class="grid2">
  ${card('Economic growth, 2015–2025', 'Real GDP growth, % per year · 2020 trough −2.07% · 2025: 5.11%', lineChart({ labels: YEARS.map(String), series: [GDP_GROWTH], yLabel: 'GDP growth', color: '#1d6b4a' }), '', 'BPS 2025')}
  ${card('Where people live', 'Population by island group, millions · 2025', hbars({ rows: ISLANDS.map((i) => ({ name: i.name, value: i.pop })), suffix: 'm', color: '#1d6b4a' }), '', 'SUPAS 2025')}
  </div>
  <div class="grid2">
  ${card('Largest provinces', 'SUPAS 2025 counts, millions', provTable(top, 'The eight largest provinces hold two-thirds of the population.'), '', 'SUPAS 2025')}
  <section class="card"><header class="card-head"><h2>Key findings</h2><p>What the latest releases show</p></header><ul class="findings">${FINDINGS.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
  <h3 class="subhead">Latest releases</h3><ul class="releases">${RELEASES.slice(0, 4).map((r) => `<li><span class="rel-date">${esc(r.date)}</span><strong>${esc(r.title)}</strong><span>${esc(r.detail)}</span></li>`).join('')}</ul></section>
  </div>
  <p class="src">Sources: BPS — Statistics Indonesia (bps.go.id); Bank Indonesia (bi.go.id). Every figure on this site is stamped with its source and year. Updated ${esc(META.updated)}.</p>`;
}

// --- Province duel: two provinces head to head ---------------------------

function duelCol(p, other, cls) {
  const rank = [...PROVINCES].sort((a, b) => b.pop - a.pop).findIndex((x) => x.code === p.code) + 1;
  const share = (p.pop / PROV_TOTAL) * 100;
  const maxPop = Math.max(p.pop, other.pop);
  const maxShare = Math.max(share, (other.pop / PROV_TOTAL) * 100);
  const bar = (v, max) => `<div class="duel-bar"><i class="${cls}" style="width:${((v / max) * 100).toFixed(1)}%"></i></div>`;
  return `<section class="card duel-col"><h3>${esc(p.name)}</h3><p class="duel-sub">${esc(p.island)} · Rank #${rank} of 38 <span class="stamp">SUPAS 2025</span></p>
  <div class="duel-metric"><div class="dm-label"><span>Population</span><strong>${p.pop.toFixed(1)}m</strong></div>${bar(p.pop, maxPop)}</div>
  <div class="duel-metric"><div class="dm-label"><span>Share of Indonesia</span><strong>${share.toFixed(1)}%</strong></div>${bar(share, maxShare)}</div>
  <div class="duel-metric"><div class="dm-label"><span>Rank by population</span><strong>#${rank}</strong></div>${bar(39 - rank, 38)}</div></section>`;
}

export function duel(state) {
  const a = PROVINCES.find((p) => p.code === state.duelA) ?? PROVINCES[0];
  const b = PROVINCES.find((p) => p.code === state.duelB) ?? PROVINCES[1];
  const opts = (sel) => PROVINCES.map((p) => `<option value="${p.code}" ${p.code === sel ? 'selected' : ''}>${esc(p.name)} — ${p.pop.toFixed(1)}m</option>`).join('');
  const diff = Math.abs(a.pop - b.pop).toFixed(1);
  const bigger = a.pop >= b.pop ? a : b;
  const smaller = a.pop >= b.pop ? b : a;
  const verdict = a.code === b.code
    ? 'Pick two different provinces to see them head to head.'
    : `${bigger.name} has ${diff} million more people than ${smaller.name} — ${bigger.name} alone is home to ${((bigger.pop / PROV_TOTAL) * 100).toFixed(1)}% of Indonesia, ranked #${[...PROVINCES].sort((x, y) => y.pop - x.pop).findIndex((x) => x.code === bigger.code) + 1} of 38 provinces.`;
  return `
  <section class="pagehead"><h1>Duel two provinces</h1><p>Pick any two of the 38 provinces and see them head to head — population, share of the country, and rank. Every figure is a BPS SUPAS 2025 count.</p></section>
  <div class="controls duel-picks"><select id="duel-a" aria-label="First province">${opts(a.code)}</select><span class="duel-vs">vs</span><select id="duel-b" aria-label="Second province">${opts(b.code)}</select><button class="pill" id="duel-swap">Swap ↺</button></div>
  <p class="verdict">${esc(verdict)}</p>
  <div class="duel-grid">${duelCol(a, b, 'a')}${duelCol(b, a, 'b')}</div>
  ${card('The five largest provinces', 'SUPAS 2025 counts, millions · BPS', provTable([...PROVINCES].sort((x, y) => y.pop - x.pop).slice(0, 5), 'West Java alone has more people than Spain.'), '', 'SUPAS 2025')}
  <p class="src">Sources: BPS — Statistics Indonesia, SUPAS 2025 provincial counts. Shares are of the national 284.7 million.</p>`;
}

// --- Indicator browser ----------------------------------------------------

function fmtInd(ind, v) {
  const num = Number(v).toLocaleString('en-US', { minimumFractionDigits: ind.dec, maximumFractionDigits: ind.dec });
  return `${ind.prefix ?? ''}${num}${ind.suffix ? ' ' + ind.suffix : ''}`;
}

function indDelta(ind) {
  const first = ind.values[0], last = ind.values[ind.values.length - 1];
  const d = last - first;
  const pct = first !== 0 ? (d / Math.abs(first)) * 100 : 0;
  const sign = d > 0 ? '+' : d < 0 ? '−' : '';
  return { d, pct, text: `${sign}${fmtInd(ind, Math.abs(d)).replace(ind.prefix ?? '', '').trim()} (${sign}${Math.abs(pct).toFixed(1)}%)`, up: d > 0, down: d < 0 };
}

export function indicators(state) {
  const q = state.indQ.toLowerCase();
  let list = INDICATORS.filter((ind) => !q || ind.label.toLowerCase().includes(q) || ind.unit.toLowerCase().includes(q));
  if (state.indFilter === 'rising') list = list.filter((ind) => indDelta(ind).up);
  else if (state.indFilter === 'falling') list = list.filter((ind) => indDelta(ind).down);
  if (state.indSort === 'name') list = [...list].sort((a, b) => a.label.localeCompare(b.label));
  else if (state.indSort === 'value') list = [...list].sort((a, b) => b.values[b.values.length - 1] - a.values[a.values.length - 1]);
  else list = [...list].sort((a, b) => Math.abs(indDelta(b).pct) - Math.abs(indDelta(a).pct));
  const rising = INDICATORS.filter((ind) => indDelta(ind).up).length;
  const falling = INDICATORS.filter((ind) => indDelta(ind).down).length;
  const sel = INDICATORS.find((ind) => ind.id === state.indSel) ?? INDICATORS[0];
  const last = sel.values[sel.values.length - 1];
  const first = sel.values[0];
  const hi = Math.max(...sel.values), lo = Math.min(...sel.values);
  const d = indDelta(sel);
  const rows = sel.years.map((y, i) => {
    const v = sel.values[i];
    const prev = i > 0 ? sel.values[i - 1] : null;
    const ch = prev === null ? '—' : `${v >= prev ? '+' : '−'}${fmtInd(sel, Math.abs(v - prev)).replace(sel.prefix ?? '', '').trim()}`;
    return `<tr><td>${y}</td><td class="num">${fmtInd(sel, v)}</td><td class="num">${ch}</td></tr>`;
  }).join('');
  return `
  <section class="pagehead"><h1>Browse the indicators</h1><p>All ${INDICATORS.length} annual series on this site — search them, sort them, open one for its full history. Every value is stamped with its source and year.</p></section>
  <div class="controls"><input id="ind-q" type="search" placeholder="Search an indicator…" value="${esc(state.indQ)}" aria-label="Search indicators">
  <button class="pill ${state.indFilter === 'all' ? 'on' : ''}" data-ind-filter="all">All ${INDICATORS.length}</button>
  <button class="pill ${state.indFilter === 'rising' ? 'on' : ''}" data-ind-filter="rising">Rising ${rising}</button>
  <button class="pill ${state.indFilter === 'falling' ? 'on' : ''}" data-ind-filter="falling">Falling ${falling}</button>
  <label>Sort by <select id="ind-sort"><option value="change" ${state.indSort === 'change' ? 'selected' : ''}>Biggest change</option><option value="name" ${state.indSort === 'name' ? 'selected' : ''}>Name A–Z</option><option value="value" ${state.indSort === 'value' ? 'selected' : ''}>Latest value</option></select></label>
  <span class="count">${list.length} of ${INDICATORS.length} indicators</span></div>
  <div class="ind-wrap">
  <div class="ind-list">${list.map((ind) => {
    const dd = indDelta(ind);
    return `<button class="ind-row ${ind.id === sel.id ? 'on' : ''}" data-ind="${ind.id}"><span class="ir-top"><span class="ir-label">${esc(ind.label)}</span><span class="ir-val">${fmtInd(ind, ind.values[ind.values.length - 1])}</span></span><span class="ir-sub"><span>${esc(ind.unit)} · ${esc(ind.src)}</span><span class="ir-delta ${dd.up ? 'up' : dd.down ? 'down' : ''}">${dd.up ? '▲' : dd.down ? '▼' : '—'} ${dd.text}</span></span></button>`;
  }).join('') || '<p class="fine">No indicator matches your search.</p>'}</div>
  <section class="card ind-detail"><header class="card-head"><div class="card-titles"><h2>${esc(sel.label)}</h2><p>${esc(sel.blurb)}</p></div><span class="stamp big">${esc(sel.src)}</span></header>
  <p class="ind-big">${fmtInd(sel, last)} <small>${esc(sel.unit)}</small></p>
  <p class="fine">Latest value, ${sel.years[sel.years.length - 1]} · ${d.up ? 'up' : d.down ? 'down' : 'flat'} ${d.text} since ${sel.years[0]}</p>
  <div class="statboxes">
  <div class="statbox"><span>Highest</span><strong>${fmtInd(sel, hi)}</strong></div>
  <div class="statbox"><span>Lowest</span><strong>${fmtInd(sel, lo)}</strong></div>
  <div class="statbox"><span>Range</span><strong>${sel.years[0]}–${sel.years[sel.years.length - 1]}</strong></div>
  <div class="statbox"><span>Data points</span><strong>${sel.values.length}</strong></div>
  </div>
  ${lineChart({ labels: sel.years.map(String), series: [sel.values], yLabel: sel.label, color: '#1d6b4a' })}
  <table class="tbl"><caption>Annual values — change is against the previous year.</caption><thead><tr><th>Year</th><th class="num">Value</th><th class="num">Change</th></tr></thead><tbody>${rows}</tbody></table>
  </section>
  </div>
  <p class="src">Sources: BPS — Statistics Indonesia; Bank Indonesia. ${esc(META.sourceNote)}</p>`;
}

export function population(state) {
  const i = YEARS.indexOf(state.popYear);
  const snap = [
    { label: `Population, ${state.popYear}`, value: `${POPULATION[i].toFixed(1)}m`, sub: 'Mid-year estimate', change: `+${(POPULATION[i] - POPULATION[0]).toFixed(1)}m since 2015`, src: `BPS ${state.popYear}` },
    { label: `GDP growth, ${state.popYear}`, value: `${GDP_GROWTH[i].toFixed(2)}%`, sub: 'Real, year on year', change: GDP_GROWTH[i] < 0 ? 'The 2020 contraction' : 'Near the 5% trend', src: `BPS ${state.popYear}` },
    { label: `HDI, ${state.popYear}`, value: HDI[i].toFixed(2), sub: 'Human Development Index', change: `+${(HDI[i] - HDI[0]).toFixed(2)} points since 2015`, src: `BPS ${state.popYear}` },
  ];
  return `
  <section class="pagehead"><h1>Population</h1><p>284.4 million people in mid-2025 — the world's fourth-largest population, still growing at about 1% a year. Slide through the decade to see any year.</p></section>
  <div class="slider-row"><label for="pop-year">Slide through the decade</label><input id="pop-year" type="range" min="2015" max="2025" step="1" value="${state.popYear}" aria-label="Choose a year"><span class="slider-year">${state.popYear}</span></div>
  <section class="kpis">${snap.map((k) => `<div class="kpi"><span class="kpi-top"><span class="kpi-label">${esc(k.label)}</span><span class="stamp">${esc(k.src)}</span></span><span class="kpi-value">${esc(k.value)}</span><span class="kpi-sub">${esc(k.sub)}</span><span class="kpi-change">${esc(k.change)}</span></div>`).join('')}</section>
  ${kpiCards()}
  <div class="grid2">
  ${card('Age structure, 2024', 'Share of total population, % · BPS estimates', pyramid({ rows: PYRAMID }), '', 'BPS 2024')}
  ${card('Population growth', 'Millions, 2015–2025', lineChart({ labels: YEARS.map(String), series: [POPULATION], yLabel: 'Population', color: '#1d6b4a', ymin: 240 }), '', 'BPS 2025')}
  </div>
  ${card('All 38 provinces', 'SUPAS 2025 counts, millions · sorted largest first', provTable([...PROVINCES].sort((a, b) => b.pop - a.pop), 'Java holds 56% of the population on about 7% of the land.'), '', 'SUPAS 2025')}
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
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">GDP, ${y} (current prices)</span><span class="stamp">BPS ${y}</span></span><span class="kpi-value">Rp${fmt(g.gdp)} trillion</span><span class="kpi-sub">US$${(g.gdp * 1000 / EXCHANGE_RATE[YEARS.indexOf(y)]).toFixed(0)} billion at end-${y} rate</span><span class="kpi-change">Per capita Rp${fmt(g.perCapita)}</span></div>
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Real growth, ${y}</span><span class="stamp">BPS ${y}</span></span><span class="kpi-value">${g.growth.toFixed(2)}%</span><span class="kpi-sub">Year on year, constant prices</span><span class="kpi-change">2025: 5.11% · 2024: 5.03%</span></div>
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Exports, ${y}</span><span class="stamp">BPS ${y}</span></span><span class="kpi-value">US$${(TRADE.find((t) => t.year === y) ?? TRADE[4]).exports.toFixed(2)}bn</span><span class="kpi-sub">Trade surplus US$${(TRADE.find((t) => t.year === y) ?? TRADE[4]).balance.toFixed(2)}bn</span><span class="kpi-change">Imports US$${(TRADE.find((t) => t.year === y) ?? TRADE[4]).imports.toFixed(2)}bn</span></div>
  </section>
  <div class="grid2">
  ${card('Growth, 2015–2025', 'Real GDP growth, % · the 2020 contraction and the recovery', vbars({ labels: YEARS.map((v) => String(v).slice(2)), values: GDP_GROWTH, suffix: '%' }), '', 'BPS 2025')}
  ${card('What the economy makes', 'Share of GDP by sector, % · 2024', hbars({ rows: SECTORS.map((s) => ({ name: s.name, value: s.share })), suffix: '%', color: '#1d6b4a' }), '', 'BPS 2024')}
  </div>
  ${card('Trade balance', 'Exports, imports and surplus, US$ billion · Bank Indonesia / BPS', `<table class="tbl"><thead><tr><th>Year</th><th class="num">Exports</th><th class="num">Imports</th><th class="num">Balance</th></tr></thead><tbody>${TRADE.map((t) => `<tr><td>${t.year}</td><td class="num">${t.exports.toFixed(2)}</td><td class="num">${t.imports.toFixed(2)}</td><td class="num">+${t.balance.toFixed(2)}</td></tr>`).join('')}</tbody></table>`, '', 'BPS 2024')}
  <p class="src">${esc(META.sourceNote)} Exchange rate: Rp16,675 per US$ at end-2025 (Bank Indonesia).</p>`;
}

export function prices() {
  return `
  <section class="pagehead"><h1>Prices &amp; inflation</h1><p>Consumer prices rose 2.92% in the year to December 2025 — back inside Bank Indonesia's 2.5±1% target — after the 1.57% low of 2024 and the 5.51% spike of 2022.</p></section>
  <section class="kpis">
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Inflation, Dec 2025</span><span class="stamp">BPS 2025</span></span><span class="kpi-value">2.92%</span><span class="kpi-sub">Year on year</span><span class="kpi-change">Within Bank Indonesia's 2.5±1% target</span></div>
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Annual average, 2024</span><span class="stamp">BPS 2024</span></span><span class="kpi-value">2.29%</span><span class="kpi-sub">Average CPI inflation</span><span class="kpi-change">2023: 3.69% · 2022: 4.21%</span></div>
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Peak of the decade</span><span class="stamp">BPS 2022</span></span><span class="kpi-value">5.51%</span><span class="kpi-sub">December 2022, year on year</span><span class="kpi-change">Driven by the fuel-price adjustment</span></div>
  </section>
  <div class="grid2">
  ${card('Inflation, year-end vs annual average', 'Consumer Price Index, % · BPS · annual average through 2024', lineChart({ labels: YEARS.map(String), series: [INFLATION_DEC, INFLATION_AVG], color: '#1d6b4a', color2: '#b7791f', yLabel: 'Inflation' }) + '<p class="legend"><span class="sw blue"></span>December, year on year &nbsp; <span class="sw amber"></span>Annual average</p>', '', 'BPS 2025')}
  ${card('Annual average inflation', '% per year · the 2022 spike stands out · 2015–2024', vbars({ labels: YEARS.slice(0, 10).map((v) => String(v).slice(2)), values: INFLATION_AVG, color: '#b7791f', suffix: '%' }), '', 'BPS 2024')}
  </div>
  <p class="src">${esc(META.sourceNote)} CPI base year 2022 = 100; 90 cities surveyed.</p>`;
}

export function labour() {
  return `
  <section class="pagehead"><h1>Labour</h1><p>146.5 million people work in Indonesia. Unemployment was 4.85% in August 2025, down from 4.91% a year earlier, while agriculture still employs more than a quarter of workers.</p></section>
  <section class="kpis">
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Unemployment rate</span><span class="stamp">BPS 2025</span></span><span class="kpi-value">4.85%</span><span class="kpi-sub">August 2025</span><span class="kpi-change">7.46 million people unemployed</span></div>
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Labour force</span><span class="stamp">BPS 2025</span></span><span class="kpi-value">154.0m</span><span class="kpi-sub">August 2025</span><span class="kpi-change">Participation rate 70.6%</span></div>
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Informal workers</span><span class="stamp">BPS 2025</span></span><span class="kpi-value">57.8%</span><span class="kpi-sub">Of all employed, Aug 2025</span><span class="kpi-change">Formal employment 42.2%</span></div>
  </section>
  <div class="grid2">
  ${card('Unemployment, 2015–2025', 'Open unemployment rate, % · August each year', lineChart({ labels: YEARS.map(String), series: [UNEMPLOYMENT], yLabel: 'Unemployment', color: '#b42318', ymin: 4 }), '', 'BPS 2025')}
  ${card('Where people work', 'Share of employment by sector, % · 2024', hbars({ rows: EMPLOYMENT.map((e) => ({ name: e.name, value: e.share })), suffix: '%', color: '#1d6b4a' }), '', 'BPS 2024')}
  </div>
  <p class="src">${esc(META.sourceNote)} Labour Force Survey (Sakernas), BPS.</p>`;
}

export function social() {
  return `
  <section class="pagehead"><h1>Society &amp; living standards</h1><p>Poverty is at its lowest on record, schooling keeps rising, and the Human Development Index reached 75.90 in 2025 — firmly in the high category.</p></section>
  <section class="kpis">
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Poverty rate</span><span class="stamp">BPS 2025</span></span><span class="kpi-value">8.25%</span><span class="kpi-sub">September 2025 · 23.36m people</span><span class="kpi-change">Rural 10.7% · Urban 6.6%</span></div>
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Life expectancy</span><span class="stamp">BPS 2025</span></span><span class="kpi-value">74.47 yrs</span><span class="kpi-sub">2025</span><span class="kpi-change">Up 0.32 from 74.15 (2024)</span></div>
    <div class="kpi"><span class="kpi-top"><span class="kpi-label">Mean years of schooling</span><span class="stamp">BPS 2025</span></span><span class="kpi-value">9.07 yrs</span><span class="kpi-sub">2025 · expected 13.30 yrs</span><span class="kpi-change">Literacy 96.4% (ages 15+)</span></div>
  </section>
  <div class="grid2">
  ${card('Poverty rate, 2015–2025', '% of population · March each year', lineChart({ labels: YEARS.map(String), series: [POVERTY], yLabel: 'Poverty', color: '#1d6b4a', ymin: 8 }), '', 'BPS 2025')}
  ${card('Human Development Index', 'Composite of health, education and income · BPS', lineChart({ labels: YEARS.map(String), series: [HDI], yLabel: 'HDI', color: '#1d6b4a', ymin: 68 }), '', 'BPS 2025')}
  </div>
  <p class="src">${esc(META.sourceNote)} Poverty line, September 2025: Rp641,443 per capita per month.</p>`;
}

export function regions(state) {
  const q = state.q.toLowerCase();
  let list = PROVINCES.filter((p) => !q || p.name.toLowerCase().includes(q) || p.island.toLowerCase().includes(q));
  if (state.sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  else if (state.sort === 'island') list = [...list].sort((a, b) => a.island.localeCompare(b.island) || b.pop - a.pop);
  else list = [...list].sort((a, b) => b.pop - a.pop);
  return `
  <section class="pagehead"><h1>Regions</h1><p>All 38 provinces, searchable and sortable. Jakarta is the densest province; West Java the largest, with 50.9 million people — more than Spain.</p></section>
  <div class="controls"><input id="q" type="search" placeholder="Search a province or island group…" value="${esc(state.q)}" aria-label="Search provinces">
  <label>Sort by <select id="sort"><option value="pop" ${state.sort === 'pop' ? 'selected' : ''}>Population</option><option value="name" ${state.sort === 'name' ? 'selected' : ''}>Name A–Z</option><option value="island" ${state.sort === 'island' ? 'selected' : ''}>Island group</option></select></label>
  <span class="count">${list.length} of 38 provinces</span></div>
  ${card('Provinces of Indonesia', 'SUPAS 2025 counts, millions · BPS', provTable(list, list.length === 38 ? 'Sorted largest first. Shares are of the national 284.7 million.' : `${list.length} provinces match your search.`), '', 'SUPAS 2025')}
  <p class="src">${esc(META.sourceNote)}</p>`;
}

export function dataPage() {
  return `
  <section class="pagehead"><h1>Data &amp; methodology</h1><p>Every figure on this site, downloadable as CSV, with its source and the notes a careful reader needs.</p></section>
  <div class="grid2">
  ${card('Download the data', 'CSV files generated in your browser from the same data this site displays', `<p>Two files, no sign-up, no tracking.</p><p><button class="btn light" data-download="provinces">↓ Provinces (38 rows, CSV)</button></p><p><button class="btn light" data-download="annual">↓ Annual indicators 2015–2025 (CSV)</button></p><p class="fine">Downloads are generated locally from the site's own data — nothing is sent anywhere.</p>`)}
  ${card('Release calendar', 'The next scheduled releases', `<ul class="releases">${RELEASES.map((r) => `<li><span class="rel-date">${esc(r.date)}</span><strong>${esc(r.title)}</strong><span>${esc(r.detail)}</span></li>`).join('')}</ul>`)}
  </div>
  ${card('Methodology', 'How the figures are made', `<ul class="findings"><li><strong>Population:</strong> 2020 Population Census and the 2025 Intercensal Population Survey (SUPAS 2025); provincial figures are SUPAS 2025 counts.</li><li><strong>GDP:</strong> national accounts at current and constant 2010 prices; growth is year on year in constant prices.</li><li><strong>Inflation:</strong> Consumer Price Index, base year 2022 = 100, surveyed monthly in 90 cities.</li><li><strong>Labour:</strong> National Labour Force Survey (Sakernas), held twice a year; unemployment is the open rate.</li><li><strong>Poverty:</strong> National Socio-Economic Survey (Susenas), March and September; the line is the cost of a minimum food and non-food basket.</li><li><strong>HDI:</strong> composite of life expectancy, expected and mean years of schooling, and adjusted per-capita expenditure.</li></ul>`)}
  ${card('Sources &amp; citation', 'Where every number comes from', `<table class="tbl"><thead><tr><th>Indicator</th><th>Publication</th><th>Year</th></tr></thead><tbody><tr><td>Population</td><td>BPS, Intercensal Population Survey (SUPAS 2025)</td><td>2025</td></tr><tr><td>GDP &amp; growth</td><td>BPS, National Accounts (GDP)</td><td>2025</td></tr><tr><td>Inflation</td><td>BPS, Consumer Price Index</td><td>2025</td></tr><tr><td>Unemployment</td><td>BPS, Labour Force Survey (Sakernas)</td><td>Aug 2025</td></tr><tr><td>Poverty</td><td>BPS, Socio-Economic Survey (Susenas)</td><td>Sep 2025</td></tr><tr><td>HDI &amp; life expectancy</td><td>BPS, Human Development Index</td><td>2025</td></tr><tr><td>Trade &amp; exchange rate</td><td>Bank Indonesia / BPS trade statistics</td><td>2025</td></tr></tbody></table><p>BPS — Statistics Indonesia (bps.go.id): population, GDP, CPI, Sakernas, Susenas, HDI. Bank Indonesia (bi.go.id): exchange rate and trade. Cite as: “Statistik Indonesia, figures from BPS — Statistics Indonesia, accessed November 2026.”</p><p class="fine">This site is an original presentation of published official statistics. It is not affiliated with BPS or the Government of Indonesia.</p>`)}
  <p class="src">${esc(META.sourceNote)}</p>`;
}

export function missing() {
  return `<section class="pagehead"><h1>Page not found</h1><p>There is no page at this address. Try one of the sections above — every page on this site is reached from the navigation.</p><p><a class="btn" href="#/">← Back to the dashboard</a></p></section>`;
}
