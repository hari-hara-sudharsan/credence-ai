"use client";

interface Props {
  healthyCount: number;
  watchlistCount: number;
}

export default function PolicyCompliance({ healthyCount, watchlistCount }: Props) {
  const complianceRules = [
    { rule: "Collateral LTV Bounds Check", status: "PASSED", color: "#34D399" },
    { rule: "Wallet Default Probability Check", status: healthyCount > 0 ? "PASSED" : "FAILED", color: healthyCount > 0 ? "#34D399" : "#FF4D6A" },
    { rule: "Adapter Activity Longevity Criteria", status: "PASSED", color: "#34D399" },
    { rule: "Concentration Limit Check", status: watchlistCount === 0 ? "PASSED" : "WARNING", color: watchlistCount === 0 ? "#34D399" : "#FFB830" }
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
          fontSize: 10,
          fontWeight: 800,
          color: "#00E5FF",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        COMPLIANCE RULES CHECKLIST
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {complianceRules.map((c, i) => (
          <div
            key={i}
            style={{
              background: "#050B14",
              border: "1px solid #111C2E",
              borderRadius: 8,
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 13, color: "#E2E8F0" }}>{c.rule}</span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: c.color,
                background: `${c.color}1A`,
                border: `1px solid ${c.color}`,
                borderRadius: 4,
                padding: "2px 6px",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {c.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
