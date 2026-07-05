"use client";

interface Props {
  issuedAt: string;
  oracleVerified: boolean;
}

export default function TrustTimeline({ issuedAt, oracleVerified }: Props) {
  const steps = [
    {
      title: "Passport Issued",
      desc: "Financial Identity Credential V2 minted on-chain",
      date: new Date(issuedAt).toLocaleDateString(),
      status: "COMPLETED",
    },
    {
      title: "Credit Updated",
      desc: "Wallet score successfully processed by CreditEngine",
      date: "Real-time sync",
      status: "COMPLETED",
    },
    {
      title: "Reputation Sync",
      desc: "Reputation score synchronized by TrustEngine",
      date: "Active",
      status: "COMPLETED",
    },
    {
      title: "Oracle Verified",
      desc: "Attestation hash signed by authorized oracle key",
      date: oracleVerified ? "Verified" : "Pending",
      status: oracleVerified ? "COMPLETED" : "PENDING",
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
          marginBottom: 20,
        }}
      >
        TRUST VERIFICATION TIMELINE
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {steps.map((s, index) => {
          const isDone = s.status === "COMPLETED";

          return (
            <div key={s.title} style={{ display: "flex", gap: 16 }}>
              {/* Dot and Line Column */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: isDone ? "#00E5FF" : "#1D2E49",
                    border: `2px solid ${isDone ? "rgba(0, 229, 255, 0.2)" : "#111C2E"}`,
                    zIndex: 2,
                  }}
                />
                {index < steps.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      background: isDone ? "linear-gradient(#00E5FF, #1D2E49)" : "#111C2E",
                      marginTop: 4,
                      marginBottom: -10,
                    }}
                  />
                )}
              </div>

              {/* Content Column */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{s.title}</div>
                  <div style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                    {s.date}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.4 }}>{s.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
