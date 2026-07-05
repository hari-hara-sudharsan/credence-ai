"use client";

interface WalletRiskItem {
  wallet: string;
  credit_score: number;
  exposure: number;
}

interface Props {
  wallets: WalletRiskItem[];
}

export default function WalletRiskTable({ wallets }: Props) {
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
          fontSize: 11,
          fontWeight: 700,
          color: "#FF4D6A",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        EXPOSURE RISK ALERT MATRIX
      </div>

      {wallets.length === 0 ? (
        <div style={{ color: "#64748B", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
          No high-risk exposures detected.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #111C2E", textAlign: "left" }}>
                <th style={{ padding: "10px 8px", fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                  WALLET ADDRESS
                </th>
                <th style={{ padding: "10px 8px", fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                  CREDIT SCORE
                </th>
                <th style={{ padding: "10px 8px", fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                  EXPOSURE LIMIT
                </th>
                <th style={{ padding: "10px 8px", fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                  RECOMMENDED ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((w, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #111C2E", fontSize: 13, color: "#E2E8F0" }}>
                  <td style={{ padding: "12px 8px", fontFamily: "JetBrains Mono, monospace" }}>{w.wallet}</td>
                  <td style={{ padding: "12px 8px", fontWeight: 700, color: "#FF4D6A" }}>{w.credit_score}</td>
                  <td style={{ padding: "12px 8px", fontWeight: 700 }}>${w.exposure.toLocaleString()}</td>
                  <td style={{ padding: "12px 8px", color: "#FFB830" }}>
                    Reduce limits by 20% or verify collateral bounds.
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
