import StatCard from "./StatCard";
import SectionTitle from "./SectionTitle";
import { ytStats } from "../data/platformUtils";
import { fmt, fmtD, cpm } from "../data/utils";

function YTBar({ item, max }) {
  const pct = Math.max(max > 0 ? (item.views / max) * 100 : 0, 1);
  const cpmStr = item.price > 0 ? cpm(item.price, item.views) : null;
  const cpmNum = cpmStr ? parseFloat(cpmStr) : null;
  const cpmColor = cpmNum !== null
    ? (cpmNum < 5 ? "var(--cpm-good)" : cpmNum < 15 ? "var(--cpm-ok)" : "var(--cpm-bad)")
    : "var(--text-muted)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5, fontFamily: "var(--font-body)" }}>
      <div style={{ width: 140, fontSize: 12, color: "var(--text-secondary)", textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {item.link ? <a href={item.link} target="_blank" rel="noopener noreferrer" className="inf-link">{item.name}</a> : item.name}
      </div>
      <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 4, height: 22, position: "relative", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "var(--c-views)", borderRadius: 4, opacity: 0.25, transition: "width 0.5s ease" }} />
        <span style={{ position: "absolute", right: 8, top: 3, fontSize: 11, color: "var(--text-primary)", opacity: 0.9, fontFamily: "var(--font-mono)" }}>{fmt(item.views)}</span>
      </div>
      <div style={{ width: 72, fontSize: 11, color: "var(--c-spend)", textAlign: "right", flexShrink: 0, fontFamily: "var(--font-mono)" }}>
        {item.price > 0 ? fmtD(item.price) : "—"}
      </div>
      <div style={{ width: 60, fontSize: 11, color: cpmColor, textAlign: "right", flexShrink: 0, fontFamily: "var(--font-mono)" }}>
        {cpmStr ? `$${cpmStr}` : "—"}
      </div>
    </div>
  );
}

export default function CampaignYTDetail({ campaignId }) {
  const stats = ytStats(campaignId);
  const sorted = [...stats.data].sort((a, b) => b.views - a.views);
  const maxViews = sorted.length > 0 ? Math.max(...sorted.map(i => i.views)) : 0;
  if (sorted.length === 0) return <div className="data-card" style={{ color: "var(--text-muted)" }}>No YouTube data for this campaign.</div>;

  return (
    <div className="fade-in">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
        <StatCard label="Total Views" value={fmt(stats.views)} accent="var(--c-views)" />
        <StatCard label="Total Spend" value={fmtD(stats.spend)} accent="var(--c-spend)" />
        <StatCard label="CPM" value={"$" + cpm(stats.spend, stats.views)} accent="var(--c-cpm)" />
        <StatCard label="Creators" value={stats.count} accent="var(--c-views)" />
      </div>
      <SectionTitle icon="▶️">Creator Performance</SectionTitle>
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 11, color: "var(--text-muted)" }}>
          <div style={{ width: 140, textAlign: "right" }}>Creator</div>
          <div style={{ flex: 1 }}>Views</div>
          <div style={{ width: 72, textAlign: "right" }}>Cost</div>
          <div style={{ width: 60, textAlign: "right" }}>CPM</div>
        </div>
        {sorted.map(i => <YTBar key={i.name} item={i} max={maxViews} />)}
      </div>
    </div>
  );
}
