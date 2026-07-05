"use client";

interface Props {
  total: number;
  verified: number;
}

export default function WalletSegments({ total, verified }: Props) {
  const institutionalPct = 25; // standard ecosystem default estimate
  const retailPct = 75;

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
          color: "#4A6080",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 20,
        }}
      >
        WALLETS SEGMENTATION
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
            <span>Retail Borrowers</span>
            <span style={{ fontWeight: 700, color: "#00E5FF" }}>{retailPct}%</span>
          </div>
          <div style={{ width: "100%", height: 6, background: "#050B14", borderRadius: 3 }}>
            <div style={{ width: `${retailPct}%`, height: "100%", background: "#00E5FF", borderRadius: 3 }} />
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
            <span>Institutional Whitelists</span>
            <span style={{ fontWeight: 700, color: "#34D399" }}>{institutionalPct}%</span>
          </div>
          <div style={{ width: "100%", height: 6, background: "#050B14", borderRadius: 3 }}>
            <div style={{ width: `${institutionalPct}%`, height: "100%", background: "#34D399", borderRadius: 3 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
