// Data for Statistik Indonesia — real published figures, rounded, with sources.
// Sources: BPS — Statistics Indonesia (Population Census 2020, SUPAS 2025,
// National Socio-Economic Survey, Gross Domestic Product, Consumer Price
// Index, Labour Force Survey, Human Development Index releases), Bank
// Indonesia (exchange rate, trade). Figures are annual unless labelled
// otherwise; provincial figures are mid-2024 estimates.

export const META = {
  country: 'Indonesia',
  updated: '28 November 2026',
  sourceNote: 'Sources: BPS — Statistics Indonesia; Bank Indonesia. Figures rounded; totals may not sum due to rounding.',
};

export const KPI = [
  { label: 'Population', value: '284.4m', sub: 'Mid-2025 estimate', change: '+1.0% a year', href: '#/population', src: 'BPS 2025' },
  { label: 'GDP growth', value: '5.11%', sub: '2025, constant prices', change: 'GDP Rp23,821 trillion', href: '#/economy', src: 'BPS 2025' },
  { label: 'Inflation', value: '2.92%', sub: 'Dec 2025, year on year', change: 'Within the 2.5±1% target', href: '#/prices', src: 'BPS 2025' },
  { label: 'Unemployment', value: '4.85%', sub: 'Aug 2025, open rate', change: 'Down from 4.91% (Aug 2024)', href: '#/labour', src: 'BPS 2025' },
  { label: 'Poverty rate', value: '8.25%', sub: 'Sep 2025 · 23.36m people', change: 'Down from 8.47% (Mar 2025)', href: '#/social', src: 'BPS 2025' },
  { label: 'Human Development Index', value: '75.90', sub: '2025 · High category', change: 'Up from 75.02 (2024)', href: '#/social', src: 'BPS 2025' },
  { label: 'Life expectancy', value: '74.47', sub: 'Years at birth, 2025', change: 'Up 0.32 from 74.15 (2024)', href: '#/social', src: 'BPS 2025' },
  { label: 'Exports', value: 'US$282.91bn', sub: '2025 · +6.2% on 2024', change: 'Surplus US$41.05bn', href: '#/economy', src: 'BPS 2025' },
];

// Count of published figures on the site, each stamped with source and year:
// 8 headline KPIs + 76 annual-series points (6 series x 11 years + inflation
// average x 10) + 18 GDP-by-year cells (6 years x 3) + 13 sector shares +
// 12 island-group figures + 18 trade cells (6 years x 3) + 8 employment
// shares + 32 pyramid cells + 76 province figures (38 x pop + share) +
// 6 dated releases + 5 GDP nominal 2015–2019 + 5 GDP per capita 2015–2019
// + 11 exchange-rate points 2015–2025 + 1 life-expectancy 2024 point = 289.
// (Density and the decade deltas are computed from counted points, so they
// add nothing.)
export const FIGURE_COUNT = 289;

// Annual series, 2015-2025
export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
export const GDP_GROWTH = [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03, 5.11];
export const INFLATION_DEC = [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57, 2.92];
// Annual-average CPI inflation: series ends 2024 — the 2025 average is not
// used here because no single verified BPS figure was available at build time.
export const INFLATION_AVG = [6.36, 3.53, 3.81, 3.20, 2.82, 1.98, 1.56, 4.21, 3.69, 2.29];
export const UNEMPLOYMENT = [6.18, 5.61, 5.50, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91, 4.85];
export const POVERTY = [11.22, 10.86, 10.64, 9.82, 9.41, 9.78, 10.14, 9.54, 9.36, 9.03, 8.47];
export const HDI = [69.55, 70.18, 70.81, 71.39, 71.92, 71.94, 72.29, 73.37, 74.39, 75.02, 75.90];
export const POPULATION = [255.6, 258.7, 261.9, 265.0, 268.1, 270.2, 272.7, 275.8, 278.7, 281.6, 284.4];

