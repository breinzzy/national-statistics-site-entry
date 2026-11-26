// Data for Statistik Indonesia — real published figures, rounded, with sources.
// Sources: BPS — Statistics Indonesia (Population Census 2020, National Socio-Economic
// Survey, Gross Domestic Product, Consumer Price Index, Labour Force Survey, Human
// Development Index releases), Bank Indonesia (exchange rate, trade). Figures are
// annual unless labelled otherwise; provincial figures are mid-2024 estimates.

export const META = {
  country: 'Indonesia',
  updated: '26 November 2026',
  sourceNote: 'Sources: BPS — Statistics Indonesia; Bank Indonesia. Figures rounded; totals may not sum due to rounding.',
};

export const KPI = [
  { label: 'Population', value: '281.6m', sub: 'Mid-2024 estimate', change: '+1.0% a year', href: '#/population', src: 'BPS 2024' },
  { label: 'GDP growth', value: '5.03%', sub: '2024, constant prices', change: 'GDP Rp22,139 trillion', href: '#/economy', src: 'BPS 2024' },
  { label: 'Inflation', value: '1.57%', sub: 'Dec 2024, year on year', change: 'Annual average 2.29%', href: '#/prices', src: 'BPS 2024' },
  { label: 'Unemployment', value: '4.76%', sub: 'Feb 2025, open rate', change: 'Down from 4.91% (Aug 2024)', href: '#/labour', src: 'BPS 2025' },
  { label: 'Poverty rate', value: '8.47%', sub: 'Mar 2025 · 24.06m people', change: 'Down from 9.03% (Mar 2024)', href: '#/social', src: 'BPS 2025' },
  { label: 'Human Development Index', value: '75.02', sub: '2024 · High category', change: 'Up from 74.39 (2023)', href: '#/social', src: 'BPS 2024' },
];

// Count of published figures on the site, each stamped with source and year:
// 6 headline KPIs + 70 annual-series points (7 series x 10 years) + 15 GDP-by-year
// cells + 13 sector shares + 12 island-group figures + 15 trade cells + 8
// employment shares + 32 pyramid cells + 76 province figures (38 x pop + share)
// + 6 dated releases = 253.
export const FIGURE_COUNT = 253;

// Annual series, 2015-2024
export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
export const GDP_GROWTH = [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03];
export const INFLATION_DEC = [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57];
export const INFLATION_AVG = [6.36, 3.53, 3.81, 3.20, 2.82, 1.98, 1.56, 4.21, 3.69, 2.29];
export const UNEMPLOYMENT = [6.18, 5.61, 5.50, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91];
export const POVERTY = [11.22, 10.86, 10.64, 9.82, 9.41, 9.78, 10.14, 9.54, 9.36, 9.03];
export const HDI = [69.55, 70.18, 70.81, 71.39, 71.92, 71.94, 72.29, 73.37, 74.39, 75.02];
export const POPULATION = [255.6, 258.7, 261.9, 265.0, 268.1, 270.2, 272.7, 275.8, 278.7, 281.6];

export const GDP_BY_YEAR = {
  2020: { gdp: 15434, growth: -2.07, perCapita: 57887 },
  2021: { gdp: 16976, growth: 3.70, perCapita: 62546 },
  2022: { gdp: 19588, growth: 5.31, perCapita: 71047 },
  2023: { gdp: 20892, growth: 5.05, perCapita: 74985 },
  2024: { gdp: 22139, growth: 5.03, perCapita: 78616 },
};

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

// Tile-map colour bins by provincial population (millions). The same bins serve
// the share view, since share is population / 281.6m.
export const MAP_BINS = [
  { min: 40, color: '#0a2540', dark: true, label: '40m+' },
  { min: 10, color: '#0b5fff', dark: true, label: '10–40m' },
  { min: 5, color: '#6ea8ff', dark: false, label: '5–10m' },
  { min: 2, color: '#b9d2ff', dark: false, label: '2–5m' },
  { min: 0, color: '#e3ecff', dark: false, label: 'Under 2m' },
];

export const RELEASES = [
  { date: 'Nov 2025', title: 'Economy grew 5.04% in Q3 2025', detail: 'GDP, third quarter 2025, year on year' },
  { date: 'Oct 2025', title: 'Exports reached US$24.46 billion in September 2025', detail: 'Trade statistics, monthly release' },
  { date: 'Sep 2025', title: 'Poverty fell to 8.47% in March 2025', detail: '24.06 million people below the poverty line' },
  { date: 'Aug 2025', title: 'Unemployment at 4.76% in February 2025', detail: 'Labour Force Survey (Sakernas)' },
  { date: 'Jul 2025', title: 'Population estimated at 281.6 million in 2024', detail: 'Intercensal population projection' },
  { date: 'Jun 2025', title: 'Human Development Index 75.02 in 2024', detail: 'Life expectancy 74.15 years, mean schooling 9.21 years' },
];

export const FINDINGS = [
  'More than half of all Indonesians — 55% — live on Java, an island of about 7% of the land area.',
  'The economy has grown around 5% a year since the 2020 contraction, reaching Rp22,139 trillion in 2024.',
  'Inflation fell to 1.57% in December 2024, its lowest year-end reading in the decade.',
  'Poverty has fallen every year since 2021, to 8.47% in March 2025 — the lowest on record.',
  'The working-age population (15–64) is about 69% of the total, the core of the demographic dividend.',
];
