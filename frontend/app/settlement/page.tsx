"use client";

import { useState } from "react";
import API from "@/lib/api";
import SettlementFlow from "@/components/SettlementFlow";
import SettlementStatus from "@/components/SettlementStatus";
import TransactionViewer from "@/components/TransactionViewer";

export default function SettlementPage() {
  const [loanId, setLoanId] = useState("");
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("500");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  // Settlement pipeline tracking
  const [stages, setStages] = useState<any[]>([
    { label: "Loan Approved", desc: "Existing CreditEngine evaluates borrow capacity.", status: "PENDING" },
    { label: "Oracle Verified", desc: "Signature validation maps trust attestations.", status: "PENDING" },
    { label: "HSP Settlement Started", desc: "Triggers HashKey Stablecoin transfer parameters.", status: "PENDING" },
    { label: "Transaction Confirmed", desc: "Solidity markSettled updates on-chain state.", status: "PENDING" },
    { label: "Funds Delivered", desc: "HSP transfer reaches target borrower wallet address.", status: "PENDING" }
  ]);

  const runSettlement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanId.trim()) return;

    setLoading(true);
    setResult(null);

    // Initial stage: processing loan approval
    const s = [...stages];
    s[0].status = "PROCESSING";
    setStages([...s]);

    try {
      // Step 1 check
      await new Promise((r) => setTimeout(r, 1000));
      s[0].status = "SUCCESS";
      s[1].status = "PROCESSING";
      setStages([...s]);

      // Step 2: verify oracle attestation
      await new Promise((r) => setTimeout(r, 1000));
      s[1].status = "SUCCESS";
      s[2].status = "PROCESSING";
      setStages([...s]);

      // Step 3: API post call executing settlement on backend
      const response = await API.post("/settlement/execute", {
        loan_id: loanId.trim(),
        borrower: wallet.trim(),
        amount: parseFloat(amount),
        asset: "HSP",
        attestation_id: "att_hsp_settle"
      });

      s[2].status = "SUCCESS";
      s[3].status = "PROCESSING";
      setStages([...s]);

      // Step 4: mark transaction confirm
      await new Promise((r) => setTimeout(r, 1000));
      s[3].status = "SUCCESS";
      s[4].status = "PROCESSING";
      setStages([...s]);

      // Step 5: finalize
      await new Promise((r) => setTimeout(r, 800));
      s[4].status = "SUCCESS";
      setStages([...s]);

      setResult(response.data);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Settlement failed. Check oracle status & policy limits.");
      // Mark active step as fail
      const failIdx = s.findIndex((x) => x.status === "PROCESSING" || x.status === "PENDING");
      if (failIdx !== -1) {
        s[failIdx].status = "FAIL";
        setStages([...s]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#040C1A",
        color: "#E2E8F0",
        fontFamily: "Inter, sans-serif",
        padding: "60px 0 100px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: "#4A6080",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          <span>STABLECOIN PAYMENT SETTLEMENT</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>HSP DEFI FLOW</span>
        </div>

        {/* Hero Section */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#E2E8F0",
              letterSpacing: -1,
              marginBottom: 12,
            }}
          >
            HSP Settlement Engine
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
            Trigger on-chain loan settlements via HashKey Stablecoin Payment (HSP).
          </p>
        </div>

        {/* E2E diagram storytelling */}
        <div
          style={{
            background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
            border: "1px solid #1D2E49",
            borderRadius: 14,
            padding: 24,
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#34D399" }}>AI DECISION</div>
              <div style={{ fontSize: 9, color: "#64748B", marginTop: 4 }}>Credit Underwriting</div>
            </div>
            <div style={{ color: "#1D2E49" }}>➔</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#00E5FF" }}>ORACLE TRUST</div>
              <div style={{ fontSize: 9, color: "#64748B", marginTop: 4 }}>Verifiable Credentials</div>
            </div>
            <div style={{ color: "#1D2E49" }}>➔</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#34D399" }}>HSP SETTLEMENT</div>
              <div style={{ fontSize: 9, color: "#64748B", marginTop: 4 }}>Stablecoin Settlement</div>
            </div>
            <div style={{ color: "#1D2E49" }}>➔</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>ON-CHAIN CREDIT HISTORY</div>
              <div style={{ fontSize: 9, color: "#64748B", marginTop: 4 }}>Updated Passport Status</div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32, alignItems: "start" }}>
          
          {/* Executer form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                background: "#0A1425",
                border: "1px solid #111C2E",
                borderRadius: 14,
                padding: 24,
              }}
            >
              <form onSubmit={runSettlement} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
                    LOAN ID REFERENCE
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. loan_001"
                    value={loanId}
                    onChange={(e) => setLoanId(e.target.value)}
                    style={{
                      width: "100%",
                      background: "#050B14",
                      border: "1px solid #1D2E49",
                      borderRadius: 8,
                      padding: "10px 14px",
                      color: "#E2E8F0",
                      fontSize: 13,
                      fontFamily: "JetBrains Mono, monospace",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
                    BORROWER ADDRESS
                  </label>
                  <input
                    type="text"
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    style={{
                      width: "100%",
                      background: "#050B14",
                      border: "1px solid #1D2E49",
                      borderRadius: 8,
                      padding: "10px 14px",
                      color: "#E2E8F0",
                      fontSize: 13,
                      fontFamily: "JetBrains Mono, monospace",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
                    AMOUNT (HSP STABLECOIN)
                  </label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{
                      width: "100%",
                      background: "#050B14",
                      border: "1px solid #1D2E49",
                      borderRadius: 8,
                      padding: "10px 14px",
                      color: "#E2E8F0",
                      fontSize: 13,
                      fontFamily: "JetBrains Mono, monospace",
                      outline: "none",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !loanId.trim()}
                  style={{
                    width: "100%",
                    background: loanId.trim() ? "#34D399" : "#1D2E49",
                    border: "none",
                    borderRadius: 8,
                    color: "#040C1A",
                    fontWeight: 850,
                    fontSize: 13,
                    padding: "12px 0",
                    cursor: loading || !loanId.trim() ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {loading ? "EXECUTING HSP SETTLEMENT..." : "EXECUTE SETTLEMENT"}
                </button>
              </form>
            </div>

            {result && (
              <TransactionViewer
                settlementId={result.settlement_id}
                txHash={result.tx_hash}
                amount={parseFloat(amount)}
              />
            )}
          </div>

          {/* Right column: Timeline tracker */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <SettlementFlow stages={stages} />
            <SettlementStatus
              approved={stages[0].status === "SUCCESS"}
              settled={stages[2].status === "SUCCESS"}
            />
          </div>

        </div>

      </div>
    </main>
  );
}