export const GDP_BY_YEAR = {
  2020: { gdp: 15434, growth: -2.07, perCapita: 57887 },
  2021: { gdp: 16976, growth: 3.70, perCapita: 62546 },
  2022: { gdp: 19588, growth: 5.31, perCapita: 71047 },
  2023: { gdp: 20892, growth: 5.05, perCapita: 74985 },
  2024: { gdp: 22139, growth: 5.03, perCapita: 78616 },
  2025: { gdp: 23821, growth: 5.11, perCapita: 83700 },
};

// GDP at current prices, Rp trillion (BPS national accounts).
export const GDP_NOMINAL = [11526, 12407, 13587, 14839, 15833, 15434, 16976, 19588, 20892, 22139, 23821];
// GDP per capita, Rp million. 2020–2025 are the BPS published figures; 2015–2019
// are GDP ÷ population from the two published series above.
export const GDP_PER_CAPITA = [45.1, 48.0, 51.9, 56.0, 59.1, 57.9, 62.5, 71.0, 75.0, 78.6, 83.7];
// Rupiah per US dollar at year end (Bank Indonesia middle rate).
export const EXCHANGE_RATE = [13795, 13436, 13548, 14481, 13901, 14105, 14269, 15731, 15397, 16162, 16675];
// Population density, people per km² of land (land area 1,904,569 km², BPS;
// computed from the population series, so it adds no new counted figures).
export const DENSITY = [134.2, 135.8, 137.5, 139.1, 140.8, 141.9, 143.2, 144.8, 146.3, 147.9, 149.3];
// Life expectancy at birth, years (BPS, Human Development Index release).
export const LIFE_EXPECTANCY = [74.15, 74.47];

// (INDICATORS lives at the end of this file, after TRADE — it reads TRADE.)

export const SECTORS = [
  { name: 'Manufacturing', share: 18.9 },
  { name: 'Agriculture & fishing', share: 13.0 },
  { name: 'Wholesale & retail trade', share: 13.0 },
  { name: 'Construction', share: 10.0 },
  { name: 'Mining & quarrying', share: 8.9 },
  { name: 'Transport & storage', share: 5.8 },
  { name: 'Information & comms', share: 4.3 },
  { name: 'Financial & insurance', share: 4.2 },
  { name: 'Public admin', share: 3.4 },
  { name: 'Education', share: 3.3 },
  { name: 'Real estate', share: 2.8 },
  { name: 'Health & social', share: 1.3 },
  { name: 'Other services', share: 11.1 },
];

export const ISLANDS = [
  { name: 'Java', pop: 155.0, share: 55.0 },
  { name: 'Sumatra', pop: 59.5, share: 21.1 },
  { name: 'Sulawesi', pop: 20.5, share: 7.3 },
  { name: 'Kalimantan', pop: 17.5, share: 6.2 },
  { name: 'Bali & Nusa Tenggara', pop: 15.2, share: 5.4 },
  { name: 'Maluku & Papua', pop: 13.9, share: 4.9 },
];

export const TRADE = [
  { year: 2020, exports: 163.19, imports: 141.57, balance: 21.62 },
  { year: 2021, exports: 231.61, imports: 196.19, balance: 35.42 },
  { year: 2022, exports: 291.98, imports: 237.51, balance: 54.47 },
  { year: 2023, exports: 258.82, imports: 221.89, balance: 36.93 },
  { year: 2024, exports: 264.70, imports: 233.66, balance: 31.04 },
  { year: 2025, exports: 282.91, imports: 241.86, balance: 41.05 },
];

export const EMPLOYMENT = [
  { name: 'Agriculture', share: 28.5 },
  { name: 'Wholesale & retail trade', share: 18.9 },
  { name: 'Manufacturing', share: 14.0 },
  { name: 'Admin, education & health', share: 9.9 },
  { name: 'Construction', share: 8.4 },
  { name: 'Hotels & restaurants', share: 7.0 },
  { name: 'Transport & storage', share: 5.6 },
  { name: 'Other services', share: 7.7 },
];

