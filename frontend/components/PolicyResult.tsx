"use client";

interface Props {
  result: any;
}

export default function PolicyResult({ result }: Props) {
  const isPassed = result.passed === true;
  const statusColor = isPassed ? "#34D399" : "#FF4D6A";
  const bgGlow = isPassed ? "rgba(52, 211, 153, 0.05)" : "rgba(255, 77, 106, 0.05)";

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
        border: `1px solid ${statusColor}`,
        borderRadius: 16,
        padding: 24,
        boxShadow: `0 8px 32px ${isPassed ? "rgba(52, 211, 153, 0.05)" : "rgba(255, 77, 106, 0.05)"}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative pulse ring */}
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          background: bgGlow,
          filter: "blur(24px)",
          borderRadius: "50%",
        }}
      />

      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#00E5FF",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 12,
        }}
      >
        EVALUATION DECISION RECORD
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 13, color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>
          Target: {result.wallet.substring(0, 8)}...{result.wallet.substring(result.wallet.length - 6)}
        </span>

        <span
          style={{
            background: isPassed ? "rgba(52, 211, 153, 0.08)" : "rgba(255, 77, 106, 0.08)",
            border: `1px solid ${statusColor}`,
            color: statusColor,
            fontSize: 11,
            fontWeight: 800,
            padding: "6px 14px",
            borderRadius: 8,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {isPassed ? "🟢 PASSED" : "🔴 REJECTED"}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
            MATCHED RULES
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#E2E8F0" }}>{result.matched_rules}</div>
        </div>

        <div>
          <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
            FAILED RULES
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: result.failed_rules > 0 ? "#FF4D6A" : "#64748B" }}>
            {result.failed_rules}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
            COMPLIANCE SCORE
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: isPassed ? "#34D399" : "#FFB830" }}>
            {result.score}%
          </div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
          DECISION REASON
        </div>
        <div style={{ fontSize: 13, color: "#E2E8F0", lineHeight: 1.5 }}>{result.reason}</div>
      </div>
    </div>
  );
}
