"use client";

interface IncidentItem {
  time: string;
  event: string;
}

interface Props {
  history: IncidentItem[];
}

export default function IncidentTimeline({ history }: Props) {
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
          fontSize: 11,
          fontWeight: 700,
          color: "#FFB830",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        INCIDENT RESOLUTION LOGS
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {history.map((h, i) => (
          <div
            key={i}
            style={{
              background: "#050B14",
              border: "1px solid #111C2E",
              borderRadius: 8,
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 13, color: "#E2E8F0" }}>{h.event}</span>
            <span style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
              {new Date(h.time).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
