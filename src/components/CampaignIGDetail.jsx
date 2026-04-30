import { useState } from "react";
import StatCard from "./StatCard";
import SectionTitle from "./SectionTitle";
import AgencyBadge, { AGENCY_COLORS } from "./AgencyBadge";
import { igStats, igAgencyBreakdown } from "../data/platformUtils";
import { igItemViews, igItemPosts } from "../data/campaigns_ig";
import { fmt, fmtD, fmtShort, cpm } from "../data/utils";

const PLATFORM_LABELS = { ig: "Instagram", yt: "YouTube", tt: "TikTok" };
const PLATFORM_COLORS = { ig: "#E1306C", yt: "#FF0000", tt: "#69C9D0" };

function PostsHoverCard({ posts }) {
  return (
    <div style={{
      position: "absolute",
      top: "100%",
      left: 0,
      zIndex: 50,
      background: "rgba(20,17,10,1)",
      border: "1px solid rgba(201,168,76,0.25)",
      borderRadius: 10,
      boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
      padding: "10px 12px",
      minWidth: 240,
      fontFamily: "var(--font-body)",
      pointerEvents: "auto",
      textAlign: "left",
    }}>
      <div style={{ fontSize: 9, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 8 }}>
        {posts.length} post{posts.length === 1 ? "" : "s"}
      </div>
      {posts.map((p, i) => {
        const label = PLATFORM_LABELS[p.platform] || p.platform;
        const color = PLATFORM_COLORS[p.platform] || "var(--text-muted)";
        const row = (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "5px 0", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontSize: 10, color, textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.8, minWidth: 56 }}>{label}</span>
            <span style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-mono)", flex: 1, textAlign: "right" }}>{fmt(p.views)}</span>
            <span style={{ fontSize: 10, color: p.link ? "var(--gold-light)" : "var(--text-muted)" }}>↗</span>
          </div>
        );
        return p.link
          ? <a key={i} href={p.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit", display: "block" }}>{row}</a>
          : <div key={i}>{row}</div>;
      })}
    </div>
  );
}

function IGBar({ item, max }) {
  const [hovered, setHovered] = useState(false);
  const totalViews = igItemViews(item);
  const isCarousel = !!item.carousel;
  const pct = Math.max(max > 0 ? (totalViews / max) * 100 : 0, 1);
  const cpmStr = !isCarousel && item.price > 0 && totalViews > 0 ? cpm(item.price, totalViews) : null;
  const cpmNum = cpmStr ? parseFloat(cpmStr) : null;
  const cpmColor = cpmNum !== null
    ? (cpmNum < 50 ? "var(--cpm-good)" : cpmNum < 100 ? "var(--cpm-ok)" : "var(--cpm-bad)")
    : "var(--text-muted)";
  const posts = igItemPosts(item);
  const showHoverCard = posts.length > 1 || (posts.length === 1 && posts[0].platform !== "ig");
  const singleLink = !showHoverCard && posts.length === 1 ? posts[0].link : null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5, fontFamily: "var(--font-body)" }}>
      <div style={{ width: 140, fontSize: 12, color: "var(--text-secondary)", textAlign: "right", flexShrink: 0, whiteSpace: "nowrap", position: "relative", overflow: "visible" }}>
        <span
          onMouseEnter={() => showHoverCard && setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ display: "inline-block", cursor: showHoverCard ? "help" : "default", position: "relative" }}
        >
          {singleLink ? (
            <a href={singleLink} target="_blank" rel="noopener noreferrer" className="inf-link">{item.name}</a>
          ) : (
            <span style={{ color: "var(--text-secondary)", borderBottom: showHoverCard ? "1px dotted rgba(201,168,76,0.4)" : "none", paddingBottom: 1 }}>{item.name}</span>
          )}
          {hovered && showHoverCard && <PostsHoverCard posts={posts} />}
        </span>
      </div>
      <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 4, height: 22, position: "relative", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "var(--c-views)", borderRadius: 4, opacity: 0.25, transition: "width 0.5s ease" }} />
        <span style={{ position: "absolute", right: 8, top: 3, fontSize: 11, color: "var(--text-primary)", opacity: 0.9, fontFamily: "var(--font-mono)" }}>
          {isCarousel ? "—" : fmt(totalViews)}
        </span>
      </div>
      <div style={{ width: 72, fontSize: 11, color: "var(--c-spend)", textAlign: "right", flexShrink: 0, fontFamily: "var(--font-mono)" }}>
        {item.price > 0 ? fmtD(item.price) : "—"}
      </div>
      <div style={{ width: 60, fontSize: 11, color: cpmColor, textAlign: "right", flexShrink: 0, fontFamily: "var(--font-mono)" }}>
        {isCarousel ? "—" : (cpmStr ? `$${cpmStr}` : "—")}
      </div>
      <div style={{ width: 72, textAlign: "right", flexShrink: 0 }}>
        <AgencyBadge agency={item.agency} />
      </div>
    </div>
  );
}

export default function CampaignIGDetail({ campaignId }) {
  const stats = igStats(campaignId);
  const agencies = igAgencyBreakdown(campaignId);
  const sorted = [...stats.data].sort((a, b) => igItemViews(b) - igItemViews(a));
  const maxViews = sorted.length > 0 ? Math.max(...sorted.map(i => igItemViews(i))) : 0;
  if (sorted.length === 0) return <div className="data-card" style={{ color: "var(--text-muted)" }}>No Instagram data for this campaign.</div>;
  const cpmStr = stats.cpmViews > 0 ? cpm(stats.cpmSpend, stats.cpmViews) : null;
  const hasCarousel = stats.data.some(i => i.carousel);

  return (
    <div className="fade-in">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
        <StatCard label="Total Views" value={fmt(stats.views)} accent="var(--c-views)" sub={hasCarousel ? "Trackable views (excl. carousels)" : undefined} />
        <StatCard label="Total Spend" value={fmtD(stats.spend)} accent="var(--c-spend)" />
        <StatCard label="Total CPM" value={cpmStr ? "$" + cpmStr : "—"} accent="var(--c-cpm)" sub={hasCarousel ? "Carousel spend excluded" : undefined} />
        <StatCard label="Creators" value={stats.count} accent="var(--c-views)" />
      </div>

      {Object.keys(agencies).length > 0 && (
        <>
          <SectionTitle icon="🏢">By Agency</SectionTitle>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            {Object.entries(agencies).sort((a, b) => b[1].views - a[1].views).map(([agency, data]) => (
              <div key={agency} className="data-card" style={{ minWidth: 150 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: AGENCY_COLORS[agency] || "#94a3b8", marginBottom: 6, fontFamily: "var(--font-body)" }}>{agency}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{fmtShort(data.views)}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{data.count} creators · {fmtD(data.spend)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <SectionTitle icon="📱">Creator Performance</SectionTitle>
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 11, color: "var(--text-muted)" }}>
          <div style={{ width: 140, textAlign: "right" }}>Creator</div>
          <div style={{ flex: 1 }}>Views</div>
          <div style={{ width: 72, textAlign: "right" }}>Cost</div>
          <div style={{ width: 60, textAlign: "right" }}>CPM</div>
          <div style={{ width: 72, textAlign: "right" }}>Agency</div>
        </div>
        {sorted.map(i => <IGBar key={i.name} item={i} max={maxViews} />)}
      </div>
    </div>
  );
}
