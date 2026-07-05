"use client";

interface Props {
  distribution: any;
}

export default function CreditDistribution({ distribution }: Props) {
  const total = Object.values(distribution).reduce((a: any, b: any) => a + b, 0) as number;

  const buckets = [
    { key: "EXCELLENT", label: "Excellent (750+)", color: "#34D399" },
    { key: "GOOD", label: "Good (650-749)", color: "#00E5FF" },
    { key: "AVERAGE", label: "Average (550-649)", color: "#FFB830" },
    { key: "RISK", label: "Substandard (450-549)", color: "#CD7F32" },
    { key: "HIGH_RISK", label: "High Risk (<450)", color: "#FF4D6A" }
  ];

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
        CREDIT RATING BRACKETS
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {buckets.map((b) => {
          const val = distribution[b.key] || 0;
          const pct = total > 0 ? (val / total) * 100 : 0;
          return (
            <div key={b.key}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: "#E2E8F0" }}>{b.label}</span>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: b.color }}>
                  {val} ({pct.toFixed(0)}%)
                </span>
              </div>

              <div style={{ width: "100%", height: 6, background: "#050B14", borderRadius: 3, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: b.color,
                    borderRadius: 3,
                    boxShadow: `0 0 6px ${b.color}40`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
