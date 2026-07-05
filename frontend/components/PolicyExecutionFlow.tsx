"use client";

interface Props {
  passed: boolean;
}

export default function PolicyExecutionFlow({ passed }: Props) {
  const nodes = [
    { title: "Wallet", subtitle: "Ingest target address features", icon: "🌐" },
    { title: "Verification", subtitle: "Verify on-chain registry", icon: "🔐" },
    { title: "Credit Engine", subtitle: "Extract credit scores", icon: "📊" },
    { title: "Policy Engine", subtitle: "Parse rules & bounds", icon: "⚙️" },
    {
      title: "Decision",
      subtitle: passed ? "Approved: Compliance matches" : "Rejected: Criteria mismatch",
      icon: passed ? "🟢" : "🔴",
      accent: passed ? "#34D399" : "#FF4D6A",
    },
  ];

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#4A6080",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 24,
        }}
      >
        POLICY EXECUTION WORKFLOW
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {nodes.map((n, idx) => (
          <div key={n.title} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Step Icon */}
            <div
              style={{
                width: 36,
                height: 36,
                background: "rgba(255, 255, 255, 0.02)",
                border: `1px solid ${n.accent || "#1D2E49"}`,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 16,
                zIndex: 2,
              }}
            >
              {n.icon}
            </div>

            {/* Step Label Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: n.accent || "#E2E8F0" }}>{n.title}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{n.subtitle}</div>
            </div>

            {/* Arrow indicators if not last */}
            {idx < nodes.length - 1 && (
              <div
                style={{
                  fontSize: 14,
                  color: "#4A6080",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                ↓
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
