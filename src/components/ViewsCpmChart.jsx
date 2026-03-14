import { fmt, cpm } from "../data/utils";

export default function ViewsCpmChart({ data }) {
  const sorted = [...data].sort((a, b) => b.views - a.views).slice(0, 15);
  const maxViews = sorted[0]?.views || 1;
  const cpmVals = sorted.map(d => parseFloat(cpm(d.price, d.views)));
  const maxCpm = Math.max(...cpmVals, 0.1);

  const BAR_W = 38;
  const GAP = 14;
  const SECTION_GAP = 28;
  const LABEL_H = 64;
  const VIEWS_H = 180;
  const CPM_H = 80;
  const PAD_L = 52;
  const PAD_R = 16;
  const chartAreaW = sorted.length * (BAR_W + GAP) - GAP;
  const W = PAD_L + chartAreaW + PAD_R;
  const H = 20 + VIEWS_H + SECTION_GAP + CPM_H + LABEL_H + 10;

  function cpmColor(val) {
    return val < 5 ? "#68d391" : val < 15 ? "#f6c90e" : "#fc8181";
  }
  function viewsColor(val) {
    return val < 5 ? "rgba(104,211,145,0.55)" : val < 15 ? "rgba(246,201,14,0.45)" : "rgba(252,129,129,0.4)";
  }

  const VIEWS_AXIS_Y = 20;
  const CPM_AXIS_Y = 20 + VIEWS_H + SECTION_GAP;
  const LABELS_Y = CPM_AXIS_Y + CPM_H + 8;

  const viewsGridLines = [0, 0.25, 0.5, 0.75, 1];
  const cpmGridLines = [0, 0.5, 1];

  return (
    <div style={{ overflowX: "auto" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: 560, display: "block" }}>
        {/* --- section labels --- */}
        <text x={PAD_L - 6} y={VIEWS_AXIS_Y + VIEWS_H / 2} fill="rgba(255,255,255,0.35)" fontSize={9}
          textAnchor="middle" transform={`rotate(-90,${PAD_L - 18},${VIEWS_AXIS_Y + VIEWS_H / 2})`}>
          VIEWS
        </text>
        <text x={PAD_L - 6} y={CPM_AXIS_Y + CPM_H / 2} fill="rgba(255,255,255,0.35)" fontSize={9}
          textAnchor="middle" transform={`rotate(-90,${PAD_L - 18},${CPM_AXIS_Y + CPM_H / 2})`}>
          CPM ($)
        </text>

        {/* --- views axis grid --- */}
        {viewsGridLines.map(pct => {
          const y = VIEWS_AXIS_Y + VIEWS_H * (1 - pct);
          return (
            <g key={pct}>
              <line x1={PAD_L} y1={y} x2={PAD_L + chartAreaW} y2={y} stroke="rgba(255,255,255,0.06)" />
              {pct > 0 && (
                <text x={PAD_L - 4} y={y + 3} fill="rgba(255,255,255,0.28)" fontSize={8} textAnchor="end">
                  {fmt(Math.round(maxViews * pct))}
                </text>
              )}
            </g>
          );
        })}

        {/* --- cpm axis grid --- */}
        {cpmGridLines.map(pct => {
          const y = CPM_AXIS_Y + CPM_H * (1 - pct);
          return (
            <g key={pct}>
              <line x1={PAD_L} y1={y} x2={PAD_L + chartAreaW} y2={y} stroke="rgba(255,255,255,0.06)" />
              {pct > 0 && (
                <text x={PAD_L - 4} y={y + 3} fill="rgba(255,255,255,0.28)" fontSize={8} textAnchor="end">
                  ${(maxCpm * pct).toFixed(0)}
                </text>
              )}
            </g>
          );
        })}

        {/* divider between sections */}
        <line x1={PAD_L} y1={CPM_AXIS_Y - 10} x2={PAD_L + chartAreaW} y2={CPM_AXIS_Y - 10} stroke="rgba(255,255,255,0.08)" />

        {sorted.map((d, i) => {
          const x = PAD_L + i * (BAR_W + GAP);
          const cx = x + BAR_W / 2;
          const cv = parseFloat(cpm(d.price, d.views));

          const viewsPct = d.views / maxViews;
          const vH = Math.max(viewsPct * VIEWS_H, 2);
          const vY = VIEWS_AXIS_Y + VIEWS_H - vH;

          const cpmPct = cv / maxCpm;
          const cH = Math.max(cpmPct * CPM_H, 2);
          const cY = CPM_AXIS_Y + CPM_H - cH;

          const vc = viewsColor(cv);
          const cc = cpmColor(cv);

          return (
            <g key={d.name}>
              {/* views bar */}
              <rect x={x} y={vY} width={BAR_W} height={vH} fill={vc} rx={3} />
              {/* views label above bar */}
              <text x={cx} y={vY - 3} fill="rgba(255,255,255,0.45)" fontSize={8} textAnchor="middle">
                {d.views >= 1000 ? `${(d.views / 1000).toFixed(0)}K` : d.views}
              </text>

              {/* cpm bar */}
              <rect x={x} y={cY} width={BAR_W} height={cH} fill={cc} rx={3} opacity={0.7} />
              {/* cpm label above */}
              <text x={cx} y={cY - 3} fill={cc} fontSize={8} textAnchor="middle">
                ${cv.toFixed(1)}
              </text>

              {/* name label (rotated) */}
              <text
                x={cx} y={LABELS_Y + 4}
                fill="rgba(255,255,255,0.5)" fontSize={9} textAnchor="end"
                transform={`rotate(-42,${cx},${LABELS_Y + 4})`}
              >
                {d.name.length > 12 ? d.name.slice(0, 12) : d.name}
              </text>
            </g>
          );
        })}

        {/* legend */}
        {[["#68d391", "< $5 CPM (great)"], ["#f6c90e", "$5–$15 CPM (ok)"], ["#fc8181", "> $15 CPM (poor)"]].map(([color, label], idx) => (
          <g key={idx} transform={`translate(${PAD_L + idx * 140}, ${H - 8})`}>
            <rect width={10} height={10} fill={color} rx={2} opacity={0.8} />
            <text x={14} y={9} fill="rgba(255,255,255,0.4)" fontSize={9}>{label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
