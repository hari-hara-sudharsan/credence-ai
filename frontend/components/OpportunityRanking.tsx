"use client";

import MatchScore from "./MatchScore";

interface Opportunity {
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
}

interface Props {
  opportunities: Opportunity[];
  onFund: (requestId: string) => void;
}

const BADGE_COLORS: Record<string, string> = {
  PRIME: "#34D399", TRUSTED: "#60A5FA", STANDARD: "#F59E0B",
  WATCHLIST: "#FB923C", HIGH_RISK: "#EF4444",
};

export default function OpportunityRanking({ opportunities, onFund }: Props) {
  if (!opportunities.length) return null;

  return (
    <div style={{
      background: "rgba(15,23,42,0.5)", border: "1px solid rgba(100,116,139,0.12)",
      borderRadius: 16, overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "grid", gridTemplateColumns: "40px 1fr 80px 80px 80px 80px 60px 90px",
        gap: 8, padding: "12px 20px",
        background: "rgba(4,12,26,0.5)", borderBottom: "1px solid rgba(100,116,139,0.1)",
        fontSize: 9, color: "#64748B", fontWeight: 700, letterSpacing: 1,
      }}>
        <span>#</span>
        <span>BORROWER</span>
        <span style={{ textAlign: "right" }}>SCORE</span>
        <span style={{ textAlign: "right" }}>AMOUNT</span>
        <span style={{ textAlign: "right" }}>INTEREST</span>
        <span style={{ textAlign: "right" }}>RETURN</span>
        <span style={{ textAlign: "center" }}>MATCH</span>
        <span></span>
      </div>

      {/* Rows */}
      {opportunities.map((opp, i) => {
        const bc = BADGE_COLORS[opp.badge] || "#64748B";
        return (
          <div
            key={opp.request_id}
            style={{
              display: "grid", gridTemplateColumns: "40px 1fr 80px 80px 80px 80px 60px 90px",
              gap: 8, padding: "12px 20px", alignItems: "center",
              borderBottom: "1px solid rgba(100,116,139,0.05)",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget).style.background = "rgba(100,116,139,0.04)"; }}
            onMouseLeave={(e) => { (e.currentTarget).style.background = "transparent"; }}
          >
            <span style={{ fontSize: 12, fontWeight: 800, color: i === 0 ? "#34D399" : "#64748B" }}>
              {i + 1}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, fontFamily: "JetBrains Mono", color: "#E2E8F0" }}>
                {opp.borrower.slice(0, 6)}...{opp.borrower.slice(-4)}
              </span>
              <span style={{
                fontSize: 8, fontWeight: 800, padding: "1px 6px", borderRadius: 6,
                color: bc, background: `${bc}12`,
              }}>
                {opp.badge}
              </span>
            </div>
            <span style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>
              {opp.credit_score}
            </span>
            <span style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>
              {opp.amount}
            </span>
            <span style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#34D399" }}>
              {opp.interest_rate}%
            </span>
            <span style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#34D399" }}>
              {opp.expected_return}
            </span>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <MatchScore score={opp.match_score} size={36} label="" />
            </div>
            <button
              onClick={() => onFund(opp.request_id)}
              style={{
                padding: "6px 0", background: "rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.2)", borderRadius: 6,
                color: "#34D399", fontWeight: 800, fontSize: 10, cursor: "pointer",
              }}
            >
              Fund
            </button>
          </div>
        );
      })}
    </div>
  );
}
