export default function PageNav({ onBack, onHome, canBack = true }) {
  return (
    <div className="fade-up" style={{ display: "flex", gap: 8, marginBottom: 24 }}>
      {canBack && onBack && (
        <button className="back-btn" onClick={onBack}>← Back</button>
      )}
      {onHome && (
        <button className="back-btn" onClick={onHome} aria-label="Home" title="Home">
          <span style={{ fontSize: 14, lineHeight: 1 }}>⌂</span>
          <span>Home</span>
        </button>
      )}
    </div>
  );
}
