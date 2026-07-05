"use client";

interface Props {
  wallet: string;
  creditScore: number;
  risk: string;
}

export default function WalletNode({ wallet, creditScore, risk }: Props) {
  const getRiskColor = (level: string) => {
    if (level === "LOW") return "#34D399";
    if (level === "MEDIUM") return "#FFB830";
    return "#FF4D6A";
  };

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#00E5FF",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        WALLET NODE COEFFICIENTS
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <span style={{ fontSize: 9, color: "#64748B", display: "block" }}>NODE IDENTIFIER</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", fontFamily: "JetBrains Mono, monospace" }}>
            {wallet}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <span style={{ fontSize: 9, color: "#64748B", display: "block" }}>CREDIT SCORE</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#E2E8F0" }}>{creditScore}</span>
          </div>
          <div>
            <span style={{ fontSize: 9, color: "#64748B", display: "block" }}>RISK LEVEL</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: getRiskColor(risk) }}>{risk} RISK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
