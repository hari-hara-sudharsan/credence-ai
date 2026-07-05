import TrustIndicator from "./ui/TrustIndicator";

interface Props {
  analysis: any;
  onNext: () => void;
}

export default function CreditDecisionStep({ analysis, onNext }: Props) {
  // Mock credit profile based on analysis results
  const score = 742;
  const rating = "PRIME";
  const riskLevel = "LOW RISK";

  const strengths = [
    "Strong repayment history across multiple protocols",
    "Consistent wallet activity over 12+ months",
    "Healthy collateral-to-debt ratio"
  ];

  const weaknesses = [
    "Relatively low total balance size"
  ];

  return (
    <div style={{ padding: "10px 0" }}>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: "#E2E8F0", marginBottom: 16 }}>
        Your Wallet Trust Profile
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr",
          gap: 24,
          marginBottom: 24,
        }}
      >
        {/* Score display */}
        <div
          style={{
            background: "#0A1425",
            border: "1px solid #111C2E",
            borderRadius: 12,
            padding: 24,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TrustIndicator score={score} />
          <div style={{ fontSize: 11, fontWeight: 700, color: "#34D399", marginTop: 12 }}>
            {rating} • {riskLevel}
          </div>
          <div style={{ fontSize: 10, color: "#64748B", marginTop: 4 }}>
            Eligible for better capital efficiency
          </div>
        </div>


        {/* Breakdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#34D399", marginBottom: 6 }}>
              STRENGTHS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {strengths.map((str, i) => (
                <div key={i} style={{ fontSize: 12, color: "#94A3B8" }}>
                  ✓ {str}
                </div>
              ))}
            </div>
          </div>

          {weaknesses.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#FF4D6A", marginBottom: 6 }}>
                WEAKNESSES
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {weaknesses.map((w, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#94A3B8" }}>
                    ⚠ {w}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          background: "rgba(52, 211, 153, 0.03)",
          border: "1px solid rgba(52, 211, 153, 0.1)",
          borderRadius: 8,
          padding: 16,
          fontSize: 12,
          color: "#94A3B8",
          lineHeight: 1.5,
          marginBottom: 24,
        }}
      >
        <strong>AI Underwriter Note:</strong> Wallet exhibits exceptional creditworthiness with a 100% repayment ratio on historical loans. Risk level is mitigated by consistent transaction patterns over multiple months. Recommended for under-collateralized borrowing terms.
      </div>

      <button
        onClick={onNext}
        style={{
          width: "100%",
          background: "#34D399",
          border: "none",
          borderRadius: 8,
          color: "#040C1A",
          fontWeight: 800,
          fontSize: 13,
          padding: "12px 0",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        CONTINUE TO LOAN OFFER ➔
      </button>
    </div>
  );
}
