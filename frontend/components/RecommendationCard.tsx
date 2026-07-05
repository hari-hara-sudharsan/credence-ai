"use client";

interface Props {
  goalResult: any;
}

export default function RecommendationCard({ goalResult }: Props) {
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
          fontSize: 10,
          fontWeight: 800,
          color: "#00E5FF",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        GOAL ENGINE OPTIMIZATION STEPS
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <span style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
            CURRENT STATUS
          </span>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#E2E8F0" }}>{goalResult.current_status}</div>
        </div>

        <div>
          <span style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
            EST. DURATION
          </span>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#34D399" }}>{goalResult.estimated_completion}</div>
        </div>
      </div>

      <div>
        <span style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", display: "block", marginBottom: 8 }}>
          REQUIRED ACTIONS LIST
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {goalResult.required_actions.map((act: string, i: number) => (
            <div
              key={i}
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid #111C2E",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 12,
                color: "#94A3B8",
              }}
            >
              🔹 {act}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
