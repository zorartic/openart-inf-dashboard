import StatCard from "./StatCard";
import Bar from "./Bar";
import SectionTitle from "./SectionTitle";
import {
  OA_MAIN, OA_LAUNCH, OA_QRT_PAID, OA_QRT_PAID_COST, OA_QRT_FREE,
  NB_MAIN, NB_LAUNCH, NB_LAUNCH_FULL, NB_LAUNCH_MAR, NB_QRT_FREE, NB_PENDING,
  SD_LAUNCH, SR_LAUNCH, OS_LAUNCH, BH_LAUNCH, EC_LAUNCH,
  VL_MAIN, VL_LAUNCH, VL_QRT_PAID, VL_QRT_PAID_COST,
  KL3_LAUNCH, KL3C_LAUNCH, SO2_LAUNCH,
  OAW_MAIN, OAW_LAUNCH, OAW_QRT_PAID_COST, OAW_QRT_PAID_VIEWS,
  AIPA_LAUNCH_MAR, AIPA_LAUNCH_APR,
  SD2_MAIN, SD2_LAUNCH, SD2_QRT_PAID_COST, SD2_QRT_PAID_VIEWS,
  CB_MAIN, CB_LAUNCH, RF4_LAUNCH,
  WAN27_LAUNCH, IPS_LAUNCH, LTX_LAUNCH, LYRIA3_LAUNCH,
} from "../data/campaigns";
import { fmt, fmtD, cpm, median, sumV, sumP } from "../data/utils";

import { CAMPAIGN_META } from "../data/campaigns";

// Per-month slices for multi-month campaigns. Everything else falls through to full.
function sliceNB(monthId) {
  if (monthId === "mar26") {
    const lV = sumV(NB_LAUNCH_MAR), lS = sumP(NB_LAUNCH_MAR);
    return { id: "nb", mainData: [], launchPosts: NB_LAUNCH_MAR, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, qrtCost: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 };
  }
  // feb26 or cumulative
  const launch = monthId === "feb26" ? NB_LAUNCH : NB_LAUNCH_FULL;
  const mV = sumV(NB_MAIN), mS = sumP(NB_MAIN), qV = sumV(NB_QRT_FREE);
  const lV = sumV(launch), lS = sumP(launch), pS = sumP(NB_PENDING);
  return { id: "nb", mainData: NB_MAIN, launchPosts: launch, hasInfluencers: true, mainViews: mV, mainSpend: mS, qrtViews: qV, qrtCost: 0, launchViews: lV, launchSpend: lS, totalViews: lV + mV + qV, totalSpend: lS + mS + pS, pendingSpend: pS, pending: NB_PENDING, med: median(NB_MAIN.map(i => i.views)), influencerCount: NB_MAIN.length };
}
function sliceAIPA(monthId) {
  let posts;
  if (monthId === "mar26") posts = AIPA_LAUNCH_MAR;
  else if (monthId === "apr26") posts = AIPA_LAUNCH_APR;
  else posts = [...AIPA_LAUNCH_MAR, ...AIPA_LAUNCH_APR];
  const lV = sumV(posts), lS = sumP(posts);
  return { id: "aipa", mainData: [], launchPosts: posts, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, qrtCost: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 };
}

