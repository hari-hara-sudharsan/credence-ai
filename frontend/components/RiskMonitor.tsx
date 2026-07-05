"use client";

interface Props {
  riskLevel: string;
}

export default function RiskMonitor({ riskLevel }: Props) {
  const isHigh = riskLevel === "HIGH";
  const statusColor = isHigh ? "#FF4D6A" : "#34D399";
  const bgGlow = isHigh ? "rgba(255, 77, 106, 0.05)" : "rgba(52, 211, 153, 0.05)";

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
        border: `1px solid ${statusColor}`,
        borderRadius: 14,
        padding: 24,
        boxShadow: `0 8px 32px ${bgGlow}`,
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
        ACTIVE RISK MONITOR
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 2 }}>
            SYSTEMIC STATUS
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: statusColor }}>{riskLevel} RISK</div>
        </div>

        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: statusColor,
            background: `${statusColor}1A`,
            border: `1px solid ${statusColor}`,
            borderRadius: 6,
            padding: "4px 10px",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {isHigh ? "STRESSED" : "STABLE"}
        </span>
      </div>
    </div>
  );
}
