import { useState } from "react";

const OA_MAIN = [
  { name: "Tripathi", views: 147500, price: 200 },
  { name: "Antonio Costa", views: 146600, price: 250 },
  { name: "Enzo Sanchez", views: 140300, price: 250 },
  { name: "Alejandro Martinez", views: 136600, price: 250 },
  { name: "Nova AI", views: 136200, price: 250 },
  { name: "Alvaro IA", views: 125300, price: 250 },
  { name: "Emma Uses AI", views: 102300, price: 250 },
  { name: "Ava AI", views: 99000, price: 250 },
  { name: "Theo Builds AI", views: 86400, price: 250 },
  { name: "Miguel Angel", views: 79500, price: 275 },
  { name: "Alex Inspira", views: 57600, price: 275 },
  { name: "Otaku Machine", views: 47200, price: 250 },
  { name: "AIwithGhotai", views: 41700, price: 150 },
  { name: "Hedonist", views: 22400, price: 700 },
  { name: "Tiago", views: 24900, price: 250 },
  { name: "Ivan", views: 16800, price: 200 },
  { name: "Jaynit", views: 14200, price: 175 },
  { name: "Dhaval", views: 12400, price: 175 },
  { name: "Rez", views: 5951, price: 125 },
  { name: "Alvaro Cintas", views: 6600, price: 2000 },
];

const OA_LAUNCH = [{ views: 2000000, price: 2000 }];
const OA_QRT_PAID = [
  { name: "Parul Gautam", views: 36600 }, { name: "Synthia", views: 20200 },
  { name: "Manish Kumar Shah", views: 20300 }, { name: "Markandey Sharma", views: 18700 },
  { name: "Pablo Evans", views: 16600 }, { name: "David", views: 13900 },
  { name: "Akansha Khandelwal", views: 13100 }, { name: "Heisenberg", views: 11300 },
  { name: "Muhammad Ayan", views: 9886 }, { name: "Oogie", views: 9785 },
  { name: "Katyayani Shukla", views: 9448 }, { name: "ADRIAN", views: 9431 },
  { name: "Nao", views: 9415 }, { name: "YokerAI", views: 9364 },
  { name: "Aakash Kanojiya", views: 9216 }, { name: "Matheus IA", views: 9211 },
  { name: "AI Panda", views: 8833 }, { name: "ValerIA", views: 8588 },
  { name: "JORDAN", views: 6821 }, { name: "Lucas IA", views: 6269 },
];
const OA_QRT_PAID_COST = 600;
const OA_QRT_FREE = [
  { name: "Ava AI Labs", views: 12000 }, { name: "Theo Builds AI", views: 10900 },
  { name: "Enzo Sanchez", views: 9853 }, { name: "Tripathi", views: 9800 },
  { name: "Nova IA", views: 8073 }, { name: "Antonio Costa", views: 7360 },
  { name: "OtakuMachine", views: 6069 }, { name: "Alejandro Martinez", views: 6039 },
  { name: "Emma Uses AI", views: 5767 }, { name: "Alvaro", views: 5341 },
  { name: "Tiago", views: 5264 }, { name: "Miguel Angel", views: 3295 },
  { name: "Wasif", views: 1621 }, { name: "Alex Inspira", views: 1458 },
  { name: "Rez", views: 1281 }, { name: "Ivan", views: 875 },
  { name: "Arsalan", views: 582 },
];

const NB_MAIN = [
  { name: "MdRiyaz", views: 260800, price: 350 },
  { name: "Chidanand Tripathi", views: 121600, price: 150 },
  { name: "Miguel Angel", views: 110100, price: 275 },
  { name: "Matias Schrank", views: 104700, price: 150 },
  { name: "Lucas Mestrel", views: 102300, price: 150 },
  { name: "Alexander Inspira", views: 60500, price: 275 },
  { name: "Arsalan", views: 24000, price: 300 },
  { name: "Min Choi", views: 23500, price: 1500 },
  { name: "Manish", views: 20700, price: 125 },
  { name: "Jaynit", views: 19400, price: 175 },
  { name: "Dhaval", views: 16400, price: 175 },
  { name: "Ivan IA", views: 10700, price: 200 },
  { name: "Rez", views: 3844, price: 125 },
  { name: "Wasif", views: 1000, price: 15 },
];
const NB_LAUNCH = [
  { views: 2100000, price: 2000 },
  { views: 1000000, price: 1000 },
];
const NB_QRT_FREE = [
  { name: "Tripathi (QRT)", views: 31000 },
  { name: "Alex Inspira (QRT)", views: 2182 },
  { name: "Miguel Angel (QRT)", views: 8514 },
];
const NB_PENDING = [
  { name: "Kalsoom", price: 150 },
  { name: "Eyisha", price: 1300 },
];

