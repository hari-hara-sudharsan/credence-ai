"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import LoanStatusTracker from "@/components/LoanStatusTracker";

export default function BorrowRequestPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("90");
  const [purpose, setPurpose] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<any>(null);

  // Live credit preview
  const [preview, setPreview] = useState<any>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // My existing requests
  const [myRequests, setMyRequests] = useState<any[]>([]);

  useEffect(() => {
    if (wallet.length >= 10) {
      loadPreview(wallet);
      loadMyRequests(wallet);
    }
  }, [wallet]);

  const loadPreview = async (addr: string) => {
    setLoadingPreview(true);
    try {
      const resp = await API.get(`/analysis?wallet=${addr}`);
      setPreview(resp.data);
    } catch {
      setPreview(null);
    } finally {
      setLoadingPreview(false);
    }
  };

  const loadMyRequests = async (addr: string) => {
    try {
      const resp = await API.get(`/p2p/borrower/${addr}`);
      setMyRequests(resp.data.requests || []);
    } catch {
      setMyRequests([]);
    }
  };

  const handleSubmit = async () => {
    if (!wallet || !amount || !purpose) {
      setError("Please fill all fields");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const resp = await API.post("/p2p/request", {
        wallet,
        amount: parseFloat(amount),
        duration_days: parseInt(duration),
        purpose,
      });
      setSuccess(resp.data);
      loadMyRequests(wallet);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create request");
    } finally {
      setSubmitting(false);
    }
  };

  const creditScore = preview?.credit_score || 0;
  const riskLevel = preview?.risk_level || "---";
  const expectedInterest = creditScore >= 750 ? 5 : creditScore >= 600 ? 8 : creditScore >= 400 ? 12 : 18;
  const approvalProb = creditScore >= 600 ? 94 : creditScore >= 400 ? 72 : creditScore >= 200 ? 48 : 15;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#040C1A",
        color: "#E2E8F0",
        fontFamily: "Inter, sans-serif",
        padding: "80px 0 100px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
        {/* Eyebrow */}
        <div style={{
          fontFamily: "JetBrains Mono, monospace", fontSize: 10,
          color: "#60A5FA", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12,
        }}>
          BORROWER REQUEST
        </div>

        <h1 style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>
          Request Funding
        </h1>
        <p style={{ fontSize: 15, color: "#64748B", marginBottom: 40, lineHeight: 1.6 }}>
          Create a loan request backed by your AI-verified credit reputation.
          Lenders will discover your request in the marketplace.
        </p>

        {success ? (
          /* ── Success State ────────────────────────────────── */
          <div
            style={{
              background: "rgba(52, 211, 153, 0.05)",
              border: "1px solid rgba(52, 211, 153, 0.2)",
              borderRadius: 20,
              padding: 40,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#34D399", marginBottom: 8 }}>
              Request Created!
            </h2>
            <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>
              Your loan request is now live in the marketplace. Lenders can discover and fund it.
            </p>

            <div style={{ maxWidth: 300, margin: "0 auto 24px" }}>
              <LoanStatusTracker currentStatus="REQUESTED" />
            </div>

            <div style={{
              background: "rgba(4, 12, 26, 0.5)", borderRadius: 12, padding: 16,
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "left", marginBottom: 24,
            }}>
              <div>
                <div style={{ fontSize: 10, color: "#64748B" }}>AMOUNT</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{success.amount} HSK</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#64748B" }}>INTEREST</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#34D399" }}>{success.interest_rate}%</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#64748B" }}>CREDIT SCORE</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{success.credit_score}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#64748B" }}>BADGE</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#60A5FA" }}>{success.badge}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => setSuccess(null)}
                style={{
                  padding: "12px 24px", background: "rgba(100,116,139,0.15)",
                  border: "1px solid rgba(100,116,139,0.2)", borderRadius: 10,
                  color: "#E2E8F0", fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}
              >
                Create Another
              </button>
              <button
                onClick={() => router.push("/lend")}
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #34D399, #06B6D4)",
                  border: "none", borderRadius: 10,
                  color: "#040C1A", fontWeight: 800, fontSize: 13, cursor: "pointer",
                }}
              >
                View Marketplace →
              </button>
            </div>
          </div>
        ) : (
          /* ── Form ─────────────────────────────────────────── */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32 }}>
            {/* Left: Form */}
            <div style={{
              background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(100,116,139,0.12)",
              borderRadius: 20, padding: 32,
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 24 }}>Loan Details</h3>

              {/* Wallet */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, display: "block", marginBottom: 6 }}>
                  YOUR WALLET ADDRESS
                </label>
                <input
                  type="text"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  placeholder="0x..."
                  style={{
                    width: "100%", padding: "12px 16px", background: "rgba(4,12,26,0.8)",
                    border: "1px solid rgba(100,116,139,0.2)", borderRadius: 10,
                    color: "#E2E8F0", fontSize: 13, fontFamily: "JetBrains Mono", outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Amount */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, display: "block", marginBottom: 6 }}>
                  LOAN AMOUNT (HSK)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 1000"
                  style={{
                    width: "100%", padding: "12px 16px", background: "rgba(4,12,26,0.8)",
                    border: "1px solid rgba(100,116,139,0.2)", borderRadius: 10,
                    color: "#E2E8F0", fontSize: 13, outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Duration */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, display: "block", marginBottom: 6 }}>
                  DURATION
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 16px", background: "rgba(4,12,26,0.8)",
                    border: "1px solid rgba(100,116,139,0.2)", borderRadius: 10,
                    color: "#E2E8F0", fontSize: 13, cursor: "pointer", boxSizing: "border-box",
                  }}
                >
                  <option value="30">30 Days</option>
                  <option value="60">60 Days</option>
                  <option value="90">90 Days</option>
                  <option value="180">180 Days</option>
                  <option value="365">365 Days</option>
                </select>
              </div>

              {/* Purpose */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, display: "block", marginBottom: 6 }}>
                  PURPOSE
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Trading liquidity, DeFi yield, Business capital"
                  style={{
                    width: "100%", padding: "12px 16px", background: "rgba(4,12,26,0.8)",
                    border: "1px solid rgba(100,116,139,0.2)", borderRadius: 10,
                    color: "#E2E8F0", fontSize: 13, outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>

              {error && <p style={{ color: "#EF4444", fontSize: 12, marginBottom: 16 }}>{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  width: "100%", padding: "14px",
                  background: submitting ? "#1E293B" : "linear-gradient(135deg, #34D399, #06B6D4)",
                  border: "none", borderRadius: 12,
                  color: submitting ? "#64748B" : "#040C1A",
                  fontWeight: 800, fontSize: 14, cursor: submitting ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {submitting ? "CREATING REQUEST..." : "CREATE LOAN REQUEST →"}
              </button>
            </div>

            {/* Right: Live Preview */}
            <div>
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(100,116,139,0.12)",
                  borderRadius: 20,
                  padding: 24,
                  position: "sticky",
                  top: 100,
                }}
              >
                <h4 style={{ fontSize: 11, color: "#34D399", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 20 }}>
                  LIVE CREDIT PREVIEW
                </h4>

                {loadingPreview ? (
                  <p style={{ fontSize: 12, color: "#64748B" }}>Analyzing wallet...</p>
                ) : !wallet || wallet.length < 10 ? (
                  <p style={{ fontSize: 12, color: "#64748B" }}>Enter wallet to see credit data</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 48, fontWeight: 800, color: creditScore >= 600 ? "#34D399" : creditScore >= 400 ? "#F59E0B" : "#EF4444" }}>
                        {creditScore}
                      </div>
                      <div style={{ fontSize: 11, color: "#64748B" }}>Credit Score</div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div style={{ background: "rgba(4,12,26,0.5)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: "#64748B", marginBottom: 4 }}>RISK</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: riskLevel === "LOW" ? "#34D399" : "#F59E0B" }}>{riskLevel}</div>
                      </div>
                      <div style={{ background: "rgba(4,12,26,0.5)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: "#64748B", marginBottom: 4 }}>INTEREST</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#34D399" }}>{expectedInterest}%</div>
                      </div>
                    </div>

                    <div style={{ background: "rgba(4,12,26,0.5)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "#64748B", marginBottom: 4 }}>APPROVAL PROBABILITY</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: approvalProb >= 70 ? "#34D399" : approvalProb >= 40 ? "#F59E0B" : "#EF4444" }}>
                        {approvalProb}%
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* My Requests */}
              {myRequests.length > 0 && (
                <div
                  style={{
                    background: "rgba(15, 23, 42, 0.5)",
                    border: "1px solid rgba(100,116,139,0.12)",
                    borderRadius: 20,
                    padding: 24,
                    marginTop: 16,
                  }}
                >
                  <h4 style={{ fontSize: 11, color: "#60A5FA", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>
                    MY REQUESTS ({myRequests.length})
                  </h4>
                  {myRequests.slice(0, 5).map((r: any) => (
                    <div
                      key={r.request_id}
                      style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "8px 0", borderBottom: "1px solid rgba(100,116,139,0.08)",
                      }}
                    >
                      <span style={{ fontSize: 12, color: "#E2E8F0" }}>{r.amount} HSK</span>
                      <span
                        style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                          color: r.status === "ACTIVE" ? "#34D399" : r.status === "REQUESTED" ? "#60A5FA" : "#F59E0B",
                          background: r.status === "ACTIVE" ? "#34D39910" : r.status === "REQUESTED" ? "#60A5FA10" : "#F59E0B10",
                        }}
                      >
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