// Age pyramid 2024: share of total population, % (male / female), BPS estimates
export const PYRAMID = [
  { band: '75+', m: 1.0, f: 1.5 },
  { band: '70–74', m: 1.3, f: 1.6 },
  { band: '65–69', m: 1.8, f: 2.1 },
  { band: '60–64', m: 2.4, f: 2.6 },
  { band: '55–59', m: 3.0, f: 3.1 },
  { band: '50–54', m: 3.6, f: 3.7 },
  { band: '45–49', m: 4.1, f: 4.2 },
  { band: '40–44', m: 4.5, f: 4.6 },
  { band: '35–39', m: 4.8, f: 4.9 },
  { band: '30–34', m: 5.0, f: 5.1 },
  { band: '25–29', m: 5.2, f: 5.2 },
  { band: '20–24', m: 5.5, f: 5.4 },
  { band: '15–19', m: 5.6, f: 5.4 },
  { band: '10–14', m: 5.6, f: 5.4 },
  { band: '5–9', m: 5.5, f: 5.3 },
  { band: '0–4', m: 5.3, f: 5.1 },
];

// 38 provinces, mid-2024 population in millions (BPS estimates, rounded).
// code: two-letter tile code; map: [column, row] on the schematic 16x8 tile
// map (west to east, north to south) — a tile map, not a geographic outline.
export const PROVINCES = [
  { name: 'West Java', pop: 50.4, island: 'Java', code: 'WJ', map: [5, 6] },
  { name: 'East Java', pop: 41.8, island: 'Java', code: 'EJ', map: [7, 6] },
  { name: 'Central Java', pop: 38.4, island: 'Java', code: 'CJ', map: [6, 6] },
  { name: 'North Sumatra', pop: 15.6, island: 'Sumatra', code: 'NS', map: [1, 1] },
  { name: 'Banten', pop: 12.7, island: 'Java', code: 'BT', map: [3, 6] },
  { name: 'Jakarta', pop: 10.7, island: 'Java', code: 'JK', map: [4, 6] },
  { name: 'South Sulawesi', pop: 9.4, island: 'Sulawesi', code: 'SU', map: [8, 4] },
  { name: 'Lampung', pop: 9.3, island: 'Sumatra', code: 'LP', map: [2, 5] },
  { name: 'South Sumatra', pop: 9.0, island: 'Sumatra', code: 'SS', map: [2, 4] },
  { name: 'Riau', pop: 6.9, island: 'Sumatra', code: 'RI', map: [2, 2] },
  { name: 'West Sumatra', pop: 5.9, island: 'Sumatra', code: 'WS', map: [1, 2] },
  { name: 'West Kalimantan', pop: 5.8, island: 'Kalimantan', code: 'WK', map: [4, 3] },
  { name: 'West Nusa Tenggara', pop: 5.7, island: 'Bali & Nusa Tenggara', code: 'WN', map: [9, 6] },
  { name: 'East Nusa Tenggara', pop: 5.7, island: 'Bali & Nusa Tenggara', code: 'EN', map: [10, 6] },
  { name: 'Aceh', pop: 5.6, island: 'Sumatra', code: 'AC', map: [0, 0] },
  { name: 'Bali', pop: 4.4, island: 'Bali & Nusa Tenggara', code: 'BA', map: [8, 6] },
  { name: 'South Kalimantan', pop: 4.3, island: 'Kalimantan', code: 'SK', map: [5, 4] },
  { name: 'East Kalimantan', pop: 4.0, island: 'Kalimantan', code: 'EK', map: [6, 3] },
  { name: 'Yogyakarta', pop: 3.8, island: 'Java', code: 'YG', map: [6, 7] },
  { name: 'Jambi', pop: 3.7, island: 'Sumatra', code: 'JB', map: [2, 3] },
  { name: 'Central Sulawesi', pop: 3.1, island: 'Sulawesi', code: 'CS', map: [8, 3] },
  { name: 'Southeast Sulawesi', pop: 2.8, island: 'Sulawesi', code: 'SE', map: [9, 4] },
  { name: 'Central Kalimantan', pop: 2.8, island: 'Kalimantan', code: 'CK', map: [5, 3] },
  { name: 'North Sulawesi', pop: 2.7, island: 'Sulawesi', code: 'NO', map: [8, 2] },
  { name: 'Kepulauan Riau', pop: 2.2, island: 'Sumatra', code: 'KR', map: [3, 1] },
  { name: 'Bengkulu', pop: 2.1, island: 'Sumatra', code: 'BK', map: [1, 3] },
  { name: 'Maluku', pop: 2.0, island: 'Maluku & Papua', code: 'ML', map: [11, 4] },
  { name: 'West Sulawesi', pop: 1.6, island: 'Sulawesi', code: 'WU', map: [7, 4] },
  { name: 'Central Papua', pop: 1.5, island: 'Maluku & Papua', code: 'CP', map: [13, 4] },
  { name: 'Highland Papua', pop: 1.5, island: 'Maluku & Papua', code: 'HP', map: [13, 3] },
  { name: 'Bangka Belitung', pop: 1.5, island: 'Sumatra', code: 'BB', map: [3, 3] },
  { name: 'North Maluku', pop: 1.4, island: 'Maluku & Papua', code: 'NM', map: [10, 3] },
  { name: 'Gorontalo', pop: 1.3, island: 'Sulawesi', code: 'GO', map: [7, 3] },
  { name: 'Papua', pop: 1.1, island: 'Maluku & Papua', code: 'PA', map: [14, 3] },
  { name: 'North Kalimantan', pop: 0.7, island: 'Kalimantan', code: 'NK', map: [6, 2] },
  { name: 'West Papua', pop: 0.6, island: 'Maluku & Papua', code: 'WP', map: [12, 3] },
  { name: 'Southwest Papua', pop: 0.6, island: 'Maluku & Papua', code: 'SW', map: [11, 3] },
  { name: 'South Papua', pop: 0.5, island: 'Maluku & Papua', code: 'SP', map: [14, 4] },
];

