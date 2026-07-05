"use client";

interface Props {
  currentScore: number;
}

export default function ProgressTracker({ currentScore }: Props) {
  const steps = [
    { label: "Initiate Score Registry", checked: true, desc: "Wallet verified and score seed complete." },
    { label: "Clear Active Liability Burdens", checked: currentScore >= 600, desc: "Repay borrow adapter outstanding balances." },
    { label: "Increase Adapter Diversification", checked: currentScore >= 660, desc: "DeFi integration footprint expanded." },
    { label: "Qualify for Gold Trust Level", checked: currentScore >= 700, desc: "Premium adapter discount perks unlocked." },
    { label: "Unlock Institutional Grade Status", checked: currentScore >= 800, desc: "Maximum borrow limits whitelisted." }
  ];

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
          fontSize: 10,
          fontWeight: 800,
          color: "#4A6080",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 20,
        }}
      >
        CREDIT ROADMAP PROGRESSION
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {steps.map((st, i) => (
          <div key={i} style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: st.checked ? "#34D3991A" : "#111C2E",
                  border: `2px solid ${st.checked ? "#34D399" : "#1D2E49"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 800,
                  color: st.checked ? "#34D399" : "#64748B",
                }}
              >
                {st.checked ? "✓" : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 2, flex: 1, background: "#111C2E", margin: "4px 0" }} />
              )}
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: st.checked ? "#E2E8F0" : "#64748B" }}>
                {st.label}
              </div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{st.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
