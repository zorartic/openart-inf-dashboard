import { useState, useEffect, useRef } from "react";
import Particles from "./Particles";

// SHA-256 of "OP3N4RT_" — password never stored in plaintext
const EXPECTED_HASH = "da8ccce4e8bb9128b388630ad680ddafe400b64ce85e73b75d3c51bffdb3be8a";
const STORAGE_KEY = "oa_auth_v1";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function getStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const { hash, expiry } = JSON.parse(raw);
    if (typeof hash !== "string" || typeof expiry !== "number") { localStorage.removeItem(STORAGE_KEY); return false; }
    if (Date.now() > expiry) { localStorage.removeItem(STORAGE_KEY); return false; }
    if (hash !== EXPECTED_HASH) { localStorage.removeItem(STORAGE_KEY); return false; }
    return true;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return false;
  }
}

export default function AuthGate({ children }) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (getStoredAuth()) setAuthed(true);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && !authed) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [ready, authed]);

  const submit = async () => {
    if (!pw || loading) return;
    setLoading(true);
    setError(false);
    const hash = await sha256(pw);
    if (hash === EXPECTED_HASH) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ hash, expiry: Date.now() + ONE_WEEK_MS }));
      setAuthed(true);
    } else {
      setError(true);
      setShake(true);
      setPw("");
      setTimeout(() => setShake(false), 600);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    setLoading(false);
  };

  const onKey = (e) => {
    if (e.key === "Enter") submit();
  };

  // Don't render anything until we've checked localStorage
  if (!ready) return null;

  // Authenticated — render the actual app
  if (authed) return children;

  // Gate screen — app data never mounts
  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div className="aura-bg" />
      <Particles />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "40px 24px", width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div className="fade-up" style={{ marginBottom: 20 }}>
          <img
            src="/logo.png"
            alt="OpenArt"
            style={{ height: 44, objectFit: "contain" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>

        {/* Eyebrow */}
        <div className="fade-up s1" style={{
          fontSize: 10, letterSpacing: 3.5, textTransform: "uppercase",
          color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 600, marginBottom: 12,
        }}>
          Influencer Marketing
        </div>

        {/* Title */}
        <h1 className="fade-up s2" style={{
          fontSize: 28, fontWeight: 700, fontFamily: "var(--font-display)",
          lineHeight: 1.1, marginBottom: 36, color: "var(--gold-light)",
        }}>
          OpenArt Dashboard
        </h1>

        {/* Auth card */}
        <div
          className="fade-up s3"
          style={{
            background: "linear-gradient(160deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 100%)",
            border: `1px solid ${error ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 16,
            padding: "28px 28px 24px",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            transition: "border-color 0.3s ease",
            animation: shake ? "authShake 0.5s cubic-bezier(.36,.07,.19,.97)" : undefined,
          }}
        >
          <div style={{
            fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase",
            letterSpacing: 1.5, fontWeight: 600, marginBottom: 16, fontFamily: "var(--font-body)",
          }}>
            Access required
          </div>

          <div style={{ position: "relative", marginBottom: 14 }}>
            <input
              ref={inputRef}
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(false); }}
              onKeyDown={onKey}
              placeholder="Enter password"
              autoComplete="current-password"
              style={{
                width: "100%",
                background: "rgba(0,0,0,0.3)",
                border: `1px solid ${error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.09)"}`,
                borderRadius: 10,
                padding: "13px 16px",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                letterSpacing: 2,
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                boxShadow: error ? "0 0 0 3px rgba(248,113,113,0.08)" : "none",
              }}
              onFocus={(e) => {
                if (!error) e.target.style.borderColor = "rgba(201,168,76,0.4)";
                e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.06)";
              }}
              onBlur={(e) => {
                if (!error) e.target.style.borderColor = "rgba(255,255,255,0.09)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Error message */}
          <div style={{
            fontSize: 11, color: "rgba(248,113,113,0.85)", fontFamily: "var(--font-body)",
            marginBottom: 14, minHeight: 16,
            opacity: error ? 1 : 0, transition: "opacity 0.2s ease",
          }}>
            Incorrect password. Try again.
          </div>

          <button
            onClick={submit}
            disabled={!pw || loading}
            style={{
              width: "100%",
              padding: "13px 0",
              background: pw && !loading
                ? "linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.1) 100%)"
                : "rgba(255,255,255,0.03)",
              border: `1px solid ${pw && !loading ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 10,
              color: pw && !loading ? "var(--gold-light)" : "var(--text-muted)",
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 1,
              cursor: pw && !loading ? "pointer" : "default",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              if (pw && !loading) {
                e.target.style.background = "linear-gradient(135deg, rgba(201,168,76,0.28) 0%, rgba(201,168,76,0.14) 100%)";
                e.target.style.borderColor = "rgba(201,168,76,0.45)";
              }
            }}
            onMouseLeave={(e) => {
              if (pw && !loading) {
                e.target.style.background = "linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.1) 100%)";
                e.target.style.borderColor = "rgba(201,168,76,0.3)";
              }
            }}
          >
            {loading ? "Verifying…" : "Enter"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes authShake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-7px); }
          30% { transform: translateX(7px); }
          45% { transform: translateX(-5px); }
          60% { transform: translateX(5px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
}
