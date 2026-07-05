"use client";

interface Props {
  metrics: any;
}

export default function NetworkHealth({ metrics }: Props) {
  const isHealthy = metrics.health_score >= 80;
  const statusColor = isHealthy ? "#34D399" : metrics.health_score >= 50 ? "#FFB830" : "#FF4D6A";
  const bgGlow = isHealthy ? "rgba(52, 211, 153, 0.05)" : metrics.health_score >= 50 ? "rgba(255, 184, 48, 0.05)" : "rgba(255, 77, 106, 0.05)";

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
        border: `1px solid ${statusColor}`,
        borderRadius: 16,
        padding: 24,
        boxShadow: `0 12px 40px ${bgGlow}`,
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr",
        gap: 24,
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#00E5FF",
            letterSpacing: 2,
            fontFamily: "JetBrains Mono, monospace",
            marginBottom: 16,
          }}
        >
          NETWORK HEALTH RATINGS
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 2 }}>
              SYSTEMIC STATUS
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: statusColor }}>
              {metrics.status} ({metrics.health_score}/100)
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                VERIFIED PASSPORTS
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0" }}>{metrics.verified_wallets}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                TOTAL WALLETS
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0" }}>{metrics.total_wallets}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                AVERAGE TRUST SCORE
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#34D399" }}>{metrics.average_trust_score}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                CREDIT CAPACITY
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#00E5FF" }}>
                ${metrics.total_credit_capacity.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ring visualizer column */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: bgGlow,
            border: `3px dashed ${statusColor}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 24px ${bgGlow}`,
            animation: "pulse-seal 2s infinite ease-in-out",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 800, color: statusColor }}>{metrics.health_score}%</div>
          <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginTop: 4 }}>
            HEALTH INDEX
          </div>
        </div>
      </div>
    </div>
  );
}
