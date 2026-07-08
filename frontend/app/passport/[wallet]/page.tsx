"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

import API from "@/lib/api";
import CreditHistoryChart from "@/components/CreditHistoryChart";
import ConnectWallet from "@/components/ConnectWallet";
import MintPassportButton from "@/components/MintPassportButton";

interface PassportData {
  credit: any;
  report: any;
  lending: any;
  history: any[];
  activity: any[];
}

// ── Shared tokens (mirrors Marketplace) ──────────────────────────────────────
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
  muted: "#4A6080",
  dim: "#2E4060",
  text: "#E2E8F0",
  sub: "#94A3B8",
};

function scoreColor(score: number) {
  if (score >= 750) return T.cyan;
  if (score >= 550) return T.gold;
  return T.red;
}

function scoreLabel(score: number) {
  if (score >= 800) return "Exceptional";
  if (score >= 750) return "Excellent";
  if (score >= 700) return "Very Good";
  if (score >= 650) return "Good";
  if (score >= 550) return "Fair";
  return "Poor";
}

// ── Badge icons ───────────────────────────────────────────────────────────────
const BADGE_ICONS: Record<string, string> = {
  "Veteran Wallet": "🛡️",
  Whale: "🐋",
  "Power User": "⚡",
  "Trusted Borrower": "✅",
  "New Wallet": "🆕",
  "Early Adopter": "🚀",
  "High Volume": "📊",
  Verified: "🔒",
  "Low Risk": "🟢",
  "DeFi Native": "🔗",
};

const BADGE_COLORS: Record<string, string> = {
  "Veteran Wallet": "#FFB830",
  Whale: "#00E5FF",
  "Power User": "#A78BFA",
  "Trusted Borrower": "#34D399",
  "New Wallet": "#94A3B8",
  "Early Adopter": "#A78BFA",
  "High Volume": "#00E5FF",
  Verified: "#34D399",
  "Low Risk": "#34D399",
  "DeFi Native": "#60A5FA",
};

// ── Report section icons ─────────────────────────────────────────────────────
const SECTION_META: Record<string, { icon: string; color: string }> = {
  "Institutional Credit Report": { icon: "🏦", color: T.cyan },
  "Wallet Overview": { icon: "👛", color: T.cyan },
  "Risk Assessment": { icon: "⚠️", color: T.gold },
  Strengths: { icon: "🟢", color: T.green },
  Weaknesses: { icon: "🔴", color: T.red },
  "Lending Recommendation": { icon: "📝", color: "#A78BFA" },
};

