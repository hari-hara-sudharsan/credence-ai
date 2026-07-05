"use client";

interface Props {
  currentScore: number;
  prevScore: number;
}

export default function CreditMonitor({ currentScore, prevScore }: Props) {
  const diff = currentScore - prevScore;
  const isDrop = diff < 0;
  const statusColor = isDrop ? "#FF4D6A" : diff > 0 ? "#34D399" : "#64748B";

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
          color: "#4A6080",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        ACTIVE CREDIT MONITOR
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 2 }}>
            CREDIT SCORE
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#E2E8F0" }}>{currentScore}</div>
        </div>

        <div>
          <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 2 }}>
            PREVIOUS / CHANGE
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: statusColor }}>
            {prevScore} ({isDrop ? "" : "+"}{diff})
          </div>
        </div>
      </div>
    </div>
  );
}
