"use client";

interface Props {
  avgLatency: string;
  totalRequests: number;
}

export default function APIMetrics({ avgLatency, totalRequests }: Props) {
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
        API TRANSACTION METRICS
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <span style={{ fontSize: 11, color: "#64748B" }}>AVERAGE LATENCY</span>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#E2E8F0" }}>{avgLatency}</div>
        </div>

        <div>
          <span style={{ fontSize: 11, color: "#64748B" }}>TOTAL TELEMETRY pings</span>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#34D399" }}>{totalRequests}</div>
        </div>
      </div>
    </div>
  );
}