function FormattedReport({ text }: { text: string }) {
  // Parse **Section Header** pattern and split into sections
  const parts = text.split(/\*\*(.*?)\*\*/g);
  const sections: { title: string; body: string }[] = [];

  for (let i = 0; i < parts.length; i++) {
    const chunk = parts[i].trim();
    if (!chunk) continue;

    // Check if this chunk is a section title (the captured group)
    // Odd indices from split are the captured groups
    if (i % 2 === 1) {
      // This is a captured header
      sections.push({ title: chunk, body: "" });
    } else {
      // This is body text
      if (sections.length > 0) {
        sections[sections.length - 1].body += chunk;
      } else {
        sections.push({ title: "", body: chunk });
      }
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {sections.map((section, idx) => {
        const meta = SECTION_META[section.title] ?? { icon: "◎", color: T.sub };
        const body = section.body.replace(/^\n+/, "").replace(/\n+$/, "");
        if (!section.title && !body) return null;

        return (
          <div
            key={idx}
            style={{
              padding: "16px 0",
              borderBottom: idx < sections.length - 1 ? `1px solid ${T.border}` : "none",
            }}
          >
            {section.title && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}>
                <span style={{ fontSize: 16 }}>{meta.icon}</span>
                <h3 style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 700,
                  color: meta.color,
                  fontFamily: "Inter, sans-serif",
                  letterSpacing: 0.3,
                }}>
                  {section.title}
                </h3>
              </div>
            )}
            {body && (
              <p style={{
                margin: 0,
                fontSize: 13,
                color: T.sub,
                lineHeight: 1.8,
                fontFamily: "Inter, sans-serif",
                paddingLeft: section.title ? 28 : 0,
              }}>
                {body}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Animated radial score ring ────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);
  const [animated, setAnimated] = useState(0);
  const raf = useRef<number | null>(null);

  const SIZE = 220;
  const STROKE = 14;
  const R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;
  const MAX_SCORE = 1000;

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;
    const target = Math.min(Math.max(score, 0), MAX_SCORE);

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(ease * target));
      setAnimated(ease * target);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [score]);

  const pct = animated / MAX_SCORE;
  const dash = pct * CIRC;
  const color = scoreColor(score);

  return (
    <div style={{ position: "relative", width: SIZE, height: SIZE, flexShrink: 0 }}>
      <svg width={SIZE} height={SIZE} style={{ transform: "rotate(-90deg)" }}>
        {/* track */}
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none" stroke="#1A2740" strokeWidth={STROKE} />
        {/* filled arc */}
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${CIRC}`}
          style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "stroke 0.4s" }}
        />
      </svg>
      {/* center label */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 2,
      }}>
        <span style={{ fontSize: 48, fontWeight: 800, color, letterSpacing: -2, lineHeight: 1, fontFamily: "Inter, sans-serif" }}>
          {displayed}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: T.muted, letterSpacing: 1.5 }}>
          / {MAX_SCORE}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color, marginTop: 4, letterSpacing: 0.5 }}>
          {scoreLabel(score)}
        </span>
      </div>
    </div>
  );
}

// ── Stat item ─────────────────────────────────────────────────────────────────
function Stat({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: 1.2 }}>{label.toUpperCase()}</span>
      <span style={{ fontSize: 17, fontWeight: 700, color: accent ?? T.text, fontFamily: "Inter, sans-serif" }}>{value}</span>
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────
function Card({ title, eyebrow, children, accentColor }: {
  title: string; eyebrow?: string; children: React.ReactNode; accentColor?: string;
}) {
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      overflow: "hidden",
      animation: "fadeSlideIn 0.35s ease both",
    }}>
      <div style={{
        padding: "16px 24px",
        borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        {accentColor && (
          <span style={{ width: 3, height: 18, borderRadius: 2, background: accentColor, flexShrink: 0 }} />
        )}
        <div>
          {eyebrow && (
            <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: 1.5, marginBottom: 2 }}>
              {eyebrow.toUpperCase()}
            </div>
          )}
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>{title}</h2>
        </div>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function Skeleton({ height = 80 }: { height?: number }) {
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      height,
      animation: "pulse-glow 1.5s ease-in-out infinite",
    }} />
  );
}

// ── Lending decision row ──────────────────────────────────────────────────────
function LendingRow({ label, value }: { label: string; value: any }) {
  const isApproved = typeof value === "boolean" ? value : undefined;
  const display =
    typeof value === "boolean"
      ? value ? "Approved" : "Declined"
      : typeof value === "number"
      ? value.toLocaleString()
      : String(value ?? "—");

  const color =
    isApproved === true ? T.green :
    isApproved === false ? T.red :
    T.sub;

  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "11px 0",
      borderBottom: `1px solid ${T.border}`,
    }}>
      <span style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>{label}</span>
      <span style={{
        fontSize: 13,
        fontWeight: 700,
        color,
        fontFamily: label.toLowerCase().includes("rate") || label.toLowerCase().includes("amount")
          ? "JetBrains Mono, monospace" : "Inter, sans-serif",
        background: isApproved !== undefined ? `${color}14` : "transparent",
        border: isApproved !== undefined ? `1px solid ${color}44` : "none",
        borderRadius: 6,
        padding: isApproved !== undefined ? "2px 10px" : "0",
      }}>{display}</span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PassportPage() {
  const params = useParams();
  const wallet = params?.wallet as string;

  const [data, setData] = useState<PassportData | null>(null);
  const [connectedWallet, setConnectedWallet] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!wallet) return;
    setError(false);

    const load = async () => {
      try {
        const [credit, report, lending, history, activity] = await Promise.all([
          API.post("/credit/score", { wallet }),
          API.post("/report/", { wallet }),
          API.post("/lending/decision", { wallet }),
          API.get(`/history/${wallet}`),
          API.get(`/activity/${wallet}`),
        ]);
        setData({
          credit: credit.data,
          report: report.data,
          lending: lending.data,
          history: history.data,
          activity: activity.data,
        });
      } catch {
        setError(true);
      }
    };

    load();
  }, [wallet]);

  const shortWallet = wallet
    ? `${wallet.slice(0, 10)}…${wallet.slice(-8)}`
    : "—";

  const lendingEntries = data?.lending
    ? Object.entries(data.lending).filter(([k]) => k !== "wallet")
    : [];

  const activityEvents = data?.activity || [];
  const proofCounts = activityEvents.reduce((acc: Record<string, number>, curr: any) => {
    const type = curr.eventType || curr.actionType; // Handle both DB and mock formats
    if (type) {
      acc[type] = (acc[type] || 0) + 1;
    }
    return acc;
  }, {});

  const hspCount = proofCounts["HSP_SETTLEMENT"] || 0;
  const repaymentCount = proofCounts["LOAN_REPAYMENT"] || 0;
  const protocolCount = proofCounts["PROTOCOL_VERIFICATION"] || 0;

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
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
      `}</style>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px", minHeight: "100vh" }}>

        {/* ── Back nav ── */}
        <a href="/marketplace" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 12, fontWeight: 600, color: T.muted, textDecoration: "none",
          marginBottom: 32, letterSpacing: 0.5,
          transition: "color 0.15s",
        }}>
          ← Marketplace
        </a>

        {/* ── Page header ── */}
        <div style={{ marginBottom: 36, animation: "fadeSlideIn 0.3s ease both" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#00E5FF12", border: "1px solid #00E5FF33",
            borderRadius: 99, padding: "4px 12px", marginBottom: 14,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: T.cyan,
              display: "inline-block", boxShadow: `0 0 6px ${T.cyan}`,
            }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: T.cyan, letterSpacing: 1.5 }}>
              ON-CHAIN IDENTITY
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800,
            letterSpacing: -1, margin: "0 0 8px",
            background: `linear-gradient(135deg, ${T.text} 40%, ${T.cyan})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Credit Passport
          </h1>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 8, padding: "6px 12px",
          }}>
            <span style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>Wallet</span>
            <span style={{
              fontSize: 12, color: T.sub,
              fontFamily: "JetBrains Mono, monospace", letterSpacing: 0.3,
            }}>
              {shortWallet}
            </span>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            background: "#FF4D6A12", border: "1px solid #FF4D6A33",
            borderRadius: 12, padding: "20px 24px", color: T.red,
            fontSize: 14, marginBottom: 24,
          }}>
            Failed to load passport data. Check the wallet address and try again.
          </div>
        )}

        {/* ── Loading ── */}
        {!data && !error && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Skeleton height={220} />
            <Skeleton height={140} />
            <Skeleton height={100} />
            <Skeleton height={180} />
          </div>
        )}

        {/* ── Content ── */}
        {data && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Hero — score ring + stats */}
            <div style={{
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              padding: "32px 32px",
              display: "flex",
              alignItems: "center",
              gap: 40,
              flexWrap: "wrap",
              animation: "fadeSlideIn 0.35s ease both",
            }}>
              <ScoreRing score={data.credit.credit_score} />

              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, letterSpacing: 1.5, marginBottom: 20 }}>
                  CREDIT OVERVIEW
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
                  <Stat label="Rating" value={data.credit.rating ?? "—"} accent={scoreColor(data.credit.credit_score)} />
                  <Stat label="Segment" value={data.credit.segment ?? "—"} />
                  {data.credit.interest_rate != null && (
                    <Stat label="Est. APR" value={`${data.credit.interest_rate}%`} accent={T.gold} />
                  )}
                  {data.credit.max_loan != null && (
                    <Stat label="Max Loan" value={`${Number(data.credit.max_loan).toLocaleString()} HSK`} />
                  )}
                </div>

                {data.credit.badges?.length > 0 && (
                  <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {data.credit.badges.map((b: string) => {
                      const c = BADGE_COLORS[b] ?? T.sub;
                      const icon = BADGE_ICONS[b] ?? "●";
                      return (
                        <span key={b} style={{
                          color: c, border: `1px solid ${c}44`, background: `${c}14`,
                          borderRadius: 6, padding: "3px 10px",
                          fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
                          display: "inline-flex", alignItems: "center", gap: 5,
                        }}>
                          <span style={{ fontSize: 13 }}>{icon}</span>
                          {b}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Mint Passport */}
            <Card title="Mint On-Chain Passport" eyebrow="NFT" accentColor={T.cyan}>
              <p style={{ fontSize: 13, color: T.muted, marginTop: 0, marginBottom: 16, lineHeight: 1.6 }}>
                Connect your wallet to mint a soulbound NFT that carries your credit score on-chain.
              </p>
              <ConnectWallet onConnect={setConnectedWallet} />
              {connectedWallet && (
                <div style={{ marginTop: 16 }}>
                  <MintPassportButton
                    wallet={wallet}
                    score={data.credit.credit_score}
                    rating={data.credit.rating}
                  />
                </div>
              )}
            </Card>

            {/* Proof History Section */}
            <Card title="Earned Proofs" eyebrow="Proof-of-Trust Protocol" accentColor="#00FF00">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ color: "#00FF00", fontSize: 13, fontWeight: "bold" }}>✓ {hspCount} HSP Settlement Proofs</div>
                <div style={{ color: "#00FF00", fontSize: 13, fontWeight: "bold" }}>✓ {repaymentCount} Repayment Proofs</div>
                <div style={{ color: "#00FF00", fontSize: 13, fontWeight: "bold" }}>✓ {protocolCount} Protocol Trust Proofs</div>
              </div>
              <div style={{ marginTop: 12 }}>
                <a href="/proof-of-trust" style={{ color: T.muted, fontSize: 12, textDecoration: "underline" }}>View Proof Center</a>
              </div>
            </Card>

            {/* Lending Decision */}
            <Card title="Lending Decision" eyebrow="Risk Assessment" accentColor={T.gold}>
              {lendingEntries.length === 0 ? (
                <p style={{ color: T.muted, fontSize: 13 }}>No lending data available.</p>
              ) : (
                <div>
                  {lendingEntries.map(([key, val]) => (
                    <LendingRow
                      key={key}
                      label={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      value={val}
                    />
                  ))}
                  {/* remove last divider */}
                </div>
              )}
            </Card>

            {/* AI Report */}
            <Card title="AI Credit Report" eyebrow="Generated Analysis" accentColor="#A78BFA">
              <div style={{
                maxHeight: 400,
                overflowY: "auto",
                paddingRight: 8,
              }}>
                <FormattedReport text={data.report.report ?? "No report available."} />
              </div>
            </Card>

            {/* Credit History */}
            <Card title="Credit History" eyebrow="Score Over Time" accentColor={T.cyan}>
              {data.history?.length > 0 ? (
                <CreditHistoryChart history={data.history} />
              ) : (
                <p style={{ color: T.muted, fontSize: 13 }}>No history recorded yet.</p>
              )}
            </Card>

          </div>
        )}
      </main>
    </>
  );
}