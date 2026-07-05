"use client";

interface Props {
  settlementId: string;
  txHash: string;
  amount: number;
}

export default function TransactionViewer({ settlementId, txHash, amount }: Props) {
  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
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
        HSP TRANSACTION DETAILS
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8 }}>
          <span style={{ fontSize: 12, color: "#64748B" }}>Settlement ID</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", fontFamily: "JetBrains Mono, monospace" }}>
            {settlementId}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8 }}>
          <span style={{ fontSize: 12, color: "#64748B" }}>Network</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>HashKey Chain</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8 }}>
          <span style={{ fontSize: 12, color: "#64748B" }}>Settlement Asset</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#34D399" }}>HSP Stablecoin</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8 }}>
          <span style={{ fontSize: 12, color: "#64748B" }}>Amount Paid</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#34D399" }}>
            {amount} HSP
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 4 }}>
          <span style={{ fontSize: 12, color: "#64748B" }}>On-Chain Transaction Hash</span>
          <a
            href="#"
            style={{
              fontSize: 11,
              color: "#34D399",
              fontFamily: "JetBrains Mono, monospace",
              textDecoration: "none",
              wordBreak: "break-all",
              background: "rgba(52, 211, 153, 0.05)",
              border: "1px solid rgba(52, 211, 153, 0.15)",
              borderRadius: 6,
              padding: 8,
              display: "block",
            }}
          >
            {txHash} ↗
          </a>
        </div>
      </div>
    </div>
  );
}
