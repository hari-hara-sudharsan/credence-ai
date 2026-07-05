"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import LenderStrategy from "@/components/LenderStrategy";
import CapitalAllocation from "@/components/CapitalAllocation";
import AIRecommendations from "@/components/AIRecommendations";
import FundingModal from "@/components/FundingModal";

const DEFAULT_ALLOCATIONS: Record<string, Record<string, number>> = {
  SAFE: { PRIME: 80, TRUSTED: 20, STANDARD: 0, WATCHLIST: 0, HIGH_RISK: 0 },
  BALANCED: { PRIME: 50, TRUSTED: 30, STANDARD: 20, WATCHLIST: 0, HIGH_RISK: 0 },
  HIGH_YIELD: { PRIME: 20, TRUSTED: 20, STANDARD: 30, WATCHLIST: 30, HIGH_RISK: 0 },
};

export default function MatchingPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState("");
  const [capital, setCapital] = useState("5000");
  const [strategy, setStrategy] = useState("BALANCED");
  const [targetReturn, setTargetReturn] = useState("8");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [fundingReq, setFundingReq] = useState<any>(null);
  const [explainData, setExplainData] = useState<any>(null);

  const handleMatch = async () => {
    if (!wallet || wallet.length < 10) {
      setError("Enter a valid wallet address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const resp = await API.post("/matching/lender", {
        wallet,
        capital: parseFloat(capital),
        risk_preference: strategy,
        duration_days: 90,
        target_return: parseFloat(targetReturn),
      });
      setResult(resp.data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Matching failed");
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async (requestId: string) => {
    try {
      const resp = await API.get(`/matching/explain/${requestId}?lender=${wallet}`);
      setExplainData(resp.data);
    } catch (err) {
      console.error("Explain failed:", err);
    }
  };

  const handleFundConfirm = async (requestId: string, lenderWallet: string) => {
    await API.post(`/p2p/fund/${requestId}`, { lender_wallet: lenderWallet });
    setFundingReq(null);
    // Refresh matches
    handleMatch();
  };

  return (
    <main style={{
      minHeight: "100vh", background: "#040C1A", color: "#E2E8F0",
      fontFamily: "Inter, sans-serif", padding: "80px 0 100px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

        {/* Hero */}
        <div style={{
          fontFamily: "JetBrains Mono, monospace", fontSize: 10,
          color: "#60A5FA", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12,
        }}>
          INTELLIGENT CAPITAL DEPLOYMENT
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>
          AI Capital Matching
        </h1>
        <p style={{ fontSize: 16, color: "#64748B", maxWidth: 640, marginBottom: 48, lineHeight: 1.6 }}>
          Deploy capital intelligently using verified wallet reputation.
          AI recommends optimal borrower matches — you decide and approve.
        </p>

        {/* Setup Form */}
        <div style={{
          display: "grid", gridTemplateColumns: result ? "380px 1fr" : "1fr",
          gap: 32, alignItems: "flex-start",
        }}>
          {/* Left: Strategy Setup */}
          <div style={{
            background: "rgba(15,23,42,0.5)", border: "1px solid rgba(100,116,139,0.12)",
            borderRadius: 20, padding: 28,
            position: result ? "sticky" : "static", top: 100,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>Lender Setup</h3>

            {/* Wallet */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, display: "block", marginBottom: 4 }}>
                YOUR WALLET
              </label>
              <input
                type="text" value={wallet} onChange={(e) => setWallet(e.target.value)}
                placeholder="0x..."
                style={{
                  width: "100%", padding: "10px 14px", background: "rgba(4,12,26,0.8)",
                  border: "1px solid rgba(100,116,139,0.2)", borderRadius: 8,
                  color: "#E2E8F0", fontSize: 12, fontFamily: "JetBrains Mono", outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Capital + Return */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, display: "block", marginBottom: 4 }}>
                  CAPITAL (HSK)
                </label>
                <input
                  type="number" value={capital} onChange={(e) => setCapital(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px", background: "rgba(4,12,26,0.8)",
                    border: "1px solid rgba(100,116,139,0.2)", borderRadius: 8,
                    color: "#E2E8F0", fontSize: 12, outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, display: "block", marginBottom: 4 }}>
                  TARGET RETURN (%)
                </label>
                <input
                  type="number" value={targetReturn} onChange={(e) => setTargetReturn(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px", background: "rgba(4,12,26,0.8)",
                    border: "1px solid rgba(100,116,139,0.2)", borderRadius: 8,
                    color: "#E2E8F0", fontSize: 12, outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Strategy Selector */}
            <div style={{ marginBottom: 20 }}>
              <LenderStrategy
                selected={strategy}
                onChange={setStrategy}
                allocation={DEFAULT_ALLOCATIONS[strategy]}
              />
            </div>

            {error && <p style={{ color: "#EF4444", fontSize: 11, marginBottom: 12 }}>{error}</p>}

            <button
              onClick={handleMatch}
              disabled={loading}
              style={{
                width: "100%", padding: "14px",
                background: loading ? "#1E293B" : "linear-gradient(135deg, #60A5FA, #8B5CF6)",
                border: "none", borderRadius: 12,
                color: loading ? "#64748B" : "#fff",
                fontWeight: 800, fontSize: 13, cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "ANALYZING MARKET..." : "FIND MATCHES →"}
            </button>
          </div>

          {/* Right: Results */}
          {result && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Summary */}
              <div style={{
                background: "rgba(96,165,250,0.04)",
                border: "1px solid rgba(96,165,250,0.15)",
                borderRadius: 16, padding: 20,
              }}>
                <div style={{ fontSize: 10, color: "#60A5FA", fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>
                  AI SUMMARY
                </div>
                <p style={{ fontSize: 13, color: "#E2E8F0", margin: 0, lineHeight: 1.6 }}>
                  {result.summary}
                </p>
              </div>

              {/* Allocation Chart */}
              {result.allocation && (
                <CapitalAllocation
                  capital={result.total_capital}
                  allocation={result.allocation}
                />
              )}

              {/* AI Recommendations */}
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>
                  AI Recommended Matches
                </h2>
                <AIRecommendations
                  recommendations={result.recommended}
                  onFund={(id) => {
                    const match = result.recommended.find((r: any) => r.request_id === id);
                    if (match) setFundingReq(match);
                  }}
                  onExplain={handleExplain}
                />
              </div>
            </div>
          )}
        </div>

        {/* Explain Modal */}
        {explainData && (
          <div
            style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
            }}
            onClick={() => setExplainData(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#0F172A", border: "1px solid rgba(96,165,250,0.2)",
                borderRadius: 20, padding: 32, maxWidth: 480, width: "100%",
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#E2E8F0", marginBottom: 6 }}>
                Why This Match?
              </h3>
              <p style={{ fontSize: 12, color: "#64748B", marginBottom: 20 }}>
                AI confidence: <strong style={{ color: "#34D399" }}>{explainData.confidence?.toFixed(0)}%</strong> — Score: <strong>{explainData.overall_score}/100</strong>
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {explainData.factors?.map((f: any, i: number) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    padding: "10px 12px", background: "rgba(4,12,26,0.5)", borderRadius: 10,
                  }}>
                    <span style={{
                      fontSize: 14,
                      color: f.status === "positive" ? "#34D399" : f.status === "warning" ? "#F59E0B" : "#64748B",
                    }}>
                      {f.status === "positive" ? "✓" : f.status === "warning" ? "⚠" : "○"}
                    </span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#E2E8F0" }}>{f.factor}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{f.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setExplainData(null)}
                style={{
                  width: "100%", padding: "12px", background: "rgba(96,165,250,0.1)",
                  border: "1px solid rgba(96,165,250,0.2)", borderRadius: 10,
                  color: "#60A5FA", fontWeight: 700, fontSize: 12, cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Funding Modal */}
        {fundingReq && (
          <FundingModal
            requestId={fundingReq.request_id}
            borrower={fundingReq.borrower}
            amount={fundingReq.amount}
            interestRate={fundingReq.interest_rate}
            onConfirm={handleFundConfirm}
            onClose={() => setFundingReq(null)}
          />
        )}
      </div>
    </main>
  );
}
