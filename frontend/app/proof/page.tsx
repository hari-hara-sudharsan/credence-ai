"use client";

export default function JudgeProofPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020714",
        color: "#E2E8F0",
        fontFamily: "Inter, sans-serif",
        padding: "80px 24px 100px",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        
        {/* Top Header */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 10,
              color: "#34D399",
              letterSpacing: 2,
              textTransform: "uppercase",
              background: "rgba(52, 211, 153, 0.08)",
              border: "1px solid rgba(52, 211, 153, 0.2)",
              borderRadius: 30,
              padding: "6px 16px",
              marginBottom: 16,
            }}
          >
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#34D399" }}></span>
            Verification Center
          </div>
          <h1
            style={{
              fontSize: 34,
              fontWeight: 900,
              background: "linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -1.5,
              margin: "0 0 12px 0",
            }}
          >
            Credence Judge Verification Portal
          </h1>
          <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>
            Inspect smart contracts, check automated integration reports, and review E2E transaction lifecycle proofs.
          </p>
        </div>

        {/* Deployed Contracts Table */}
        <div
          style={{
            background: "rgba(10, 18, 30, 0.4)",
            border: "1px solid #111C2E",
            borderRadius: 20,
            padding: 28,
            marginBottom: 32,
          }}
        >
          <h3 style={{ margin: "0 0 20px 0", fontSize: 16, fontWeight: 800 }}>HashKey Chain Mainnet Deployments</h3>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #111C2E", color: "#64748B" }}>
                  <th style={{ padding: "12px 8px" }}>Contract</th>
                  <th style={{ padding: "12px 8px" }}>Address</th>
                  <th style={{ padding: "12px 8px" }}>Security Features</th>
                  <th style={{ padding: "12px 8px", textAlign: "right" }}>Explorer</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "GovernanceRegistry", address: "0x98297dF9f8ffC79bc8e6BA3Ec606136adacb6f81", features: "RBAC Controls" },
                  { name: "CreditPassportV2", address: "0xD6b040736e948621c5b6E0a494473c47a6113eA8", features: "ERC721 Metadata" },
                  { name: "OracleRegistry", address: "0x2Dd78Fd9B8F40659Af32eF98555B8b31bC97A351", features: "Consensus, EIP-712" },
                  { name: "LoanManager", address: "0x2988f0bE02e1a679430aEb4A6B9B10429F1e8e80", features: "State Machine" },
                  { name: "LendingPool", address: "0x928BA9D30669c41695422a68a1C307a6529F0050", features: "ReentrancyGuard" },
                  { name: "SettlementManager", address: "0x4f3eEE789936a0eca627484bf680464f2F37b9FB", features: "Double-Execute Lock" },
                  { name: "ReputationRegistry", address: "0x110e9fB1ABEc92521E4511d5f45B4917B4c941Ab", features: "Streak and Weights" },
                  { name: "TrustDefenseRegistry", address: "0x5bb83E60a7a05A0e1b077B66412a26306e334208", features: "Sybil Alert, Pausable" }
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #111C2E" }}>
                    <td style={{ padding: "14px 8px", fontWeight: 700, color: "#E2E8F0" }}>{row.name}</td>
                    <td style={{ padding: "14px 8px", fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#94A3B8" }}>{row.address}</td>
                    <td style={{ padding: "14px 8px", color: "#34D399" }}>{row.features}</td>
                    <td style={{ padding: "14px 8px", textAlign: "right" }}>
                      <a
                        href={`https://hashkey.blockscout.com/address/${row.address}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#00E5FF", textDecoration: "none", fontSize: 12 }}
                      >
                        Verify ➔
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* E2E Flywheel Lifecycle Flows */}
        <div
          style={{
            background: "rgba(10, 18, 30, 0.4)",
            border: "1px solid #111C2E",
            borderRadius: 20,
            padding: 28,
            marginBottom: 32,
          }}
        >
          <h3 style={{ margin: "0 0 24px 0", fontSize: 16, fontWeight: 800 }}>Complete Trust Lifecycle Flow Proof</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { step: "Step 1", label: "Wallet Connected", desc: "User links active wallet address via CreditPassport NFT." },
              { step: "Step 2", label: "AI Assessment", desc: "Transparent credit engine processes risk factors from Blockscout." },
              { step: "Step 3", label: "Defense Check", desc: "Security checks screen against Sybil clusters, farming loops, and wash volume." },
              { step: "Step 4", label: "Oracle Attestation", desc: "Multi-oracle consensus signs validation EIP-712 structured data hashes." },
              { step: "Step 5", label: "HSP Settlement", desc: "Settlements execute on-chain on HashKey Chain, issuing immutable Trust Receipts." },
              { step: "Step 6", label: "Reputation Upgrade", desc: "Dynamic weights upgrade borrower standings from FICO 620 to 820." },
              { step: "Step 7", label: "Dynamic Terms Sync", desc: "Consuming protocols (Lending, PayFi, RWA) automatically lower rates and raise limits." }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  background: "rgba(17, 28, 46, 0.2)",
                  border: "1px solid #111C2E",
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: "JetBrains Mono, monospace",
                    fontWeight: 800,
                    color: "#00E5FF",
                    background: "rgba(0, 229, 255, 0.08)",
                    border: "1px solid rgba(0, 229, 255, 0.2)",
                    borderRadius: 4,
                    padding: "4px 8px",
                  }}
                >
                  {item.step}
                </span>
                <div>
                  <strong style={{ display: "block", fontSize: 14, color: "#E2E8F0", marginBottom: 4 }}>{item.label}</strong>
                  <span style={{ fontSize: 12, color: "#64748B" }}>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification & Test Metrics */}
        <div
          style={{
            background: "rgba(10, 18, 30, 0.4)",
            border: "1px solid #111C2E",
            borderRadius: 20,
            padding: 28,
          }}
        >
          <h3 style={{ margin: "0 0 20px 0", fontSize: 16, fontWeight: 800 }}>Automated Integration Verification Tests</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ background: "rgba(52, 211, 153, 0.04)", border: "1px solid rgba(52, 211, 153, 0.15)", borderRadius: 12, padding: 20 }}>
              <span style={{ display: "block", fontSize: 10, color: "#34D399", textTransform: "uppercase", marginBottom: 4, fontWeight: 700 }}>
                Smart Contracts (Hardhat & Mocha)
              </span>
              <strong style={{ display: "block", fontSize: 24, color: "#FFF", marginBottom: 6 }}>133 / 133 Tests Passed</strong>
              <span style={{ fontSize: 12, color: "#64748B" }}>Includes AccessControl, SignatureVerification, and ReplayAttack tests.</span>
            </div>
            
            <div style={{ background: "rgba(52, 211, 153, 0.04)", border: "1px solid rgba(52, 211, 153, 0.15)", borderRadius: 12, padding: 20 }}>
              <span style={{ display: "block", fontSize: 10, color: "#34D399", textTransform: "uppercase", marginBottom: 4, fontWeight: 700 }}>
                Backend Services (Python Unittest Discovery)
              </span>
              <strong style={{ display: "block", fontSize: 24, color: "#FFF", marginBottom: 6 }}>29 / 29 Tests Passed</strong>
              <span style={{ fontSize: 12, color: "#64748B" }}>Includes WalletAnalyzer, CreditEngine, and AnomalyDetector tests.</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
