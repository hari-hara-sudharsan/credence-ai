"use client";

export default function ArchitectureViewer() {
  const steps = [
    { name: "Wallet Analysis", desc: "Balance extraction, native transactions logs.", col: "#34D399" },
    { name: "AI Underwriting", desc: "Credit score calculating & Markov chains defaults predictions.", col: "#00E5FF" },
    { name: "Oracle Attestation", desc: "Off-chain EIP-712 structured cryptographic signatures.", col: "#FFB830" },
    { name: "Credit Passport V2", desc: "EVM ERC-721/1155 smart contracts record validation.", col: "#FF4D6A" },
    { name: "Protocol Layer", desc: "Lending, Insurance, RWA, & DAO adapters criteria.", col: "#A855F7" }
  ];

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#00E5FF",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 24,
        }}
      >
        E2E TRUST FLOW DIAGRAM PATH
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {steps.map((s, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
                border: `1px solid ${s.col}`,
                borderRadius: 10,
                padding: 16,
                boxShadow: `0 0 12px ${s.col}0D`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#E2E8F0" }}>{s.name}</span>
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 800,
                    color: s.col,
                    background: `${s.col}1A`,
                    border: `1px solid ${s.col}`,
                    borderRadius: 4,
                    padding: "2px 6px",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  STAGE {idx + 1}
                </span>
              </div>
              <p style={{ fontSize: 11, color: "#94A3B8", margin: 0, lineHeight: 1.4 }}>
                {s.desc}
              </p>
            </div>
            
            {idx < steps.length - 1 && (
              <div
                style={{
                  height: 20,
                  width: 2,
                  background: `linear-gradient(180deg, ${s.col} 0%, ${steps[idx + 1].col} 100%)`,
                  margin: "4px 0",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
