import Particles from "../components/Particles";
import PageNav from "../components/PageNav";
import { getCampaignIds, getPlatformStats } from "../data/platformUtils";
import { MONTHS, MONTH_ORDER } from "../data/campaigns";
import { fmt, fmtD } from "../data/utils";

function getMonthStats(monthId) {
  const month = MONTHS[monthId];
  if (!month || month.campaigns.length === 0) return null;

  let totalViews = 0, totalSpend = 0;
  for (const platform of ["x", "ig", "yt"]) {
    getCampaignIds(platform, monthId).forEach(id => {
      const s = getPlatformStats(platform, id, monthId);
      totalViews += s.views;
      totalSpend += s.spend;
    });
  }
  return { totalViews, totalSpend, count: month.campaigns.length };
}

export default function Timeline({ onNavigate, onBack, onHome, canBack }) {
  return (
    <div style={{ position: "relative", minHeight: "100vh", padding: "40px 28px" }}>
      <div className="aura-bg" />
      <Particles />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto" }}>
        <PageNav onBack={onBack} onHome={onHome} canBack={canBack} />
        <div style={{ marginTop: 4, marginBottom: 48 }}>
          <div className="fade-up s1" style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 600, marginBottom: 10 }}>By Timeline</div>
          <h1 className="fade-up s2" style={{ fontSize: 34, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--gold-light)", letterSpacing: -0.8, marginBottom: 8 }}>Monthly Performance</h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {MONTH_ORDER.map((monthId, idx) => {
            const month = MONTHS[monthId];
            const stats = getMonthStats(monthId);
            const active = stats !== null;

            return (
              <div key={monthId}
                className={`month-card fade-up s${idx + 3} ${!active ? "empty" : ""}`}
                onClick={() => active && onNavigate("month-cross", monthId)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--font-display)", color: active ? "var(--text-primary)" : "var(--text-muted)", marginBottom: 4 }}>{month.label}</h2>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{active ? `${stats.count} campaign${stats.count !== 1 ? "s" : ""}` : "No data yet"}</p>
                  </div>
                  {active && <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1 }}>VIEW →</span>}
                </div>
                {active && (
                  <div style={{ display: "flex", gap: 40, marginTop: 22 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Impressions</div>
                      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--c-views)" }}>{fmt(stats.totalViews)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Total Spend</div>
                      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--c-spend)" }}>{fmtD(stats.totalSpend)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Campaigns</div>
                      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--c-cpm)" }}>{stats.count}</div>
                    </div>
                  </div>
                )}
                {!active && <div style={{ marginTop: 20, fontSize: 13, color: "var(--text-muted)", fontStyle: "italic" }}>Coming soon</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
