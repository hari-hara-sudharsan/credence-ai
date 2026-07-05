"use client";

interface ActionItem {
  action_id: string;
  title: string;
  description: string;
  difficulty: string;
  expected_score_gain: number;
  estimated_time_days: number;
  priority: number;
}

interface Props {
  actions: ActionItem[];
}

export default function ImprovementPlan({ actions }: Props) {
  const getDifficultyColor = (diff: string) => {
    if (diff === "EASY") return "#34D399";
    if (diff === "MEDIUM") return "#FFB830";
    return "#FF4D6A";
  };

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
        OPTIMIZATION STRATEGY ROADMAP
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {actions.map((act, i) => (
          <div
            key={act.action_id}
            style={{
              background: "#050B14",
              border: "1px solid #111C2E",
              borderRadius: 10,
              padding: "16px 20px",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 16,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 6 }}>
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 800,
                    color: getDifficultyColor(act.difficulty),
                    background: `${getDifficultyColor(act.difficulty)}1A`,
                    border: `1px solid ${getDifficultyColor(act.difficulty)}`,
                    borderRadius: 4,
                    padding: "2px 6px",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {act.difficulty}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{act.title}</span>
              </div>
              <p style={{ margin: 0, fontSize: 11, color: "#64748B", lineHeight: 1.4 }}>{act.description}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#00E5FF", fontFamily: "JetBrains Mono, monospace" }}>
                +{act.expected_score_gain}
              </span>
              <span style={{ fontSize: 9, color: "#4A6080", fontFamily: "JetBrains Mono, monospace" }}>
                Est: {act.estimated_time_days} days
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
