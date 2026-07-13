import { useState, useMemo } from "react";
import {
  ResponsiveContainer, ComposedChart, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { MONTHS, MONTH_ORDER } from "../../data/campaigns";
import { getCampaignIds, getPlatformStats, PLATFORM_COLORS } from "../../data/platformUtils";
import { fmt, fmtD, fmtShort } from "../../data/utils";

// Per-platform market average CPMs for the "all" view.
const MARKET_CPM = { x: 9, ig: 30, yt: 25 };
// Niche AI / tech-creator IG market reference (used for the IG-only mode).
const IG_NICHE_CPM = 40;
const IG_BAND_COLOR = "var(--c-spend)";

function buildMonthly() {
  const perMonth = MONTH_ORDER
    .filter(monthId => MONTHS[monthId]?.campaigns.length > 0)
    .map(monthId => {
      const month = MONTHS[monthId];
      let totalV = 0, igV = 0;
      let xS = 0, igS = 0, ytS = 0;
      ["x", "ig", "yt"].forEach(platform => {
        getCampaignIds(platform, monthId).forEach(id => {
          const s = getPlatformStats(platform, id, monthId);
          totalV += s.views;
          if (platform === "x")  xS  += s.spend;
          if (platform === "ig") { igS += s.spend; igV += s.views; }
          if (platform === "yt") ytS += s.spend;
        });
      });
      return { monthId, label: month.label.replace(/ 20(\d{2})$/, " '$1"), totalV, igV, xS, igS, ytS };
    });

  let cumTotalV = 0, cumIGV = 0, cumXS = 0, cumIGS = 0, cumYTS = 0;
  return perMonth.map(m => {
    cumTotalV += m.totalV;
    cumIGV    += m.igV;
    cumXS     += m.xS;
    cumIGS    += m.igS;
    cumYTS    += m.ytS;
    const allSpend = cumXS + cumIGS + cumYTS;
    const allBenchmark = Math.round(
      (cumXS / MARKET_CPM.x + cumIGS / MARKET_CPM.ig + cumYTS / MARKET_CPM.yt) * 1000
    );
    // IG-only $35–$40 niche AI range translated to view counts at this spend.
    const igRefLine = Math.round((cumIGS / IG_NICHE_CPM) * 1000);
    return {
      monthId: m.monthId,
      label: m.label,
      monthlyAllViews: m.totalV,
      monthlyAllSpend: m.xS + m.igS + m.ytS,
      monthlyIGViews: m.igV,
      monthlyIGSpend: m.igS,
      // All-platform series
      total: cumTotalV,
      spend: allSpend,
      benchmark: allBenchmark,
      cpm: cumTotalV > 0 ? (allSpend / cumTotalV) * 1000 : 0,
      // IG-only series
      igTotal: cumIGV,
      igSpend: cumIGS,
      igRefLine,
      igCpm: cumIGV > 0 ? (cumIGS / cumIGV) * 1000 : 0,
    };
  });
}

function ChartTooltip({ active, payload, mode }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;

  if (mode === "ig") {
    // CPM-based delta: negative when our CPM is cheaper than $40 (good).
    const cpmPct = row.igCpm > 0 ? ((row.igCpm - IG_NICHE_CPM) / IG_NICHE_CPM) * 100 : 0;
    const dir = cpmPct < 0 ? "below" : "above";
    const color = cpmPct < 0 ? "var(--cpm-good)" : "var(--cpm-bad)";
    return (
      <div style={tooltipStyle}>
        <div style={{ fontWeight: 700, marginBottom: 2, color: "var(--text-primary)" }}>{row.label} (cumulative)</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>
          Total IG Spend: <span style={mono("var(--c-spend)")}>{fmtD(row.igSpend)}</span>
          <span style={{ color: "var(--text-muted)", marginLeft: 6 }}>(this month {fmtD(row.monthlyIGSpend)})</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>
          This month: <span style={mono("var(--c-views)")}>{fmt(row.monthlyIGViews)}</span> IG views
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: "var(--c-views)" }} />
          <span style={{ color: "var(--text-muted)", flex: 1 }}>Actual:</span>
          <span style={mono()}>{fmt(row.igTotal)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: IG_BAND_COLOR, opacity: 0.7 }} />
          <span style={{ color: "var(--text-muted)", flex: 1 }}>At $40 CPM:</span>
          <span style={mono("var(--text-secondary)")}>{fmt(row.igRefLine)}</span>
        </div>
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--hl-2)", fontSize: 11 }}>
          <span style={{ color: "var(--text-muted)" }}>IG CPM: </span>
          <span style={mono("var(--c-cpm)")}>${row.igCpm.toFixed(2)}</span>
          <span style={{ color: "var(--text-muted)", marginLeft: 10 }}>
            <span style={{ color, fontFamily: "var(--font-mono)", fontWeight: 600 }}>
              {Math.abs(cpmPct).toFixed(0)}% {dir}
            </span> $40 niche industry rate
          </span>
        </div>
      </div>
    );
  }

  // all-platforms mode: CPM-based delta
  const marketCpmRow = (row.benchmark > 0 && row.spend > 0) ? (row.spend / row.benchmark) * 1000 : 0;
  const cpmPctAll = row.cpm > 0 && marketCpmRow > 0 ? ((row.cpm - marketCpmRow) / marketCpmRow) * 100 : 0;
  const dirAll = cpmPctAll < 0 ? "below" : "above";
  const colorAll = cpmPctAll < 0 ? "var(--cpm-good)" : "var(--cpm-bad)";
  return (
    <div style={tooltipStyle}>
      <div style={{ fontWeight: 700, marginBottom: 2, color: "var(--text-primary)" }}>{row.label} (cumulative)</div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>
        Total Spend: <span style={mono("var(--c-spend)")}>{fmtD(row.spend)}</span>
        <span style={{ color: "var(--text-muted)", marginLeft: 6 }}>(this month {fmtD(row.monthlyAllSpend)})</span>
      </div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>
        This month: <span style={mono("var(--c-views)")}>{fmt(row.monthlyAllViews)}</span> views
      </div>
      {payload.map((e, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: e.color }} />
          <span style={{ color: "var(--text-muted)", flex: 1 }}>{e.name}:</span>
          <span style={mono()}>{fmt(e.value)}</span>
        </div>
      ))}
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--hl-2)", fontSize: 11 }}>
        <span style={{ color: "var(--text-muted)" }}>Effective CPM: </span>
        <span style={mono("var(--c-cpm)")}>${row.cpm.toFixed(2)}</span>
        <span style={{ color: "var(--text-muted)", marginLeft: 10 }}>
          <span style={{ color: colorAll, fontFamily: "var(--font-mono)", fontWeight: 600 }}>
            {Math.abs(cpmPctAll).toFixed(0)}% {dirAll}
          </span> market (${marketCpmRow.toFixed(2)})
        </span>
      </div>
    </div>
  );
}