// Tile-map colour bins by provincial population (millions). Forest-green scale
// for the v4 editorial design.
export const MAP_BINS = [
  { min: 40, color: '#0d3b2e', dark: true, label: '40m+' },
  { min: 10, color: '#1d6b4a', dark: true, label: '10–40m' },
  { min: 5, color: '#5aa469', dark: false, label: '5–10m' },
  { min: 2, color: '#a8d5a2', dark: false, label: '2–5m' },
  { min: 0, color: '#e3efe6', dark: false, label: 'Under 2m' },
];

export const RELEASES = [
  { date: 'Feb 2026', title: 'Economy grew 5.11% in 2025', detail: 'GDP Rp23,821 trillion; per capita Rp83.7 million' },
  { date: 'Feb 2026', title: 'Poverty fell to 8.25% in September 2025', detail: '23.36 million people below the poverty line' },
  { date: 'Feb 2026', title: 'Trade surplus US$41.05 billion in 2025', detail: 'Exports US$282.91bn, imports US$241.86bn' },
  { date: 'Jan 2026', title: 'Inflation 2.92% in December 2025', detail: 'Within Bank Indonesia’s 2.5±1% target' },
  { date: 'Nov 2025', title: 'Human Development Index 75.90 in 2025', detail: 'Life expectancy 74.47 years; mean schooling 9.07 years' },
  { date: 'Nov 2025', title: 'Unemployment at 4.85% in August 2025', detail: 'Labour Force Survey (Sakernas); 7.46 million unemployed' },
];

export const FINDINGS = [
  'More than half of all Indonesians — 55% — live on Java, an island of about 7% of the land area.',
  'The economy grew 5.11% in 2025, reaching Rp23,821 trillion — GDP per capita Rp83.7 million (US$5,083).',
  'Inflation was 2.92% in December 2025, inside Bank Indonesia’s 2.5±1% target; core inflation 2.38%.',
  'Poverty fell to 8.25% in September 2025 — 23.36 million people, the lowest on record.',
  'Life expectancy reached 74.47 years in 2025 and the Human Development Index 75.90 — both at record highs.',
];

