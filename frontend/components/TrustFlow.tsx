"use client";

export default function TrustFlow() {
  const steps = [
    { title: "Wallet Connection", desc: "User connects account address." },
    { title: "AI Credit Underwriting", desc: "CreditEngine parses reputation." },
    { title: "Oracle Attestation", desc: "Seals verifiable credentials." },
    { title: "Loan Execution", desc: "Lending pool capital allocation." }
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #0A1425 0%, #050B14 100%)",
        border: "1px solid #111C2E",
        borderRadius: 16,
        padding: "32px 24px",
        position: "relative",
        overflow: "hidden",
        marginTop: 40,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
      }}
    >
      {steps.map((s, idx) => (
        <div key={idx} style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <div style={{ flex: 1, textAlign: "left", padding: "0 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: "1.5px solid #34D399",
                  color: "#34D399",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 800,
                  fontFamily: "JetBrains Mono, monospace"
                }}
              >
                {idx + 1}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{s.title}</span>
            </div>
            <p style={{ fontSize: 11, color: "#64748B", margin: 0, lineHeight: 1.4 }}>
              {s.desc}
            </p>
          </div>

          {idx < steps.length - 1 && (
            <span
              style={{
                fontSize: 14,
                color: "#1D2E49",
                fontWeight: 800,
                padding: "0 8px"
              }}
            >
              ➔
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
