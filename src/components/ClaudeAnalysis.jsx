import { useState } from "react";

function ClaudeMark({ size = 22 }) {
  return (
    <img
      src="/claude.png"
      alt=""
      aria-hidden="true"
      className="claude-mark"
      width={size}
      height={size}
      style={{ display: "inline-block", objectFit: "contain" }}
    />
  );
}

const ACCENT = "#cc785c";

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.65, color: "var(--text-secondary)" }}>{children}</div>
    </div>
  );
}

function K({ children }) {
  return <span style={{ color: "var(--text-primary)", fontWeight: 600, fontFamily: "var(--font-mono)" }}>{children}</span>;
}

export default function ClaudeAnalysis() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      background: "var(--surface-elev)",
      border: "1px solid var(--hl-3)",
      borderRadius: 16,
      boxShadow: "var(--shadow-card)",
      overflow: "hidden",
    }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          display: "flex", alignItems: "center", gap: 12,
          padding: "16px 22px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "var(--font-body)",
          color: "var(--text-primary)",
        }}
      >
        <ClaudeMark size={20} />
        <div style={{ flex: 1 }}>
          <div className="claude-shimmer-text" style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: -0.2 }}>
            Live Claude Analysis
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
            {open ? "Tap to collapse" : "Tap to expand — full breakdown of program performance"}
          </div>
        </div>
        <span style={{
          fontSize: 11, color: "var(--text-muted)",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.25s ease",
          fontFamily: "var(--font-mono)",
        }}>▶</span>
      </button>

      {open && (
        <div className="fade-in" style={{ padding: "4px 22px 22px", borderTop: "1px solid var(--hl-2)" }}>
          <Section title="Overall Read">
            Across three months, the program delivered <K>173.4M impressions</K> for <K>$1.48M</K> spend — a blended CPM of <K>$8.52</K>.
            That's roughly <K>1.8×</K> more efficient than the $15–$25 mid-range typical for influencer marketing across this platform mix.
            Solid by any reasonable yardstick, with clear platform-specific stories rather than a single uniform performance.
          </Section>

          <Section title="Where the program is genuinely strong">
            <ul style={{ paddingLeft: 18, marginTop: 4 }}>
              <li>
                <strong>X is the standout.</strong> Blended CPM of <K>$1.33</K> against a <K>$6–$12</K> industry range.
                <div style={{ marginTop: 4, color: "var(--text-muted)", fontSize: 12 }}>
                  Worth noting: a meaningful portion of X impressions come from paid launch posts on @openart_ai and the $30 paid RT/QRT packages, which boost view counts at very low marginal cost and skew the blended CPM downward.
                  Even stripping those out and looking only at influencer threads, the CPM stays comfortably below the $6–$12 range — the launch boost amplifies an already strong baseline rather than masking a weak one.
                </div>
              </li>
              <li><strong>Creator portfolio quality.</strong> Lenny Motion (10.8M views), Werner (2.8M), Karen X Cheng cross-platform, Rourke Heath, Keanu Visuals — recognizable names whose audiences carry brand-safety and aesthetic credibility that pure CPM understates.</li>
              <li><strong>Operational throughput.</strong> 130+ creator partnerships across three months shows the program can scale execution, not just spend.</li>
            </ul>
          </Section>

          <Section title="Where it's working as expected (not weak, not a story)">
            <ul style={{ paddingLeft: 18, marginTop: 4 }}>
              <li><strong>Instagram averages <K>$32 CPM</K></strong> — squarely on-market for the premium-mid-tier creator mix. The Heek and HSG tiers (EzExplains, Rachit Singh, Kavangun) are doing meaningful efficiency lifting and bend the blended down. Without them, IG would land in premium-only territory.</li>
              <li><strong>YouTube is small and expensive</strong> (<K>$66 CPM</K> on $33K spend). Normal for the platform at this scale — treat it as a probe, not a channel.</li>
            </ul>
          </Section>

          <Section title="Room for improvement">
            <ul style={{ paddingLeft: 18, marginTop: 4 }}>
              <li><strong>Two HSG carousel deals</strong> (<K>$4.3K</K>) have zero trackable views by design. Small money, but a measurement gap worth either closing or stopping.</li>
              <li><strong>IG efficiency leans heavily on the mid-tier.</strong> If Heek/HSG creators churn or get more expensive, the IG blended CPM moves the wrong way. Worth diversifying the sub-$10-CPM bench.</li>
            </ul>
          </Section>

          <Section title="Bottom line">
            Well-executed program with category-leading efficiency on X, market-rate execution on IG with real brand-association value from premium creators, and a small experimental YT footprint. The X advantage holds up even after accounting for the launch-post amplification, and the IG mid-tier is doing real work to keep the blended CPM healthy.
          </Section>

          <div style={{
            marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--hl-2)",
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 10, color: "var(--text-muted)", letterSpacing: 0.4, textTransform: "uppercase", fontWeight: 600,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: ACCENT, animation: "claude-pulse 1.6s ease-in-out infinite" }} />
            Generated by Claude · Data through April 2026
          </div>
        </div>
      )}
    </div>
  );
}
