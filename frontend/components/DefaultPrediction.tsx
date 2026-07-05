"use client";

interface Props {
  now: number;
  future: number;
}

export default function DefaultPrediction({ now, future }: Props) {
  const isDeclining = future < now;
  const statusColor = isDeclining ? "#34D399" : future > now ? "#FF4D6A" : "#64748B";

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
        PROBABILITY OF DEFAULT FORECAST
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
            IMMEDIATE PROBABILITY
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#E2E8F0" }}>{now}%</div>
        </div>

        <div>
          <div style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
            FUTURE OUTLOOK (90-DAY)
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: statusColor }}>{future}%</div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          color: "#94A3B8",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid #111C2E",
          borderRadius: 8,
          padding: "8px 12px",
        }}
      >
        <span>🛡️</span>
        <span>
          Liquidity risk is forecasted to{" "}
          <strong style={{ color: statusColor }}>
            {isDeclining ? "DECREASE" : future > now ? "INCREASE" : "REMAIN STABLE"}
          </strong>.
        </span>
      </div>
    </div>
  );
}
