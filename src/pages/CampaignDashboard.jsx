import { useState } from "react";
import Particles from "../components/Particles";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import Bar from "../components/Bar";
import SectionTitle from "../components/SectionTitle";
import CompareCard from "../components/CompareCard";
import {
  OA_MAIN, OA_LAUNCH, OA_QRT_PAID, OA_QRT_PAID_COST, OA_QRT_FREE,
  NB_MAIN, NB_LAUNCH, NB_LAUNCH_FULL, NB_LAUNCH_MAR, NB_QRT_FREE, NB_PENDING,
  SD_LAUNCH, SR_LAUNCH, OS_LAUNCH, BH_LAUNCH, EC_LAUNCH,
  CAMPAIGN_META, MONTHS, MONTH_ORDER,
} from "../data/campaigns";
import { fmt, fmtD, cpm, median, sumV, sumP } from "../data/utils";

function campaignStats(id, fullNB = false) {
  if (id === "oa") {
    const mV = sumV(OA_MAIN), mS = sumP(OA_MAIN);
    const qPV = sumV(OA_QRT_PAID), qFV = sumV(OA_QRT_FREE);
    const lV = sumV(OA_LAUNCH), lS = sumP(OA_LAUNCH);
    return { id, mainData: OA_MAIN, launchPosts: OA_LAUNCH, hasInfluencers: true, mainViews: mV, mainSpend: mS, qrtViews: qPV + qFV, launchViews: lV, launchSpend: lS, totalViews: lV + mV + qPV + qFV, totalSpend: lS + mS + OA_QRT_PAID_COST, pendingSpend: 0, pending: [], med: median(OA_MAIN.map(i => i.views)), influencerCount: OA_MAIN.length };
  }
  if (id === "nb") {
    const launch = fullNB ? NB_LAUNCH_FULL : NB_LAUNCH;
    const mV = sumV(NB_MAIN), mS = sumP(NB_MAIN), qV = sumV(NB_QRT_FREE), lV = sumV(launch), lS = sumP(launch), pS = sumP(NB_PENDING);
    return { id, mainData: NB_MAIN, launchPosts: launch, hasInfluencers: true, mainViews: mV, mainSpend: mS, qrtViews: qV, launchViews: lV, launchSpend: lS, totalViews: lV + mV + qV, totalSpend: lS + mS + pS, pendingSpend: pS, pending: NB_PENDING, med: median(NB_MAIN.map(i => i.views)), influencerCount: NB_MAIN.length };
  }
  if (id === "sd") {
    const lV = sumV(SD_LAUNCH), lS = sumP(SD_LAUNCH);
    return { id, mainData: [], launchPosts: SD_LAUNCH, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 };
  }
  if (id === "sr") {
    const lV = sumV(SR_LAUNCH), lS = sumP(SR_LAUNCH);
    return { id, mainData: [], launchPosts: SR_LAUNCH, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 };
  }
  if (id === "nbm") {
    const lV = sumV(NB_LAUNCH_MAR), lS = sumP(NB_LAUNCH_MAR);
    return { id, mainData: [], launchPosts: NB_LAUNCH_MAR, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 };
  }
  if (id === "os") {
    const lV = sumV(OS_LAUNCH), lS = sumP(OS_LAUNCH);
    return { id, mainData: [], launchPosts: OS_LAUNCH, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 };
  }
  if (id === "bh") {
    const lV = sumV(BH_LAUNCH), lS = sumP(BH_LAUNCH);
    return { id, mainData: [], launchPosts: BH_LAUNCH, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 };
  }
  if (id === "ec") {
    const lV = sumV(EC_LAUNCH), lS = sumP(EC_LAUNCH);
    return { id, mainData: [], launchPosts: EC_LAUNCH, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 };
  }
  return null;
}

