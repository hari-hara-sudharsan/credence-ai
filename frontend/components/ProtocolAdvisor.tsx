"use client";

export default function ProtocolAdvisor() {
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
          color: "#34D399",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        ⚙️ PROTOCOL ADVISOR CORNER
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13, color: "#94A3B8" }}>
        <div>
          <strong>Which policy is recommended?</strong>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748B", lineHeight: 1.4 }}>
            Apply the Institutional Lending policy model for whitelisting and default rates control, requiring oracle attestations.
          </p>
        </div>

        <div>
          <strong>Adapter limits adjustments?</strong>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748B", lineHeight: 1.4 }}>
            Enable dynamically adjusted LTV boundaries based on the UCVN Trust Seals (BRONZE to INSTITUTIONAL_VERIFIED).
          </p>
        </div>
      </div>
    </div>
  );
}
