// Small SVG chart helpers. No libraries, no network: every chart is drawn from the
// data in data.js and scales to its container.

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

export function lineChart({ labels, series, height = 220, yLabel = '', color = '#1d6b4a', color2 = null, ymin = null, ymax = null }) {
  const W = 640, H = height, P = { l: 44, r: 12, t: 14, b: 28 };
  const all = series.flat();
  let lo = ymin ?? Math.min(...all), hi = ymax ?? Math.max(...all);
  if (lo === hi) { lo -= 1; hi += 1; }
  const pad = (hi - lo) * 0.12; lo -= pad; hi += pad;
  const x = (i) => P.l + (i * (W - P.l - P.r)) / (labels.length - 1);
  const y = (v) => P.t + ((hi - v) * (H - P.t - P.b)) / (hi - lo);
  const grid = [];
  for (let g = 0; g <= 4; g++) {
    const v = lo + ((hi - lo) * g) / 4, gy = y(v);
    grid.push(`<line x1="${P.l}" y1="${gy}" x2="${W - P.r}" y2="${gy}" stroke="#e2d9c6"/><text x="${P.l - 6}" y="${gy + 4}" text-anchor="end" font-size="11" fill="#5f6b62">${fmtNum(v)}</text>`);
  }
  const lines = series.map((s, si) => {
    const pts = s.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    const col = si === 0 ? color : (color2 ?? '#c2410c');
    const dots = s.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="3.2" fill="${col}"/>`).join('');
    return `<polyline points="${pts}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${dots}`;
  }).join('');
  const xlabels = labels.map((l, i) => `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#5f6b62">${esc(l)}</text>`).join('');
  const last = series[0][series[0].length - 1];
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(yLabel)} line chart" class="chart">${grid.join('')}${lines}${xlabels}<text x="${W - P.r}" y="${y(last) - 10}" text-anchor="end" font-size="12" font-weight="700" fill="${color}">${fmtNum(last)}%</text></svg>`;
}

export function hbars({ rows, height = null, color = '#1d6b4a', suffix = '', max = null }) {
  const W = 640, rowH = 30, P = { l: 168, r: 52, t: 6, b: 6 };
  const H = height ?? P.t + P.b + rows.length * rowH;
  const hi = max ?? Math.max(...rows.map((r) => r.value));
  const parts = rows.map((r, i) => {
    const y = P.t + i * rowH, bw = ((W - P.l - P.r) * r.value) / hi;
    return `<text x="${P.l - 10}" y="${y + 19}" text-anchor="end" font-size="12.5" fill="#1d2939">${esc(r.name)}</text><rect x="${P.l}" y="${y + 6}" width="${Math.max(bw, 2)}" height="18" rx="4" fill="${r.color ?? color}"/><text x="${P.l + bw + 8}" y="${y + 19}" font-size="12.5" font-weight="600" fill="#1d2939">${fmtNum(r.value)}${suffix}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" class="chart">${parts}</svg>`;
}

export function vbars({ labels, values, height = 220, color = '#1d6b4a', suffix = '', ymin = null }) {
  const W = 640, H = height, P = { l: 44, r: 8, t: 16, b: 28 };
  let lo = ymin ?? Math.min(0, ...values), hi = Math.max(...values);
  const pad = (hi - lo) * 0.1; hi += pad;
  const bw = (W - P.l - P.r) / labels.length;
  const y = (v) => P.t + ((hi - v) * (H - P.t - P.b)) / (hi - lo);
  const zero = y(0);
  const bars = values.map((v, i) => {
    const bx = P.l + i * bw + bw * 0.18, w = bw * 0.64;
    const col = v < 0 ? '#b42318' : color;
    return `<rect x="${bx}" y="${Math.min(y(v), zero)}" width="${w}" height="${Math.abs(zero - y(v))}" rx="3" fill="${col}"/><text x="${bx + w / 2}" y="${y(v) - 6 < P.t + 10 ? P.t + 12 : y(v) - 6}" text-anchor="middle" font-size="11.5" font-weight="600" fill="#1d2939">${fmtNum(v)}</text>`;
  }).join('');
  const xlabels = labels.map((l, i) => `<text x="${P.l + i * bw + bw / 2}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#5f6b62">${esc(l)}</text>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" class="chart"><line x1="${P.l}" y1="${zero}" x2="${W - P.r}" y2="${zero}" stroke="#98a2b3"/>${bars}${xlabels}</svg>`;
}

export function pyramid({ rows }) {
  const W = 640, rowH = 24, P = { t: 8, b: 26 };
  const H = P.t + P.b + rows.length * rowH;
  const hi = Math.max(...rows.flatMap((r) => [r.m, r.f]));
  const mid = W / 2, half = W / 2 - 64;
  const parts = rows.map((r, i) => {
    const y = P.t + i * rowH;
    const mw = (r.m / hi) * half, fw = (r.f / hi) * half;
    return `<text x="${mid - half - 8}" y="${y + 16}" text-anchor="end" font-size="11.5" fill="#5f6b62">${esc(r.band)}</text><rect x="${mid - mw}" y="${y + 4}" width="${mw}" height="16" rx="3" fill="#1d6b4a"/><rect x="${mid}" y="${y + 4}" width="${fw}" height="16" rx="3" fill="#c2410c"/><text x="${mid - mw - 6}" y="${y + 16}" text-anchor="end" font-size="11" fill="#1d2939">${fmtNum(r.m)}</text><text x="${mid + fw + 6}" y="${y + 16}" font-size="11" fill="#1d2939">${fmtNum(r.f)}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Population pyramid" class="chart">${parts}<text x="${mid - half / 2}" y="${H - 6}" text-anchor="middle" font-size="12" font-weight="600" fill="#1d6b4a">Male</text><text x="${mid + half / 2}" y="${H - 6}" text-anchor="middle" font-size="12" font-weight="600" fill="#c2410c">Female</text></svg>`;
}

function fmtNum(v) {
  const n = Math.round(v * 100) / 100;
  return Number.isInteger(n) ? String(n) : n.toFixed(n < 10 ? 2 : 1).replace(/\.?0+$/, '');
}
