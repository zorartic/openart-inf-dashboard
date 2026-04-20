export const fmt = (n) => n.toLocaleString();
export const fmtD = (n) => "$" + n.toLocaleString();
// Compact: 504K, 2.1M — avoids "0.5M" for sub-million numbers.
export const fmtShort = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return Math.round(n / 1_000) + "K";
  return n.toString();
};
export const cpm = (cost, views) => views > 0 ? ((cost / views) * 1000).toFixed(2) : "—";
export const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
export const sumV = (a) => a.reduce((s, i) => s + (i.views || 0), 0);
export const sumP = (a) => a.reduce((s, i) => s + (i.price || 0), 0);
