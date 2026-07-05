"use client";

interface Props {
  totalExposure: number;
  riskAdjusted: number;
}

export default function ExposureDashboard({ totalExposure, riskAdjusted }: Props) {
  const diffPercent = totalExposure ? Math.round(((riskAdjusted - totalExposure) / totalExposure) * 100) : 0;

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
        EXPOSURE RISK COMPILER
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <span style={{ fontSize: 11, color: "#64748B" }}>RAW EXPOSURE LIMIT</span>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#E2E8F0" }}>
            ${totalExposure.toLocaleString()}
          </div>
        </div>

        <div>
          <span style={{ fontSize: 11, color: "#64748B" }}>RISK-ADJUSTED EXPOSURE LIMIT</span>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#FF4D6A" }}>
            ${riskAdjusted.toLocaleString()}{" "}
            <span style={{ fontSize: 13, color: "#FF4D6A", fontWeight: 700 }}>
              (+{diffPercent}%)
            </span>
          </div>
        </div>

        <p style={{ margin: 0, fontSize: 11, color: "#64748B", lineHeight: 1.5 }}>
          Risk-adjusted metrics assign custom weights to HIGH risk accounts, scaling total liability limits dynamically.
        </p>
      </div>
    </div>
  );
}
