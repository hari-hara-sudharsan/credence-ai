"use client";

interface Props {
  failedSignatures: number;
}

export default function SecurityMonitor({ failedSignatures }: Props) {
  const cards = [
    { label: "BLOCKED REQUESTS", value: 12, color: "#34D399" },
    { label: "FAILED SIGNATURES", value: failedSignatures, color: failedSignatures > 0 ? "#FF4D6A" : "#34D399" },
    { label: "DETECTED RISKS", value: 1, color: "#FFB830" },
    { label: "RESOLVED THREATS", value: 13, color: "#34D399" }
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
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
