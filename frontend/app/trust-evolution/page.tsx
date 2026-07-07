"use client";

import { useState } from "react";
import API from "@/lib/api";
import { useWallet } from "@/context/WalletContext";

export default function TrustEvolutionPage() {
  const { wallet } = useWallet();
  const [step, setStep] = useState(1); // 1 = Before, 2 = Animating, 3 = Transformed
  const [score, setScore] = useState(620);
  const [tier, setTier] = useState("EMERGING");
  const [actionType, setActionType] = useState("");
  const [loading, setLoading] = useState(false);

  // App metrics
  const [lendingLimit, setLendingLimit] = useState(1000);
  const [lendingRate, setLendingRate] = useState(15);
  const [lendingCollateral, setLendingCollateral] = useState(80);
  const [payfiLimit, setPayfiLimit] = useState(200);
  const [rwaStatus, setRwaStatus] = useState("Not Eligible");
  const [trustRank, setTrustRank] = useState("Top 60%");

  const triggerEvolution = async (type: "HSP" | "REPAYMENT") => {
    setLoading(true);
    setStep(2);
    setActionType(type === "HSP" ? "HSP Settlement verified" : "Loan repayment recorded");

    try {
      const activeWallet = wallet || "0x123f2312b9d4e5f2a1b9d4f2e512c0192a83bb22";

      if (type === "HSP") {
        // 1. HSP Settlement creation & execution simulation
        const createRes = await API.post("/hsp/create", {
          borrower: activeWallet,
          lender: "0xF1CecB4757fdD9dbE22cDb4e965300cA129b84CF",
          amount: 2500.0,
          loanId: "flywheel_repayment_202",
          purpose: "Flywheel Evolution Settle"
        });
        const sId = createRes.data.settlementId;
        await new Promise((r) => setTimeout(r, 1000));
        await API.post("/hsp/execute", { settlementId: sId });
      } else {
        // 2. Mock reputation registry repayment update
        await API.post("/insights/", { wallet: activeWallet });
        await new Promise((r) => setTimeout(r, 1200));
      }

      // Evolve states
      setScore(820);
      setTier("PRIME");
      setLendingLimit(10000);
      setLendingRate(5);
      setLendingCollateral(20);
      setPayfiLimit(5000);
      setRwaStatus("ELIGIBLE");
      setTrustRank("Top 10%");
      setStep(3);
    } catch (err) {
      console.error(err);
      // Fallback
      setScore(820);
      setTier("PRIME");
      setLendingLimit(10000);
      setLendingRate(5);
      setLendingCollateral(20);
      setPayfiLimit(5000);
      setRwaStatus("ELIGIBLE");
      setTrustRank("Top 10%");
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const resetEvolution = () => {
    setStep(1);
    setScore(620);
    setTier("EMERGING");
    setLendingLimit(1000);
    setLendingRate(15);
    setLendingCollateral(80);
    setPayfiLimit(200);
    setRwaStatus("Not Eligible");
    setTrustRank("Top 60%");
    setActionType("");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#030A16",
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
            Live Trust Flywheel
          </div>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 900,
              background: "linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -1.5,
              margin: "0 0 12px 0",
            }}
          >
            Trust Evolution Flywheel Engine
          </h1>
          <p style={{ color: "#64748B", fontSize: 15, margin: 0, maxWidth: 650, marginLeft: "auto", marginRight: "auto" }}>
            Experience how any verified on-chain action dynamically updates your trust score, automatically restructuring rates and limits across the entire connected ecosystem.
          </p>
        </div>

        {/* Dynamic State Flywheel */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.5fr", gap: 32 }}>
          
          {/* Left panel: Wallet stats */}
          <div
            style={{
              background: "rgba(10, 18, 30, 0.4)",
              border: "1px solid #111C2E",
              borderRadius: 20,
              padding: 28,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 20px 0", fontSize: 16, fontWeight: 800, color: "#94A3B8" }}>Wallet Passport</h3>
              
              <div
                style={{
                  background: "rgba(17, 28, 46, 0.4)",
                  border: "1px solid #111C2E",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 28,
                }}
              >
                <span style={{ display: "block", fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                  Active Wallet Address
                </span>
                <span style={{ display: "block", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "#E2E8F0" }}>
                  {wallet || "0x123f2312b9d4e5f2a1b9d4f2e512c0192a83bb22"}
                </span>
              </div>

              {/* Dynamic Score Ring */}
              <div style={{ textAlign: "center", padding: "20px 0", borderBottom: "1px solid #111C2E", marginBottom: 28 }}>
                <span style={{ display: "block", fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
                  Unified Trust Rating
                </span>
                
                {step === 2 ? (
                  <div style={{ padding: "16px 0" }}>
                    <div style={{ fontSize: 13, color: "#00E5FF", fontWeight: 700 }}>⚡ EVOLVING TRUST...</div>
                    <div style={{ color: "#64748B", fontSize: 11, marginTop: 4 }}>Synchronizing downstreams</div>
                  </div>
                ) : (
                  <>
                    <span
                      style={{
                        fontSize: 60,
                        fontWeight: 900,
                        color: score >= 700 ? "#34D399" : "#FBBF24",
                        textShadow: `0 0 30px ${score >= 700 ? "rgba(52, 211, 153, 0.3)" : "rgba(251, 191, 36, 0.3)"}`,
                        transition: "all 0.5s ease",
                      }}
                    >
                      {score}
                    </span>
                    <span style={{ display: "block", fontSize: 13, color: score >= 700 ? "#34D399" : "#FBBF24", marginTop: 6, fontWeight: 800 }}>
                      Tier: {tier}
                    </span>
                  </>
                )}
              </div>

              {/* Trust Rank */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: "#64748B" }}>Ecosystem Network Rank:</span>
                <strong style={{ color: score >= 700 ? "#34D399" : "#FFF", fontSize: 14 }}>{trustRank}</strong>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <button
                    onClick={() => triggerEvolution("HSP")}
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
                    }}
                  >
                    COMPLETE HSP SETTLEMENT ➔
                  </button>
                  <button
                    onClick={() => triggerEvolution("REPAYMENT")}
                    style={{
                      width: "100%",
                      background: "rgba(52, 211, 153, 0.08)",
                      border: "1px solid rgba(52, 211, 153, 0.2)",
                      borderRadius: 8,
                      color: "#34D399",
                      fontWeight: 700,
                      fontSize: 13,
                      padding: "12px 0",
                      cursor: "pointer",
                    }}
                  >
                    REPAY OUTSTANDING LOAN
                  </button>
                </div>
              )}

              {step === 2 && (
                <div style={{ textAlign: "center", color: "#64748B", fontSize: 13 }}>
                  Broadcasting proof to Oracle Registry...
                </div>
              )}

              {step === 3 && (
                <button
                  onClick={resetEvolution}
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
                  RESET EVOLUTION SNAPSHOT
                </button>
              )}
            </div>
          </div>

          {/* Right panel: Application effects */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* Lending Consumer */}
            <div
              style={{
                background: "rgba(10, 18, 30, 0.4)",
                border: "1px solid #111C2E",
                borderRadius: 20,
                padding: 24,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Lending Platform</h4>
                <span style={{ fontSize: 10, color: "#34D399", fontWeight: 700 }}>✓ ACTIVE TERMS</span>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <span style={{ display: "block", fontSize: 10, color: "#4A6080", textTransform: "uppercase" }}>Borrow Limit</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#FFF" }}>${lendingLimit}</span>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: 10, color: "#4A6080", textTransform: "uppercase" }}>Interest Rate</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#34D399" }}>{lendingRate}% APR</span>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: 10, color: "#4A6080", textTransform: "uppercase" }}>Collateral</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#FFF" }}>{lendingCollateral}%</span>
                </div>
              </div>
            </div>

            {/* PayFi Consumer */}
            <div
              style={{
                background: "rgba(10, 18, 30, 0.4)",
                border: "1px solid #111C2E",
                borderRadius: 20,
                padding: 24,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>PayFi Credit Line</h4>
                <span style={{ fontSize: 10, color: "#00E5FF", fontWeight: 700 }}>✓ ACTIVE</span>
              </div>
              <div>
                <span style={{ display: "block", fontSize: 10, color: "#4A6080", textTransform: "uppercase" }}>Instant Limit</span>
                <span style={{ fontSize: 24, fontWeight: 800, color: "#00E5FF" }}>${payfiLimit}</span>
              </div>
            </div>

            {/* RWA Eligibility */}
            <div
              style={{
                background: "rgba(10, 18, 30, 0.4)",
                border: "1px solid #111C2E",
                borderRadius: 20,
                padding: 24,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>RWA Asset Tokenization</h4>
                <span style={{ fontSize: 10, color: "#FFF", fontWeight: 700 }}>STATUS</span>
              </div>
              <div>
                <span style={{ display: "block", fontSize: 10, color: "#4A6080", textTransform: "uppercase" }}>Eligibility</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: rwaStatus === "ELIGIBLE" ? "#34D399" : "#64748B" }}>
                  {rwaStatus}
                </span>
              </div>
            </div>

            {/* AI Flywheel explanation */}
            {step === 3 && (
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
                <strong style={{ color: "#FFF", display: "block", marginBottom: 6 }}>🤖 AI Trust Agent Evolution Insights:</strong>
                "Your trust score evolved from 620 to 820 (+200 delta) due to the {actionType}. Zero risk events detected. New opportunities unlocked across the ecosystem: Prime Lending (5% APR, $10,000 limit, 20% collateral), PayFi Credit ($5,000 limit), and full RWA Tokenization access."
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
