"use client";

interface AlertItem {
  alert_id: string;
  wallet: string;
  alert_type: string;
  severity: string;
  title: string;
  description: string;
  recommendation: string;
  source: string;
  created_at: string;
  resolved: boolean;
}

interface Props {
  alerts: AlertItem[];
  onResolve: (alertId: string) => void;
}

export default function AlertFeed({ alerts, onResolve }: Props) {
  const getSeverityColor = (sev: string) => {
    if (sev === "CRITICAL") return "#FF4D6A";
    if (sev === "HIGH") return "#FF8A00";
    if (sev === "MEDIUM") return "#FFB830";
    if (sev === "LOW") return "#00E5FF";
    return "#34D399";
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
        LIVE ALERTS FEED
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {alerts.length === 0 ? (
          <div style={{ color: "#64748B", fontSize: 12, textAlign: "center", padding: "20px 0" }}>
            No active alerts triggered for this wallet profile.
          </div>
        ) : (
          alerts.map((alt) => (
            <div
              key={alt.alert_id}
              style={{
                background: "#050B14",
                borderLeft: `4px solid ${getSeverityColor(alt.severity)}`,
                borderRadius: "0 8px 8px 0",
                padding: "16px 20px",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 16,
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 6 }}>
                  <span
                    style={{
                      fontSize: 8,
                      fontWeight: 800,
                      color: getSeverityColor(alt.severity),
                      background: `${getSeverityColor(alt.severity)}1A`,
                      border: `1px solid ${getSeverityColor(alt.severity)}`,
                      borderRadius: 4,
                      padding: "2px 6px",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    {alt.severity}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{alt.title}</span>
                </div>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: "#94A3B8" }}>{alt.description}</p>
                <div style={{ fontSize: 11, color: "#64748B" }}>
                  <strong>Recommendation:</strong> {alt.recommendation}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                <span style={{ fontSize: 9, color: "#4A6080", fontFamily: "JetBrains Mono, monospace" }}>
                  {alt.alert_type}
                </span>
                <button
                  onClick={() => onResolve(alt.alert_id)}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid #1D2E49",
                    borderRadius: 6,
                    color: "#00E5FF",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "4px 10px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e: any) => (e.target.style.background = "rgba(0, 229, 255, 0.05)")}
                  onMouseLeave={(e: any) => (e.target.style.background = "rgba(255, 255, 255, 0.03)")}
                >
                  RESOLVE
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
