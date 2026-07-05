"use client";

import { useRouter } from "next/navigation";

interface Props {
  request: {
    request_id: string;
    borrower: string;
    amount: number;
    interest_rate: number;
    duration_days: number;
    purpose: string;
    credit_score: number;
    risk_level: string;
    badge?: string;
    ai_confidence?: number;
    status: string;
    created_at: string;
  };
  onFund?: (requestId: string) => void;
  showFundButton?: boolean;
}

const BADGE_COLORS: Record<string, string> = {
  PRIME: "#34D399",
  TRUSTED: "#60A5FA",
  STANDARD: "#F59E0B",
  WATCHLIST: "#FB923C",
  HIGH_RISK: "#EF4444",
  UNRATED: "#64748B",
};

const RISK_COLORS: Record<string, string> = {
  LOW: "#34D399",
  MEDIUM: "#F59E0B",
  HIGH: "#FB923C",
  CRITICAL: "#EF4444",
};

export default function BorrowRequestCard({ request, onFund, showFundButton = true }: Props) {
  const router = useRouter();
  const badgeColor = BADGE_COLORS[request.badge || "UNRATED"] || "#64748B";
  const riskColor = RISK_COLORS[request.risk_level] || "#64748B";
  const shortWallet = `${request.borrower.slice(0, 6)}...${request.borrower.slice(-4)}`;
  const confidence = request.ai_confidence || 0;

  return (
    <div
      onClick={() => router.push(`/passport/${request.borrower}`)}
      style={{
        background: "rgba(15, 23, 42, 0.6)",
        border: "1px solid rgba(100, 116, 139, 0.15)",
        borderRadius: 16,
        padding: 24,
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.border = `1px solid ${badgeColor}40`;
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${badgeColor}10`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(100, 116, 139, 0.15)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Header: Wallet + Badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: "#64748B", fontFamily: "JetBrains Mono, monospace", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
            Borrower
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0", fontFamily: "JetBrains Mono, monospace" }}>
            {shortWallet}
          </div>
        </div>
        <span
          style={{
            background: `${badgeColor}15`,
            color: badgeColor,
            padding: "4px 12px",
            borderRadius: 20,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 1,
            border: `1px solid ${badgeColor}30`,
          }}
        >
          {request.badge || "UNRATED"}
        </span>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 10, color: "#64748B", fontWeight: 600, marginBottom: 2 }}>CREDIT SCORE</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#E2E8F0" }}>{request.credit_score}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#64748B", fontWeight: 600, marginBottom: 2 }}>REQUEST</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#E2E8F0" }}>{request.amount} HSK</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#64748B", fontWeight: 600, marginBottom: 2 }}>INTEREST</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#34D399" }}>{request.interest_rate}%</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#64748B", fontWeight: 600, marginBottom: 2 }}>DURATION</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#E2E8F0" }}>{request.duration_days}d</div>
        </div>
      </div>

      {/* AI Confidence Bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: "#64748B", fontWeight: 600 }}>AI CONFIDENCE</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: confidence >= 70 ? "#34D399" : confidence >= 40 ? "#F59E0B" : "#EF4444" }}>
            {confidence.toFixed(0)}%
          </span>
        </div>
        <div style={{ background: "rgba(100, 116, 139, 0.15)", borderRadius: 4, height: 4, overflow: "hidden" }}>
          <div
            style={{
              width: `${confidence}%`,
              height: "100%",
              background: confidence >= 70 ? "#34D399" : confidence >= 40 ? "#F59E0B" : "#EF4444",
              borderRadius: 4,
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>

      {/* Risk + Purpose */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 11, color: riskColor, fontWeight: 700 }}>
          ● {request.risk_level} RISK
        </span>
        <span style={{ fontSize: 11, color: "#94A3B8", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {request.purpose}
        </span>
      </div>

      {/* Fund Button */}
      {showFundButton && request.status === "REQUESTED" && onFund && (
        <button
          onClick={(e) => { e.stopPropagation(); onFund(request.request_id); }}
          style={{
            width: "100%",
            padding: "12px 0",
            background: "linear-gradient(135deg, #34D399 0%, #06B6D4 100%)",
            border: "none",
            borderRadius: 10,
            color: "#040C1A",
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: 0.5,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.transform = "scale(1.02)"; }}
          onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.transform = "scale(1)"; }}
        >
          FUND LOAN
        </button>
      )}
    </div>
  );
}
