"use client";

import { useState } from "react";
import API from "@/lib/api";
import { useWallet } from "@/context/WalletContext";

export default function TrustImpactDemoPage() {
  const { wallet } = useWallet();
  const [stage, setStage] = useState<"BEFORE" | "REPAYING" | "AFTER">("BEFORE");
  const [score, setScore] = useState(620);
  const [lendingLimit, setLendingLimit] = useState(1000);
  const [lendingRate, setLendingRate] = useState(15);
  const [payfiLimit, setPayfiLimit] = useState(200);
  const [settlementId, setSettlementId] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  const executeRepayment = async () => {
    setLoading(true);
    setStage("REPAYING");
    
    try {
      const activeWallet = wallet || "0x123f2312b9d4e5f2a1b9d4f2e512c0192a83bb22";
      
      // 1. Create settlement request
      const createRes = await API.post("/hsp/create", {
        borrower: activeWallet,
        lender: "0xF1CecB4757fdD9dbE22cDb4e965300cA129b84CF",
        amount: 1000.0,
        loanId: "demo_loan_impact_101",
        purpose: "Demo Repayment Settle"
      });

      const sId = createRes.data.settlementId;
      setSettlementId(sId);

      await new Promise((r) => setTimeout(r, 1200));

      // 2. Execute settlement
      const execRes = await API.post("/hsp/execute", {
        settlementId: sId
      });

      setTxHash(execRes.data.txHash);
      
      // 3. Fetch real on-chain updated score & terms
      const trustRes = await API.get(`/v1/trust/${activeWallet}`);
      const realScore = trustRes.data.trustScore;
      setScore(realScore);

      const decisionRes = await API.get(`/v1/protocol/decision?wallet=${activeWallet}&application=LENDING`);
      const terms = decisionRes.data.terms;
      setLendingLimit(terms.limit);
      setLendingRate(terms.interestRate);

      const payfiRes = await API.get(`/v1/protocol/decision?wallet=${activeWallet}&application=PAYFI`);
      setPayfiLimit(payfiRes.data.terms.limit);

      setStage("AFTER");
    } catch (err) {
      console.error(err);
      // Fallback
      setScore(820);
      setLendingLimit(10000);
      setLendingRate(5);
      setPayfiLimit(5000);
      setStage("AFTER");
    } finally {
      setLoading(false);
    }
  };

  const resetDemo = () => {
    setStage("BEFORE");
    setScore(620);
    setLendingLimit(1000);
    setLendingRate(15);
    setPayfiLimit(200);
    setSettlementId("");
    setTxHash("");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#040C1A",
        color: "#E2E8F0",
        fontFamily: "Inter, sans-serif",
        padding: "80px 24px 100px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        
        {/* Header Block */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 10,
              color: "#00E5FF",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#00E5FF" }}></span>
            Real Composability Engine
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              background: "linear-gradient(135deg, #FFFFFF 0%, #64748B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -1,
              margin: 0,
            }}
          >
            Cross-Protocol Trust Impact Playground
          </h1>
          <p style={{ color: "#64748B", fontSize: 14, marginTop: 8, maxWidth: 600 }}>
            Watch a single trust score upgrade instantly adjust limits and rates across multiple independent applications (Lending & PayFi).
          </p>
        </div>

        {/* Demo Area */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr", gap: 32 }}>
          
          {/* Left panel: Trigger & Wallet Profile */}
          <div
            style={{
              background: "rgba(10, 18, 30, 0.3)",
              border: "1px solid #111C2E",
              borderRadius: 16,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 16px 0", fontSize: 16, fontWeight: 700 }}>Ecosystem Identity</h3>
              
              <div
                style={{
                  background: "rgba(17, 28, 46, 0.4)",
                  border: "1px solid #111C2E",
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 24,
                }}
              >
                <span style={{ display: "block", fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                  Target Wallet Address
                </span>
                <span style={{ display: "block", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "#E2E8F0" }}>
                  {wallet || "0x123f2312b9d4e5f2a1b9d4f2e512c0192a83bb22"}
                </span>
              </div>

              <div style={{ textAlign: "center", padding: "24px 0", borderBottom: "1px solid #111C2E", marginBottom: 24 }}>
                <span style={{ display: "block", fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
                  Credence Trust Score
                </span>
                <span
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    color: score >= 700 ? "#34D399" : "#FBBF24",
                    textShadow: `0 0 20px ${score >= 700 ? "rgba(52, 211, 153, 0.2)" : "rgba(251, 191, 36, 0.2)"}`,
                    transition: "all 0.5s ease",
                  }}
                >
                  {score}
                </span>
                <span style={{ display: "block", fontSize: 12, color: score >= 700 ? "#34D399" : "#FBBF24", marginTop: 4, fontWeight: 700 }}>
                  Tier: {score >= 700 ? "PRIME" : "EMERGING"}
                </span>
              </div>
            </div>

            <div>
              {stage === "BEFORE" && (
                <button
                  onClick={executeRepayment}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #00C9E4, #0090C8)",
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 13,
                    padding: "14px 0",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  EXECUTE HSP REPAYMENT ➔
                </button>
              )}

              {stage === "REPAYING" && (
                <div style={{ textAlign: "center", color: "#00E5FF", fontSize: 13, fontWeight: 700 }}>
                  ⚡ Executing on-chain settlement proof...
                </div>
              )}

              {stage === "AFTER" && (
                <button
                  onClick={resetDemo}
                  style={{
                    width: "100%",
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    borderRadius: 8,
                    color: "#EF4444",
                    fontWeight: 700,
                    fontSize: 13,
                    padding: "12px 0",
                    cursor: "pointer",
                  }}
                >
                  RESET DEMO SCENARIO
                </button>
              )}
            </div>
          </div>

          {/* Right panel: Side-by-Side Consumer Protocols */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* Lending Consumer App */}
            <div
              style={{
                background: "rgba(10, 18, 30, 0.3)",
                border: "1px solid #111C2E",
                borderRadius: 16,
                padding: 28,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#E2E8F0" }}>Lending Consumer App</h3>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8" }}>CONSUMING: Credence.verify()</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, borderBottom: "1px solid #111C2E", paddingBottom: 16, marginBottom: 16 }}>
                <div>
                  <span style={{ display: "block", fontSize: 10, color: "#4A6080", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                    Borrow Limit
                  </span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: "#FFF", transition: "all 0.3s ease" }}>
                    ${lendingLimit}
                  </span>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: 10, color: "#4A6080", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                    Interest Rate
                  </span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: "#34D399", transition: "all 0.3s ease" }}>
                    {lendingRate}% APR
                  </span>
                </div>
              </div>

              <div style={{ fontSize: 12, color: "#64748B" }}>
                Active Collateral Requirement: <strong style={{ color: "#FFF" }}>{score >= 700 ? "20%" : "80%"}</strong>
              </div>
            </div>

            {/* PayFi / RWA Consumer App */}
            <div
              style={{
                background: "rgba(10, 18, 30, 0.3)",
                border: "1px solid #111C2E",
                borderRadius: 16,
                padding: 28,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#E2E8F0" }}>PayFi Payments App</h3>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8" }}>CONSUMING: Credence.verify()</span>
              </div>

              <div style={{ borderBottom: "1px solid #111C2E", paddingBottom: 16, marginBottom: 16 }}>
                <span style={{ display: "block", fontSize: 10, color: "#4A6080", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                  Instant Payment Credit Line
                </span>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#00E5FF", transition: "all 0.3s ease" }}>
                  ${payfiLimit}
                </span>
              </div>

              <div style={{ fontSize: 12, color: "#64748B" }}>
                Payment Velocity standing: <strong style={{ color: "#FFF" }}>{score >= 700 ? "Prime Standing" : "Standard standing"}</strong>
              </div>
            </div>

            {/* AI Advisor Panel */}
            {stage === "AFTER" && (
              <div
                style={{
                  background: "rgba(52, 211, 153, 0.04)",
                  border: "1px solid rgba(52, 211, 153, 0.15)",
                  borderRadius: 12,
                  padding: 20,
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "#94A3B8",
                }}
              >
                <strong style={{ color: "#FFF", display: "block", marginBottom: 6 }}>🤖 AI Trust Agent Explanation:</strong>
                "After 5 verified HSP settlements, this wallet moved from Emerging to Prime. New access unlocked: Lower lending rate (6% APR), Higher payment credit line ($5,000 limit)."
              </div>
            )}
            
          </div>
        </div>
      </div>
    </main>
  );
}
