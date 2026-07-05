"use client";

export default function BorrowerAdvisor() {
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
          color: "#00E5FF",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        🙋 BORROWER ADVISOR CORNER
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13, color: "#94A3B8" }}>
        <div>
          <strong>How do I increase my score?</strong>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748B", lineHeight: 1.4 }}>
            Repaying active loans before their due dates and maintaining daily transaction activity are the highest weighted factors.
          </p>
        </div>

        <div>
          <strong>Max borrowing capacity limits?</strong>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748B", lineHeight: 1.4 }}>
            Qualifying for a score of 700+ (Institutional) increases your adapter borrowing limits and reduces LTV ratios.
          </p>
        </div>
      </div>
    </div>
  );
}
