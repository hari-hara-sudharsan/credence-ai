"use client";

import ScoreGauge from "./ScoreGauge";

export default function CreditCard({
  score,
  rating,
}: {
  score: number;
  rating: string;
}) {
  const color =
    score >= 700 ? "#00E5FF" : score >= 500 ? "#FFB830" : "#FF4D6A";

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent line */}
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
          marginBottom: 8,
        }}
      >
        CREDIT PROFILE
      </div>

      <ScoreGauge score={score} />

      <div
        style={{
          marginTop: 4,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: `${color}14`,
          border: `1px solid ${color}44`,
          borderRadius: 99,
          padding: "4px 14px",
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
            fontSize: 12,
            fontWeight: 700,
            color,
            letterSpacing: 1,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {rating}
        </span>
      </div>
    </div>
  );
}