import Particles from "../components/Particles";
import {
  OA_MAIN, OA_LAUNCH, OA_QRT_PAID, OA_QRT_PAID_COST, OA_QRT_FREE,
  NB_MAIN, NB_LAUNCH, NB_LAUNCH_MAR, NB_QRT_FREE, NB_PENDING,
  SD_LAUNCH, SR_LAUNCH, OS_LAUNCH, BH_LAUNCH, EC_LAUNCH,
  VL_MAIN, VL_LAUNCH, VL_QRT_PAID, VL_QRT_PAID_COST,
  KL3_LAUNCH, KL3C_LAUNCH, SO2_LAUNCH,
  MONTHS, MONTH_ORDER,
} from "../data/campaigns";
import { fmt, fmtD, sumV, sumP } from "../data/utils";

function getMonthStats(monthId) {
  const month = MONTHS[monthId];
  if (!month || month.campaigns.length === 0) return null;

  let totalViews = 0, totalSpend = 0;
  for (const id of month.campaigns) {
    if (id === "oa") {
      totalViews += sumV(OA_LAUNCH) + sumV(OA_MAIN) + sumV(OA_QRT_PAID) + sumV(OA_QRT_FREE);
      totalSpend += sumP(OA_LAUNCH) + sumP(OA_MAIN) + OA_QRT_PAID_COST;
    } else if (id === "nb") {
      totalViews += sumV(NB_LAUNCH) + sumV(NB_MAIN) + sumV(NB_QRT_FREE);
      totalSpend += sumP(NB_LAUNCH) + sumP(NB_MAIN) + sumP(NB_PENDING);
    } else if (id === "sd") {
      totalViews += sumV(SD_LAUNCH); totalSpend += sumP(SD_LAUNCH);
    } else if (id === "sr") {
      totalViews += sumV(SR_LAUNCH); totalSpend += sumP(SR_LAUNCH);
    } else if (id === "nbm") {
      totalViews += sumV(NB_LAUNCH_MAR); totalSpend += sumP(NB_LAUNCH_MAR);
    } else if (id === "os") {
      totalViews += sumV(OS_LAUNCH); totalSpend += sumP(OS_LAUNCH);
    } else if (id === "bh") {
      totalViews += sumV(BH_LAUNCH); totalSpend += sumP(BH_LAUNCH);
    } else if (id === "ec") {
      totalViews += sumV(EC_LAUNCH); totalSpend += sumP(EC_LAUNCH);
    } else if (id === "vl") {
      totalViews += sumV(VL_LAUNCH) + sumV(VL_MAIN) + sumV(VL_QRT_PAID);
      totalSpend += sumP(VL_LAUNCH) + sumP(VL_MAIN) + VL_QRT_PAID_COST;
    } else if (id === "kl3") {
      totalViews += sumV(KL3_LAUNCH); totalSpend += sumP(KL3_LAUNCH);
    } else if (id === "kl3c") {
      totalViews += sumV(KL3C_LAUNCH); totalSpend += sumP(KL3C_LAUNCH);
    } else if (id === "so2") {
      totalViews += sumV(SO2_LAUNCH); totalSpend += sumP(SO2_LAUNCH);
    }
  }
  return { totalViews, totalSpend, count: month.campaigns.length };
}

export default function Timeline({ onNavigate, onBack }) {
  return (
    <div style={{ position: "relative", minHeight: "100vh", padding: "40px 28px" }}>
      <div className="aura-bg" />
      <Particles />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto" }}>
        <button className="back-btn fade-up" onClick={onBack}>← Back</button>
        <div style={{ marginTop: 28, marginBottom: 48 }}>
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
                onClick={() => active && onNavigate("campaign-month", monthId)}>
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
