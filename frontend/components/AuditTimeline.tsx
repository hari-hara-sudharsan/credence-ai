"use client";

interface AuditLogItem {
  log_id: string;
  action: string;
  performed_by: string;
  resource: string;
  result: string;
  timestamp: string;
}

interface Props {
  logs: AuditLogItem[];
}

export default function AuditTimeline({ logs }: Props) {
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
        IMMUTABLE GOVERNANCE AUDIT TIMELINE
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {logs.map((log) => (
          <div key={log.log_id} style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#FFB830",
                  border: "2px solid #0A1425",
                }}
              />
              <div style={{ width: 2, flex: 1, background: "#111C2E", margin: "4px 0" }} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{log.action}</span>
                <span style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
                Performed by: <strong style={{ color: "#E2E8F0", fontFamily: "JetBrains Mono, monospace" }}>{log.performed_by}</strong> on{" "}
                <strong style={{ color: "#00E5FF", fontFamily: "JetBrains Mono, monospace" }}>{log.resource}</strong>
              </div>
              <div style={{ fontSize: 11, color: "#34D399", marginTop: 4, fontStyle: "italic" }}>
                Result: {log.result}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
