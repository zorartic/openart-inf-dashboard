// Gentle haze matching the golden .aura-bg: same alpha values (0.05–0.10),
// same radial layout, just tinted per platform with two colors creating a gradient.
const PALETTE = {
  x: {
    top:        "rgba(29, 161, 242, 0.10)",
    left:       "rgba(10, 74, 143, 0.06)",
    right:      "rgba(60, 180, 255, 0.05)",
    bottomLeft: "rgba(29, 161, 242, 0.06)",
  },
  ig: {
    top:        "rgba(225, 48, 108, 0.10)",
    left:       "rgba(131, 58, 180, 0.06)",
    right:      "rgba(247, 119, 55, 0.05)",
    bottomLeft: "rgba(225, 48, 108, 0.06)",
  },
  yt: {
    top:        "rgba(255, 40, 40, 0.10)",
    left:       "rgba(139, 0, 0, 0.06)",
    right:      "rgba(255, 80, 80, 0.05)",
    bottomLeft: "rgba(255, 40, 40, 0.06)",
  },
};

export default function PlatformAura({ platform }) {
  const p = PALETTE[platform];
  if (!p) return null;

  const background = [
    `radial-gradient(ellipse 80% 50% at 50% 0%, ${p.top} 0%, transparent 60%)`,
    `radial-gradient(ellipse 60% 40% at 20% 20%, ${p.left} 0%, transparent 50%)`,
    `radial-gradient(ellipse 60% 40% at 80% 30%, ${p.right} 0%, transparent 50%)`,
    `radial-gradient(ellipse 60% 40% at 18% 82%, ${p.bottomLeft} 0%, transparent 55%)`,
    `radial-gradient(ellipse 50% 50% at 50% 100%, var(--aura-platform-floor) 0%, transparent 60%)`,
  ].join(", ");

  return <div key={platform} className="platform-aura-bg" style={{ background }} />;
}
