"use client";

interface Props {
  status: string;
  oracle: string;
  contracts: string;
  uptime: number;
}

export default function SystemHealth({ status, oracle, contracts, uptime }: Props) {
  const getStatusColor = (val: string) => {
    if (val === "HEALTHY" || val === "VERIFIED") return "#34D399";
    if (val === "DEGRADED") return "#FFB830";
    return "#FF4D6A";
  };

  const services = [
    { name: "Backend APIs", status: status, color: getStatusColor(status) },
    { name: "Oracle Operator Nodes", status: oracle, color: getStatusColor(oracle) },
    { name: "Smart Contract Registry", status: contracts, color: getStatusColor(contracts) },
    { name: "Database Persistence", status: "HEALTHY", color: "#34D399" },
    { name: "AI Underwriting Agents", status: "HEALTHY", color: "#34D399" }
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#34D399",
            letterSpacing: 2,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          INFRASTRUCTURE HEALTH SERVICES status
        </div>
        <span style={{ fontSize: 11, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
          Uptime: {uptime}%
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {services.map((s, i) => (
          <div
            key={i}
            style={{
              background: "#050B14",
              border: "1px solid #111C2E",
              borderRadius: 8,
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 13, color: "#E2E8F0" }}>{s.name}</span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: s.color,
                background: `${s.color}1A`,
                border: `1px solid ${s.color}`,
                borderRadius: 4,
                padding: "2px 6px",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
