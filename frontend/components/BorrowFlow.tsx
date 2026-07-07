"use client";

import { useState, useEffect } from "react";
import API from "@/lib/api";
import { useWallet } from "@/context/WalletContext";
import WalletAnalysisStep from "./WalletAnalysisStep";
import CreditDecisionStep from "./CreditDecisionStep";
import LoanOfferStep from "./LoanOfferStep";
import OracleVerificationStep from "./OracleVerificationStep";
import SettlementStep from "./SettlementStep";
import RepaymentStep from "./RepaymentStep";
import CreditImprovementStep from "./CreditImprovementStep";

enum BorrowStage {
  CONNECT_WALLET = "CONNECT_WALLET",
  ANALYZING = "ANALYZING",
  CREDIT_READY = "CREDIT_READY",
  OFFER_GENERATED = "OFFER_GENERATED",
  ORACLE_VERIFIED = "ORACLE_VERIFIED",
  LOAN_APPROVED = "LOAN_APPROVED",
  SETTLED = "SETTLED",
  REPAID = "REPAID",
  IMPROVED = "IMPROVED"
}

function generateLoanId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `loan_${ts}_${rand}`;
}

export default function BorrowFlow() {
  const { wallet: connectedWallet, connect, isCorrectChain, switchToMainnet } = useWallet();
  const [walletInput, setWalletInput] = useState("");
  const [session, setSession] = useState<any | null>(null);
  const [stage, setStage] = useState<BorrowStage>(BorrowStage.CONNECT_WALLET);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [allocating, setAllocating] = useState(false);

  // Load initial state from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const savedStage = localStorage.getItem("borrow_stage");
    const savedSession = localStorage.getItem("borrow_session");
    const savedAnalysis = localStorage.getItem("borrow_analysis");
    const savedWallet = localStorage.getItem("borrow_wallet_input");

    if (savedStage) setStage(savedStage as BorrowStage);
    if (savedSession) setSession(JSON.parse(savedSession));
    if (savedAnalysis) setAnalysis(JSON.parse(savedAnalysis));
    if (savedWallet) setWalletInput(savedWallet);
  }, []);

  // Use connected wallet if available, otherwise use manual input
  const activeWallet = connectedWallet || walletInput;

  const allocatePoolCapital = async () => {
    setAllocating(true);
    try {
      // Use actual approved loan amount from analysis, fallback to session data
      const loanAmount = analysis?.lending?.max_loan_amount
        || session?.lending?.max_loan_amount
        || 100;

      await API.post("/pool/borrow", {
        wallet: activeWallet.trim(),
        amount: loanAmount,
        loan_id: generateLoanId()
      });
      await new Promise((r) => setTimeout(r, 600));
      handleStageTransition(BorrowStage.SETTLED);
    } catch (err: any) {
      // Pool allocation is optional — proceed to direct settlement
      // This is expected when pool has insufficient liquidity
      console.warn("Pool allocation unavailable, proceeding to direct settlement:", err?.response?.data?.detail || err);
      await new Promise((r) => setTimeout(r, 400));
      handleStageTransition(BorrowStage.SETTLED);
    } finally {
      setAllocating(false);
    }
  };


  const startSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWallet.trim()) return;

    // Ensure on correct chain
    if (connectedWallet && !isCorrectChain) {
      await switchToMainnet();
    }

    setLoading(true);

    try {
      const res = await API.post("/demo-flow/start", { wallet: activeWallet.trim() });
      setSession(res.data);
      localStorage.setItem("borrow_session", JSON.stringify(res.data));
      localStorage.setItem("borrow_wallet_input", activeWallet.trim());
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("wallet_input_changed"));
      }
      
      // Move to ANALYZING stage
      const nextRes = await API.post("/demo-flow/next", {
        session_id: res.data.session_id,
        next_stage: "ANALYZING"
      });
      setSession(nextRes.data);
      localStorage.setItem("borrow_session", JSON.stringify(nextRes.data));
      setStage(BorrowStage.ANALYZING);
      localStorage.setItem("borrow_stage", BorrowStage.ANALYZING);
    } catch (err) {
      console.error(err);
      // Local fallback in case network issues
      setStage(BorrowStage.ANALYZING);
      localStorage.setItem("borrow_stage", BorrowStage.ANALYZING);
    } finally {
      setLoading(false);
    }
  };

  const handleStageTransition = async (next: BorrowStage) => {
    if (session) {
      try {
        const nextRes = await API.post("/demo-flow/next", {
          session_id: session.session_id,
          next_stage: next
        });
        setSession(nextRes.data);
        localStorage.setItem("borrow_session", JSON.stringify(nextRes.data));
      } catch (err) {
        console.error(err);
      }
    }
    setStage(next);
    localStorage.setItem("borrow_stage", next);
  };

  // Helper to determine step check completion
  const getStepStatus = (stepIndex: number) => {
    const stageMap: Record<BorrowStage, number> = {
      [BorrowStage.CONNECT_WALLET]: 0,
      [BorrowStage.ANALYZING]: 1,
      [BorrowStage.CREDIT_READY]: 2,
      [BorrowStage.OFFER_GENERATED]: 3,
      [BorrowStage.ORACLE_VERIFIED]: 4,
      [BorrowStage.LOAN_APPROVED]: 5,
      [BorrowStage.SETTLED]: 6,
      [BorrowStage.REPAID]: 7,
      [BorrowStage.IMPROVED]: 8,
    };
    const current = stageMap[stage];
    if (current > stepIndex) return "COMPLETED";
    if (current === stepIndex) return "ACTIVE";
    return "PENDING";
  };

  const sidebarSteps = [
    { label: "Wallet", idx: 0 },
    { label: "AI", idx: 2 },
    { label: "Credit", idx: 3 },
    { label: "Loan", idx: 5 },
    { label: "Settlement", idx: 6 }
  ];


  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        gap: 40,
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 16,
        padding: 32,
        boxShadow: "0 12px 48px rgba(0,0,0,0.3)",
      }}
    >
      {/* Sidebar step status list */}
      <div style={{ borderRight: "1px solid #111C2E", paddingRight: 32 }}>
        <h4
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#64748B",
            letterSpacing: 1.5,
            fontFamily: "JetBrains Mono, monospace",
            marginBottom: 24,
            textTransform: "uppercase",
          }}
        >
          Lending Progress
        </h4>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {sidebarSteps.map((s) => {
            const status = getStepStatus(s.idx);
            let color = "#4A6080";
            let indicator = "○";

            if (status === "COMPLETED") {
              color = "#34D399";
              indicator = "✓";
            } else if (status === "ACTIVE") {
              color = "#00E5FF";
              indicator = "●";
            }

            return (
              <div key={s.idx} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 12,
                    fontWeight: 800,
                    color,
                    width: 16,
                    display: "inline-block",
                  }}
                >
                  {indicator}
                </span>
                <span style={{ fontSize: 13, fontWeight: 550, color }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <button
          id="reset-session-btn"
          onClick={() => {
            localStorage.removeItem("borrow_stage");
            localStorage.removeItem("borrow_session");
            localStorage.removeItem("borrow_analysis");
            localStorage.removeItem("borrow_wallet_input");
            setStage(BorrowStage.CONNECT_WALLET);
            setSession(null);
            setAnalysis(null);
            setWalletInput("");
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("wallet_input_changed"));
            }
          }}
          style={{
            marginTop: 40,
            width: "100%",
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: 6,
            color: "#EF4444",
            fontSize: 11,
            fontWeight: 600,
            padding: "8px 12px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            textAlign: "center",
          }}
        >
          Reset Session State
        </button>
      </div>

      {/* Main step details view area */}
      <div>
        {stage === BorrowStage.CONNECT_WALLET && (
          <div style={{ padding: "20px 0" }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#E2E8F0", marginBottom: 10 }}>
              Initiate Under-Collateralized Loan
            </h3>
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 24, lineHeight: 1.5 }}>
              Connect your wallet or input a HashKey address to run the AI Underwriter, retrieve credit limits, verify cryptographic credentials, and settle funds on-chain.
            </p>

            {!connectedWallet && (
              <button
                onClick={connect}
                style={{
                  background: "linear-gradient(135deg, #00C9E4, #0090C8)",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 13,
                  padding: "12px 24px",
                  cursor: "pointer",
                  marginBottom: 16,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Connect MetaMask Wallet
              </button>
            )}

            <form onSubmit={startSession} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
                  WALLET ADDRESS (HASHKEY MAINNET)
                </label>
                <input
                  type="text"
                  value={connectedWallet || walletInput}
                  onChange={(e) => {
                    setWalletInput(e.target.value);
                    localStorage.setItem("borrow_wallet_input", e.target.value);
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new Event("wallet_input_changed"));
                    }
                  }}
                  disabled={!!connectedWallet}
                  placeholder="0x..."
                  style={{
                    width: "100%",
                    background: connectedWallet ? "#0A1425" : "#050B14",
                    border: connectedWallet ? "1px solid #34D39944" : "1px solid #1D2E49",
                    borderRadius: 8,
                    padding: "10px 14px",
                    color: "#E2E8F0",
                    fontSize: 13,
                    fontFamily: "JetBrains Mono, monospace",
                    outline: "none",
                  }}
                />
                {connectedWallet && (
                  <div style={{ fontSize: 10, color: "#34D399", marginTop: 4, fontFamily: "JetBrains Mono, monospace" }}>
                    ✓ Connected via MetaMask
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !activeWallet.trim()}
                style={{
                  background: "#34D399",
                  border: "none",
                  borderRadius: 8,
                  color: "#040C1A",
                  fontWeight: 800,
                  fontSize: 13,
                  padding: "12px 0",
                  cursor: loading || !activeWallet.trim() ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "INITIALIZING SESSION..." : "START LENDING"}
              </button>
            </form>
          </div>
        )}

        {stage === BorrowStage.ANALYZING && (
          <WalletAnalysisStep
            wallet={activeWallet}
            onComplete={(data) => {
              setAnalysis(data);
              localStorage.setItem("borrow_analysis", JSON.stringify(data));
              handleStageTransition(BorrowStage.CREDIT_READY);
            }}
          />
        )}

        {stage === BorrowStage.CREDIT_READY && (
          <CreditDecisionStep
            analysis={analysis}
            wallet={activeWallet}
            onNext={(reportData) => {
              const updatedAnalysis = { ...analysis, ...reportData };
              setAnalysis(updatedAnalysis);
              localStorage.setItem("borrow_analysis", JSON.stringify(updatedAnalysis));
              handleStageTransition(BorrowStage.OFFER_GENERATED);
            }}
          />
        )}

        {stage === BorrowStage.OFFER_GENERATED && (
          <LoanOfferStep
            analysis={analysis}
            session={session}
            onNext={() => handleStageTransition(BorrowStage.ORACLE_VERIFIED)}
          />
        )}

        {stage === BorrowStage.ORACLE_VERIFIED && (
          <OracleVerificationStep
            wallet={activeWallet}
            onNext={() => handleStageTransition(BorrowStage.LOAN_APPROVED)}
          />
        )}

        {stage === BorrowStage.LOAN_APPROVED && (
          <div style={{ padding: "10px 0" }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#E2E8F0", marginBottom: 16 }}>
              Smart Contract Validation
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#94A3B8" }}>Credit Policy Evaluation</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#34D399" }}>PASSED ✓</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#94A3B8" }}>Oracle Attestation Verification</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#34D399" }}>VERIFIED ✓</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#94A3B8" }}>Risk Limit Check</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#34D399" }}>APPROVED ✓</span>
              </div>
            </div>

            <button
              onClick={allocatePoolCapital}
              disabled={allocating}
              style={{
                width: "100%",
                background: "#34D399",
                border: "none",
                borderRadius: 8,
                color: "#040C1A",
                fontWeight: 800,
                fontSize: 13,
                padding: "12px 0",
                cursor: allocating ? "not-allowed" : "pointer",
              }}
            >
              {allocating ? "ALLOCATING POOL CAPITAL..." : "ALLOCATE POOL CAPITAL ➔"}
            </button>

          </div>
        )}

        {stage === BorrowStage.SETTLED && (
          <SettlementStep
            wallet={activeWallet}
            onComplete={() => handleStageTransition(BorrowStage.REPAID)}
          />
        )}

        {stage === BorrowStage.REPAID && (
          <RepaymentStep
            wallet={activeWallet}
            loanAmount={analysis?.lending?.max_loan_amount || session?.lending?.max_loan_amount || 100}
            onComplete={() => handleStageTransition(BorrowStage.IMPROVED)}
          />
        )}

        {stage === BorrowStage.IMPROVED && (
          <CreditImprovementStep
            creditScore={analysis?.credit_score || session?.credit_score || 0}
            interestRate={analysis?.lending?.interest_rate || session?.lending?.interest_rate || 15}
          />
        )}
      </div>
    </div>
  );
}
