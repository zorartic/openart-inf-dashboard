import Particles from "../components/Particles";

export default function Landing({ onNavigate }) {
  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div className="aura-bg" />
      <Particles />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "40px 24px", maxWidth: 780 }}>
        {/* Logo */}
        <div className="fade-up" style={{ marginBottom: 24 }}>
          <img src="/logo.png" alt="OpenArt" style={{ height: 48, objectFit: "contain" }}
            onError={(e) => { e.target.style.display = "none"; }} />
        </div>

        {/* Eyebrow */}
        <div className="fade-up s1" style={{
          fontSize: 11, letterSpacing: 3.5, textTransform: "uppercase",
          color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 600, marginBottom: 18,
        }}>
          Influencer Marketing
        </div>

        {/* Title - light gold, no gradient */}
        <h1 className="fade-up s2" style={{
          fontSize: "clamp(34px, 5vw, 52px)", fontWeight: 700,
          fontFamily: "var(--font-display)", lineHeight: 1.1, marginBottom: 14,
          color: "var(--gold-light)",
        }}>
          OpenArt Dashboard
        </h1>

        {/* Subtitle */}
        <p className="fade-up s3" style={{
          fontSize: 15, color: "var(--text-secondary)",
          fontFamily: "var(--font-body)", marginBottom: 64, fontWeight: 400,
        }}>
          Campaign analytics & performance tracking for X (Twitter)
        </p>

        {/* Glass Cards */}
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>

          <div className="glass-card fade-up s4" onClick={() => onNavigate("campaign")}
            style={{ width: 310, padding: "44px 32px", textAlign: "center" }}>
            <div className="shine" />
            <div style={{ marginBottom: 18, lineHeight: 1 }}>
              <img src="/campaign.png" alt="" style={{ height: 36, objectFit: "contain" }} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 8 }}>By Campaign</h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>
              Individual campaign breakdowns, influencer CPM rankings, and performance data
            </p>
          </div>

          <div className="glass-card fade-up s5" onClick={() => onNavigate("timeline")}
            style={{ width: 310, padding: "44px 32px", textAlign: "center" }}>
            <div className="shine" />
            <div style={{ marginBottom: 18, lineHeight: 1 }}>
              <img src="/calendar.png" alt="" style={{ height: 36, objectFit: "contain" }} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 8 }}>By Timeline</h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>
              Monthly view of all campaigns, cumulative spend, and trend analysis over time
            </p>
          </div>
        </div>

      </div>
      <p style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.13)", fontFamily: "var(--font-body)", zIndex: 1, margin: 0 }}>
        built by Zozo for OpenArt AI · 2026
      </p>
    </div>
  );
}
