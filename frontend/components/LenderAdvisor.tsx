"use client";

export default function LenderAdvisor() {
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
          color: "#FFB830",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        ⚖️ LENDER ADVISOR CORNER
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13, color: "#94A3B8" }}>
        <div>
          <strong>Evaluating default probability?</strong>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748B", lineHeight: 1.4 }}>
            Verify the borrower has an active, valid passport and EIP-712 signatures. Avoid lending if default forecast is above 30%.
          </p>
        </div>

        <div>
          <strong>Collateral ratios recommendation?</strong>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748B", lineHeight: 1.4 }}>
            Require higher collateral thresholds (e.g. 150%) for retail borrowers and discount LTVs for Institutional Verified wallets.
          </p>
        </div>
      </div>
    </div>
  );
}
