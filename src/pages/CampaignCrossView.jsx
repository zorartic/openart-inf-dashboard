import Particles from "../components/Particles";
import PageNav from "../components/PageNav";
import StatCard from "../components/StatCard";
import SectionTitle from "../components/SectionTitle";
import { PLATFORM_COLORS, xStats, igStats, ytStats } from "../data/platformUtils";
import { CAMPAIGN_META } from "../data/campaigns";
import { IG_CAMPAIGNS } from "../data/campaigns_ig";
import { YT_CAMPAIGNS } from "../data/campaigns_yt";
import { fmt, fmtD, cpm } from "../data/utils";

function getLabel(id) {
  return CAMPAIGN_META[id]?.label || IG_CAMPAIGNS[id]?.label || YT_CAMPAIGNS[id]?.label || id;
}

function PlatformTile({ platformId, views, spend, onClick }) {
  const colors = PLATFORM_COLORS[platformId];
  return (
    <div
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${colors.gradientStr})`,
        padding: 1,
        borderRadius: 16,
        cursor: "pointer",
        flex: "1 1 260px",
        minWidth: 240,
        transition: "opacity 0.2s ease, transform 0.2s ease",
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1";   e.currentTarget.style.transform = "translateY(0)"; }}
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
          {fmt(views)}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 10 }}>
          impressions
        </div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
          <span style={{ color: "var(--c-spend)" }}>{fmtD(spend)}</span> spend ·{" "}
          <span style={{ color: "var(--c-cpm)" }}>${cpm(spend, views)}</span> CPM
        </div>
        <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 14, color: colors.primary, fontWeight: 600, opacity: 0.7 }}>
          View breakdown →
        </div>
      </div>
    </div>
  );
}

export default function CampaignCrossView({ campaignId, onBack, onHome, canBack, onPickPlatform }) {
  const hasX = !!CAMPAIGN_META[campaignId] && !CAMPAIGN_META[campaignId]?.hideFromAll;
  const hasIG = !!IG_CAMPAIGNS[campaignId];
  const hasYT = !!YT_CAMPAIGNS[campaignId];

  const x = hasX ? xStats(campaignId) : { views: 0, spend: 0 };
  const ig = hasIG ? igStats(campaignId) : { views: 0, spend: 0 };
  const yt = hasYT ? ytStats(campaignId) : { views: 0, spend: 0 };

  const totalViews = x.views + ig.views + yt.views;
  const totalSpend = x.spend + ig.spend + yt.spend;

  const platforms = [
    hasX && { id: "x", stats: x },
    hasIG && { id: "ig", stats: ig },
    hasYT && { id: "yt", stats: yt },
  ].filter(Boolean);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div className="aura-bg" />
      <Particles />

      <div style={{ position: "relative", zIndex: 1, padding: "40px 28px 60px" }}>
        <div style={{ maxWidth: 940, margin: "0 auto" }}>

          <PageNav onBack={onBack} onHome={onHome} canBack={canBack} />

          <div className="fade-up s1" style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 10, letterSpacing: 3.5, textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 600, marginBottom: 10 }}>
              Campaign
            </div>
            <h1 style={{
              fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, fontFamily: "var(--font-display)",
              lineHeight: 1.1, color: "var(--gold-light)",
            }}>
              {getLabel(campaignId)}
            </h1>
          </div>

          <div className="fade-up s2" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
            <StatCard label="Total Impressions" value={fmt(totalViews)} sub={`Across ${platforms.length} platform${platforms.length > 1 ? "s" : ""}`} accent="var(--c-views)" />
            <StatCard label="Total Spend" value={fmtD(totalSpend)} accent="var(--c-spend)" />
            <StatCard label="Blended CPM" value={"$" + cpm(totalSpend, totalViews)} accent="var(--c-cpm)" sub="All platforms combined" />
          </div>

          <SectionTitle icon="🌐">By Platform</SectionTitle>
          <div className="fade-up s3" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {platforms.map(p => (
              <PlatformTile
                key={p.id}
                platformId={p.id}
                views={p.stats.views}
                spend={p.stats.spend}
                onClick={() => onPickPlatform(p.id, campaignId)}
              />
            ))}
          </div>

        </div>
      </div>

      <p style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.13)", fontFamily: "var(--font-body)", zIndex: 1, margin: 0 }}>
        built by Zozo for OpenArt AI · 2026
      </p>
    </div>
  );
}
