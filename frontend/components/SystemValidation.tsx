"use client";

interface ValidationReport {
  test_name: string;
  component: string;
  passed: boolean;
  latency: number;
}

interface Props {
  status: string;
  reports: ValidationReport[];
}

export default function SystemValidation({ status, reports }: Props) {
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
            color: "#FFB830",
            letterSpacing: 2,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          LIVE SYSTEM VERIFICATION STATUS
        </div>
        <span
          style={{
            fontSize: 9,
            fontWeight: 800,
            color: status === "HEALTHY" ? "#34D399" : "#FFB830",
            background: `${status === "HEALTHY" ? "#34D399" : "#FFB830"}1A`,
            border: `1px solid ${status === "HEALTHY" ? "#34D399" : "#FFB830"}`,
            borderRadius: 4,
            padding: "2px 6px",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {status}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {reports.map((r, i) => (
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
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{r.component}</div>
              <span style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                Test: {r.test_name} ({r.latency}ms)
              </span>
            </div>
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: r.passed ? "#34D399" : "#FF4D6A",
                background: `${r.passed ? "#34D399" : "#FF4D6A"}1A`,
                border: `1px solid ${r.passed ? "#34D399" : "#FF4D6A"}`,
                borderRadius: 4,
                padding: "2px 6px",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {r.passed ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
