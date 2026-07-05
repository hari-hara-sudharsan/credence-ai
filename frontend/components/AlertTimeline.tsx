"use client";

export default function AlertTimeline() {
  const steps = [
    { label: "Wallet State Change", desc: "Live on-chain transaction velocity drops or leverage increases." },
    { label: "Monitoring Engine Detects", desc: "Snapshot comparison tracks credit drops or risk spikes." },
    { label: "Alert Engine Creates Alert", desc: "Saves record and triggers Server Sent Events stream push." },
    { label: "AI Agent Explanation", desc: "Formulates explainable recommendation decision traces." },
    { label: "Dashboard Updates", desc: "Displays warning states on client screen interface." }
  ];

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
          color: "#00E5FF",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 20,
        }}
      >
        MONITORING PIPELINE ARCHITECTURE
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {steps.map((st, i) => (
          <div key={i} style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#00E5FF1A",
                  border: "2px solid #00E5FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#00E5FF",
                }}
              >
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 2, flex: 1, background: "#111C2E", margin: "4px 0" }} />
              )}
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{st.label}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{st.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
