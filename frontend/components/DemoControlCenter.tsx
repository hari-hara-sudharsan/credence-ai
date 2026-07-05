"use client";

interface Scenario {
  scenario_id: string;
  name: string;
  description: string;
}

interface Props {
  scenarios: Scenario[];
  activeScenario: string | null;
  onSelect: (scenarioId: string) => void;
  onRun: () => void;
  loading: boolean;
}

export default function DemoControlCenter({
  scenarios,
  activeScenario,
  onSelect,
  onRun,
  loading
}: Props) {
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
          color: "#34D399",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 20,
        }}
      >
        SELECT SCENARIO
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {scenarios.map((s) => {
          const isSelected = activeScenario === s.scenario_id;
          return (
            <div
              key={s.scenario_id}
              onClick={() => !loading && onSelect(s.scenario_id)}
              style={{
                background: isSelected ? "rgba(52, 211, 153, 0.05)" : "#050B14",
                border: `1px solid ${isSelected ? "#34D399" : "#1D2E49"}`,
                borderRadius: 10,
                padding: 20,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: isSelected ? "#34D399" : "#E2E8F0", marginBottom: 8 }}>
                {s.name}
              </div>
              <p style={{ fontSize: 11, color: "#64748B", margin: 0, lineHeight: 1.4 }}>{s.description}</p>
            </div>
          );
        })}
      </div>

      <button
        onClick={onRun}
        disabled={loading || !activeScenario}
        style={{
          width: "100%",
          background: activeScenario ? "#34D399" : "#1D2E49",
          border: "none",
          borderRadius: 8,
          color: "#040C1A",
          fontWeight: 850,
          fontSize: 14,
          padding: "12px 0",
          cursor: loading || !activeScenario ? "not-allowed" : "pointer",
          textAlign: "center",
          transition: "background 0.2s ease",
        }}
      >
        {loading ? "EXECUTING END-TO-END FLOW..." : "RUN CHOSEN JOURNEY"}
      </button>
    </div>
  );
}
