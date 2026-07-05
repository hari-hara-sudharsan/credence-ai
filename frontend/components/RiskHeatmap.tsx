"use client";

interface Props {
  riskData: any;
}

export default function RiskHeatmap({ riskData }: Props) {
  const getRiskColor = (level: string) => {
    if (level === "LOW") return "#34D399";
    if (level === "MEDIUM") return "#FFB830";
    return "#FF4D6A";
  };

  const riskBlocks = [
    { title: "Protocol Risk Exposure", status: riskData.systemic_risk, detail: "Low counterparty insolvency events" },
    { title: "Wallet Collateral Risk", status: riskData.risk_score < 30 ? "LOW" : "MEDIUM", detail: "Leverage concentrations limits" },
    { title: "Liquidity Capacity Stresses", status: "LOW", detail: "Funding pools reserve coverage checks" },
    { title: "Systemic Default Risk", status: riskData.default_probability > 30.0 ? "HIGH" : "MEDIUM", detail: `${riskData.default_probability}% defaulted events index` }
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
        SYSTEMIC RISK HEATMAP GRID
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {riskBlocks.map((block, i) => (
          <div
            key={i}
            style={{
              background: "#050B14",
              border: "1px solid #111C2E",
              borderRadius: 10,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0", marginBottom: 4 }}>
                {block.title}
              </div>
              <div style={{ fontSize: 10, color: "#64748B" }}>{block.detail}</div>
            </div>

            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: getRiskColor(block.status),
                marginTop: 12,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              ● {block.status} RISK
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
