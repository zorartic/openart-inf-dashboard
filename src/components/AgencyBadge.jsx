const AGENCY_STYLE = {
  Rakugo: { bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.4)", color: "#60a5fa" },
  Aevy:   { bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.35)",  color: "#4ade80" },
  Heek:   { bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.35)", color: "#fb923c" },
  Direct: { bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.25)",color: "#94a3b8" },
};

export const AGENCY_COLORS = {
  Rakugo: "#60a5fa", Aevy: "#4ade80", Heek: "#fb923c", Direct: "#94a3b8",
};

export default function AgencyBadge({ agency }) {
  const s = AGENCY_STYLE[agency] || AGENCY_STYLE.Direct;
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase",
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      borderRadius: 4, padding: "2px 5px", fontFamily: "var(--font-body)",
      display: "inline-block", lineHeight: 1.4,
    }}>
      {agency || "Direct"}
    </span>
  );
}
