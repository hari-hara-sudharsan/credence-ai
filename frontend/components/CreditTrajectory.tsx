"use client";

interface Props {
  currentScore: number;
  predictedScore: number;
  trajectory: string;
}

export default function CreditTrajectory({ currentScore, predictedScore, trajectory }: Props) {
  const diff = predictedScore - currentScore;
  const isUp = diff > 0;
  const isDown = diff < 0;

  const trajectoryColor = isUp ? "#34D399" : isDown ? "#FF4D6A" : "#64748B";

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
        CREDIT SCORE TRAJECTORY
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: 24, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 2 }}>
            CURRENT SCORE
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#94A3B8" }}>{currentScore}</div>
        </div>

        <div style={{ fontSize: 24, color: "#4A6080", fontWeight: 700 }}>→</div>

        <div>
          <div style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 2 }}>
            PREDICTED SCORE
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#E2E8F0" }}>{predictedScore}</div>
        </div>

        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 2 }}>
            NET FORECAST
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: trajectoryColor }}>
            {diff > 0 ? `+${diff}` : diff}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid #111C2E",
          borderRadius: 8,
          padding: "8px 12px",
        }}
      >
        <span style={{ fontSize: 13 }}>📈</span>
        <span style={{ fontSize: 12, color: "#94A3B8" }}>Trajectory Path:</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: trajectoryColor,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {trajectory}
        </span>
      </div>
    </div>
  );
}