const tooltipStyle = {
  background: "var(--surface-popover)",
  border: "1px solid var(--hl-3)",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 12,
  fontFamily: "var(--font-body)",
  boxShadow: "var(--shadow-elevated)",
  minWidth: 240,
};
const mono = (color = "var(--text-primary)") => ({
  color, fontFamily: "var(--font-mono)", fontWeight: 600,
});

function Toggle({ mode, onChange }) {
  const options = [
    { id: "all", label: "All Platforms" },
    { id: "ig",  label: "Instagram Only" },
  ];
  return (
    <div style={{
      display: "inline-flex",
      background: "var(--hl-1)",
      border: "1px solid var(--hl-3)",
      borderRadius: 999,
      padding: 3,
      fontFamily: "var(--font-body)",
    }}>
      {options.map(o => {
        const active = mode === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            style={{
              padding: "6px 14px",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              border: "none",
              borderRadius: 999,
              cursor: "pointer",
              background: active ? "var(--gold-glow)" : "transparent",
              color: active ? "var(--gold-light)" : "var(--text-muted)",
              transition: "background 0.2s ease, color 0.2s ease",
            }}
          >{o.label}</button>
        );
      })}
    </div>
  );
}

export default function MonthlyTrendChart() {
  const [mode, setMode] = useState("all");
  const allData = useMemo(buildMonthly, []);
  const data = useMemo(
    () => mode === "ig" ? allData.filter(d => d.igSpend > 0) : allData,
    [mode, allData]
  );

  // Use the LAST cumulative row for headline totals (not a sum of cumulative rows).
  const last = data[data.length - 1] || { total: 0, spend: 0, benchmark: 0, igTotal: 0, igSpend: 0, igHi: 0, igLo: 0 };
  const blendedCpm = mode === "ig"
    ? (last.igSpend > 0 ? (last.igSpend / last.igTotal) * 1000 : 0)
    : (last.spend  > 0 ? (last.spend  / last.total)   * 1000 : 0);
  // CPM delta: negative means *cheaper than benchmark* (good).
  // Comparison anchor: All mode → platform-weighted market CPM. IG mode → $40 niche AI industry rate.
  const refCpm = mode === "ig"
    ? IG_NICHE_CPM
    : (last.benchmark > 0 ? (last.spend / last.benchmark) * 1000 : 0);
  const cpmDeltaPct = (blendedCpm > 0 && refCpm > 0) ? ((blendedCpm - refCpm) / refCpm) * 100 : 0;
  const cpmDirection = cpmDeltaPct < 0 ? "below" : "above";
  const cpmDeltaColor = cpmDeltaPct < 0 ? "var(--cpm-good)" : "var(--cpm-bad)";

  const xKey = mode === "ig" ? "igSpend" : "spend";
  const spendTicks = data.map(d => d[xKey]);
  const spendToLabel = Object.fromEntries(data.map(d => [d[xKey], d.label]));

  const axis = {
    tick: { fontSize: 11, fill: "var(--text-muted)" },
    axisLine: false,
    tickLine: false,
  };
  const gridStroke = "color-mix(in oklab, currentColor 12%, transparent)";

  return (
    <div className="fade-in" style={{
      background: "var(--surface-elev)",
      border: "1px solid var(--hl-3)",
      borderRadius: 16,
      padding: 22,
      boxShadow: "var(--shadow-card)",
      color: "var(--text-secondary)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, marginBottom: 6 }}>
            Trend
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)", margin: 0 }}>
            {mode === "ig" ? "Instagram Impressions vs Spend" : "Cumulative Impressions vs Spend"}
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, maxWidth: 720 }}>
            {mode === "ig" ? (
              <>
                Each point is the running total through that month. Dashed line marks the niche AI / tech-creator industry rate
                ($40 CPM). IG blended CPM:{" "}
                <span style={{ color: "var(--c-cpm)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>${blendedCpm.toFixed(2)}</span>
                {" "}<span style={{ color: cpmDeltaColor, fontWeight: 600 }}>
                  ({Math.abs(cpmDeltaPct).toFixed(0)}% {cpmDirection} $40 niche industry rate)
                </span>.
              </>
            ) : (
              <>
                Each point shows the running total through that month — the line runs left-to-right as spend accumulates.
                Dashed line is the same total spend at platform-weighted market CPMs (X $9 / IG $30 / YT $25).
                Blended CPM:{" "}
                <span style={{ color: "var(--c-cpm)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>${blendedCpm.toFixed(2)}</span>
                {" "}<span style={{ color: cpmDeltaColor, fontWeight: 600 }}>
                  ({Math.abs(cpmDeltaPct).toFixed(0)}% {cpmDirection} market CPM)
                </span>.
              </>
            )}
          </p>
        </div>
        <Toggle mode={mode} onChange={setMode} />
      </div>

      <div style={{ width: "100%", height: 360 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 30, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="grad-total" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--c-views)" stopOpacity={0.6} />
                <stop offset="100%" stopColor="var(--c-views)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="grad-ig" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PLATFORM_COLORS.ig.primary} stopOpacity={0.55} />
                <stop offset="100%" stopColor={PLATFORM_COLORS.ig.primary} stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />

            <XAxis
              xAxisId="top"
              orientation="top"
              type="number"
              dataKey={xKey}
              domain={["dataMin", "dataMax"]}
              ticks={spendTicks}
              tickFormatter={(v) => spendToLabel[v] || ""}
              tick={{ fontSize: 11, fill: "var(--text-secondary)", fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <XAxis
              type="number"
              dataKey={xKey}
              domain={["dataMin", "dataMax"]}
              ticks={spendTicks}
              tickFormatter={(v) => "$" + fmtShort(v)}
              {...axis}
            />
            <YAxis tickFormatter={fmtShort} width={50} {...axis} />
            <Tooltip content={<ChartTooltip mode={mode} />} cursor={{ stroke: "var(--hl-3)", strokeWidth: 1 }} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="circle" />

            {mode === "all" && (
              <>
                <Area type="monotone" dataKey="total" name="Actual Impressions"
                  stroke="var(--c-views)" strokeWidth={2.5} fill="url(#grad-total)"
                  dot={{ r: 4, strokeWidth: 0, fill: "var(--c-views)" }} activeDot={{ r: 6 }}
                  animationDuration={900} animationEasing="ease-out" />
                <Line type="monotone" dataKey="benchmark" name="At Market CPM"
                  stroke="var(--c-cpm)" strokeWidth={2} strokeDasharray="6 4"
                  dot={{ r: 3, strokeWidth: 0, fill: "var(--c-cpm)" }} activeDot={{ r: 5 }}
                  animationDuration={900} animationEasing="ease-out" />
              </>
            )}

            {mode === "ig" && (
              <>
                {/* $40 niche AI industry CPM reference line, dashed gold */}
                <Line type="monotone" dataKey="igRefLine" name="$40 CPM (niche industry rate)"
                  stroke={IG_BAND_COLOR} strokeOpacity={0.75} strokeWidth={1.75} strokeDasharray="5 4"
                  dot={false} activeDot={false} isAnimationActive={false} />
                {/* Actual IG: clean line, no fill */}
                <Line type="monotone" dataKey="igTotal" name={`Actual IG Impressions ($${blendedCpm.toFixed(2)} CPM)`}
                  stroke={PLATFORM_COLORS.ig.primary} strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 0, fill: PLATFORM_COLORS.ig.primary }} activeDot={{ r: 6 }}
                  animationDuration={900} animationEasing="ease-out" />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
