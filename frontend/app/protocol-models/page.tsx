"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

/**
 * Multi-Protocol Risk Models — Credence AI
 *
 * Uses the marketplace/passport visual language: deep dark background,
 * cyan accent, score gauges, card-based layout. Each protocol model
 * gets its own card with a visual LTV bar and interest badge, so
 * the comparison is spatial instead of tabular.
 */

type ProtocolModel = {
  max_ltv: number;
  interest: number;
};

type ModelsResponse = {
  wallet: string;
  credit_score: number;
  models: Record<string, ProtocolModel>;
};

const T = {
  bg: "#040C1A",
  surface: "#080F1E",
  card: "#0A1425",
  border: "#111C2E",
  borderHover: "#00E5FF33",
  cyan: "#00E5FF",
  gold: "#FFB830",
  red: "#FF4D6A",
  green: "#34D399",
  purple: "#A78BFA",
  muted: "#4A6080",
  text: "#E2E8F0",
  sub: "#94A3B8",
};

const PROTOCOL_META: Record<string, { color: string; icon: string; label: string }> = {
  aave: { color: "#B6509E", icon: "⬡", label: "Aave-style" },
  compound: { color: "#00D395", icon: "◈", label: "Compound-style" },
  institutional: { color: "#60A5FA", icon: "◉", label: "Institutional" },
  conservative: { color: "#FFB830", icon: "◇", label: "Conservative" },
};

function ScoreGauge({ score }: { score: number }) {
  const pct = Math.min(Math.max(score / 1000, 0), 1);
  const r = 28;
  const circ = Math.PI * r;
  const dash = pct * circ;
  const color =
    score >= 750 ? T.cyan : score >= 550 ? T.gold : T.red;
  const label =
    score >= 750 ? "Excellent" : score >= 550 ? "Fair" : "Poor";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <svg width="72" height="44" viewBox="0 0 72 44">
        <path
          d="M 8 40 A 28 28 0 0 1 64 40"
          fill="none" stroke="#1A2740" strokeWidth="6" strokeLinecap="round"
        />
        <path
          d="M 8 40 A 28 28 0 0 1 64 40"
          fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
        <text
          x="36" y="36" textAnchor="middle"
          fontSize="11" fontWeight="700" fill={color}
          fontFamily="JetBrains Mono, monospace"
        >
          {score ?? "—"}
        </text>
      </svg>
      <span style={{ color, fontSize: 10, fontWeight: 600, letterSpacing: 1 }}>
        {label.toUpperCase()}
      </span>
    </div>
  );
}

