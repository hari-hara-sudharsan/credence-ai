"use client";

interface Stage {
  label: string;
  desc: string;
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAIL";
}

interface Props {
  stages: Stage[];
}

export default function SettlementFlow({ stages }: Props) {
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
          color: "#34D399",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 20,
        }}
      >
        HSP SETTLEMENT PROCESS PIPELINE
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {stages.map((s, idx) => {
          let dotColor = "#1D2E49";
          let textColor = "#64748B";

          if (s.status === "SUCCESS") {
            dotColor = "#34D399";
            textColor = "#E2E8F0";
          } else if (s.status === "PROCESSING") {
            dotColor = "#00E5FF";
            textColor = "#E2E8F0";
          } else if (s.status === "FAIL") {
            dotColor = "#FF4D6A";
            textColor = "#E2E8F0";
          }

          return (
            <div key={idx} style={{ display: "flex", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: dotColor,
                    border: "3px solid #0A1425",
                    boxShadow: s.status === "PROCESSING" ? "0 0 10px #00E5FF" : "none",
                    transition: "all 0.3s ease",
                  }}
                />
                {idx < stages.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      background: s.status === "SUCCESS" ? "#34D399" : "#111C2E",
                      margin: "6px 0",
                      transition: "background 0.3s ease",
                    }}
                  />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: textColor }}>{s.label}</span>
                  <span
                    style={{
                      fontSize: 8,
                      fontWeight: 800,
                      color: dotColor,
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    {s.status}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: "#64748B", margin: "4px 0 0", lineHeight: 1.4 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
