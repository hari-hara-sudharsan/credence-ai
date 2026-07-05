"use client";

interface Props {
  metrics: {
    total_liquidity: number;
    borrowed_amount: number;
    available_liquidity: number;
    utilization_rate: number;
    average_interest: number;
    health: string;
  };
}

export default function LiquidityDashboard({ metrics }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: 20,
        marginBottom: 32,
      }}
    >
      {[
        { label: "Total Liquidity", val: `${metrics.total_liquidity.toLocaleString()} HSK`, desc: "Total assets committed to pool" },
        { label: "Available Liquidity", val: `${metrics.available_liquidity.toLocaleString()} HSK`, desc: "Liquid capital for allocation" },
        { label: "Borrowed Capital", val: `${metrics.borrowed_amount.toLocaleString()} HSK`, desc: "Active under-collateralized loans" },
        { label: "Pool Utilization", val: `${metrics.utilization_rate}%`, desc: "Ratio of borrowed to total assets", highlight: true }
      ].map((card, i) => (
        <div
          key={i}
          style={{
            background: "#0A1425",
            border: "1px solid #111C2E",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748B", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
            {card.label}
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: card.highlight ? "#00E5FF" : "#E2E8F0",
              letterSpacing: -0.5,
              marginBottom: 4,
            }}
          >
            {card.val}
          </div>
          <div style={{ fontSize: 11, color: "#4A6080" }}>
            {card.desc}
          </div>
        </div>
      ))}
    </div>
  );
}