function LtvBar({ ltv, color }: { ltv: number; color: string }) {
  return (
    <div style={{
      position: "relative",
      height: 8,
      background: "#1A2740",
      borderRadius: 4,
      overflow: "hidden",
      marginTop: 8,
    }}>
      <div
        style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: `${ltv}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 4,
          transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: `0 0 12px ${color}44`,
        }}
      />
    </div>
  );
}

function ProtocolCard({
  name,
  model,
  idx,
}: {
  name: string;
  model: ProtocolModel;
  idx: number;
}) {
  const [hovered, setHovered] = useState(false);
  const meta = PROTOCOL_META[name] ?? { color: T.sub, icon: "●", label: name };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#111C2E" : T.card,
        border: `1px solid ${hovered ? `${meta.color}44` : T.border}`,
        borderRadius: 14,
        padding: "24px 28px",
        transition: "all 0.22s ease",
        boxShadow: hovered
          ? `0 0 0 1px ${meta.color}22, 0 8px 32px ${meta.color}0D`
          : "none",
        animation: `fadeSlideIn 0.4s ease both`,
        animationDelay: `${idx * 80}ms`,
      }}
    >
      {/* Protocol header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{
          fontSize: 20,
          color: meta.color,
          filter: `drop-shadow(0 0 4px ${meta.color}66)`,
        }}>
          {meta.icon}
        </span>
        <div>
          <div style={{
            fontSize: 16, fontWeight: 700, color: T.text,
            fontFamily: "Inter, sans-serif",
            textTransform: "capitalize",
          }}>
            {name}
          </div>
          <div style={{
            fontSize: 11, fontWeight: 600, color: T.muted,
            letterSpacing: 0.8,
          }}>
            {meta.label}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16 }}>
        <div>
          <div style={{
            fontSize: 10, fontWeight: 700, color: T.muted,
            letterSpacing: 1.2, marginBottom: 6,
          }}>
            MAX LTV
          </div>
          <div style={{
            fontSize: 32, fontWeight: 800, color: meta.color,
            fontFamily: "Inter, sans-serif", letterSpacing: -1,
            lineHeight: 1,
          }}>
            {model.max_ltv}%
          </div>
        </div>
        <div>
          <div style={{
            fontSize: 10, fontWeight: 700, color: T.muted,
            letterSpacing: 1.2, marginBottom: 6,
          }}>
            INTEREST
          </div>
          <div style={{
            fontSize: 32, fontWeight: 800, color: T.gold,
            fontFamily: "Inter, sans-serif", letterSpacing: -1,
            lineHeight: 1,
          }}>
            {model.interest}%
          </div>
        </div>
      </div>

      {/* LTV bar */}
      <div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontSize: 10, color: T.muted, fontWeight: 600, letterSpacing: 0.8,
        }}>
          <span>0%</span>
          <span>100%</span>
        </div>
        <LtvBar ltv={model.max_ltv} color={meta.color} />
      </div>
    </div>
  );
}

export default function ProtocolModelsPage() {
  const [wallet, setWallet] = useState("");
  const [data, setData] = useState<ModelsResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const canAnalyze = wallet.trim().length > 0;

  const analyze = async () => {
    if (!canAnalyze) return;
    setStatus("loading");
    try {
      const res = await API.post("/protocol-models/", { wallet });
      setData(res.data);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") analyze();
  };

  const modelEntries = data?.models ? Object.entries(data.models) : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        body { background: ${T.bg}; font-family: Inter, sans-serif; color: ${T.text}; margin: 0; }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.7; }
        }
        input::placeholder { color: #2E4060; }
        input:focus { border-color: #00E5FF55 !important; box-shadow: 0 0 0 2px #00E5FF11; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
      `}</style>

      <main style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "40px 24px",
        minHeight: "100vh",
      }}>
        {/* Header */}
        <div style={{ marginBottom: 40, animation: "fadeSlideIn 0.35s ease both" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#00E5FF12",
            border: "1px solid #00E5FF33",
            borderRadius: 99,
            padding: "4px 12px",
            marginBottom: 16,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: T.cyan,
              display: "inline-block",
              boxShadow: `0 0 6px ${T.cyan}`,
            }} />
            <span style={{
              fontSize: 11, fontWeight: 700, color: T.cyan, letterSpacing: 1.5,
            }}>
              RISK COMPARISON
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800,
            letterSpacing: -1.5,
            margin: 0,
            lineHeight: 1.1,
            background: `linear-gradient(135deg, ${T.text} 30%, ${T.cyan})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Multi-Protocol Risk Models
          </h1>
          <p style={{ color: T.muted, fontSize: 15, marginTop: 10, marginBottom: 0 }}>
            See how different lending protocols would price a wallet&apos;s credit risk.
          </p>
        </div>

        {/* Input */}
        <div
          onKeyDown={onKeyDown}
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: 24,
            marginBottom: 32,
            display: "flex",
            gap: 12,
            alignItems: "flex-end",
            flexWrap: "wrap",
            animation: "fadeSlideIn 0.35s ease both",
            animationDelay: "60ms",
          }}
        >
          <div style={{ flex: 1, minWidth: 240 }}>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 600,
              color: T.muted, letterSpacing: 0.8, marginBottom: 6,
            }}>
              WALLET ADDRESS
            </label>
            <input
              placeholder="0x..."
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              style={{
                background: "#070F1C",
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: "10px 14px",
                color: T.text,
                fontSize: 14,
                width: "100%",
                fontFamily: "JetBrains Mono, monospace",
                outline: "none",
                transition: "border-color 0.18s",
              }}
            />
          </div>
          <button
            onClick={analyze}
            disabled={!canAnalyze || status === "loading"}
            style={{
              background:
                !canAnalyze || status === "loading"
                  ? "#0D1B2E"
                  : `linear-gradient(135deg, #00C9E4, #0090C8)`,
              border: "none",
              borderRadius: 8,
              color: !canAnalyze || status === "loading" ? "#2E4060" : "#fff",
              fontSize: 14,
              fontWeight: 700,
              padding: "11px 28px",
              cursor: !canAnalyze || status === "loading" ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow:
                !canAnalyze || status === "loading"
                  ? "none"
                  : "0 4px 20px #00E5FF33",
              letterSpacing: 0.3,
              whiteSpace: "nowrap",
            }}
          >
            {status === "loading" ? "Analyzing…" : "Analyze Risk →"}
          </button>
        </div>

        {/* Error */}
        {status === "error" && (
          <div style={{
            background: "#FF4D6A12",
            border: "1px solid #FF4D6A33",
            borderRadius: 12,
            padding: "16px 24px",
            color: T.red,
            fontSize: 14,
            marginBottom: 24,
            animation: "fadeSlideIn 0.3s ease both",
          }}>
            Could not analyze this wallet. Check the address and try again.
          </div>
        )}

        {/* Loading */}
        {status === "loading" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                background: T.card,
                borderRadius: 14,
                height: 240,
                border: `1px solid ${T.border}`,
                opacity: 0.5,
                animation: "pulse-glow 1.5s ease-in-out infinite",
                animationDelay: `${i * 150}ms`,
              }} />
            ))}
          </div>
        )}

        {/* Results */}
        {data && status === "idle" && (
          <div style={{ animation: "fadeSlideIn 0.3s ease both" }}>
            {/* Score overview */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginBottom: 28,
              padding: "16px 24px",
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              flexWrap: "wrap",
            }}>
              <ScoreGauge score={data.credit_score} />
              <div>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: T.muted,
                  letterSpacing: 1.5, marginBottom: 4,
                }}>
                  WALLET
                </div>
                <div style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 13, color: T.sub, letterSpacing: 0.3,
                }}>
                  {data.wallet
                    ? `${data.wallet.slice(0, 10)}…${data.wallet.slice(-6)}`
                    : "—"}
                </div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: T.muted,
                  letterSpacing: 1.5, marginBottom: 4,
                }}>
                  MODELS
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: T.text }}>
                  {modelEntries.length}
                </div>
              </div>
            </div>

            {/* Protocol cards grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}>
              {modelEntries.map(([name, model], idx) => (
                <ProtocolCard key={name} name={name} model={model} idx={idx} />
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
