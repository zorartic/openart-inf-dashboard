import { useState, useEffect, useMemo } from "react";
import Particles from "../components/Particles";
import PlatformAura from "../components/PlatformAura";
import PageNav from "../components/PageNav";
import StatCard from "../components/StatCard";
import SectionTitle from "../components/SectionTitle";
import PlatformSwitcher from "../components/PlatformSwitcher";
import CampaignDropdown from "../components/CampaignDropdown";
import CampaignXDetail from "../components/CampaignXDetail";
import CampaignIGDetail from "../components/CampaignIGDetail";
import CampaignYTDetail from "../components/CampaignYTDetail";
import XCumulativeView from "../components/XCumulativeView";
import AgencyBadge, { AGENCY_COLORS } from "../components/AgencyBadge";
import {
  PLATFORM_COLORS, IG_CAMPAIGN_IDS,
  getCampaignIds, igAgencyBreakdown, getPlatformStats,
} from "../data/platformUtils";
import { IG_CAMPAIGNS } from "../data/campaigns_ig";
import { YT_CAMPAIGNS } from "../data/campaigns_yt";
import { CAMPAIGN_META, MONTHS } from "../data/campaigns";
import { fmt, fmtD, fmtShort, cpm } from "../data/utils";

function getLabel(platform, id) {
  if (platform === "ig") return IG_CAMPAIGNS[id]?.label || id;
  if (platform === "yt") return YT_CAMPAIGNS[id]?.label || id;
  return CAMPAIGN_META[id]?.label || id;
}

