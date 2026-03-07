export default function StatCard({ label, value, sub, accent = "var(--c-views)" }) {
  return (
    <div className="data-card">
      <div style={{ fontSize: 11, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8, fontFamily: "var(--font-body)" }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: accent, fontFamily: "var(--font-mono)" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 5, fontFamily: "var(--font-body)", lineHeight: 1.4 }}>{sub}</div>}
    </div>
  );
}
