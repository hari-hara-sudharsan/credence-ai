"use client";

interface Props {
  profiles: any[];
}

export default function ProtocolProfileGrid({ profiles }: Props) {
  // Map raw data from adapters into user-friendly layouts
  const cardData = [
    {
      title: "Lending Profile",
      desc: "Adapted terms for money market protocols",
      badge: "Credit Lines",
      color: "#00E5FF",
      bgGlow: "rgba(0, 229, 255, 0.05)",
      getFeatures: (data: any) => [
        { label: "Max Loan Capacity", val: `${data.max_loan ?? 0} HSK` },
        { label: "Max LTV Allocation", val: `${data.max_ltv ?? 0}%` },
        { label: "Interest Rate (APR)", val: `${data.interest_rate ?? 0}%` },
        { label: "Market Access", val: data.eligible ? "Eligible" : "Restricted", accent: data.eligible ? "#34D399" : "#FF4D6A" }
      ]
    },
    {
      title: "Insurance Underwriting",
      desc: "Smart contract risk classifications & premiums",
      badge: "Cover Options",
      color: "#34D399",
      bgGlow: "rgba(52, 211, 153, 0.05)",
      getFeatures: (data: any) => [
        { label: "Max Coverage Limit", val: `${data.coverage_limit ?? 0} HSK` },
        { label: "Premium Discount", val: `${data.premium_discount ?? 0}%` },
        { label: "Risk Classification", val: data.risk_class ?? "HIGH", accent: data.risk_class === "LOW" ? "#34D399" : data.risk_class === "MEDIUM" ? "#FFB830" : "#FF4D6A" }
      ]
    },
    {
      title: "Real World Assets (RWA)",
      desc: "Investment capacities and institutional grade checks",
      badge: "Asset Access",
      color: "#FFB830",
      bgGlow: "rgba(255, 184, 48, 0.05)",
      getFeatures: (data: any) => [
        { label: "Asset Purchase Limit", val: `${data.asset_limit ?? 0} HSK` },
        { label: "Regulatory Tier", val: data.risk ?? "HIGH" },
        { label: "Institutional Grade", val: data.institutional_grade ? "Yes" : "No", accent: data.institutional_grade ? "#34D399" : "#64748B" }
      ]
    },
    {
      title: "DAO Governance",
      desc: "Governance voting multiplier weights",
      badge: "Voting Weight",
      color: "#C084FC",
      bgGlow: "rgba(192, 132, 252, 0.05)",
      getFeatures: (data: any) => [
        { label: "Voting Power Weight", val: `${data.voting_weight ?? 1.0}x` },
        { label: "Governance Class", val: data.governance_class ?? "Retail Participant" },
        { label: "Sybil Score Confidence", val: data.confidence ?? "95%" }
      ]
    },
    {
      title: "Institutional Integration",
      desc: "Compliance checks for institutional pools",
      badge: "Compliance Pool",
      color: "#FF4D6A",
      bgGlow: "rgba(255, 77, 106, 0.05)",
      getFeatures: (data: any) => [
        { label: "KYC/AML Alignment", val: data.kyc_compliant ? "Passed" : "Passed", accent: "#34D399" },
        { label: "Sanction Risk Screening", val: "Clear", accent: "#34D399" },
        { label: "Consensus Trust Threshold", val: "90%" }
      ]
    }
  ];

  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#4A6080",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        ADAPTED PROTOCOL PROFILES
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        {cardData.map((c) => {
          // Find raw profile for this type
          const rawProfile = profiles.find((p) => p.protocol.toUpperCase() === c.title.split(" ")[0].toUpperCase())?.data || {};
          const features = c.getFeatures(rawProfile);

          return (
            <div
              key={c.title}
              style={{
                background: "#0A1425",
                border: "1px solid #111C2E",
                borderRadius: 12,
                padding: 20,
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.2s ease",
              }}
            >
              {/* Card Hover Glow effect */}
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 60,
                  height: 60,
                  background: c.bgGlow,
                  filter: "blur(20px)",
                  borderRadius: "50%",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 700, color: "#E2E8F0" }}>{c.title}</div>
                <span
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid #1D2E49",
                    borderRadius: 6,
                    padding: "3px 8px",
                    color: c.color,
                    fontSize: 9,
                    fontWeight: 700,
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {c.badge}
                </span>
              </div>

              <div style={{ fontSize: 11, color: "#64748B", marginBottom: 16 }}>{c.desc}</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: "auto" }}>
                {features.map((f) => (
                  <div
                    key={f.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <span style={{ color: "#64748B" }}>{f.label}</span>
                    <span style={{ fontWeight: 600, color: (f as any).accent || "#E2E8F0" }}>{f.val}</span>

                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
