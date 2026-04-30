import { useState } from "react";
import { fmt, fmtD } from "../data/utils";

function cpmColor(cv) {
  return cv < 5 ? "var(--cpm-good)" : cv < 15 ? "var(--cpm-ok)" : "var(--cpm-bad)";
}
function cpeColor(cv) {
  return cv < 1 ? "var(--cpm-good)" : cv < 2 ? "var(--cpm-ok)" : "var(--cpm-bad)";
}

function TooltipRow({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
      <div style={{ fontSize: 12, color, fontFamily: "var(--font-mono)", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

export default function Bar({ name, value, max, cost, cpmVal, link, comments, reposts, likes, bookmarks }) {
  const [hovered, setHovered] = useState(false);
  const pct = Math.max((value / max) * 100, 2);
  const cv = parseFloat(cpmVal);
  const barColor = cpmColor(cv);

  const eng = (comments || 0) + (reposts || 0) + (likes || 0) + (bookmarks || 0);
  const cpeVal = (eng > 0 && cost > 0) ? (cost / eng) : null;
  const hasEng = eng > 0;

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5, fontFamily: "var(--font-body)", position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ width: 130, fontSize: 12, color: "var(--text-secondary)", textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {link ? <a href={link} target="_blank" rel="noopener noreferrer" className="inf-link">{name}</a> : name}
      </div>
      <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 4, height: 22, position: "relative", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 4, opacity: 0.7, transition: "width 0.6s ease" }} />
        <span style={{ position: "absolute", right: 8, top: 3, fontSize: 11, color: "var(--text-primary)", opacity: 0.9, fontFamily: "var(--font-mono)" }}>{fmt(value)}</span>
      </div>
      <div style={{ width: 58, fontSize: 11, color: "var(--c-spend)", textAlign: "right", flexShrink: 0, fontFamily: "var(--font-mono)" }}>{fmtD(cost)}</div>
      <div style={{ width: 62, fontSize: 11, color: cpmColor(cv), textAlign: "right", flexShrink: 0, fontFamily: "var(--font-mono)" }}>${cpmVal}</div>
      <div style={{ width: 62, fontSize: 11, color: cpeVal ? cpeColor(cpeVal) : "var(--text-muted)", textAlign: "right", flexShrink: 0, fontFamily: "var(--font-mono)" }}>
        {cpeVal ? `$${cpeVal.toFixed(2)}` : "—"}
      </div>

      {hovered && (
        <div style={{
          position: "absolute",
          left: 140,
          top: -6,
          transform: "translateY(-100%)",
          zIndex: 200,
          background: "var(--surface-elev)",
          border: "1px solid var(--border-gold)",
          borderRadius: 12,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          padding: "12px 16px",
          minWidth: 210,
          boxShadow: "var(--shadow-elevated), 0 0 0 0.5px var(--gold-glow) inset",
          pointerEvents: "none",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, borderRadius: "12px 12px 0 0", background: "linear-gradient(90deg, transparent 5%, rgba(201,168,76,0.4) 50%, transparent 95%)", pointerEvents: "none" }} />
          <div style={{ fontSize: 11, color: "var(--gold-light)", marginBottom: 10, fontWeight: 600, letterSpacing: 0.3 }}>{name}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
            <TooltipRow label="Impressions" value={fmt(value)} color="var(--c-views)" />
            <TooltipRow label="Cost" value={fmtD(cost)} color="var(--c-spend)" />
            <TooltipRow label="CPM" value={`$${cpmVal}`} color={cpmColor(cv)} />
            {cpeVal && <TooltipRow label="CPE" value={`$${cpeVal.toFixed(2)}`} color={cpeColor(cpeVal)} />}
            {hasEng && likes !== undefined && <TooltipRow label="Likes" value={likes.toLocaleString()} color="var(--c-median)" />}
            {hasEng && reposts !== undefined && <TooltipRow label="Reposts" value={reposts.toLocaleString()} color="var(--c-qrt)" />}
            {hasEng && comments !== undefined && <TooltipRow label="Comments" value={comments.toLocaleString()} color="var(--text-secondary)" />}
            {hasEng && bookmarks !== undefined && <TooltipRow label="Bookmarks" value={bookmarks.toLocaleString()} color="var(--text-secondary)" />}
          </div>
        </div>
      )}
    </div>
  );
}