export function campaignStats(id, monthId = null) {
  if (monthId && !CAMPAIGN_META[id]?.months?.includes(monthId)) return null;

  if (id === "nb") return sliceNB(monthId);
  if (id === "aipa") return sliceAIPA(monthId);

  if (id === "oa") {
    const mV = sumV(OA_MAIN), mS = sumP(OA_MAIN);
    const qPV = sumV(OA_QRT_PAID), qFV = sumV(OA_QRT_FREE);
    const lV = sumV(OA_LAUNCH), lS = sumP(OA_LAUNCH);
    return { id, mainData: OA_MAIN, launchPosts: OA_LAUNCH, hasInfluencers: true, mainViews: mV, mainSpend: mS, qrtViews: qPV + qFV, qrtCost: OA_QRT_PAID_COST, launchViews: lV, launchSpend: lS, totalViews: lV + mV + qPV + qFV, totalSpend: lS + mS + OA_QRT_PAID_COST, pendingSpend: 0, pending: [], med: median(OA_MAIN.map(i => i.views)), influencerCount: OA_MAIN.length };
  }
  if (id === "sd") { const lV = sumV(SD_LAUNCH), lS = sumP(SD_LAUNCH); return { id, mainData: [], launchPosts: SD_LAUNCH, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, qrtCost: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 }; }
  if (id === "sr") { const lV = sumV(SR_LAUNCH), lS = sumP(SR_LAUNCH); return { id, mainData: [], launchPosts: SR_LAUNCH, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, qrtCost: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 }; }
  if (id === "os") { const lV = sumV(OS_LAUNCH), lS = sumP(OS_LAUNCH); return { id, mainData: [], launchPosts: OS_LAUNCH, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, qrtCost: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 }; }
  if (id === "bh") { const lV = sumV(BH_LAUNCH), lS = sumP(BH_LAUNCH); return { id, mainData: [], launchPosts: BH_LAUNCH, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, qrtCost: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 }; }
  if (id === "ec") { const lV = sumV(EC_LAUNCH), lS = sumP(EC_LAUNCH); return { id, mainData: [], launchPosts: EC_LAUNCH, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, qrtCost: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 }; }
  if (id === "kl3") { const lV = sumV(KL3_LAUNCH), lS = sumP(KL3_LAUNCH); return { id, mainData: [], launchPosts: KL3_LAUNCH, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, qrtCost: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 }; }
  if (id === "kl3c") { const lV = sumV(KL3C_LAUNCH), lS = sumP(KL3C_LAUNCH); return { id, mainData: [], launchPosts: KL3C_LAUNCH, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, qrtCost: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 }; }
  if (id === "so2") { const lV = sumV(SO2_LAUNCH), lS = sumP(SO2_LAUNCH); return { id, mainData: [], launchPosts: SO2_LAUNCH, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, qrtCost: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 }; }
  if (id === "oaw") {
    const mV = sumV(OAW_MAIN), mS = sumP(OAW_MAIN);
    const lV = sumV(OAW_LAUNCH), lS = sumP(OAW_LAUNCH);
    return { id, mainData: OAW_MAIN, launchPosts: OAW_LAUNCH, hasInfluencers: true, mainViews: mV, mainSpend: mS, qrtViews: OAW_QRT_PAID_VIEWS, qrtCost: OAW_QRT_PAID_COST, launchViews: lV, launchSpend: lS, totalViews: lV + mV + OAW_QRT_PAID_VIEWS, totalSpend: lS + mS + OAW_QRT_PAID_COST, pendingSpend: 0, pending: [], med: median(OAW_MAIN.map(i => i.views)), influencerCount: OAW_MAIN.length };
  }
  if (id === "sd2") {
    const mV = sumV(SD2_MAIN), mS = sumP(SD2_MAIN);
    const lV = sumV(SD2_LAUNCH), lS = sumP(SD2_LAUNCH);
    return { id, mainData: SD2_MAIN, launchPosts: SD2_LAUNCH, hasInfluencers: true, mainViews: mV, mainSpend: mS, qrtViews: SD2_QRT_PAID_VIEWS, qrtCost: SD2_QRT_PAID_COST, launchViews: lV, launchSpend: lS, totalViews: lV + mV + SD2_QRT_PAID_VIEWS, totalSpend: lS + mS + SD2_QRT_PAID_COST, pendingSpend: 0, pending: [], med: median(SD2_MAIN.map(i => i.views)), influencerCount: SD2_MAIN.length };
  }
  if (id === "cb") {
    const mV = sumV(CB_MAIN), mS = sumP(CB_MAIN);
    const lV = sumV(CB_LAUNCH), lS = sumP(CB_LAUNCH);
    return { id, mainData: CB_MAIN, launchPosts: CB_LAUNCH, hasInfluencers: true, mainViews: mV, mainSpend: mS, qrtViews: 0, qrtCost: 0, launchViews: lV, launchSpend: lS, totalViews: lV + mV, totalSpend: lS + mS, pendingSpend: 0, pending: [], med: median(CB_MAIN.map(i => i.views)), influencerCount: CB_MAIN.length };
  }
  if (id === "rf4") { const lV = sumV(RF4_LAUNCH), lS = sumP(RF4_LAUNCH); return { id, mainData: [], launchPosts: RF4_LAUNCH, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, qrtCost: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 }; }
  if (id === "wan27") { const lV = sumV(WAN27_LAUNCH), lS = sumP(WAN27_LAUNCH); return { id, mainData: [], launchPosts: WAN27_LAUNCH, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, qrtCost: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 }; }
  if (id === "ips") { const lV = sumV(IPS_LAUNCH), lS = sumP(IPS_LAUNCH); return { id, mainData: [], launchPosts: IPS_LAUNCH, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, qrtCost: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 }; }
  if (id === "ltx") { const lV = sumV(LTX_LAUNCH), lS = sumP(LTX_LAUNCH); return { id, mainData: [], launchPosts: LTX_LAUNCH, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, qrtCost: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 }; }
  if (id === "lyria3") { const lV = sumV(LYRIA3_LAUNCH), lS = sumP(LYRIA3_LAUNCH); return { id, mainData: [], launchPosts: LYRIA3_LAUNCH, hasInfluencers: false, mainViews: 0, mainSpend: 0, qrtViews: 0, qrtCost: 0, launchViews: lV, launchSpend: lS, totalViews: lV, totalSpend: lS, pendingSpend: 0, pending: [], med: 0, influencerCount: 0 }; }
  if (id === "vl") {
    const qrtByNorm = {};
    VL_QRT_PAID.forEach(q => { const norm = q.name.replace(/\s*\(QRT\)\s*/i, "").trim(); qrtByNorm[norm] = (qrtByNorm[norm] || 0) + q.views; });
    const mergedMain = VL_MAIN.map(m => { const bonus = qrtByNorm[m.name] || 0; return bonus ? { ...m, views: m.views + bonus } : m; });
    const pureQRTs = VL_QRT_PAID.filter(q => { const norm = q.name.replace(/\s*\(QRT\)\s*/i, "").trim(); return !VL_MAIN.some(m => m.name === norm); });
    const mV = sumV(mergedMain), mS = sumP(VL_MAIN);
    const qFV = sumV(pureQRTs);
    const lV = sumV(VL_LAUNCH), lS = sumP(VL_LAUNCH);
    return { id, mainData: mergedMain, launchPosts: VL_LAUNCH, hasInfluencers: true, mainViews: mV, mainSpend: mS, qrtViews: qFV, qrtCost: VL_QRT_PAID_COST, pureQRTs, launchViews: lV, launchSpend: lS, totalViews: lV + mV + qFV, totalSpend: lS + mS + VL_QRT_PAID_COST, pendingSpend: 0, pending: [], med: median(mergedMain.map(i => i.views)), influencerCount: mergedMain.length };
  }
  return null;
}

