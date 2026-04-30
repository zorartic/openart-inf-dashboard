import { useEffect, useState } from "react";

function readTheme() {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") || "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  const toggle = () => setTheme(t => (t === "dark" ? "light" : "dark"));
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "fixed",
        top: 20,
        right: 24,
        zIndex: 1000,
        width: 36,
        height: 36,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--hl-1)",
        border: "1px solid var(--hl-3)",
        borderRadius: 10,
        cursor: "pointer",
        color: "var(--text-secondary)",
        transition: "background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease",
        padding: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "var(--hl-2)";
        e.currentTarget.style.borderColor = "var(--border-gold)";
        e.currentTarget.style.color = "var(--gold-light)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "var(--hl-1)";
        e.currentTarget.style.borderColor = "var(--hl-3)";
        e.currentTarget.style.color = "var(--text-secondary)";
      }}
    >
      {isDark ? (
        // Moon (currently dark → click for light)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        // Sun (currently light → click for dark)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )}
    </button>
  );
}
