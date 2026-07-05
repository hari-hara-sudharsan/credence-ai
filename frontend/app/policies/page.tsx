"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import PolicyBuilder from "@/components/PolicyBuilder";
import PolicyCard from "@/components/PolicyCard";
import PolicyResult from "@/components/PolicyResult";
import PolicyExecutionFlow from "@/components/PolicyExecutionFlow";

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Execution state
  const [execWallet, setExecWallet] = useState("");
  const [selectedPolicyId, setSelectedPolicyId] = useState("");
  const [executing, setExecuting] = useState(false);
  const [evalResult, setEvalResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = async () => {
    setLoadingList(true);
    try {
      const response = await API.get("/policies");
      setPolicies(response.data);
      if (response.data.length > 0 && !selectedPolicyId) {
        setSelectedPolicyId(response.data[0].policy_id);
      }
    } catch (err) {
      console.error("Failed to fetch policies:", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleDeletePolicy = async (id: string) => {
    if (confirm("Are you sure you want to delete this credit policy?")) {
      try {
        await API.delete(`/policies/${id}`);
        alert("Policy deleted successfully.");
        await fetchPolicies();
        if (selectedPolicyId === id) {
          setSelectedPolicyId("");
          setEvalResult(null);
        }
      } catch (err) {
        alert("Failed to delete policy.");
      }
    }
  };

  const handleEvaluate = async () => {
    if (!execWallet.trim()) {
      alert("Please enter a wallet address.");
      return;
    }
    if (!selectedPolicyId) {
      alert("Please select a policy.");
      return;
    }

    setExecuting(true);
    setEvalResult(null);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await API.post("/policies/evaluate", {
        wallet: execWallet.trim(),
        policy_id: selectedPolicyId
      });
      setEvalResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Evaluation failed. Verify the target wallet has passport credentials.");
    } finally {
      setExecuting(false);
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
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
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
          <span>PROGRAMMABLE CREDIT CONTROLLERS</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>MILESTONE D</span>
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
            Programmable Credit Policies
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
            Define credit requirements once. Distribute and evaluate them dynamically across any protocol in the HashKey ecosystem.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 40, alignItems: "start" }}>
          {/* Policy Builder Form */}
          <PolicyBuilder onSuccess={fetchPolicies} />

          {/* Execute policy form block */}
          <div
            style={{
              background: "#0A1425",
              border: "1px solid #111C2E",
              borderRadius: 14,
              padding: 24,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#4A6080",
                letterSpacing: 1.5,
                fontFamily: "JetBrains Mono, monospace",
                marginBottom: 20,
              }}
            >
              EXECUTE POLICY EVALUATOR
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
                  TARGET WALLET ADDRESS
                </label>
                <input
                  type="text"
                  value={execWallet}
                  onChange={(e) => setExecWallet(e.target.value)}
                  placeholder="Enter Wallet Address (0x...)"
                  style={{
                    width: "100%",
                    background: "#050B14",
                    border: "1px solid #1D2E49",
                    borderRadius: 8,
                    padding: "10px 14px",
                    color: "#E2E8F0",
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
                  SELECT POLICY RULES TEMPLATE
                </label>
                {policies.length === 0 ? (
                  <div style={{ fontSize: 12, color: "#64748B" }}>No policies registered. Create one first.</div>
                ) : (
                  <select
                    value={selectedPolicyId}
                    onChange={(e) => setSelectedPolicyId(e.target.value)}
                    style={{
                      width: "100%",
                      background: "#050B14",
                      border: "1px solid #1D2E49",
                      borderRadius: 8,
                      padding: "10px 12px",
                      color: "#E2E8F0",
                      fontSize: 13,
                      outline: "none",
                      height: 38,
                    }}
                  >
                    {policies.map((p) => (
                      <option key={p.policy_id} value={p.policy_id}>
                        {p.policy_name} (v{p.version})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <button
                onClick={handleEvaluate}
                disabled={executing || !execWallet.trim() || !selectedPolicyId}
                style={{
                  background: "#00E5FF",
                  border: "none",
                  borderRadius: 8,
                  color: "#040C1A",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "12px 20px",
                  cursor: executing || !execWallet.trim() || !selectedPolicyId ? "not-allowed" : "pointer",
                  opacity: executing ? 0.6 : 1,
                }}
              >
                {executing ? "EVALUATING COMPLIANCE..." : "EXECUTE POLICY EVALUATION"}
              </button>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div
            style={{
              background: "rgba(255, 77, 106, 0.08)",
              border: "1px solid rgba(255, 77, 106, 0.3)",
              borderRadius: 8,
              padding: "16px 20px",
              color: "#FF4D6A",
              fontSize: 14,
              marginBottom: 32,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Evaluation Output section */}
        {evalResult && (
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32, marginBottom: 40, animation: "fade-in 0.4s ease" }}>
            <PolicyResult result={evalResult} />
            <PolicyExecutionFlow passed={evalResult.passed} />
          </div>
        )}

        {/* Header segment for registered list */}
        <div style={{ margin: "48px 0 20px" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#E2E8F0", marginBottom: 6 }}>
            Ecosystem Registered Policies
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
            Inspect active programmable policy configurations currently live on the verification gateway network.
          </p>
        </div>

        {/* Policies List grid */}
        {loadingList && policies.length === 0 ? (
          <div style={{ color: "#64748B", textAlign: "center", padding: "40px 0" }}>
            LOADING ACTIVE POLICIES...
          </div>
        ) : policies.length === 0 ? (
          <div style={{ background: "#050B14", border: "1px dashed #1D2E49", borderRadius: 12, padding: "40px 0", textAlign: "center", color: "#64748B" }}>
            No credit policies registered. Use the builder above to set up a template.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {policies.map((policy) => (
              <PolicyCard key={policy.policy_id} policy={policy} onDelete={handleDeletePolicy} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
