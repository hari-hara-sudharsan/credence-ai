"use client";

interface Props {
  verifiedAt: string;
}

export default function VerificationTimeline({ verifiedAt }: Props) {
  const steps = [
    {
      title: "Passport Issued",
      desc: "Immutable wallet credential registered on-chain",
      time: "Verified",
      status: "DONE",
    },
    {
      title: "Oracle Verified",
      desc: "Underwriting signatures recovered and validated by smart contract",
      time: "Verified",
      status: "DONE",
    },
    {
      title: "Trust Updated",
      desc: "Trust metrics evaluated by the UCVN node",
      time: "Verified",
      status: "DONE",
    },
    {
      title: "Verification Completed",
      desc: "Verification hash recorded on-chain in UCVN registry",
      time: new Date(verifiedAt).toLocaleTimeString(),
      status: "DONE",
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
        UCVN VERIFICATION WORKFLOW
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {steps.map((s, index) => (
          <div key={s.title} style={{ display: "flex", gap: 16 }}>
            {/* Timeline Dot and line column */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#00E5FF",
                  border: "2px solid rgba(0, 229, 255, 0.2)",
                  zIndex: 2,
                }}
              />
              {index < steps.length - 1 && (
                <div
                  style={{
                    width: 2,
                    flex: 1,
                    background: "linear-gradient(#00E5FF, #1D2E49)",
                    marginTop: 4,
                    marginBottom: -10,
                  }}
                />
              )}
            </div>

            {/* Timeline content column */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{s.title}</div>
                <div style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                  {s.time}
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.4 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
