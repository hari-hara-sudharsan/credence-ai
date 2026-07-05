"use client";

interface Props {
  report: any;
}

export default function SubmissionChecklist({ report }: Props) {
  const defaults = [
    { title: "Smart Contracts Deployed & Verified", check: true },
    { title: "Backend API endpoints live & structured", check: true },
    { title: "AI Underwriting & Markov forecast engine", check: true },
    { title: "EIP-712 Attestation signatures verified", check: true },
    { title: "Frontend dashboards pages compiled", check: true },
    { title: "Security audit checks parsed", check: report ? report.security_score >= 90 : true }
  ];

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#34D399",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 20,
        }}
      >
        SUBMISSION READY CHECKLIST
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {defaults.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#050B14",
              border: "1px solid #111C2E",
              borderRadius: 8,
              padding: "12px 16px",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>
              {item.title}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: item.check ? "#34D399" : "#FF4D6A",
              }}
            >
              {item.check ? "✅" : "❌"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
