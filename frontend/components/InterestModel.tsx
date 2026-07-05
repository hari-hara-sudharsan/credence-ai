"use client";

export default function InterestModel() {
  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#FFB830",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        DYNAMIC INTEREST RATE MODEL
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: "#E2E8F0" }}>Base Borrow Rate</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#E2E8F0" }}>5.0%</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: "#34D399" }}>✓ Prime Score Discount (Score ≥ 700)</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#34D399" }}>-2.0%</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: "#FF4D6A" }}>⚠ Subprime Risk Penalty (Score &lt; 550)</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#FF4D6A" }}>+5.0%</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: "#FF4D6A" }}>⚠ High Portfolio Risk Level</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#FF4D6A" }}>+3.0%</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: "#E2E8F0" }}>🔥 Pool Utilization Premium (&gt;80%)</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#E2E8F0" }}>+3.0%</span>
        </div>
      </div>
    </div>
  );
}
