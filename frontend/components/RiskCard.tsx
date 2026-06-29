"use client";

export default function RiskCard({ probability }: { probability: number }) {
  const severity =
    probability >= 30 ? "HIGH" : probability >= 15 ? "MEDIUM" : "LOW";
  const color =
    probability >= 30 ? "#FF4D6A" : probability >= 15 ? "#FFB830" : "#34D399";

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />

      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#4A6080",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 24,
        }}
      >
        DEFAULT PROBABILITY
      </div>

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color,
            fontFamily: "Inter, sans-serif",
            letterSpacing: -3,
            lineHeight: 1,
            filter: `drop-shadow(0 0 12px ${color}44)`,
          }}
        >
          {probability}%
        </div>

        <div
          style={{
            marginTop: 16,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: `${color}14`,
            border: `1px solid ${color}33`,
            borderRadius: 6,
            padding: "4px 12px",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 6px ${color}`,
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color,
              letterSpacing: 1.2,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {severity} RISK
          </span>
        </div>
      </div>

      {/* Bar */}
      <div style={{ marginTop: 24 }}>
        <div
          style={{
            height: 6,
            background: "#1A2740",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min(probability, 100)}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${color}88, ${color})`,
              borderRadius: 3,
              transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: `0 0 8px ${color}44`,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 6,
            fontSize: 10,
            color: "#4A6080",
            fontWeight: 600,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}