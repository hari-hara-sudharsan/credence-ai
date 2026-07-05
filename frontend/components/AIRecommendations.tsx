"use client";

import MatchScore from "./MatchScore";

interface MatchData {
  borrower: string;
  request_id: string;
  credit_score: number;
  risk: string;
  badge: string;
  amount: number;
  interest_rate: number;
  expected_return: number;
  match_score: number;
  ai_confidence: number;
  explanation: string;
  match_factors: {
    credit_compatibility: number;
    risk_alignment: number;
    yield_match: number;
    trust_strength: number;
  };
}

interface Props {
  recommendations: MatchData[];
  onFund: (requestId: string) => void;
  onExplain: (requestId: string) => void;
}

const BADGE_COLORS: Record<string, string> = {
  PRIME: "#34D399",
  TRUSTED: "#60A5FA",
  STANDARD: "#F59E0B",
  WATCHLIST: "#FB923C",
  HIGH_RISK: "#EF4444",
};

export default function AIRecommendations({ recommendations, onFund, onExplain }: Props) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "60px 0",
        background: "rgba(15,23,42,0.4)", borderRadius: 20,
        border: "1px solid rgba(100,116,139,0.1)",
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#E2E8F0", marginBottom: 6 }}>
          No Matches Found
        </h3>
        <p style={{ fontSize: 12, color: "#64748B" }}>
          Adjust your strategy or wait for new borrower requests.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {recommendations.map((match, i) => {
        const badgeColor = BADGE_COLORS[match.badge] || "#64748B";
        const shortWallet = `${match.borrower.slice(0, 6)}...${match.borrower.slice(-4)}`;

        return (
          <div
            key={match.request_id}
            style={{
              background: "rgba(15,23,42,0.5)",
              border: `1px solid ${i === 0 ? `${badgeColor}30` : "rgba(100,116,139,0.12)"}`,
              borderRadius: 16,
              padding: 24,
              transition: "all 0.2s ease",
            }}
          >
            {/* Top: Rank + Score + Badge */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/* Rank */}
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: i === 0 ? "rgba(52,211,153,0.15)" : "rgba(100,116,139,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800,
                  color: i === 0 ? "#34D399" : "#64748B",
                }}>
                  #{i + 1}
                </div>

                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0", fontFamily: "JetBrains Mono" }}>
                    {shortWallet}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 10,
                      color: badgeColor, background: `${badgeColor}15`, border: `1px solid ${badgeColor}25`,
                      letterSpacing: 0.5,
                    }}>
                      {match.badge}
                    </span>
                    <span style={{ fontSize: 10, color: match.risk === "LOW" ? "#34D399" : "#F59E0B", fontWeight: 700 }}>
                      ● {match.risk} RISK
                    </span>
                  </div>
                </div>
              </div>

              <MatchScore score={match.match_score} size={64} label="MATCH" />
            </div>

            {/* Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
              <div style={{ background: "rgba(4,12,26,0.4)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#64748B", fontWeight: 600 }}>SCORE</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#E2E8F0" }}>{match.credit_score}</div>
              </div>
              <div style={{ background: "rgba(4,12,26,0.4)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#64748B", fontWeight: 600 }}>AMOUNT</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#E2E8F0" }}>{match.amount}</div>
              </div>
              <div style={{ background: "rgba(4,12,26,0.4)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#64748B", fontWeight: 600 }}>INTEREST</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#34D399" }}>{match.interest_rate}%</div>
              </div>
              <div style={{ background: "rgba(4,12,26,0.4)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#64748B", fontWeight: 600 }}>RETURN</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#34D399" }}>{match.expected_return}</div>
              </div>
            </div>

            {/* AI Explanation */}
            <div style={{
              background: "rgba(96,165,250,0.04)",
              border: "1px solid rgba(96,165,250,0.1)",
              borderRadius: 10, padding: 12, marginBottom: 16,
            }}>
              <div style={{ fontSize: 9, color: "#60A5FA", fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>
                AI ANALYSIS
              </div>
              <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
                {match.explanation}
              </p>
            </div>

            {/* Factor Bars */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {Object.entries(match.match_factors).map(([key, val]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 9, color: "#64748B", width: 55, fontWeight: 600, textTransform: "capitalize" }}>
                    {key.replace("_", " ").split(" ")[0]}
                  </span>
                  <div style={{ flex: 1, background: "rgba(100,116,139,0.1)", borderRadius: 3, height: 4 }}>
                    <div style={{
                      width: `${val}%`, height: "100%", borderRadius: 3,
                      background: val >= 70 ? "#34D399" : val >= 40 ? "#F59E0B" : "#EF4444",
                      transition: "width 0.5s ease",
                    }} />
                  </div>
                  <span style={{ fontSize: 9, color: "#94A3B8", fontWeight: 700, width: 24 }}>{val.toFixed(0)}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => onExplain(match.request_id)}
                style={{
                  flex: 1, padding: "10px", background: "transparent",
                  border: "1px solid rgba(96,165,250,0.25)", borderRadius: 10,
                  color: "#60A5FA", fontWeight: 700, fontSize: 11, cursor: "pointer",
                }}
              >
                Why This Match?
              </button>
              <button
                onClick={() => onFund(match.request_id)}
                style={{
                  flex: 1, padding: "10px",
                  background: "linear-gradient(135deg, #34D399, #06B6D4)",
                  border: "none", borderRadius: 10,
                  color: "#040C1A", fontWeight: 800, fontSize: 11, cursor: "pointer",
                }}
              >
                Fund This Loan
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
