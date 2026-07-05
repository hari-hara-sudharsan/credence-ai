"use client";

interface Props {
  protocols: any[];
}

export default function ProtocolAnalytics({ protocols }: Props) {
  const getRiskColor = (risk: string) => {
    if (risk === "LOW") return "#34D399";
    if (risk === "MEDIUM") return "#FFB830";
    return "#FF4D6A";
  };

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
          color: "#4A6080",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 20,
        }}
      >
        ADAPTER PERFORMANCE REPORT
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #111C2E", textAlign: "left" }}>
              <th style={{ padding: "10px 8px", fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                PROTOCOL
              </th>
              <th style={{ padding: "10px 8px", fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                ACTIVE USERS
              </th>
              <th style={{ padding: "10px 8px", fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                VOLUME CAPACITY
              </th>
              <th style={{ padding: "10px 8px", fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                AVG CREDIT SCORE
              </th>
              <th style={{ padding: "10px 8px", fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                RISK LEVEL
              </th>
            </tr>
          </thead>
          <tbody>
            {protocols.map((p) => (
              <tr key={p.protocol} style={{ borderBottom: "1px solid #111C2E", fontSize: 13, color: "#E2E8F0" }}>
                <td style={{ padding: "12px 8px", fontWeight: 700 }}>{p.protocol}</td>
                <td style={{ padding: "12px 8px" }}>{p.users}</td>
                <td style={{ padding: "12px 8px", fontFamily: "JetBrains Mono, monospace", color: "#00E5FF" }}>
                  ${p.volume.toLocaleString()}
                </td>
                <td style={{ padding: "12px 8px", fontFamily: "JetBrains Mono, monospace" }}>{p.average_score}</td>
                <td
                  style={{
                    padding: "12px 8px",
                    fontWeight: 700,
                    color: getRiskColor(p.risk),
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {p.risk}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
