"use client";

interface Props {
  activeOracles: number;
  pendingPolicies: number;
  activePassports: number;
  revokedPassports: number;
  auditEvents: number;
  status: string;
}

export default function GovernanceDashboard({
  activeOracles,
  pendingPolicies,
  activePassports,
  revokedPassports,
  auditEvents,
  status
}: Props) {
  const cards = [
    { label: "SYSTEM STATUS", value: status, color: "#34D399" },
    { label: "ACTIVE ORACLES", value: activeOracles, color: "#E2E8F0" },
    { label: "ACTIVE PASSPORTS", value: activePassports, color: "#00E5FF" },
    { label: "REVOKED PASSPORTS", value: revokedPassports, color: "#FF4D6A" },
    { label: "AUDIT EVENTS (TODAY)", value: auditEvents, color: "#FFB830" }
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
      {cards.map((c, i) => (
        <div
          key={i}
          style={{
            background: "#0A1425",
            border: "1px solid #111C2E",
            borderRadius: 14,
            padding: 20,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>
            {c.label}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: c.color }}>{c.value}</div>
        </div>
      ))}
    </div>
  );
}
