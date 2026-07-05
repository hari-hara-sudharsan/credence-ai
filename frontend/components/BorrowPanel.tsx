"use client";

interface Props {
  score: number;
  limit: number;
  rate: number;
}

export default function BorrowPanel({ score, limit, rate }: Props) {
  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#00E5FF",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 20,
        }}
      >
        BORROWER LIMIT ASSIGNMENT
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#64748B" }}>Wallet Credit Score</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#34D399" }}>
            {score} / 850
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#64748B" }}>Maximum Borrow Limit</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0" }}>
            {limit.toLocaleString()} HSK
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#64748B" }}>Dynamic Interest Rate</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#00E5FF" }}>
            {rate}% APY
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#64748B" }}>Collateral Reduction Lock</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#34D399" }}>
            -120% Savings
          </span>
        </div>
      </div>
    </div>
  );
}
