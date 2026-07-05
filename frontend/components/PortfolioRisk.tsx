"use client";

interface Props {
  segments: {
    PRIME: number;
    TRUSTED: number;
    STANDARD: number;
    WATCHLIST: number;
    HIGH_RISK: number;
  };
}

export default function PortfolioRisk({ segments }: Props) {
  const list = [
    { label: "PRIME", count: segments.PRIME, color: "#34D399" },
    { label: "TRUSTED", count: segments.TRUSTED, color: "#00E5FF" },
    { label: "STANDARD", count: segments.STANDARD, color: "#94A3B8" },
    { label: "WATCHLIST", count: segments.WATCHLIST, color: "#FFB830" },
    { label: "HIGH_RISK", count: segments.HIGH_RISK, color: "#FF4D6A" }
  ];

  const total = Object.values(segments).reduce((a, b) => a + b, 0) || 1;

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
          color: "#4A6080",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        PORTFOLIO SEGMENTATION
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {list.map((item, i) => {
          const percent = Math.round((item.count / total) * 100);
          return (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: item.color }}>{item.label}</span>
                <span style={{ color: "#64748B" }}>
                  {item.count} wallets ({percent}%)
                </span>
              </div>
              <div style={{ height: 6, background: "#111C2E", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${percent}%`, height: "100%", background: item.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
