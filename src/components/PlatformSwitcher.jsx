import { PLATFORM_COLORS } from "../data/platformUtils";

const PLATFORMS = [
  { id: "x",  label: "X (Twitter)" },
  { id: "ig", label: "Instagram" },
  { id: "yt", label: "YouTube" },
];

export default function PlatformSwitcher({ current, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" }}>
      {PLATFORMS.map(p => {
        const colors = PLATFORM_COLORS[p.id];
        const isActive = current === p.id;
        const base = {
          borderRadius: 8,
          fontFamily: "var(--font-body)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 0.5,
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxSizing: "border-box",
        };
        const activeStyle = {
          ...base,
          padding: "10px 21px",
          background: colors.gradient,
          backgroundClip: "padding-box",
          WebkitBackgroundClip: "padding-box",
          border: "none",
          color: "#fff",
        };
        const inactiveStyle = {
          ...base,
          padding: "9px 20px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "var(--text-muted)",
        };
        return (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            style={isActive ? activeStyle : inactiveStyle}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }
            }}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
