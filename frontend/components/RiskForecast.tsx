"use client";

interface Props {
  currentRisk: string;
  predictedRisk: string;
  confidence: number;
}

export default function RiskForecast({ currentRisk, predictedRisk, confidence }: Props) {
  const getRiskColor = (risk: string) => {
    if (risk === "LOW") return "#34D399";
    if (risk === "MEDIUM") return "#FFB830";
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
        AI RISK OUTLOOK
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
            CURRENT RISK LEVEL
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: getRiskColor(currentRisk) }}>
            {currentRisk}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
            FORECASTED RISK LEVEL
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: getRiskColor(predictedRisk) }}>
            {predictedRisk}
          </div>
        </div>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94A3B8", marginBottom: 8 }}>
          <span>Prediction Confidence</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#00E5FF", fontWeight: 700 }}>
            {confidence}%
          </span>
        </div>
        <div style={{ width: "100%", height: 6, background: "#050B14", borderRadius: 3, overflow: "hidden" }}>
          <div
            style={{
              width: `${confidence}%`,
              height: "100%",
              background: "linear-gradient(90deg, #00E5FF, #34D399)",
              borderRadius: 3,
              boxShadow: "0 0 8px rgba(0, 229, 255, 0.4)",
              transition: "width 0.8s ease-out",
            }}
          />
        </div>
      </div>
    </div>
  );
}