export default function CampaignDashboard({ onBack, monthId }) {
  const isAll = monthId === "all";
  const month = MONTHS[monthId];
  const monthLabel = isAll ? "All Campaigns" : (month?.label || "All");
  const campaignIds = isAll
    ? MONTH_ORDER.flatMap(m => MONTHS[m]?.campaigns || []).filter(id => !CAMPAIGN_META[id]?.hideFromAll)
    : (month?.campaigns || []);
  const [tab, setTab] = useState(campaignIds[0] || "oa");

  const allStats = campaignIds.map(id => campaignStats(id, isAll)).filter(Boolean);
  const cumTV = allStats.reduce((s, c) => s + c.totalViews, 0);
  const cumTS = allStats.reduce((s, c) => s + c.totalSpend, 0);
  const cumIV = allStats.reduce((s, c) => s + c.mainViews, 0);
  const cumIS = allStats.reduce((s, c) => s + c.mainSpend, 0);
  const cumLV = allStats.reduce((s, c) => s + c.launchViews, 0);
  const cumLS = allStats.reduce((s, c) => s + c.launchSpend, 0);
  const cumPS = allStats.reduce((s, c) => s + c.pendingSpend, 0);

  const tabs = [...campaignIds.map(id => ({ id, label: CAMPAIGN_META[id]?.label || id })), { id: "cum", label: "Cumulative" }];

  const isCum = tab === "cum";
  const current = isCum ? null : campaignStats(tab, isAll);
  const isLO = current && !current.hasInfluencers;
  const data = current?.mainData || [];
  const maxViews = data.length > 0 ? Math.max(...data.map(i => i.views)) : 0;
  const sorted = [...data].sort((a, b) => b.views - a.views);
  const sortedCPM = [...data].sort((a, b) => (a.price / a.views) - (b.price / b.views));
  const tabMonthLabel = isCum ? monthLabel : (CAMPAIGN_META[tab]?.monthDisplay || MONTHS[CAMPAIGN_META[tab]?.month]?.label || monthLabel);
  const campaignTitle = isCum ? `${monthLabel} — Cumulative` : CAMPAIGN_META[tab]?.label || "";

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div className="aura-bg" />
      <Particles />
      <div style={{ position: "relative", zIndex: 1, padding: "32px 28px" }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <button className="back-btn fade-up" onClick={onBack}>← Back</button>
          <PageHeader eyebrow="Influencer Marketing Analytics" title={campaignTitle} platform="X (Twitter)" owner="Zozo" month={tabMonthLabel} />

          <div className="fade-up s3" style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
            {tabs.map(t => (<button key={t.id} className={`campaign-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>))}
          </div>

          {/* CUMULATIVE */}
          {isCum && (
            <div className="fade-in">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                <StatCard label="Total Impressions" value={fmt(cumTV)} sub={`${campaignIds.length} campaigns in ${monthLabel}`} accent="var(--c-views)" />
                <StatCard label="Total Spend" value={fmtD(cumTS)} accent="var(--c-spend)" />
                <StatCard label="All-In CPM" value={"$" + cpm(cumTS, cumTV)} accent="var(--c-cpm)" sub="Everything included" />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                <StatCard label="Launch Posts Only" value={fmt(cumLV)} sub={`${fmtD(cumLS)} spent · $${cpm(cumLS, cumLV)} CPM`} accent="var(--c-views)" />
                {cumIV > 0 && <StatCard label="Influencers Only" value={fmt(cumIV)} sub={`${fmtD(cumIS)} spent · $${cpm(cumIS, cumIV)} CPM`} accent="var(--c-views)" />}
              </div>
              <div className="info-banner">ℹ️ <strong>Influencer-Only CPM</strong> = influencer spend ÷ influencer views (no launch posts, QRTs, pending). <strong>All-In CPM</strong> = total spend ÷ total impressions. Showing <strong>{monthLabel}</strong> only.</div>
              <SectionTitle icon="📊">Campaign Comparison</SectionTitle>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                {allStats.map(c => (<CompareCard key={c.id} name={CAMPAIGN_META[c.id]?.label} views={c.totalViews} spend={c.totalSpend} mainV={c.mainViews} mainS={c.mainSpend} med={c.med} influencers={c.influencerCount} qrtV={c.qrtViews} launchOnly={!c.hasInfluencers} />))}
              </div>
              <SectionTitle icon="💡">Key Insights</SectionTitle>
              <div className="data-card" style={{ lineHeight: 1.9, fontSize: 14, color: "var(--text-secondary)" }}>
                <p style={{ margin: "0 0 12px" }}><strong style={{ color: "var(--c-views)" }}>{fmt(cumTV)} total impressions</strong> in {monthLabel} across {campaignIds.length} campaigns at <strong style={{ color: "var(--c-cpm)" }}>${cpm(cumTS, cumTV)} CPM</strong>. Industry average X CPMs sit at $6–$12.</p>
                <p style={{ margin: "0 0 12px" }}><strong style={{ color: "var(--c-views)" }}>Launch posts generated {fmt(cumLV)} impressions</strong> ({cumTV > 0 ? ((cumLV/cumTV)*100).toFixed(0) : 0}% of total) at <strong style={{ color: "var(--c-cpm)" }}>${cpm(cumLS, cumLV)} CPM</strong>.</p>
                {cumIV > 0 && <p style={{ margin: "0 0 12px" }}><strong style={{ color: "var(--c-cpm)" }}>Influencer-only CPM is ${cpm(cumIS, cumIV)}</strong>, driven by sub-$2 performers like Tripathi, MdRiyaz, Antonio Costa, and Enzo Sanchez.</p>}
                {campaignIds.includes("oa") && <p style={{ margin: "0 0 12px" }}><strong style={{ color: "var(--cpm-bad)" }}>Underperformers:</strong> Alvaro Cintas ($303 CPM), Min Choi ($63.83 CPM), Hedonist ($31.25 CPM) consumed $4,200 for under 52K views.</p>}
                {campaignIds.includes("oa") && <p style={{ margin: "0 0 12px" }}><strong style={{ color: "var(--c-views)" }}>$30 QRT strategy</strong> on OA Suite delivered 257K paid QRT views at $2.33 CPM, most cost-efficient content type.</p>}
                {cumPS > 0 && <p style={{ margin: 0 }}><strong style={{ color: "var(--c-spend)" }}>${fmt(cumPS)} pending</strong> with zero impressions.</p>}
              </div>
            </div>
          )}

          {/* LAUNCH-ONLY */}
          {!isCum && isLO && current && (
            <div className="fade-in">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
                <StatCard label="Total Impressions" value={fmt(current.totalViews)} accent="var(--c-views)" />
                <StatCard label="Total Spend" value={fmtD(current.totalSpend)} accent="var(--c-spend)" />
                <StatCard label="Launch Post CPM" value={"$" + cpm(current.totalSpend, current.totalViews)} accent="var(--c-cpm)" />
              </div>
              <SectionTitle icon="🚀">Launch Post</SectionTitle>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {current.launchPosts.map((l, i) => (<StatCard key={i} label={`Launch Post${current.launchPosts.length > 1 ? ` ${i+1}` : ""}`} value={fmt(l.views)} sub={`${fmtD(l.price)} · $${cpm(l.price, l.views)} CPM`} accent="var(--c-views)" />))}
              </div>
              <SectionTitle icon="💡">Notes</SectionTitle>
              <div className="data-card" style={{ lineHeight: 1.9, fontSize: 14, color: "var(--text-secondary)" }}>
                {tab === "sd" && <p style={{ margin: 0 }}><strong style={{ color: "var(--gold-light)" }}>Seedance 2.0 Teaser</strong> achieved <strong style={{ color: "var(--c-cpm)" }}>${cpm(current.totalSpend, current.totalViews)} CPM</strong>. At $1,000 for 1.5M impressions, strongest launch post efficiency across all February campaigns.</p>}
                {tab === "sr" && <p style={{ margin: 0 }}><strong style={{ color: "var(--gold-light)" }}>Seedream 5.0 Lite</strong> delivered 2.1M impressions at <strong style={{ color: "var(--c-cpm)" }}>${cpm(current.totalSpend, current.totalViews)} CPM</strong>.</p>}
                {tab === "nbm" && <p style={{ margin: 0 }}><strong style={{ color: "var(--gold-light)" }}>Nano Banana 2 — Launch Post 3</strong> contributed 1M impressions at <strong style={{ color: "var(--c-cpm)" }}>${cpm(current.totalSpend, current.totalViews)} CPM</strong> in March, extending the campaign's reach beyond February.</p>}
                {tab === "os" && <p style={{ margin: 0 }}><strong style={{ color: "var(--gold-light)" }}>OpenArt Summit</strong> launch post delivered 1M impressions at <strong style={{ color: "var(--c-cpm)" }}>${cpm(current.totalSpend, current.totalViews)} CPM</strong>.</p>}
                {tab === "bh" && <p style={{ margin: 0 }}><strong style={{ color: "var(--gold-light)" }}>Bot House</strong> trailer achieved 3.4M impressions at <strong style={{ color: "var(--c-cpm)" }}>${cpm(current.totalSpend, current.totalViews)} CPM</strong> — strongest single launch post across all March campaigns.</p>}
                {tab === "ec" && <p style={{ margin: 0 }}><strong style={{ color: "var(--gold-light)" }}>Embryom Chronicles: The Last Doctrine</strong> teaser delivered 1.3M impressions at <strong style={{ color: "var(--c-cpm)" }}>${cpm(current.totalSpend, current.totalViews)} CPM</strong>.</p>}
              </div>
            </div>
          )}

          {/* INFLUENCER CAMPAIGNS */}
          {!isCum && !isLO && current && (
            <div className="fade-in">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
                <StatCard label="Total Impressions" value={fmt(current.totalViews)} sub="Launch + influencers + QRTs" accent="var(--c-views)" />
                <StatCard label="Total Spend" value={fmtD(current.totalSpend)} accent="var(--c-spend)" sub="All costs incl. pending" />
                <StatCard label="All-In CPM" value={"$" + cpm(current.totalSpend, current.totalViews)} accent="var(--c-cpm)" sub="Everything included" />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
                <StatCard label="Influencer-Only CPM" value={"$" + cpm(current.mainSpend, current.mainViews)} accent="var(--c-cpm)" sub="Excludes launch posts & QRTs" />
                <StatCard label="Influencer Views" value={fmt(current.mainViews)} accent="var(--c-views)" />
                <StatCard label="Median Views" value={fmt(current.med)} accent="var(--c-median)" />
                <StatCard label="QRT Views" value={fmt(current.qrtViews)} accent="var(--c-qrt)" />
              </div>
              <div className="info-banner">ℹ️ <strong>Influencer-Only CPM</strong> = influencer spend ÷ influencer views (no launch posts, QRTs, pending). <strong>All-In CPM</strong> = total spend ÷ total impressions.</div>

              <SectionTitle icon="🚀">Launch Post{current.launchPosts.length > 1 ? "s" : ""}</SectionTitle>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                {current.launchPosts.map((l, i) => (<StatCard key={i} label={`Launch Post${current.launchPosts.length > 1 ? ` ${i+1}` : ""}`} value={fmt(l.views)} sub={`${fmtD(l.price)} · $${cpm(l.price, l.views)} CPM`} accent="var(--c-views)" />))}
              </div>

              <SectionTitle icon="📈">Influencer Performance (by Views)</SectionTitle>
              <div style={{ marginBottom: 4 }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 11, color: "var(--text-muted)" }}>
                  <div style={{ width: 130, textAlign: "right" }}>Name</div>
                  <div style={{ flex: 1 }}>Views</div>
                  <div style={{ width: 58, textAlign: "right" }}>Cost</div>
                  <div style={{ width: 62, textAlign: "right" }}>CPM</div>
                </div>
                {sorted.map(i => (<Bar key={i.name} name={i.name} value={i.views} max={maxViews} cost={i.price} cpmVal={cpm(i.price, i.views)} />))}
              </div>

              <SectionTitle icon="🏆">Efficiency Ranking (Best CPM)</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {sortedCPM.slice(0, 6).map((i, idx) => (
                  <div key={i.name} className="data-card" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
                    <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-mono)", width: 22, color: idx === 0 ? "var(--c-spend)" : idx === 1 ? "#c0c4cc" : idx === 2 ? "#cd7f32" : "var(--text-muted)" }}>{idx + 1}</span>
                    <div>
                      <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{i.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}><span style={{ color: "var(--c-views)" }}>{fmt(i.views)}</span> views · <span style={{ color: "var(--c-cpm)" }}>${cpm(i.price, i.views)}</span> CPM</div>
                    </div>
                  </div>
                ))}
              </div>

              {current.pending.length > 0 && (
                <>
                  <SectionTitle icon="⏳">Pending Deliverables</SectionTitle>
                  <div className="data-card">
                    {current.pending.map(p => (
                      <div key={p.name} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                        <span style={{ color: "var(--c-spend)" }}>{p.name}</span>
                        <span style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{fmtD(p.price)} committed</span>
                      </div>
                    ))}
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>Total pending: <span style={{ color: "var(--c-spend)" }}>{fmtD(current.pendingSpend)}</span> with no impressions yet</div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
