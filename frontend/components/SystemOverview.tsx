"use client";

export default function SystemOverview() {
  const sections = [
    { title: "Credit Identity Generation", desc: "Aggregates wallet history, token balances, transaction velocities, and logs." },
    { title: "Oracle Signature Network", desc: "Coordinates EIP-712 structured credential signature attestations off-chain." },
    { title: "Smart Contract Registry", desc: "Locks verification states and maps dynamic passport metadata Cancun." },
    { title: "Protocol Integrations", desc: "Adapts core credit profiles to specific money markets borrow parameters." },
    { title: "Dashboard Command Center", desc: "Permits institutions to run stress tests, monitor risk segments, and configure policies." }
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
        SYSTEM OVERVIEW LAYERS
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {sections.map((s, idx) => (
          <div key={idx} style={{ display: "flex", gap: 16 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "rgba(52, 211, 153, 0.1)",
                border: "1px solid #34D399",
                color: "#34D399",
                fontSize: 11,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {idx + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0", marginBottom: 4 }}>
                {s.title}
              </div>
              <p style={{ fontSize: 11, color: "#64748B", margin: 0, lineHeight: 1.4 }}>
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