export default function CampaignXDetail({ campaignId, monthId }) {
  const current = campaignStats(campaignId, monthId);
  if (!current) return null;
  const isLO = !current.hasInfluencers;
  const data = current.mainData || [];
  const maxViews = data.length > 0 ? Math.max(...data.map(i => i.views)) : 0;
  const sorted = [...data].sort((a, b) => b.views - a.views);
  const sortedCPM = [...data].sort((a, b) => (a.price / a.views) - (b.price / b.views));

  if (isLO) {
    return (
      <div className="fade-in">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
          <StatCard label="Total Impressions" value={fmt(current.totalViews)} accent="var(--c-views)" />
          <StatCard label="Total Spend" value={fmtD(current.totalSpend)} accent="var(--c-spend)" />
          <StatCard label="Launch Post CPM" value={"$" + cpm(current.totalSpend, current.totalViews)} accent="var(--c-cpm)" />
        </div>
        <SectionTitle icon="🚀">Launch Post{current.launchPosts.length > 1 ? "s" : ""}</SectionTitle>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {current.launchPosts.map((l, i) => {
            const eng = (l.comments || 0) + (l.reposts || 0) + (l.likes || 0) + (l.bookmarks || 0);
            const cpeStr = (eng > 0 && l.price > 0) ? ` · $${(l.price / eng).toFixed(2)} CPE` : "";
            const postLabel = l.label || `Launch Post${current.launchPosts.length > 1 ? ` ${i+1}` : ""}`;
            const labelEl = l.link ? <a href={l.link} target="_blank" rel="noopener noreferrer" className="inf-link" style={{ color: "inherit", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, fontFamily: "var(--font-body)" }}>{postLabel}</a> : postLabel;
            return <StatCard key={i} label={labelEl} value={fmt(l.views)} sub={`${fmtD(l.price)} · $${cpm(l.price, l.views)} CPM${cpeStr}`} accent="var(--c-views)" />;
          })}
        </div>
      </div>
    );
  }

  const allEng = [...current.mainData, ...current.launchPosts].reduce((s, i) => s + (i.comments || 0) + (i.reposts || 0) + (i.likes || 0) + (i.bookmarks || 0), 0);
  const overallCPE = allEng > 0 ? (current.totalSpend / allEng).toFixed(2) : null;

  return (
    <div className="fade-in">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
        <StatCard label="Total Impressions" value={fmt(current.totalViews)} sub="Launch + threads + QRTs" accent="var(--c-views)" />
        <StatCard label="Threads" value={fmt(current.mainViews)} accent="var(--c-views)" sub="Thread impressions" />
        {current.id !== "cb" && <StatCard label="QRT Impressions" value={fmt(current.qrtViews)} accent="var(--c-qrt)" />}
        {current.launchPosts.length > 0 && <StatCard label={`Launch Post${current.launchPosts.length > 1 ? "s" : ""} Total`} value={fmt(current.launchViews)} accent="var(--c-views)" sub={`${current.launchPosts.length} post${current.launchPosts.length > 1 ? "s" : ""}`} />}
        <StatCard label="Median of Threads" value={fmt(current.med)} accent="var(--c-median)" />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
        <StatCard label="Total Spend" value={fmtD(current.totalSpend)} accent="var(--c-spend)" sub="All costs incl. pending" />
        <StatCard label="Total CPM" value={"$" + cpm(current.totalSpend, current.totalViews)} accent="var(--c-cpm)" sub="Everything included" />
        <StatCard label="Threads CPM" value={"$" + cpm(current.mainSpend, current.mainViews)} accent="var(--c-cpm)" sub="Thread spend ÷ thread impressions" />
        {overallCPE && <StatCard label="Overall CPE" value={`$${overallCPE}`} accent="var(--c-cpm)" sub="Total spend ÷ total engagements" />}
        {current.launchPosts.length > 0 && <StatCard label="Launch CPM" value={"$" + cpm(current.launchSpend, current.launchViews)} accent="var(--c-cpm)" sub="Launch spend ÷ launch impressions" />}
      </div>
      <div className="info-banner">ℹ️ <strong>Threads CPM</strong> = thread spend ÷ thread impressions. <strong>Total CPM</strong> = total spend ÷ total impressions.</div>

      {current.launchPosts.length > 0 && (
        <>
          <SectionTitle icon="🚀">Launch Post{current.launchPosts.length > 1 ? "s" : ""}</SectionTitle>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
            {current.launchPosts.map((l, i) => {
              const eng = (l.comments || 0) + (l.reposts || 0) + (l.likes || 0) + (l.bookmarks || 0);
              const cpeStr = (eng > 0 && l.price > 0) ? ` · $${(l.price / eng).toFixed(2)} CPE` : "";
              const postLabel = l.label || `Launch Post${current.launchPosts.length > 1 ? ` ${i+1}` : ""}`;
              const labelEl = l.link ? <a href={l.link} target="_blank" rel="noopener noreferrer" className="inf-link" style={{ color: "inherit", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, fontFamily: "var(--font-body)" }}>{postLabel}</a> : postLabel;
              return <StatCard key={i} label={labelEl} value={fmt(l.views)} sub={`${fmtD(l.price)} · $${cpm(l.price, l.views)} CPM${cpeStr}`} accent="var(--c-views)" />;
            })}
          </div>
        </>
      )}

      <SectionTitle icon="📈">Influencer Performance</SectionTitle>
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 11, color: "var(--text-muted)" }}>
          <div style={{ width: 130, textAlign: "right" }}>Name</div>
          <div style={{ flex: 1 }}>Impressions</div>
          <div style={{ width: 58, textAlign: "right" }}>Cost</div>
          <div style={{ width: 62, textAlign: "right" }}>CPM</div>
          <div style={{ width: 62, textAlign: "right" }}>CPE</div>
        </div>
        {sorted.map(i => (<Bar key={i.name} name={i.name} value={i.views} max={maxViews} cost={i.price} cpmVal={cpm(i.price, i.views)} link={i.link} comments={i.comments} reposts={i.reposts} likes={i.likes} bookmarks={i.bookmarks} />))}
      </div>

      <SectionTitle icon="🏆">Efficiency Ranking (Best CPM)</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {sortedCPM.slice(0, 6).map((i, idx) => (
          <div key={i.name} className="data-card" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
            <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-mono)", width: 22, color: idx === 0 ? "var(--c-spend)" : idx === 1 ? "#c0c4cc" : idx === 2 ? "#cd7f32" : "var(--text-muted)" }}>{idx + 1}</span>
            <div>
              <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>
                {i.link ? <a href={i.link} target="_blank" rel="noopener noreferrer" className="inf-link">{i.name}</a> : i.name}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}><span style={{ color: "var(--c-views)" }}>{fmt(i.views)}</span> impressions · <span style={{ color: "var(--c-cpm)" }}>${cpm(i.price, i.views)}</span> CPM</div>
            </div>
          </div>
        ))}
      </div>

      {current.id === "vl" && current.pureQRTs && (
        <>
          <SectionTitle icon="🔁">$30 QRT Package — Cumulative</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
            <StatCard label="QRT Package Impressions" value={fmt(current.qrtViews)} sub={`12 creators · ${fmtD(VL_QRT_PAID_COST)} total`} accent="var(--c-qrt)" />
            <StatCard label="Package CPM" value={"$" + cpm(VL_QRT_PAID_COST, current.qrtViews)} accent="var(--c-cpm)" sub="All $30 QRTs as one deal" />
          </div>
        </>
      )}
      {current.id === "oaw" && (
        <>
          <SectionTitle icon="🔁">$30 QRT Package</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
            <StatCard label="QRT Package Impressions" value={fmt(current.qrtViews)} sub={`100 creators · ${fmtD(OAW_QRT_PAID_COST)} total`} accent="var(--c-qrt)" />
            <StatCard label="Package CPM" value={"$" + cpm(OAW_QRT_PAID_COST, current.qrtViews)} accent="var(--c-cpm)" sub="100 paid QRTs as one deal" />
          </div>
        </>
      )}
      {current.id === "sd2" && (
        <>
          <SectionTitle icon="🔁">Paid QRT Package</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
            <StatCard label="QRT Package Impressions" value={fmt(current.qrtViews)} sub={`208 creators · ${fmtD(SD2_QRT_PAID_COST)} total`} accent="var(--c-qrt)" />
            <StatCard label="Package CPM" value={"$" + cpm(SD2_QRT_PAID_COST, current.qrtViews)} accent="var(--c-cpm)" sub="208 paid QRTs as one deal" />
          </div>
        </>
      )}

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
  );
}
