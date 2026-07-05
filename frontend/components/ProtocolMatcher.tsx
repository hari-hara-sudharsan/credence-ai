"use client";

interface ProtocolMatchItem {
  protocol: string;
  wallet: string;
  eligibility: number;
  reason: string;
}

interface Props {
  matches: ProtocolMatchItem[];
}

export default function ProtocolMatcher({ matches }: Props) {
  const getEligibilityColor = (pct: number) => {
    if (pct >= 80) return "#34D399";
    if (pct >= 50) return "#FFB830";
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
          fontSize: 10,
          fontWeight: 800,
          color: "#34D399",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        ADAPTER MATCH ELIGIBILITY
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {matches.map((m, i) => (
          <div
            key={i}
            style={{
              background: "#050B14",
              border: "1px solid #111C2E",
              borderRadius: 8,
              padding: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{m.protocol}</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: getEligibilityColor(m.eligibility),
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {m.eligibility}% ELIGIBLE
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: "#64748B", lineHeight: 1.4 }}>
              <strong>Status check:</strong> {m.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
