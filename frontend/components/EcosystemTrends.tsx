"use client";

interface Props {
  reportText: string;
}

export default function EcosystemTrends({ reportText }: Props) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
        border: "1px solid #1D2E49",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#00E5FF",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        AI SYSTEMIC CREDIT SUMMARY REPORT
      </div>

      <div style={{ fontSize: 14, color: "#E2E8F0", lineHeight: 1.6, marginBottom: 12 }}>
        {reportText}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          fontSize: 12,
          color: "#64748B",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid #111C2E",
          borderRadius: 8,
          padding: "8px 12px",
          marginTop: 16,
        }}
      >
        <span>💡</span>
        <span>
          Risk signals suggest an overall stable credit volume allocation across all HashKey money markets.
        </span>
      </div>
    </div>
  );
}
