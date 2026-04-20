import { useEffect, useRef, useState } from "react";
import Particles from "../components/Particles";
import PageNav from "../components/PageNav";
import { SD2_IG, OAW_IG, CB_IG } from "../data/campaigns_ig";
import { SD2_YT, OAW_YT } from "../data/campaigns_yt";
import {
  OAW_MAIN, OAW_LAUNCH, OAW_QRT_PAID_VIEWS,
  SD2_MAIN, SD2_LAUNCH, SD2_QRT_PAID_VIEWS,
  CB_MAIN, CB_LAUNCH,
  NB_MAIN, NB_LAUNCH_FULL, NB_QRT_FREE,
  OA_MAIN, OA_LAUNCH, OA_QRT_PAID, OA_QRT_FREE,
  VL_MAIN, VL_LAUNCH, VL_QRT_PAID,
  BH_LAUNCH, EC_LAUNCH, KL3_LAUNCH, KL3C_LAUNCH, SO2_LAUNCH, OS_LAUNCH,
  SD_LAUNCH, SR_LAUNCH,
  AIPA_LAUNCH_MAR, AIPA_LAUNCH_APR,
  RF4_LAUNCH,
  WAN27_LAUNCH, IPS_LAUNCH, LTX_LAUNCH, LYRIA3_LAUNCH,
} from "../data/campaigns";
import { fmtShort } from "../data/utils";

function animFmt(value, target) {
  if (target >= 1_000_000) return Math.round(value / 1_000_000) + "M";
  if (target >= 1_000) return Math.round(value / 1_000) + "K";
  return Math.round(value).toString();
}

const X_TOTAL = [
  ...OA_MAIN, ...OA_LAUNCH, ...OA_QRT_PAID, ...OA_QRT_FREE,
  ...NB_MAIN, ...NB_LAUNCH_FULL, ...NB_QRT_FREE,
  ...VL_MAIN, ...VL_LAUNCH, ...VL_QRT_PAID,
  ...BH_LAUNCH, ...EC_LAUNCH, ...KL3_LAUNCH, ...KL3C_LAUNCH, ...SO2_LAUNCH, ...OS_LAUNCH,
  ...SD_LAUNCH, ...SR_LAUNCH,
  ...OAW_MAIN, ...OAW_LAUNCH, { views: OAW_QRT_PAID_VIEWS },
  ...CB_MAIN, ...CB_LAUNCH,
  ...AIPA_LAUNCH_MAR, ...AIPA_LAUNCH_APR,
  ...SD2_MAIN, ...SD2_LAUNCH, { views: SD2_QRT_PAID_VIEWS },
  ...RF4_LAUNCH,
  ...WAN27_LAUNCH, ...IPS_LAUNCH, ...LTX_LAUNCH, ...LYRIA3_LAUNCH,
].reduce((s, i) => s + (i.views || 0), 0);

const IG_TOTAL = [...SD2_IG, ...OAW_IG, ...CB_IG].reduce((s, i) => s + (i.views || 0), 0);
const YT_TOTAL = [...SD2_YT, ...OAW_YT].reduce((s, i) => s + (i.views || 0), 0);

function useCounter(target, started) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(null);
  const stateRef = useRef("counting");

  useEffect(() => {
    if (!started) return;
    const intermediate = target - 4;
    const duration = 2000;
    const start = performance.now();

    stateRef.current = "counting";
    setVal(0);

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      if (stateRef.current === "counting") {
        setVal(Math.floor(eased * intermediate));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setVal(intermediate);
          stateRef.current = "paused";
          setTimeout(() => {
            stateRef.current = "done";
            setVal(target);
          }, 2000);
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, started]);

  return val;
}

function PlatformCard({ name, gradient, labelColor, total, delay, started, onClick }) {
  const count = useCounter(total, started);

  return (
    <div
      className="fade-up"
      style={{ animationDelay: `${delay}s`, width: 280, cursor: "pointer" }}
      onClick={onClick}
    >
      <div style={{ background: `linear-gradient(135deg, ${gradient})`, padding: 1, borderRadius: 20, transition: "opacity 0.2s ease" }}
        onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
      >
        <div style={{
          background: "linear-gradient(160deg, rgba(18,14,8,0.97) 0%, rgba(12,10,6,0.98) 100%)",
          borderRadius: 19,
          padding: "36px 28px",
          textAlign: "center",
          backdropFilter: "blur(24px)",
        }}>
          <div style={{
            fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase",
            color: labelColor,
            fontFamily: "var(--font-body)", fontWeight: 700, marginBottom: 14,
            opacity: 0.9,
          }}>
            {name}
          </div>
          <div style={{
            fontSize: 34, fontWeight: 700, fontFamily: "var(--font-display)",
            color: "var(--text-primary)", lineHeight: 1, marginBottom: 6,
            fontVariantNumeric: "tabular-nums",
            position: "relative", display: "inline-block",
          }}>
            <span style={{ visibility: "hidden" }} aria-hidden>{animFmt(total, total)}</span>
            <span style={{ position: "absolute", left: 0, right: 0, top: 0, textAlign: "center" }}>
              {animFmt(count, total)}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 12 }}>
            total impressions
          </div>
          <div style={{
            fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase",
            color: labelColor, fontFamily: "var(--font-body)", fontWeight: 600, opacity: 0.6,
          }}>
            View breakdown →
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Platform({ onBack, onHome, canBack, onNavigate }) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh", padding: "40px 28px" }}>
      <div className="aura-bg" />
      <Particles />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto" }}>
        <PageNav onBack={onBack} onHome={onHome} canBack={canBack} />

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <div className="fade-up" style={{ marginBottom: 20 }}>
            <img src="/logo.png" alt="OpenArt" style={{ height: 40, objectFit: "contain" }}
              onError={(e) => { e.target.style.display = "none"; }} />
          </div>

          <div className="fade-up s1" style={{
            fontSize: 10, letterSpacing: 3.5, textTransform: "uppercase",
            color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 600, marginBottom: 12,
          }}>
            Influencer Marketing
          </div>

          <h1 className="fade-up s2" style={{
            fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700,
            fontFamily: "var(--font-display)", lineHeight: 1.1, marginBottom: 14,
            color: "var(--gold-light)",
          }}>
            By Platform
          </h1>

          <p className="fade-up s3" style={{
            fontSize: 14, color: "var(--text-secondary)",
            fontFamily: "var(--font-body)", marginBottom: 56, fontWeight: 400,
          }}>
            Cumulative impressions across all campaigns per platform
          </p>

          <div className="fade-up s4" style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            <PlatformCard
              name="X (Twitter)"
              gradient="#1DA1F2, #0a4a8f"
              labelColor="#1DA1F2"
              total={X_TOTAL}
              delay={0.5}
              started={started}
              onClick={() => onNavigate && onNavigate("platform-detail", "x")}
            />
            <PlatformCard
              name="Instagram"
              gradient="#833AB4, #E1306C, #F77737"
              labelColor="#E1306C"
              total={IG_TOTAL}
              delay={0.65}
              started={started}
              onClick={() => onNavigate && onNavigate("platform-detail", "ig")}
            />
            <PlatformCard
              name="YouTube"
              gradient="#FF0000, #8B0000"
              labelColor="#FF0000"
              total={YT_TOTAL}
              delay={0.8}
              started={started}
              onClick={() => onNavigate && onNavigate("platform-detail", "yt")}
            />
          </div>
        </div>
      </div>

      <p style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.13)", fontFamily: "var(--font-body)", zIndex: 1, margin: 0 }}>
        built by Zozo for OpenArt AI · 2026
      </p>
    </div>
  );
}
