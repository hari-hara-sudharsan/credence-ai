"use client";

export default function ProtocolMonitor() {
  const monitors = [
    { target: "Aave Money Markets", status: "STABLE", color: "#34D399" },
    { target: "Compound Lending Pools", status: "STABLE", color: "#34D399" },
    { target: "HashKey Liquidity Pools", status: "MONITOR", color: "#FFB830" }
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
          color: "#4A6080",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        ADAPTER MONITOR STATUS
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {monitors.map((mon, i) => (
          <div
            key={i}
            style={{
              background: "#050B14",
              border: "1px solid #111C2E",
              borderRadius: 8,
              padding: "10px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <span style={{ color: "#E2E8F0" }}>{mon.target}</span>
            <span style={{ color: mon.color, fontWeight: 700, fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>
              ● {mon.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
