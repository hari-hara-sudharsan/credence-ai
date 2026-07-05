"use client";

interface TrustSourceItem {
  source: string;
  impact: string;
}

interface Props {
  insights: string;
  trustSources: TrustSourceItem[];
  trustPath: string[];
}

export default function GraphInsights({ insights, trustSources, trustPath }: Props) {
  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#00E5FF", letterSpacing: 2, fontFamily: "JetBrains Mono, monospace", marginBottom: 12 }}>
          AI RELATIONSHIP INTELLIGENCE INSIGHTS
        </div>
        <p style={{ margin: 0, fontSize: 13, color: "#94A3B8", lineHeight: 1.5 }}>
          {insights}
        </p>
      </div>

      <div style={{ borderTop: "1px solid #111C2E", paddingTop: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#34D399", letterSpacing: 2, fontFamily: "JetBrains Mono, monospace", marginBottom: 16 }}>
          TRUST FLOW PROPAGATION PATHWAYS
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
          {/* Flow Sources */}
          <div>
            <span style={{ fontSize: 9, color: "#64748B", display: "block", marginBottom: 8 }}>
              PROPAGATION SOURCE NODES
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {trustSources.map((src, i) => (
                <div
                  key={i}
                  style={{
                    background: "#050B14",
                    border: "1px solid #111C2E",
                    borderRadius: 8,
                    padding: "8px 12px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: "#E2E8F0" }}>{src.source}</span>
                  <span style={{ color: "#34D399", fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
                    {src.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Flow path steps timeline */}
          <div>
            <span style={{ fontSize: 9, color: "#64748B", display: "block", marginBottom: 8 }}>
              TRUST PROPAGATION PATH
            </span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {trustPath.map((step, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#00E5FF",
                      background: "rgba(0, 229, 255, 0.05)",
                      border: "1px solid #00E5FF",
                      borderRadius: 4,
                      padding: "4px 8px",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    {step}
                  </span>
                  {idx < trustPath.length - 1 && <span style={{ color: "#4A6080" }}>➔</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
