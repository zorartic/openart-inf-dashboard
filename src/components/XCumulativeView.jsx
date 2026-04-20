import StatCard from "./StatCard";
import SectionTitle from "./SectionTitle";
import CompareCard from "./CompareCard";
import { campaignStats } from "./CampaignXDetail";
import { CAMPAIGN_META } from "../data/campaigns";
import { fmt, fmtD, cpm, median } from "../data/utils";

export default function XCumulativeView({ campaignIds, monthId = null, monthLabel = "All Campaigns" }) {
  const allStats = campaignIds.map(id => campaignStats(id, monthId)).filter(Boolean);
  const cumTV = allStats.reduce((s, c) => s + c.totalViews, 0);
  const cumTS = allStats.reduce((s, c) => s + c.totalSpend, 0);
  const cumIV = allStats.reduce((s, c) => s + c.mainViews, 0);
  const cumIS = allStats.reduce((s, c) => s + c.mainSpend, 0);
  const cumLV = allStats.reduce((s, c) => s + c.launchViews, 0);
  const cumLS = allStats.reduce((s, c) => s + c.launchSpend, 0);
  const cumPS = allStats.reduce((s, c) => s + c.pendingSpend, 0);

  const allLaunchPostViews = allStats.flatMap(c => c.launchPosts.map(l => l.views));
  const cumMedianLaunch = allLaunchPostViews.length > 0 ? median(allLaunchPostViews) : 0;
  const allThreadViews = allStats.flatMap(c => c.mainData.map(i => i.views));
  const cumMedianThreads = allThreadViews.length > 0 ? median(allThreadViews) : 0;
  const allInfluencerCPMs = allStats.flatMap(c => c.mainData.map(i => (i.price / i.views) * 1000));
  const cumMedianCPM = allInfluencerCPMs.length > 0 ? median(allInfluencerCPMs) : 0;

  return (
    <div className="fade-in">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
        <StatCard label="Total Impressions" value={fmt(cumTV)} sub={`${campaignIds.length} campaigns in ${monthLabel}`} accent="var(--c-views)" />
        <StatCard label="Total Spend" value={fmtD(cumTS)} accent="var(--c-spend)" />
        <StatCard label="All-In CPM" value={"$" + cpm(cumTS, cumTV)} accent="var(--c-cpm)" sub="Everything included" />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
        <StatCard label="Launch Posts Only" value={fmt(cumLV)} sub={`${fmtD(cumLS)} spent · $${cpm(cumLS, cumLV)} CPM`} accent="var(--c-views)" />
        {cumIV > 0 && <StatCard label="Threads Only" value={fmt(cumIV)} sub={`${fmtD(cumIS)} spent · $${cpm(cumIS, cumIV)} CPM`} accent="var(--c-views)" />}
      </div>
      {(cumMedianLaunch > 0 || cumMedianThreads > 0) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
          {cumMedianLaunch > 0 && <StatCard label="Median Launch Post" value={fmt(Math.round(cumMedianLaunch))} sub="Median impressions per launch post" accent="var(--c-median)" />}
          {cumMedianThreads > 0 && <StatCard label="Median Thread" value={fmt(Math.round(cumMedianThreads))} sub="Median impressions per thread" accent="var(--c-median)" />}
          {cumMedianCPM > 0 && <StatCard label="Median CPM" value={"$" + cumMedianCPM.toFixed(2)} sub="Median per-thread CPM" accent="var(--c-cpm)" />}
        </div>
      )}
      <div className="info-banner">ℹ️ <strong>Threads CPM</strong> = thread spend ÷ thread impressions (no launch posts, QRTs, pending). <strong>All-In CPM</strong> = total spend ÷ total impressions. Showing <strong>{monthLabel}</strong> only.</div>

      <SectionTitle icon="📊">Campaign Comparison</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
        {allStats.map(c => (
          <CompareCard
            key={c.id}
            name={CAMPAIGN_META[c.id]?.label}
            views={c.totalViews}
            spend={c.totalSpend}
            mainV={c.mainViews}
            mainS={c.mainSpend}
            med={c.med}
            influencers={c.influencerCount}
            qrtV={c.qrtViews}
            launchOnly={!c.hasInfluencers}
          />
        ))}
      </div>

      <SectionTitle icon="💡">Key Insights</SectionTitle>
      <div className="data-card" style={{ lineHeight: 1.9, fontSize: 14, color: "var(--text-secondary)" }}>
        <p style={{ margin: "0 0 12px" }}><strong style={{ color: "var(--c-views)" }}>{fmt(cumTV)} total impressions</strong> in {monthLabel} across {campaignIds.length} campaigns at <strong style={{ color: "var(--c-cpm)" }}>${cpm(cumTS, cumTV)} CPM</strong>. Industry average X CPMs sit at $6–$12.</p>
        <p style={{ margin: "0 0 12px" }}><strong style={{ color: "var(--c-views)" }}>Launch posts generated {fmt(cumLV)} impressions</strong> ({cumTV > 0 ? ((cumLV/cumTV)*100).toFixed(0) : 0}% of total) at <strong style={{ color: "var(--c-cpm)" }}>${cpm(cumLS, cumLV)} CPM</strong>.</p>
        {cumIV > 0 && <p style={{ margin: "0 0 12px" }}><strong style={{ color: "var(--c-cpm)" }}>Threads-only CPM is ${cpm(cumIS, cumIV)}</strong>, driven by sub-$2 performers across campaigns.</p>}
        {campaignIds.includes("oa") && <p style={{ margin: "0 0 12px" }}><strong style={{ color: "var(--c-views)" }}>$30 QRT strategy</strong> on OA Suite delivered 257K paid QRT impressions at $2.33 CPM, most cost-efficient content type.</p>}
        {cumPS > 0 && <p style={{ margin: 0 }}><strong style={{ color: "var(--c-spend)" }}>${fmt(cumPS)} pending</strong> with zero impressions.</p>}
      </div>
    </div>
  );
}
