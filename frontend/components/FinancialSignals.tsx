"use client";

interface Signal {
  signal: string;
  impact: string; // "POSITIVE" | "NEGATIVE" | "NEUTRAL"
  severity: string; // "HIGH" | "MEDIUM" | "LOW"
  description: string;
}


interface Props {
  signals: any[];
}

export default function FinancialSignals({ signals }: Props) {
  const getImpactColor = (impact: string) => {
    if (impact === "POSITIVE") return "#34D399";
    if (impact === "NEGATIVE") return "#FF4D6A";
    return "#94A3B8";
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
        DETECTED RISK SIGNAL INDEX
      </div>

      {signals.length === 0 ? (
        <div style={{ color: "#64748B", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
          No active financial risk signals detected for this profile.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {signals.map((sig, i) => (
            <div
              key={i}
              style={{
                background: "#050B14",
                borderLeft: `3px solid ${getImpactColor(sig.impact)}`,
                borderTop: "1px solid #111C2E",
                borderRight: "1px solid #111C2E",
                borderBottom: "1px solid #111C2E",
                borderRadius: "0 8px 8px 0",
                padding: "12px 16px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{sig.signal}</span>
                
                <span
                  style={{
                    background: `${getImpactColor(sig.impact)}1A`,
                    border: `1px solid ${getImpactColor(sig.impact)}`,
                    color: getImpactColor(sig.impact),
                    fontSize: 8,
                    fontWeight: 800,
                    padding: "2px 6px",
                    borderRadius: 4,
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {sig.impact} • {sig.severity}
                </span>
              </div>
              <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.4 }}>{sig.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
