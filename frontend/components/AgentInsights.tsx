"use client";

interface Insight {
  type: string; // "IMPROVEMENT" | "ALERT" | "OPPORTUNITY"

  title: string;
  description: string;
  severity: string;
}

interface Props {
  insights: any[];
}

export default function AgentInsights({ insights }: Props) {
  const getInsightColor = (type: string) => {
    if (type === "OPPORTUNITY") return "#00E5FF";
    if (type === "ALERT") return "#FF4D6A";
    return "#FFB830";
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
        PERSONALIZED INSIGHTS
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {insights.map((ins, idx) => (
          <div
            key={idx}
            style={{
              background: "#050B14",
              borderLeft: `3px solid ${getInsightColor(ins.type)}`,
              borderRadius: "0 8px 8px 0",
              padding: "12px 16px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{ins.title}</span>
              <span
                style={{
                  background: `${getInsightColor(ins.type)}1A`,
                  border: `1px solid ${getInsightColor(ins.type)}`,
                  color: getInsightColor(ins.type),
                  fontSize: 8,
                  fontWeight: 800,
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {ins.type}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: "#64748B", lineHeight: 1.4 }}>{ins.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
