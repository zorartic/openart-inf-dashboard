import { useState } from "react";
import Particles from "../components/Particles";
import PageNav from "../components/PageNav";
import StatCard from "../components/StatCard";
import SectionTitle from "../components/SectionTitle";
import {
  X_CAMPAIGN_IDS, IG_CAMPAIGN_IDS, YT_CAMPAIGN_IDS,
  PLATFORM_COLORS, xStats, igStats, ytStats,
} from "../data/platformUtils";
import { CAMPAIGN_META } from "../data/campaigns";
import { IG_CAMPAIGNS } from "../data/campaigns_ig";
import { YT_CAMPAIGNS } from "../data/campaigns_yt";
import { fmt, fmtD, cpm } from "../data/utils";

function getCampaignCross(id) {
  const hasX = !!CAMPAIGN_META[id] && !CAMPAIGN_META[id]?.hideFromAll;
  const hasIG = !!IG_CAMPAIGNS[id];
  const hasYT = !!YT_CAMPAIGNS[id];
  const x = hasX ? xStats(id) : { views: 0, spend: 0 };
  const ig = hasIG ? igStats(id) : { views: 0, spend: 0 };
  const yt = hasYT ? ytStats(id) : { views: 0, spend: 0 };
  const launchOnly = hasX && !hasIG && !hasYT && x.hasInfluencers === false;
  return {
    id,
    label: CAMPAIGN_META[id]?.label || IG_CAMPAIGNS[id]?.label || YT_CAMPAIGNS[id]?.label || id,
    hasX, hasIG, hasYT, launchOnly,
    x, ig, yt,
    totalViews: x.views + ig.views + yt.views,
    totalSpend: x.spend + ig.spend + yt.spend,
  };
}

function PlatformPill({ platformId, views }) {
  const colors = PLATFORM_COLORS[platformId];
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 10px", borderRadius: 20,
      border: `1px solid ${colors.primary}40`,
      background: `${colors.primary}14`,
      fontSize: 11, fontFamily: "var(--font-mono)",
    }}>
      <span style={{ color: colors.primary, fontWeight: 700 }}>{colors.label.split(" ")[0]}</span>
      <span style={{ color: "var(--text-secondary)" }}>{fmt(views)}</span>
    </div>
  );
}

export default function CampaignsCrossView({ onPickCampaign, onBack, onHome, canBack }) {
  const [query, setQuery] = useState("");
  const allIds = Array.from(new Set([...X_CAMPAIGN_IDS, ...IG_CAMPAIGN_IDS, ...YT_CAMPAIGN_IDS]));
  const allRows = allIds
    .map(getCampaignCross)
    .sort((a, b) => b.totalViews - a.totalViews);
  const q = query.trim().toLowerCase();
  const rows = q ? allRows.filter(r => r.label.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)) : allRows;

  const cumTV = allRows.reduce((s, r) => s + r.totalViews, 0);
  const cumTS = allRows.reduce((s, r) => s + r.totalSpend, 0);
  const xTotal = allRows.reduce((s, r) => s + r.x.views, 0);
  const igTotal = allRows.reduce((s, r) => s + r.ig.views, 0);
  const ytTotal = allRows.reduce((s, r) => s + r.yt.views, 0);

  return (
    <div style={{ position: "relative", minHeight: "100vh", padding: "40px 28px" }}>
      <div className="aura-bg" />
      <Particles />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 940, margin: "0 auto" }}>
        <PageNav onBack={onBack} onHome={onHome} canBack={canBack} />

        <div className="fade-up s1" style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 600, marginBottom: 10 }}>By Campaign</div>
          <h1 style={{ fontSize: 34, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--gold-light)", letterSpacing: -0.8 }}>
            All Campaigns
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
            Cross-platform performance across X, Instagram, and YouTube. Click any campaign for its platform breakdown.
          </p>
        </div>

        <div className="fade-up s2" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
          <StatCard label="Total Impressions" value={fmt(cumTV)} sub={`${rows.length} campaigns across 3 platforms`} accent="var(--c-views)" />
          <StatCard label="Total Spend" value={fmtD(cumTS)} accent="var(--c-spend)" />
          <StatCard label="Blended CPM" value={"$" + cpm(cumTS, cumTV)} accent="var(--c-cpm)" sub="Everything combined" />
        </div>

        <div className="fade-up s3" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
          <StatCard label="X (Twitter)"  value={fmt(xTotal)}  sub={`${((xTotal / cumTV) * 100).toFixed(0)}% of total`} accent={PLATFORM_COLORS.x.primary} />
          <StatCard label="Instagram"    value={fmt(igTotal)} sub={`${((igTotal / cumTV) * 100).toFixed(0)}% of total`} accent={PLATFORM_COLORS.ig.primary} />
          <StatCard label="YouTube"      value={fmt(ytTotal)} sub={`${((ytTotal / cumTV) * 100).toFixed(0)}% of total`} accent={PLATFORM_COLORS.yt.primary} />
        </div>

        <SectionTitle icon="📊">Campaign Comparison</SectionTitle>
        <div className="fade-up s4" style={{ marginBottom: 12 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search campaigns…"
            style={{
              width: "100%", boxSizing: "border-box",
              background: "rgba(10,8,4,0.92)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
              fontSize: 13,
              padding: "10px 14px",
              outline: "none",
            }}
            onFocus={e => { e.target.style.borderColor = "rgba(201,168,76,0.5)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
          />
        </div>
        <div className="fade-up s4" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rows.length === 0 && (
            <div className="data-card" style={{ color: "var(--text-muted)" }}>No campaigns match "{query}".</div>
          )}
          {rows.map(r => (
            <div
              key={r.id}
              className="data-card"
              style={{ cursor: "pointer", padding: "18px 20px" }}
              onClick={() => onPickCampaign(r.id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 260px", minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                    <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--gold-light)" }}>{r.label}</div>
                    {r.launchOnly && (
                      <span style={{
                        display: "inline-flex", alignItems: "center",
                        padding: "2px 8px", borderRadius: 20,
                        border: "1px solid rgba(201,168,76,0.3)",
                        background: "rgba(201,168,76,0.08)",
                        color: "var(--gold-light)",
                        fontSize: 9, fontFamily: "var(--font-body)", fontWeight: 700,
                        letterSpacing: 0.8, textTransform: "uppercase",
                      }}>Launch RT only</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {r.hasX && <PlatformPill platformId="x"  views={r.x.views} />}
                    {r.hasIG && <PlatformPill platformId="ig" views={r.ig.views} />}
                    {r.hasYT && <PlatformPill platformId="yt" views={r.yt.views} />}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Total</div>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--c-views)" }}>{fmt(r.totalViews)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Spend</div>
                    <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-mono)", color: "var(--c-spend)" }}>{fmtD(r.totalSpend)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>CPM</div>
                    <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-mono)", color: "var(--c-cpm)" }}>${cpm(r.totalSpend, r.totalViews)}</div>
                  </div>
                  <span style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