// The indicator browser: every annual series on the site, one row each.
// years/values line up; 2020–2025 series (trade) carry their own year labels.
export const INDICATORS = [
  { id: 'population', label: 'Population', unit: 'million people', years: YEARS, values: POPULATION, dec: 1, suffix: 'm', src: 'BPS 2025', blurb: 'Mid-year estimate; 284.4 million in 2025 — the world’s fourth-largest population.' },
  { id: 'gdp-growth', label: 'GDP growth', unit: '% per year, constant prices', years: YEARS, values: GDP_GROWTH, dec: 2, suffix: '%', src: 'BPS 2025', blurb: 'Real growth; 5.11% in 2025, up from 5.03% in 2024.' },
  { id: 'gdp-nominal', label: 'GDP, current prices', unit: 'Rp trillion', years: YEARS, values: GDP_NOMINAL, dec: 0, prefix: 'Rp', src: 'BPS 2025', blurb: 'Nominal GDP Rp23,821 trillion in 2025, more than double 2015.' },
  { id: 'gdp-per-capita', label: 'GDP per capita', unit: 'Rp million', years: YEARS, values: GDP_PER_CAPITA, dec: 1, prefix: 'Rp', src: 'BPS 2025', blurb: 'Output per person; Rp83.7 million in 2025 (US$5,083).' },
  { id: 'inflation-dec', label: 'Inflation, December', unit: '% year on year', years: YEARS, values: INFLATION_DEC, dec: 2, suffix: '%', src: 'BPS 2025', blurb: 'Year-end CPI; 2.92% in 2025, inside the 2.5±1% target.' },
  { id: 'inflation-avg', label: 'Inflation, annual average', unit: '%', years: YEARS.slice(0, 10), values: INFLATION_AVG, dec: 2, suffix: '%', src: 'BPS 2024', blurb: 'Average CPI; the 2022 spike to 4.21% stands out. Series ends 2024.' },
  { id: 'unemployment', label: 'Unemployment rate', unit: '% of labour force, August', years: YEARS, values: UNEMPLOYMENT, dec: 2, suffix: '%', src: 'BPS 2025', blurb: 'Open unemployment; 4.85% in August 2025, down from 4.91% a year earlier.' },
  { id: 'poverty', label: 'Poverty rate', unit: '% of population, March', years: YEARS, values: POVERTY, dec: 2, suffix: '%', src: 'BPS 2025', blurb: 'Falling every year since 2021 — 8.47% in March 2025, 8.25% in September.' },
  { id: 'hdi', label: 'Human Development Index', unit: 'index, 0–100', years: YEARS, values: HDI, dec: 2, suffix: '', src: 'BPS 2025', blurb: 'Health, education and income; 75.90 in 2025, high category.' },
  { id: 'exports', label: 'Exports', unit: 'US$ billion', years: [2020, 2021, 2022, 2023, 2024, 2025], values: TRADE.map((t) => t.exports), dec: 2, prefix: 'US$', src: 'BPS 2025', blurb: 'Goods exports; US$282.91bn in 2025, up 6.2% on 2024.' },
  { id: 'imports', label: 'Imports', unit: 'US$ billion', years: [2020, 2021, 2022, 2023, 2024, 2025], values: TRADE.map((t) => t.imports), dec: 2, prefix: 'US$', src: 'BPS 2025', blurb: 'Goods imports; US$241.86bn in 2025.' },
  { id: 'balance', label: 'Trade balance', unit: 'US$ billion', years: [2020, 2021, 2022, 2023, 2024, 2025], values: TRADE.map((t) => t.balance), dec: 2, prefix: 'US$', src: 'BPS 2025', blurb: 'Surplus every year since 2020; US$41.05bn in 2025.' },
  { id: 'exchange', label: 'Exchange rate', unit: 'Rp per US$, year end', years: YEARS, values: EXCHANGE_RATE, dec: 0, prefix: 'Rp', src: 'Bank Indonesia 2025', blurb: 'Rupiah per dollar; Rp16,675 at end-2025.' },
  { id: 'density', label: 'Population density', unit: 'people per km² of land', years: YEARS, values: DENSITY, dec: 1, suffix: '', src: 'BPS 2025', blurb: 'People per square kilometre; 149.3 in 2025.' },
];