function NonXCumulative({ platform, allStats, totalViews, totalSpend, onPickCampaign, monthLabel }) {
  const igAllAgencies = useMemo(() => {
    if (platform !== "ig") return null;
    const agg = {};
    allStats.forEach(s => {
      Object.entries(igAgencyBreakdown(s.id)).forEach(([ag, d]) => {
        if (!agg[ag]) agg[ag] = { count: 0, views: 0, spend: 0 };
        agg[ag].count += d.count;
        agg[ag].views += d.views;
        agg[ag].spend += d.spend;
      });
    });
    return agg;
  }, [platform, allStats]);

  const sorted = [...allStats].sort((a, b) => b.views - a.views);

  return (
    <div className="fade-in">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <StatCard label="Total Impressions" value={fmt(totalViews)} sub={`${allStats.length} campaigns${monthLabel ? ` · ${monthLabel}` : ""}`} accent="var(--c-views)" />
        <StatCard label="Total Spend" value={fmtD(totalSpend)} accent="var(--c-spend)" />
        <StatCard label="All-In CPM" value={"$" + cpm(totalSpend, totalViews)} accent="var(--c-cpm)" sub="All campaigns combined" />
      </div>

      {platform === "ig" && igAllAgencies && Object.keys(igAllAgencies).length > 0 && (
        <>
          <SectionTitle icon="🏢">Agency Breakdown</SectionTitle>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            {Object.entries(igAllAgencies).sort((a, b) => b[1].views - a[1].views).map(([agency, data]) => (
              <div key={agency} className="data-card" style={{ minWidth: 160 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: AGENCY_COLORS[agency] || "#94a3b8", marginBottom: 6, fontFamily: "var(--font-body)" }}>{agency}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{fmtShort(data.views)}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{data.count} creators · {fmtD(data.spend)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <SectionTitle icon="📊">Campaign Breakdown</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
        {sorted.map(c => (
          <div key={c.id} className="data-card" style={{ minWidth: 180, flex: "1 1 180px", maxWidth: 260, cursor: "pointer" }}
            onClick={() => onPickCampaign(c.id)}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.2 }}>
              {getLabel(platform, c.id)}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--c-views)" }}>
              {fmtShort(c.views)}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
              {fmtD(c.spend)} · ${cpm(c.spend, c.views)} CPM
            </div>
            {c.count > 0 && (
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{c.count} creators</div>
            )}
            <div style={{ fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", marginTop: 8, color: "var(--text-muted)" }}>View breakdown →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlatformDetail({ platform: initialPlatform, initialCampaign, monthId, onBack, onHome, canBack }) {
  const [platform, setPlatform] = useState(initialPlatform);
  const [campaign, setCampaign] = useState(initialCampaign || "all");
  const [userChangedPlatform, setUserChangedPlatform] = useState(false);

  useEffect(() => {
    if (userChangedPlatform) setCampaign("all");
  }, [platform, userChangedPlatform]);

  const handlePlatformChange = (p) => {
    setUserChangedPlatform(true);
    setPlatform(p);
  };

  const colors = PLATFORM_COLORS[platform];
  const monthLabel = monthId ? MONTHS[monthId]?.label : null;

  const campaignIds = useMemo(() => getCampaignIds(platform, monthId), [platform, monthId]);

  const allStats = useMemo(
    () => campaignIds.map(id => ({ id, ...getPlatformStats(platform, id, monthId) })),
    [platform, campaignIds, monthId]
  );
  const totalViews = allStats.reduce((s, c) => s + c.views, 0);
  const totalSpend = allStats.reduce((s, c) => s + c.spend, 0);

  const isCum = campaign === "all";

  return (
    <div style={{ position: "relative", minHeight: "100vh", padding: "40px 28px" }}>
      <PlatformAura platform={platform} />
      <Particles platform={platform} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 940, margin: "0 auto" }}>
        <PageNav onBack={onBack} onHome={onHome} canBack={canBack} />

        <div className="fade-up s1" style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: 3.5, textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 600, marginBottom: 10 }}>
            {monthLabel ? `${monthLabel} · By Platform` : "By Platform"}
          </div>
          <h1 style={{
            fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, fontFamily: "var(--font-display)",
            lineHeight: 1.1, marginBottom: 0, display: "inline-block",
          }}>
            <span
              key={platform}
              style={{
                display: "inline-block",
                background: colors.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {colors.label}
            </span>
          </h1>
        </div>

        <div className="fade-up s2">
          <PlatformSwitcher current={platform} onChange={handlePlatformChange} />
        </div>

        <div className="fade-up s3" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap", position: "relative", zIndex: 50 }}>
          <CampaignDropdown
            campaigns={campaignIds}
            value={campaign}
            onChange={setCampaign}
            getLabel={id => getLabel(platform, id)}
            accentColor={colors.primary + "80"}
          />
          <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
            {isCum ? (
              campaignIds.length > 0 ? (
                <>
                  <span style={{ color: "var(--c-views)" }}>{fmt(totalViews)}</span> impressions ·{" "}
                  <span style={{ color: "var(--c-spend)" }}>{fmtD(totalSpend)}</span> spend ·{" "}
                  <span style={{ color: "var(--c-cpm)" }}>${cpm(totalSpend, totalViews)}</span> CPM
                </>
              ) : (
                <span style={{ color: "var(--text-muted)" }}>No campaigns on this platform{monthLabel ? ` in ${monthLabel}` : ""}.</span>
              )
            ) : (
              <span style={{ color: "var(--text-muted)" }}>{getLabel(platform, campaign)}</span>
            )}
          </div>
        </div>

        <div className="fade-up s4">
          {isCum && platform === "x" && campaignIds.length > 0 && (
            <XCumulativeView
              campaignIds={campaignIds}
              monthId={monthId}
              monthLabel={monthLabel || "All Campaigns"}
            />
          )}
          {isCum && platform !== "x" && campaignIds.length > 0 && (
            <NonXCumulative
              platform={platform}
              allStats={allStats}
              totalViews={totalViews}
              totalSpend={totalSpend}
              onPickCampaign={setCampaign}
              monthLabel={monthLabel}
            />
          )}
          {!isCum && platform === "x"  && <CampaignXDetail  campaignId={campaign} monthId={monthId} />}
          {!isCum && platform === "ig" && <CampaignIGDetail campaignId={campaign} />}
          {!isCum && platform === "yt" && <CampaignYTDetail campaignId={campaign} />}
        </div>

      </div>

      <p style={{ position: "relative", zIndex: 1, textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.13)", fontFamily: "var(--font-body)", marginTop: 40, paddingBottom: 20 }}>
        built by Zozo for OpenArt AI · 2026
      </p>
    </div>
  );
}
