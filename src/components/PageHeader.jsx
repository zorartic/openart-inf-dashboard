export default function PageHeader({ eyebrow, title, platform, owner, month }) {
  return (
    <div style={{ marginTop: 24, marginBottom: 28 }}>
      <div className="fade-up s1" style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 600, marginBottom: 10 }}>
        {eyebrow || "Influencer Marketing Analytics"}
      </div>
      <h1 className="fade-up s2" style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.8, fontFamily: "var(--font-display)", color: "var(--gold-light)", marginBottom: 8, lineHeight: 1.2 }}>
        {title}
      </h1>
      <div className="fade-up s3" style={{ display: "flex", gap: 20, fontSize: 13, color: "var(--text-secondary)" }}>
        {platform && <span>Platform: <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>{platform}</strong></span>}
        {owner && <span>Owner: <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>{owner}</strong></span>}
        {month && <span style={{ color: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-mono)", background: "rgba(255,255,255,0.04)", padding: "3px 10px", borderRadius: 6 }}>{month}</span>}
      </div>
    </div>
  );
}
