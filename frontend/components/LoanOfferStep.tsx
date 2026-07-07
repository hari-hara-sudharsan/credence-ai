"use client";

interface Props {
  analysis?: any;
  session?: any;
  onNext: () => void;
}

export default function LoanOfferStep({ analysis, session, onNext }: Props) {
  const score = analysis?.credit_score || session?.credit_score || 600;
  const rate = analysis?.lending?.interest_rate || session?.lending?.interest_rate || 5.0;
  const collateralRatio = analysis?.lending?.collateral_ratio || session?.lending?.collateral_ratio || 30;
  const amount = analysis?.lending?.max_loan_amount || session?.lending?.max_loan_amount || 500;
  const lockAmount = Math.round((amount * collateralRatio) / 100);
  const tradLockAmount = Math.round(amount * 1.5);

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
            Borrow Power: Limited. Requires locking ${tradLockAmount} to borrow ${amount}.
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
            Collateral: {collateralRatio}%
          </div>
          <div style={{ fontSize: 11, color: "#34D399", marginTop: 4 }}>
            Borrow Power: Unlocked. Only locks ${lockAmount} due to high Credit Score ({score}).
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
          💡 <strong>Judge Hint:</strong> This step shows AI underwriting replacing excessive collateral requirement with a reputation-backed model, reducing capital locks by {150 - collateralRatio}%.
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
            <div style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0" }}>{amount} HSP</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#64748B", marginBottom: 4 }}>INTEREST RATE</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#34D399" }}>{rate}% APY</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#64748B", marginBottom: 4 }}>LOAN DURATION</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0" }}>30 Days</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#64748B", marginBottom: 4 }}>COLLATERAL TO LOCK</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0" }}>{lockAmount} HSP ({collateralRatio}%)</div>
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
