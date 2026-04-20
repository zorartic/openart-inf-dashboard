import Particles from "../components/Particles";
import PageNav from "../components/PageNav";
import StatCard from "../components/StatCard";
import SectionTitle from "../components/SectionTitle";
import { PLATFORM_COLORS, getCampaignIds, getPlatformStats } from "../data/platformUtils";
import { MONTHS } from "../data/campaigns";
import { fmt, fmtD, cpm } from "../data/utils";

function sumPlatformForMonth(monthId, platform) {
  const ids = getCampaignIds(platform, monthId);
  return ids.reduce((acc, id) => {
    const s = getPlatformStats(platform, id, monthId);
    return { views: acc.views + s.views, spend: acc.spend + s.spend, count: acc.count + 1 };
  }, { views: 0, spend: 0, count: 0 });
}

function PlatformTile({ platformId, views, spend, count, onClick }) {
  const colors = PLATFORM_COLORS[platformId];
  const disabled = views === 0 && spend === 0;
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        background: `linear-gradient(135deg, ${colors.gradientStr})`,
        padding: 1,
        borderRadius: 16,
        cursor: disabled ? "default" : "pointer",
        flex: "1 1 260px",
        minWidth: 240,
        opacity: disabled ? 0.35 : 1,
        transition: "opacity 0.2s ease, transform 0.2s ease",
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
      onMouseLeave={e => { if (!disabled) { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; } }}
    >
      <div style={{
        background: "linear-gradient(160deg, rgba(18,14,8,0.97) 0%, rgba(12,10,6,0.98) 100%)",
        borderRadius: 15,
        padding: "24px 22px",
        backdropFilter: "blur(24px)",
      }}>
        <div style={{
          fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase",
          color: colors.primary, fontFamily: "var(--font-body)", fontWeight: 700, marginBottom: 14, opacity: 0.9,
        }}>
          {colors.label}
        </div>
        <div style={{
          fontSize: 28, fontWeight: 700, fontFamily: "var(--font-display)",
          color: "var(--c-views)", lineHeight: 1, marginBottom: 6,
          fontVariantNumeric: "tabular-nums",
        }}>
          {disabled ? "—" : fmt(views)}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 10 }}>
          impressions · {count} campaign{count !== 1 ? "s" : ""}
        </div>
        {!disabled && (
          <div style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
            <span style={{ color: "var(--c-spend)" }}>{fmtD(spend)}</span> spend ·{" "}
            <span style={{ color: "var(--c-cpm)" }}>${cpm(spend, views)}</span> CPM
          </div>
        )}
        <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 14, color: colors.primary, fontWeight: 600, opacity: disabled ? 0.3 : 0.7 }}>
          {disabled ? "No data" : "View breakdown →"}
        </div>
      </div>
    </div>
  );
}

export default function MonthCrossView({ monthId, onBack, onHome, canBack, onPickPlatform }) {
  const month = MONTHS[monthId];
  const x  = sumPlatformForMonth(monthId, "x");
  const ig = sumPlatformForMonth(monthId, "ig");
  const yt = sumPlatformForMonth(monthId, "yt");
  const totalViews = x.views + ig.views + yt.views;
  const totalSpend = x.spend + ig.spend + yt.spend;
  const totalCount = x.count + ig.count + yt.count;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div className="aura-bg" />
      <Particles />

      <div style={{ position: "relative", zIndex: 1, padding: "40px 28px 60px" }}>
        <div style={{ maxWidth: 940, margin: "0 auto" }}>

          <PageNav onBack={onBack} onHome={onHome} canBack={canBack} />

          <div className="fade-up s1" style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 10, letterSpacing: 3.5, textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 600, marginBottom: 10 }}>
              By Timeline
            </div>
            <h1 style={{
              fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, fontFamily: "var(--font-display)",
              lineHeight: 1.1, color: "var(--gold-light)",
            }}>
              {month?.label || monthId}
            </h1>
          </div>

          <div className="fade-up s2" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
            <StatCard label="Total Impressions" value={fmt(totalViews)} sub={`${month?.campaigns?.length || 0} campaigns`} accent="var(--c-views)" />
            <StatCard label="Total Spend" value={fmtD(totalSpend)} accent="var(--c-spend)" />
            <StatCard label="Blended CPM" value={"$" + cpm(totalSpend, totalViews)} accent="var(--c-cpm)" sub="All platforms combined" />
          </div>

          <SectionTitle icon="🌐">By Platform</SectionTitle>
          <div className="fade-up s3" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <PlatformTile platformId="x"  views={x.views}  spend={x.spend}  count={x.count}  onClick={() => onPickPlatform("x", monthId)} />
            <PlatformTile platformId="ig" views={ig.views} spend={ig.spend} count={ig.count} onClick={() => onPickPlatform("ig", monthId)} />
            <PlatformTile platformId="yt" views={yt.views} spend={yt.spend} count={yt.count} onClick={() => onPickPlatform("yt", monthId)} />
          </div>

          {totalCount === 0 && (
            <div className="data-card" style={{ marginTop: 20, color: "var(--text-muted)" }}>No data for this month yet.</div>
          )}

        </div>
      </div>

      <p style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.13)", fontFamily: "var(--font-body)", zIndex: 1, margin: 0 }}>
        built by Zozo for OpenArt AI · 2026
      </p>
    </div>
  );
}
