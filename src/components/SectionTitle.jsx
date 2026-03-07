export default function SectionTitle({ children, icon }) {
  return (
    <div className="section-title">
      <span style={{ fontSize: 18 }}>{icon}</span>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)", letterSpacing: -0.2 }}>{children}</h2>
    </div>
  );
}
