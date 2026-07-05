"use client";

interface Props {
  totalWallets: number;
  totalCredit: number;
}

export default function MarketplaceStats({ totalWallets, totalCredit }: Props) {
  const stats = [
    { label: "VERIFIED WALLETS", value: totalWallets, color: "#34D399" },
    { label: "AVAILABLE CREDIT POOLS", value: `$${totalCredit.toLocaleString()}`, color: "#00E5FF" },
    { label: "CONNECTED PROTOCOLS", value: "3 Markets", color: "#FFB830" },
    { label: "MARKETPLACE STATUS", value: "STABLE", color: "#34D399" }
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            background: "#0A1425",
            border: "1px solid #111C2E",
            borderRadius: 12,
            padding: "16px 20px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>
            {s.label}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}
