"use client";

interface Props {
  currentScore: number;
  predictedScore: number;
  trajectory: string;
}

export default function RiskTimeline({ currentScore, predictedScore, trajectory }: Props) {
  const diff = predictedScore - currentScore;

  const points = [
    {
      title: "Today",
      desc: `Credit Score stands at baseline of ${currentScore}`,
      time: "Current State",
      status: "DONE",
    },
    {
      title: "30-Day Outlook",
      desc: `Forecasted trajectory index is ${trajectory} (${diff >= 0 ? `+${diff}` : diff})`,
      time: "Prediction Frame",
      status: "PENDING",
    },
    {
      title: "90-Day Outlook",
      desc: `Extrapolated credit rating stability is projected at ${predictedScore + (diff > 0 ? 10 : diff < 0 ? -10 : 0)}`,
      time: "Projection Frame",
      status: "PENDING",
    },
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
          fontSize: 11,
          fontWeight: 700,
          color: "#4A6080",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 20,
        }}
      >
        INTELLIGENCE RISK TIMELINE
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {points.map((p, index) => (
          <div key={p.title} style={{ display: "flex", gap: 16 }}>
            {/* Dot & line column */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: p.status === "DONE" ? "#34D399" : "#00E5FF",
                  border: `2px solid ${p.status === "DONE" ? "rgba(52, 211, 153, 0.2)" : "rgba(0, 229, 255, 0.2)"}`,
                  zIndex: 2,
                }}
              />
              {index < points.length - 1 && (
                <div
                  style={{
                    width: 2,
                    flex: 1,
                    background: "linear-gradient(#00E5FF, #1D2E49)",
                    marginTop: 4,
                    marginBottom: -10,
                  }}
                />
              )}
            </div>

            {/* Content column */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{p.title}</div>
                <div style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                  {p.time}
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.4 }}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
