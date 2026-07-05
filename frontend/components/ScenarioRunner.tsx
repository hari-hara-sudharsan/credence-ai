"use client";

interface Props {
  result: any;
}

export default function ScenarioRunner({ result }: Props) {
  if (!result) return null;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
        border: "1px solid #1D2E49",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#34D399",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        JOURNEY EXECUTION OUTCOME
      </div>

      <div style={{ fontSize: 20, fontWeight: 800, color: "#E2E8F0", marginBottom: 12 }}>
        {result.scenario.replace("_", " ")}
      </div>

      <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.5, margin: "0 0 20px" }}>
        {result.result}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#050B14", border: "1px solid #111C2E", borderRadius: 8, padding: 16 }}>
          <span style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>TOTAL DURATION</span>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#34D399", marginTop: 4 }}>
            {result.execution_time}
          </div>
        </div>

        <div style={{ background: "#050B14", border: "1px solid #111C2E", borderRadius: 8, padding: 16 }}>
          <span style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>STEPS EVALUATED</span>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#34D399", marginTop: 4 }}>
            {result.steps_passed} / {result.total_steps}
          </div>
        </div>
      </div>
    </div>
  );
}
