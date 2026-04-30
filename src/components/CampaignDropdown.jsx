import { useEffect, useRef, useState } from "react";

export default function CampaignDropdown({ campaigns, value, onChange, getLabel, accentColor }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const accent = accentColor || "rgba(201,168,76,0.5)";

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open]);

  const pickOption = (id) => {
    onChange(id);
    setQuery("");
    setOpen(false);
  };

  const selectedLabel = value === "all" ? "All Campaigns" : getLabel(value);

  const q = query.trim().toLowerCase();
  const options = [{ id: "all", label: "All Campaigns" }]
    .concat(campaigns.map(id => ({ id, label: getLabel(id) })))
    .filter(o => !q || o.label.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));

  return (
    <div ref={wrapRef} style={{ position: "relative", minWidth: 240, pointerEvents: "auto" }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%",
          background: "var(--surface-input)",
          border: `1px solid ${open ? accent : "var(--hl-3)"}`,
          boxShadow: open ? `0 0 0 2px ${accent.replace(/[\d.]+\)$/, "0.12)")}` : "none",
          borderRadius: 10,
          color: "var(--text-primary)",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          fontWeight: 500,
          padding: "10px 38px 10px 16px",
          cursor: "pointer",
          textAlign: "left",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
          position: "relative",
          outline: "none",
        }}
      >
        {selectedLabel}
        <span style={{
          position: "absolute", right: 14, top: "50%",
          transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
          transition: "transform 0.18s ease",
          width: 0, height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "6px solid var(--text-muted)",
          pointerEvents: "none",
        }} />
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0, right: 0,
            zIndex: 9999,
            background: "var(--surface-popover)",
            border: "1px solid var(--hl-3)",
            borderRadius: 10,
            boxShadow: "var(--shadow-elevated)",
            overflow: "hidden",
            fontFamily: "var(--font-body)",
            pointerEvents: "auto",
          }}
        >
          <div style={{ padding: 8, borderBottom: "1px solid var(--hl-2)" }}>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search campaigns…"
              style={{
                width: "100%",
                background: "var(--hl-1)",
                border: "1px solid var(--hl-2)",
                borderRadius: 8,
                color: "var(--text-primary)",
                fontFamily: "var(--font-body)",
                fontSize: 12.5,
                padding: "8px 12px",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={e => { e.target.style.borderColor = accent; }}
              onBlur={e => { e.target.style.borderColor = "var(--hl-2)"; }}
            />
          </div>
          <div style={{ maxHeight: 280, overflowY: "auto", padding: 4 }}>
            {options.length === 0 && (
              <div style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-muted)" }}>No matches.</div>
            )}
            {options.map(o => {
              const isSelected = o.id === value;
              return (
                <button
                  key={o.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pickOption(o.id);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 12px",
                    border: "none",
                    borderRadius: 6,
                    background: isSelected ? "var(--hl-3)" : "transparent",
                    color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: isSelected ? 600 : 400,
                    cursor: "pointer",
                    transition: "background 0.12s ease, color 0.12s ease",
                  }}
                  onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = "var(--hl-2)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
                  onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
