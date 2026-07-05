"use client";

import { useState } from "react";
import API from "@/lib/api";
import OptimizationScore from "@/components/OptimizationScore";
import ImprovementPlan from "@/components/ImprovementPlan";
import ActionSimulator from "@/components/ActionSimulator";
import ProgressTracker from "@/components/ProgressTracker";
import RecommendationCard from "@/components/RecommendationCard";

export default function OptimizePage() {
  const [wallet, setWallet] = useState("");
  const [activeWallet, setActiveWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any | null>(null);
  const [progress, setProgress] = useState<any | null>(null);
  
  const [goal, setGoal] = useState("Institutional Grade");
  const [goalResult, setGoalResult] = useState<any | null>(null);
  const [goalLoading, setGoalLoading] = useState(false);
  
  const [error, setError] = useState<string | null>(null);

  const loadPlan = async () => {
    if (!wallet.trim()) {
      alert("Please input a valid wallet address.");
      return;
    }

    setLoading(true);
    setError(null);
    setActiveWallet(wallet.trim());

    try {
      const [planResp, progResp] = await Promise.all([
        API.get(`/optimize/${wallet.trim()}`),
        API.get(`/optimize/progress/${wallet.trim()}`)
      ]);

      setPlan(planResp.data);
      setProgress(progResp.data);

      // Load initial goal parameters
      setGoalResult(null);
    } catch (err: any) {
      setError("Failed to generate optimization plan.");
    } finally {
      setLoading(false);
    }
  };

  const optimizeGoal = async () => {
    if (!activeWallet || !goal.trim()) return;
    setGoalLoading(true);
    try {
      const response = await API.post("/optimize/goal", {
        wallet: activeWallet,
        target_goal: goal.trim()
      });
      setGoalResult(response.data);
    } catch (err) {
      alert("Goal optimization calculation failed.");
    } finally {
      setGoalLoading(false);
    }
  };

  const handleSimulate = (predicted: number, gain: number) => {
    // Dynamically update UI parameters to display simulated projections on the fly!
    if (progress) {
      setProgress((prev: any) => ({
        ...prev,
        current_score: predicted,
        progress_percent: Math.min(Math.round(((predicted - 300) / (prev.target_score - 300)) * 100), 100)
      }));
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
          <span>TRAJECTORY STRATEGY NODE</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>REMEDIATION ENGINE</span>
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
            Credit Optimization Engine
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
            AI-powered action simulations and optimization roadmaps to actively build your financial reputation.
          </p>
        </div>

        {/* Search controls */}
        <div
          style={{
            background: "#0A1425",
            border: "1px solid #111C2E",
            borderRadius: 14,
            padding: 24,
            marginBottom: 32,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            display: "flex",
            gap: 16,
          }}
        >
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="Input Wallet Address (0x...) to diagnose weaknesses and generate roadmap"
            style={{
              flex: 1,
              background: "#050B14",
              border: "1px solid #1D2E49",
              borderRadius: 8,
              padding: "12px 16px",
              color: "#E2E8F0",
              fontSize: 14,
              outline: "none",
              fontFamily: "JetBrains Mono, monospace",
            }}
          />
          <button
            onClick={loadPlan}
            disabled={loading}
            style={{
              background: "#00E5FF",
              border: "none",
              borderRadius: 8,
              color: "#040C1A",
              fontWeight: 700,
              fontSize: 14,
              padding: "0 32px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "DIAGNOSING..." : "ANALYZE WALLET"}
          </button>
        </div>

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

        {activeWallet && plan && progress && (
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32, alignItems: "start" }}>
            
            {/* Left column: Score monitors and actions roadmap */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <OptimizationScore
                currentScore={progress.current_score}
                targetScore={progress.target_score}
                progressPercent={progress.progress_percent}
              />

              <ImprovementPlan actions={plan.actions} />
            </div>

            {/* Right column: Action simulations and Goal target engine */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              
              <ActionSimulator wallet={activeWallet} onSimulate={handleSimulate} />

              <ProgressTracker currentScore={progress.current_score} />

              {/* Goal Optimizer Panel */}
              <div
                style={{
                  background: "#0A1425",
                  border: "1px solid #111C2E",
                  borderRadius: 14,
                  padding: 24,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#4A6080",
                      letterSpacing: 2,
                      fontFamily: "JetBrains Mono, monospace",
                      marginBottom: 16,
                    }}
                  >
                    CREDIT GOAL TARGET OPTIMIZER
                  </div>
                  
                  <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
                    SET REPUTATION TARGET GOAL
                  </label>
                  <div style={{ display: "flex", gap: 12 }}>
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      style={{
                        flex: 1,
                        background: "#050B14",
                        border: "1px solid #1D2E49",
                        borderRadius: 8,
                        padding: "8px 12px",
                        color: "#E2E8F0",
                        fontSize: 13,
                        outline: "none",
                      }}
                    />
                    <button
                      onClick={optimizeGoal}
                      disabled={goalLoading}
                      style={{
                        background: "#00E5FF",
                        border: "none",
                        borderRadius: 8,
                        color: "#040C1A",
                        fontWeight: 700,
                        fontSize: 13,
                        padding: "0 20px",
                        cursor: goalLoading ? "not-allowed" : "pointer",
                      }}
                    >
                      {goalLoading ? "OPTIMIZING..." : "OPTIMIZE GOAL"}
                    </button>
                  </div>
                </div>

                {goalResult && <RecommendationCard goalResult={goalResult} />}
              </div>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}