const SD_LAUNCH = [{ views: 1500000, price: 1000 }];
const SR_LAUNCH = [{ views: 2100000, price: 2000 }];

function fmt(n) { return n.toLocaleString(); }
function fmtD(n) { return "$" + n.toLocaleString(); }
function cpmCalc(cost, views) { return views > 0 ? ((cost / views) * 1000).toFixed(2) : "—"; }
function median(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

const StatCard = ({ label, value, sub, accent = "#00e5a0" }) => (
  <div style={{
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "20px 24px",
    flex: "1 1 200px",
    minWidth: 170,
  }}>
    <div style={{ fontSize: 11, color: "#8a8f98", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 700, color: accent, fontFamily: "'Space Mono', monospace" }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{sub}</div>}
  </div>
);

const Bar = ({ name, value, max, cost, cpmVal, color }) => {
  const pct = Math.max((value / max) * 100, 2);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ width: 140, fontSize: 12, color: "#c0c4cc", textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 4, height: 22, position: "relative", overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          borderRadius: 4, transition: "width 0.6s ease",
        }} />
        <span style={{ position: "absolute", right: 8, top: 2, fontSize: 11, color: "#fff", opacity: 0.8 }}>{fmt(value)}</span>
      </div>
      <div style={{ width: 55, fontSize: 11, color: "#8a8f98", textAlign: "right", flexShrink: 0 }}>{fmtD(cost)}</div>
      <div style={{ width: 60, fontSize: 11, color: parseFloat(cpmVal) > 15 ? "#ff6b6b" : parseFloat(cpmVal) < 5 ? "#00e5a0" : "#fbbf24", textAlign: "right", flexShrink: 0, fontFamily: "'Space Mono', monospace" }}>${cpmVal}</div>
    </div>
  );
};

const SectionTitle = ({ children, icon }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "36px 0 18px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 12 }}>
    <span style={{ fontSize: 20 }}>{icon}</span>
    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#e8eaed", fontFamily: "'DM Sans', sans-serif", letterSpacing: -0.3 }}>{children}</h2>
  </div>
);

const CampaignCompareCard = ({ name, views, spend, mainV, mainS, med, color, influencers, qrtV, launchOnly }) => (
  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 24 }}>
    <div style={{ fontSize: 15, fontWeight: 600, color, marginBottom: 16 }}>{name}</div>
    <div style={{ fontSize: 12, color: "#8a8f98", lineHeight: 2.2 }}>
      <div>Total Impressions: <span style={{ color: "#e8eaed", fontFamily: "'Space Mono', monospace" }}>{fmt(views)}</span></div>
      <div>Total Spend: <span style={{ color: "#e8eaed", fontFamily: "'Space Mono', monospace" }}>{fmtD(spend)}</span></div>
      <div>All-In CPM: <span style={{ color: "#e8eaed", fontFamily: "'Space Mono', monospace" }}>${cpmCalc(spend, views)}</span></div>
      {!launchOnly && <>
        <div>Influencer-Only CPM: <span style={{ color: "#e8eaed", fontFamily: "'Space Mono', monospace" }}>${cpmCalc(mainS, mainV)}</span></div>
        <div>Median Influencer Views: <span style={{ color: "#e8eaed", fontFamily: "'Space Mono', monospace" }}>{fmt(med)}</span></div>
        <div>Influencers: <span style={{ color: "#e8eaed", fontFamily: "'Space Mono', monospace" }}>{influencers}</span></div>
        <div>QRT Impressions: <span style={{ color: "#e8eaed", fontFamily: "'Space Mono', monospace" }}>{fmt(qrtV)}</span></div>
      </>}
      {launchOnly && <div style={{ marginTop: 4, color: "#6b7280", fontStyle: "italic" }}>Launch post only — no influencer posts</div>}
    </div>
  </div>
);

