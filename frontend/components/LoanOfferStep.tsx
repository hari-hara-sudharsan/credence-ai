"use client";

interface Props {
  onNext: () => void;
}

export default function LoanOfferStep({ onNext }: Props) {
  return (
    <div style={{ padding: "10px 0" }}>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: "#E2E8F0", marginBottom: 16 }}>
        Dynamic Loan Offer
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {/* Traditional */}
        <div
          style={{
            border: "1px solid #1A2740",
            background: "rgba(26, 39, 64, 0.2)",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748B", letterSpacing: 1, marginBottom: 8 }}>
            TRADITIONAL DEFI
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#94A3B8" }}>
            Collateral: 150%
          </div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
            Borrow Power: Limited. Requires locking $750 to borrow $500.
          </div>
        </div>

        {/* Credence AI */}
        <div
          style={{
            border: "1px solid #34D399",
            background: "rgba(52, 211, 153, 0.04)",
            borderRadius: 12,
            padding: 20,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -10,
              right: 12,
              background: "#34D399",
              color: "#040C1A",
              fontSize: 8,
              fontWeight: 800,
              padding: "2px 6px",
              borderRadius: 4,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            CREDIT-BACKED
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#34D399", letterSpacing: 1, marginBottom: 8 }}>
            CREDENCE AI
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#E2E8F0" }}>
            Collateral: 30%
          </div>
          <div style={{ fontSize: 11, color: "#34D399", marginTop: 4 }}>
            Borrow Power: Unlocked. Only locks $150 due to high Credit Score (742).
          </div>
        </div>
      </div>

      {/* Judge Hint Tooltip */}
      {typeof window !== "undefined" && window.location.search.includes("demo=true") && (
        <div
          style={{
            background: "rgba(0, 229, 255, 0.05)",
            border: "1px solid rgba(0, 229, 255, 0.2)",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 11,
            color: "#00E5FF",
            marginBottom: 20,
            lineHeight: 1.4
          }}
        >
          💡 <strong>Judge Hint:</strong> This step shows AI underwriting replacing excessive collateral requirement with a reputation-backed model, reducing capital locks by 120%.
        </div>
      )}


      {/* Offer terms details */}
      <div
        style={{
          background: "#0A1425",
          border: "1px solid #111C2E",
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: "#64748B", marginBottom: 4 }}>BORROW AMOUNT</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0" }}>500 HSP</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#64748B", marginBottom: 4 }}>INTEREST RATE</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#34D399" }}>5.0% APY</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#64748B", marginBottom: 4 }}>LOAN DURATION</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0" }}>30 Days</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#64748B", marginBottom: 4 }}>COLLATERAL TO LOCK</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0" }}>150 HSP (30%)</div>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        style={{
          width: "100%",
          background: "#34D399",
          border: "none",
          borderRadius: 8,
          color: "#040C1A",
          fontWeight: 800,
          fontSize: 13,
          padding: "12px 0",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        ACCEPT OFFER & REQUEST SIGNATURE ➔
      </button>
    </div>
  );
}
