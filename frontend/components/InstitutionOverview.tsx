"use client";

interface Props {
  exposure: number;
  health: number;
  wallets: number;
  risk: string;
}

export default function InstitutionOverview({ exposure, health, wallets, risk }: Props) {
  const getRiskColor = (level: string) => {
    if (level === "LOW") return "#34D399";
    return "#FF4D6A";
  };

  const cards = [
    { label: "TOTAL CREDIT EXPOSURE", value: `$${exposure.toLocaleString()}`, sub: `Across ${wallets} wallets` },
    { label: "PORTFOLIO HEALTH", value: `${health}/900`, sub: "Weighted score" },
    { label: "CONNECTED WALLETS", value: wallets, sub: "Reputation nodes" },
    { label: "PORTFOLIO RISK LEVEL", value: `${risk} RISK`, sub: "Consolidated bounds", color: getRiskColor(risk) }
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      {cards.map((c, i) => (
        <div
          key={i}
          style={{
            background: "#0A1425",
            border: "1px solid #111C2E",
            borderRadius: 14,
            padding: 20,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>
            {c.label}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: c.color || "#E2E8F0" }}>{c.value}</div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