export default function Dashboard() {
  const [tab, setTab] = useState("oa");

  const oaMainViews = OA_MAIN.reduce((s, i) => s + i.views, 0);
  const oaMainSpend = OA_MAIN.reduce((s, i) => s + i.price, 0);
  const oaQrtPaidViews = OA_QRT_PAID.reduce((s, i) => s + i.views, 0);
  const oaQrtFreeViews = OA_QRT_FREE.reduce((s, i) => s + i.views, 0);
  const oaLaunchViews = OA_LAUNCH.reduce((s, i) => s + i.views, 0);
  const oaLaunchSpend = OA_LAUNCH.reduce((s, i) => s + i.price, 0);
  const oaTotalViews = oaLaunchViews + oaMainViews + oaQrtPaidViews + oaQrtFreeViews;
  const oaTotalSpend = oaLaunchSpend + oaMainSpend + OA_QRT_PAID_COST;
  const oaMedian = median(OA_MAIN.map(i => i.views));

  const nbLaunchViews = NB_LAUNCH.reduce((s, i) => s + i.views, 0);
  const nbLaunchSpend = NB_LAUNCH.reduce((s, i) => s + i.price, 0);
  const nbMainViews = NB_MAIN.reduce((s, i) => s + i.views, 0);
  const nbMainSpend = NB_MAIN.reduce((s, i) => s + i.price, 0);
  const nbQrtViews = NB_QRT_FREE.reduce((s, i) => s + i.views, 0);
  const nbPendingSpend = NB_PENDING.reduce((s, i) => s + i.price, 0);
  const nbTotalViews = nbLaunchViews + nbMainViews + nbQrtViews;
  const nbTotalSpend = nbLaunchSpend + nbMainSpend + nbPendingSpend;
  const nbMedian = median(NB_MAIN.map(i => i.views));

  const sdLaunchViews = SD_LAUNCH.reduce((s, i) => s + i.views, 0);
  const sdLaunchSpend = SD_LAUNCH.reduce((s, i) => s + i.price, 0);
  const srLaunchViews = SR_LAUNCH.reduce((s, i) => s + i.views, 0);
  const srLaunchSpend = SR_LAUNCH.reduce((s, i) => s + i.price, 0);

  const cumViews = oaTotalViews + nbTotalViews + sdLaunchViews + srLaunchViews;
  const cumSpend = oaTotalSpend + nbTotalSpend + sdLaunchSpend + srLaunchSpend;
  const cumInfluencerViews = oaMainViews + nbMainViews;
  const cumInfluencerSpend = oaMainSpend + nbMainSpend;
  const cumLaunchViews = oaLaunchViews + nbLaunchViews + sdLaunchViews + srLaunchViews;
  const cumLaunchSpend = oaLaunchSpend + nbLaunchSpend + sdLaunchSpend + srLaunchSpend;

  const tabs = [
    { id: "oa", label: "OA Suite Launch" },
    { id: "nb", label: "Nano Banana 2" },
    { id: "sd", label: "Seedance 2.0" },
    { id: "sr", label: "Seedream 5.0" },
    { id: "cum", label: "Cumulative" },
  ];

  const isOA = tab === "oa";
  const isNB = tab === "nb";
  const isSD = tab === "sd";
  const isSR = tab === "sr";
  const isCum = tab === "cum";
  const isLaunchOnly = isSD || isSR;

  const data = isOA ? OA_MAIN : isNB ? NB_MAIN : [];
  const maxViews = data.length > 0 ? Math.max(...data.map(i => i.views)) : 0;
  const sorted = [...data].sort((a, b) => b.views - a.views);
  const sortedByCPM = [...data].sort((a, b) => (a.price / a.views) - (b.price / b.views));

  let totalViews, totalSpend, mainViews, mainSpend, medianV, launchPosts, qrtViews;
  if (isOA) {
    totalViews = oaTotalViews; totalSpend = oaTotalSpend; mainViews = oaMainViews; mainSpend = oaMainSpend; medianV = oaMedian; launchPosts = OA_LAUNCH; qrtViews = oaQrtPaidViews + oaQrtFreeViews;
  } else if (isNB) {
    totalViews = nbTotalViews; totalSpend = nbTotalSpend; mainViews = nbMainViews; mainSpend = nbMainSpend; medianV = nbMedian; launchPosts = NB_LAUNCH; qrtViews = nbQrtViews;
  } else if (isSD) {
    totalViews = sdLaunchViews; totalSpend = sdLaunchSpend; launchPosts = SD_LAUNCH;
  } else if (isSR) {
    totalViews = srLaunchViews; totalSpend = srLaunchSpend; launchPosts = SR_LAUNCH;
  }

  const tabStyle = (active) => ({
    padding: "10px 16px",
    fontSize: 12,
    fontWeight: active ? 600 : 400,
    color: active ? "#fff" : "#6b7280",
    background: active ? "rgba(0,229,160,0.12)" : "transparent",
    border: active ? "1px solid rgba(0,229,160,0.3)" : "1px solid rgba(255,255,255,0.06)",
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
    letterSpacing: 0.3,
    whiteSpace: "nowrap",
  });

  return (
    <div style={{
      background: "#0d1117",
      minHeight: "100vh",
      color: "#e8eaed",
      padding: "32px 28px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: "#00e5a0", textTransform: "uppercase", letterSpacing: 2, fontWeight: 600 }}>Influencer Marketing Analytics</span>
        </div>
        <h1 style={{ margin: "0 0 6px", fontSize: 32, fontWeight: 700, letterSpacing: -1, fontFamily: "'DM Sans', sans-serif" }}>
          February Performance Report
        </h1>
        <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 28px" }}>By Zozo for X (Twitter)</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={tabStyle(tab === t.id)}>{t.label}</button>
          ))}
        </div>

        {/* ============ CUMULATIVE ============ */}
        {isCum && (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 14 }}>
              <StatCard label="Total Impressions" value={fmt(cumViews)} sub="All 4 campaigns" />
              <StatCard label="Total Spend" value={fmtD(cumSpend)} accent="#fbbf24" />
              <StatCard label="All-In CPM" value={"$" + cpmCalc(cumSpend, cumViews)} accent="#818cf8" sub="Everything included" />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 14 }}>
              <StatCard label="Launch Posts Only" value={fmt(cumLaunchViews)} sub={`${fmtD(cumLaunchSpend)} spent · $${cpmCalc(cumLaunchSpend, cumLaunchViews)} CPM`} accent="#38bdf8" />
              <StatCard label="Influencers Only" value={fmt(cumInfluencerViews)} sub={`${fmtD(cumInfluencerSpend)} spent · $${cpmCalc(cumInfluencerSpend, cumInfluencerViews)} CPM`} accent="#f472b6" />
            </div>

            <div style={{
              background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.2)",
              borderRadius: 10, padding: "14px 20px", marginBottom: 8, fontSize: 12, color: "#a5b4fc",
            }}>
              ℹ️ <strong>Influencer-Only CPM</strong> uses only influencer post views & spend — launch posts, QRTs, and pending spend are excluded. <strong>All-In CPM</strong> includes everything.
            </div>

            <SectionTitle icon="📊">Campaign Comparison</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <CampaignCompareCard name="OA Suite Launch" views={oaTotalViews} spend={oaTotalSpend} mainV={oaMainViews} mainS={oaMainSpend} med={oaMedian} color="#00e5a0" influencers={20} qrtV={oaQrtPaidViews + oaQrtFreeViews} />
              <CampaignCompareCard name="Nano Banana 2" views={nbTotalViews} spend={nbTotalSpend} mainV={nbMainViews} mainS={nbMainSpend} med={nbMedian} color="#818cf8" influencers={14} qrtV={nbQrtViews} />
              <CampaignCompareCard name="Seedance 2.0 Teaser" views={sdLaunchViews} spend={sdLaunchSpend} color="#fbbf24" launchOnly />
              <CampaignCompareCard name="Seedream 5.0 Lite" views={srLaunchViews} spend={srLaunchSpend} color="#f472b6" launchOnly />
            </div>

            <SectionTitle icon="💡">Key Insights</SectionTitle>
            <div style={{ background: "rgba(0,229,160,0.04)", border: "1px solid rgba(0,229,160,0.15)", borderRadius: 12, padding: 24, lineHeight: 1.9, fontSize: 14, color: "#c0c4cc" }}>
              <p style={{ margin: "0 0 14px" }}><strong style={{ color: "#00e5a0" }}>{fmt(cumViews)} total impressions</strong> across all 4 campaigns at a combined all-in CPM of <strong style={{ color: "#fbbf24" }}>${cpmCalc(cumSpend, cumViews)}</strong> — exceptional efficiency for X influencer marketing where industry averages sit at $6–$12 CPM.</p>
              <p style={{ margin: "0 0 14px" }}><strong style={{ color: "#818cf8" }}>Launch posts are the ROI engine.</strong> They generated {fmt(cumLaunchViews)} impressions ({((cumLaunchViews / cumViews) * 100).toFixed(0)}% of total) at just ${cpmCalc(cumLaunchSpend, cumLaunchViews)} CPM. The brand account's organic reach amplifies every dollar spent.</p>
              <p style={{ margin: "0 0 14px" }}><strong style={{ color: "#f472b6" }}>Influencer-only CPM (excl. launch posts) is ${cpmCalc(cumInfluencerSpend, cumInfluencerViews)}</strong> — still well below industry benchmarks, driven by sub-$2 CPM performers like Tripathi, MdRiyaz, Antonio Costa, and Enzo Sanchez.</p>
              <p style={{ margin: "0 0 14px" }}><strong style={{ color: "#fbbf24" }}>Seedance 2.0 Teaser</strong> delivered the strongest single launch post CPM at ${cpmCalc(sdLaunchSpend, sdLaunchViews)} — 1.5M views for just $1,000. <strong style={{ color: "#f472b6" }}>Seedream 5.0 Lite</strong> matched OA Suite's launch CPM at ${cpmCalc(srLaunchSpend, srLaunchViews)} with 2.1M views.</p>
              <p style={{ margin: "0 0 14px" }}><strong style={{ color: "#ff6b6b" }}>Underperformers to reconsider:</strong> Alvaro Cintas ($303 CPM), Min Choi ($63.83 CPM), and Hedonist ($31.25 CPM) consumed $4,200 for under 52K views. Reallocating to proven $150-tier creators could yield 1M+ additional impressions.</p>
              <p style={{ margin: "0 0 14px" }}><strong style={{ color: "#00e5a0" }}>The $30 QRT strategy</strong> on OA Suite delivered 257K paid QRT views at $2.33 CPM — the most cost-efficient content type. Scaling this across future campaigns is a clear win.</p>
              <p style={{ margin: 0 }}><strong style={{ color: "#818cf8" }}>$1,450 pending</strong> (Kalsoom + Eyisha, NB2) has zero impressions. If undelivered, NB2's all-in CPM improves from $2.09 to $1.73.</p>
            </div>
          </>
        )}

        {/* ============ LAUNCH-ONLY CAMPAIGNS ============ */}
        {isLaunchOnly && (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 14 }}>
              <StatCard label="Total Impressions" value={fmt(totalViews)} />
              <StatCard label="Total Spend" value={fmtD(totalSpend)} accent="#fbbf24" />
              <StatCard label="Launch Post CPM" value={"$" + cpmCalc(totalSpend, totalViews)} accent="#818cf8" />
            </div>

            <SectionTitle icon="🚀">Launch Post</SectionTitle>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {launchPosts.map((l, i) => (
                <StatCard key={i} label={`Launch Post${launchPosts.length > 1 ? ` ${i + 1}` : ""}`} value={fmt(l.views)} sub={`${fmtD(l.price)} · $${cpmCalc(l.price, l.views)} CPM`} accent={isSD ? "#fbbf24" : "#f472b6"} />
              ))}
            </div>

            <SectionTitle icon="💡">Notes</SectionTitle>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 24, lineHeight: 1.9, fontSize: 14, color: "#c0c4cc" }}>
              {isSD && (
                <>
                  <p style={{ margin: "0 0 14px" }}><strong style={{ color: "#fbbf24" }}>Seedance 2.0 Teaser</strong> achieved the lowest launch post CPM across all campaigns at <strong style={{ color: "#00e5a0" }}>${cpmCalc(sdLaunchSpend, sdLaunchViews)}</strong>. At $1,000 for 1.5M impressions, this sets a strong benchmark for teaser content efficiency.</p>
                  <p style={{ margin: 0 }}>This is a launch-post-only campaign with no influencer posts yet. Adding even a small influencer push at current rates ($1.23–$4.67 CPM) could amplify reach significantly.</p>
                </>
              )}
              {isSR && (
                <>
                  <p style={{ margin: "0 0 14px" }}><strong style={{ color: "#f472b6" }}>Seedream 5.0 Lite</strong> delivered 2.1M impressions at <strong style={{ color: "#00e5a0" }}>${cpmCalc(srLaunchSpend, srLaunchViews)} CPM</strong> — matching OA Suite Launch's launch post performance exactly.</p>
                  <p style={{ margin: 0 }}>Currently launch-post-only. Pairing with an influencer wave using proven sub-$2 CPM creators could extend reach by 500K–1M+ views at minimal incremental cost.</p>
                </>
              )}
            </div>
          </>
        )}

        {/* ============ INFLUENCER CAMPAIGNS ============ */}
        {(isOA || isNB) && (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 8 }}>
              <StatCard label="Total Impressions" value={fmt(totalViews)} sub="Launch + influencers + QRTs" />
              <StatCard label="Total Spend" value={fmtD(totalSpend)} accent="#fbbf24" sub="All costs incl. pending" />
              <StatCard label="All-In CPM" value={"$" + cpmCalc(totalSpend, totalViews)} accent="#818cf8" sub="Everything included" />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 8 }}>
              <StatCard label="Influencer-Only CPM" value={"$" + cpmCalc(mainSpend, mainViews)} accent="#f472b6" sub="Excludes launch posts & QRTs" />
              <StatCard label="Influencer Views" value={fmt(mainViews)} accent="#34d399" />
              <StatCard label="Median Influencer Views" value={fmt(medianV)} accent="#a78bfa" />
              <StatCard label="QRT Views" value={fmt(qrtViews)} accent="#38bdf8" />
            </div>

            <div style={{
              background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.2)",
              borderRadius: 10, padding: "14px 20px", marginBottom: 8, fontSize: 12, color: "#a5b4fc",
            }}>
              ℹ️ <strong>Influencer-Only CPM</strong> = influencer spend ÷ influencer views only (no launch posts, no QRTs, no pending). <strong>All-In CPM</strong> = total spend ÷ total impressions.
            </div>

            <SectionTitle icon="🚀">Launch Post{launchPosts.length > 1 ? "s" : ""}</SectionTitle>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 8 }}>
              {launchPosts.map((l, i) => (
                <StatCard key={i} label={`Launch Post${launchPosts.length > 1 ? ` ${i + 1}` : ""}`} value={fmt(l.views)} sub={`${fmtD(l.price)} · $${cpmCalc(l.price, l.views)} CPM`} accent={isOA ? "#00e5a0" : "#818cf8"} />
              ))}
            </div>

            <SectionTitle icon="📈">Influencer Performance (by Views)</SectionTitle>
            <div style={{ marginBottom: 4 }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 11, color: "#6b7280" }}>
                <div style={{ width: 140, textAlign: "right" }}>Name</div>
                <div style={{ flex: 1 }}>Views</div>
                <div style={{ width: 55, textAlign: "right" }}>Cost</div>
                <div style={{ width: 60, textAlign: "right" }}>CPM</div>
              </div>
              {sorted.map(i => (
                <Bar key={i.name} name={i.name} value={i.views} max={maxViews}
                  cost={i.price} cpmVal={cpmCalc(i.price, i.views)}
                  color={parseFloat(cpmCalc(i.price, i.views)) < 5 ? "#00e5a0" : parseFloat(cpmCalc(i.price, i.views)) < 15 ? "#fbbf24" : "#ff6b6b"} />
              ))}
            </div>

            <SectionTitle icon="🏆">Efficiency Ranking (Best CPM)</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {sortedByCPM.slice(0, 6).map((i, idx) => (
                <div key={i.name} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                  background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)"
                }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: idx === 0 ? "#fbbf24" : idx === 1 ? "#c0c4cc" : idx === 2 ? "#cd7f32" : "#6b7280", fontFamily: "'Space Mono', monospace", width: 24 }}>
                    {idx + 1}
                  </span>
                  <div>
                    <div style={{ fontSize: 13, color: "#e8eaed", fontWeight: 500 }}>{i.name}</div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>{fmt(i.views)} views · ${cpmCalc(i.price, i.views)} CPM</div>
                  </div>
                </div>
              ))}
            </div>

            {isNB && NB_PENDING.length > 0 && (
              <>
                <SectionTitle icon="⏳">Pending Deliverables</SectionTitle>
                <div style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 10, padding: 16 }}>
                  {NB_PENDING.map(p => (
                    <div key={p.name} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                      <span style={{ color: "#fbbf24" }}>{p.name}</span>
                      <span style={{ color: "#8a8f98", fontFamily: "'Space Mono', monospace" }}>{fmtD(p.price)} committed</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>Total pending: {fmtD(nbPendingSpend)} with no impressions yet</div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}