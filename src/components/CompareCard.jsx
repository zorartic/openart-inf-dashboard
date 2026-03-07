import { fmt, fmtD, cpm } from "../data/utils";

export default function CompareCard({ name, views, spend, mainV, mainS, med, influencers, qrtV, launchOnly }) {
  return (
    <div className="data-card" style={{ flex: "1 1 380px" }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gold-light)", marginBottom: 14, fontFamily: "var(--font-display)" }}>{name}</div>
      <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 2.2 }}>
        <div>Total Impressions: <span style={{ color: "var(--c-views)", fontFamily: "var(--font-mono)" }}>{fmt(views)}</span></div>
        <div>Total Spend: <span style={{ color: "var(--c-spend)", fontFamily: "var(--font-mono)" }}>{fmtD(spend)}</span></div>
        <div>All-In CPM: <span style={{ color: "var(--c-cpm)", fontFamily: "var(--font-mono)" }}>${cpm(spend, views)}</span></div>
        {!launchOnly && <>
          <div>Influencer-Only CPM: <span style={{ color: "var(--c-cpm)", fontFamily: "var(--font-mono)" }}>${cpm(mainS, mainV)}</span></div>
          <div>Median Views: <span style={{ color: "var(--c-median)", fontFamily: "var(--font-mono)" }}>{fmt(med)}</span></div>
          <div>Influencers: <span style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{influencers}</span></div>
          <div>QRT Impressions: <span style={{ color: "var(--c-qrt)", fontFamily: "var(--font-mono)" }}>{fmt(qrtV)}</span></div>
        </>}
        {launchOnly && <div style={{ marginTop: 4, color: "var(--text-muted)", fontStyle: "italic" }}>Launch post only</div>}
      </div>
    </div>
  );
}
