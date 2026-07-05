"use client";

interface Props {
  currentScore: number;
  targetScore: number;
  progressPercent: number;
}

export default function OptimizationScore({ currentScore, targetScore, progressPercent }: Props) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
        border: "1px solid #1D2E49",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 12px 40px rgba(0, 229, 255, 0.03)",
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr",
        gap: 24,
        alignItems: "center",
      }}
    >
      <div>
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
          CREDIT OPTIMIZATION INDEX
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                CURRENT SCORE
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#E2E8F0" }}>{currentScore}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                TARGET LIMIT
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#34D399" }}>{targetScore}</div>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748B", marginBottom: 6 }}>
              <span>Progress to Institutional Grade</span>
              <span style={{ fontWeight: 700, color: "#00E5FF" }}>{progressPercent}%</span>
            </div>
            <div style={{ width: "100%", height: 6, background: "#050B14", borderRadius: 3, overflow: "hidden" }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #00E5FF 0%, #34D399 100%)",
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(0, 229, 255, 0.02)",
            border: "3px dashed #00E5FF",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(0, 229, 255, 0.05)",
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 800, color: "#00E5FF" }}>{progressPercent}%</div>
          <div style={{ fontSize: 8, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginTop: 4 }}>
            READY STATE
          </div>
        </div>
      </div>
    </div>
  );
}
