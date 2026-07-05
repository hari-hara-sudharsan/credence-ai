"use client";

interface LenderMatchItem {
  lender_id: string;
  borrower: string;
  compatibility_score: number;
  expected_risk: string;
  suggested_terms: {
    max_ltv: number;
    interest_rate_apy: number;
  };
}

interface Props {
  matches: LenderMatchItem[];
}

export default function LenderExplorer({ matches }: Props) {
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
          fontSize: 10,
          fontWeight: 800,
          color: "#FFB830",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        LENDER POOLS MATCH MAKER
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>
                {m.lender_id === "pool_aave_stable" ? "Aave Stable pool" : "HashKey Alpha Liquidity"}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#34D399",
                  background: "rgba(52, 211, 153, 0.05)",
                  border: "1px solid #34D399",
                  borderRadius: 4,
                  padding: "2px 6px",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {m.compatibility_score}% COMPATIBLE
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, fontSize: 12 }}>
              <div>
                <span style={{ fontSize: 9, color: "#64748B", display: "block" }}>EXPECTED RISK</span>
                <span style={{ fontWeight: 700, color: getRiskColor(m.expected_risk) }}>
                  {m.expected_risk}
                </span>
              </div>
              <div>
                <span style={{ fontSize: 9, color: "#64748B", display: "block" }}>MAX LTV LIMIT</span>
                <span style={{ fontWeight: 700, color: "#E2E8F0" }}>{m.suggested_terms.max_ltv}%</span>
              </div>
              <div>
                <span style={{ fontSize: 9, color: "#64748B", display: "block" }}>SUGGESTED APY</span>
                <span style={{ fontWeight: 700, color: "#00E5FF", fontFamily: "JetBrains Mono, monospace" }}>
                  {m.suggested_terms.interest_rate_apy}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
