import { fmt, fmtD } from "../data/utils";

export default function Bar({ name, value, max, cost, cpmVal }) {
  const pct = Math.max((value / max) * 100, 2);
  const cv = parseFloat(cpmVal);
  const barColor = cv < 5 ? "var(--cpm-good)" : cv < 15 ? "var(--cpm-ok)" : "var(--cpm-bad)";
  const cpmColor = cv < 5 ? "var(--cpm-good)" : cv < 15 ? "var(--cpm-ok)" : "var(--cpm-bad)";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5, fontFamily: "var(--font-body)" }}>
      <div style={{ width: 130, fontSize: 12, color: "var(--text-secondary)", textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 4, height: 22, position: "relative", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 4, opacity: 0.7, transition: "width 0.6s ease" }} />
        <span style={{ position: "absolute", right: 8, top: 3, fontSize: 11, color: "var(--text-primary)", opacity: 0.9, fontFamily: "var(--font-mono)" }}>{fmt(value)}</span>
      </div>
      <div style={{ width: 58, fontSize: 11, color: "var(--c-spend)", textAlign: "right", flexShrink: 0, fontFamily: "var(--font-mono)" }}>{fmtD(cost)}</div>
      <div style={{ width: 62, fontSize: 11, color: cpmColor, textAlign: "right", flexShrink: 0, fontFamily: "var(--font-mono)" }}>${cpmVal}</div>
    </div>
  );
}
