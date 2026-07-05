"use client";

import { useState } from "react";
import API from "@/lib/api";
import RiskForecast from "@/components/RiskForecast";
import CreditTrajectory from "@/components/CreditTrajectory";
import DefaultPrediction from "@/components/DefaultPrediction";
import FinancialSignals from "@/components/FinancialSignals";
import RiskTimeline from "@/components/RiskTimeline";

export default function IntelligencePage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any | null>(null);
  const [forecast, setForecast] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simulation states
  const [simScenario, setSimScenario] = useState("REPAY_LOAN");
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<any | null>(null);

  const handleSearch = async () => {
    if (!address.trim()) {
      setError("Please input a valid wallet address.");
      return;
    }
    setLoading(true);
    setReport(null);
    setForecast(null);
    setSimResult(null);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      const [repResp, foreResp] = await Promise.all([
        API.get(`/intelligence/${address.trim()}`),
        API.get(`/intelligence/${address.trim()}/forecast`)
      ]);

      setReport(repResp.data);
      setForecast(foreResp.data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Failed to load financial intelligence metrics. Confirm target wallet has active credential state."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    if (!address.trim()) return;
    setSimLoading(true);
    setSimResult(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const response = await API.post("/intelligence/simulate", {
        wallet: address.trim(),
        scenario: simScenario
      });
      setSimResult(response.data);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Simulation failed.");
    } finally {
      setSimLoading(false);
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
          <span>PREDICTIVE FINANCIAL MODELLING</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>FORWARD-LOOKING RISK ENGINE</span>
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
            AI Financial Intelligence
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
            Forecast future wallet risk metrics, score trajectories, default outcomes, and credit event scenarios before they occur.
          </p>
        </div>

        {/* Search bar */}
        <div
          style={{
            background: "#0A1425",
            border: "1px solid #111C2E",
            borderRadius: 14,
            padding: 24,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#4A6080",
              letterSpacing: 1.5,
              fontFamily: "JetBrains Mono, monospace",
              marginBottom: 16,
            }}
          >
            FORECAST ANALYSIS TARGET
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Input Target Wallet Address (0x...)"
              style={{
                flex: 1,
                background: "#050B14",
                border: "1px solid #1D2E49",
                borderRadius: 8,
                padding: "12px 16px",
                color: "#E2E8F0",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 14,
                outline: "none",
              }}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !address.trim()}
              style={{
                background: "#00E5FF",
                border: "none",
                borderRadius: 8,
                color: "#040C1A",
                fontWeight: 700,
                fontSize: 14,
                padding: "0 24px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "all 0.2s ease",
              }}
            >
              {loading ? "PROCESSING AI..." : "FORECAST PROFILE"}
            </button>
          </div>

          {error && (
            <div style={{ color: "#FF4D6A", fontSize: 13, marginTop: 12, fontFamily: "Inter, sans-serif" }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {report && forecast && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32, animation: "fade-in 0.4s ease" }}>
            
            {/* Trajectory and risk indicators row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 32 }}>
              <RiskForecast
                currentRisk={forecast.current_risk}
                predictedRisk={forecast.predicted_risk}
                confidence={forecast.confidence}
              />
              <CreditTrajectory
                currentScore={report.current_score}
                predictedScore={report.predicted_score}
                trajectory={report.trajectory}
              />
            </div>

            {/* Probability Outlook and timeline row */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32 }}>
              <RiskTimeline
                currentScore={report.current_score}
                predictedScore={report.predicted_score}
                trajectory={report.trajectory}
              />
              <DefaultPrediction
                now={report.default_probability_now}
                future={report.default_probability_future}
              />
            </div>

            {/* Risk Signals detection */}
            <FinancialSignals signals={report.signals} />

            {/* Interactive Scenario Simulator segment */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 32,
              }}
            >
              {/* Simulation input card */}
              <div
                style={{
                  background: "#0A1425",
                  border: "1px solid #111C2E",
                  borderRadius: 14,
                  padding: 24,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: "#4A6080", letterSpacing: 1.5, fontFamily: "JetBrains Mono, monospace", marginBottom: 16 }}>
                  CREDIT TRAJECTORY SIMULATOR
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
                      SIMULATION SCENARIO
                    </label>
                    <select
                      value={simScenario}
                      onChange={(e) => setSimScenario(e.target.value)}
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
                      <option value="REPAY_LOAN">Settle Active Loan Repayment (+48)</option>
                      <option value="TAKE_NEW_LOAN">Acquire New Borrow Exposure (-35)</option>
                      <option value="DEFAULT_LOAN">Trigger Credit Repayment Default (-150)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSimulate}
                    disabled={simLoading}
                    style={{
                      background: "#FFB830",
                      border: "none",
                      borderRadius: 8,
                      color: "#040C1A",
                      fontWeight: 700,
                      fontSize: 14,
                      padding: "12px 20px",
                      cursor: simLoading ? "not-allowed" : "pointer",
                      opacity: simLoading ? 0.6 : 1,
                    }}
                  >
                    {simLoading ? "CALCULATING..." : "RUN RISK SIMULATION"}
                  </button>
                </div>
              </div>

              {/* Simulation Result Output */}
              <div
                style={{
                  background: "#0A1425",
                  border: `1px solid ${simResult ? (simResult.impact.startsWith("+") ? "#34D399" : "#FF4D6A") : "#111C2E"}`,
                  borderRadius: 14,
                  padding: 24,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {simResult ? (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>Simulated State Score</span>
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: simResult.impact.startsWith("+") ? "#34D399" : "#FF4D6A",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        {simResult.impact} Impact
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>BASELINE</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: "#94A3B8" }}>{simResult.current_score}</div>
                      </div>
                      <div style={{ fontSize: 18, color: "#4A6080" }}>→</div>
                      <div>
                        <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>SIMULATED</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: "#E2E8F0" }}>{simResult.simulated_score}</div>
                      </div>
                    </div>

                    <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.4 }}>
                      {simResult.reason}
                    </div>
                  </div>
                ) : (
                  <div style={{ color: "#64748B", fontSize: 12, textAlign: "center" }}>
                    Select a scenario and click run to view simulated credit ratings trajectory.
                  </div>
                )}
              </div>
            </div>

            {/* AI Explanation Recommendations Box */}
            <div
              style={{
                background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
                border: "1px solid #1D2E49",
                borderRadius: 14,
                padding: 24,
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "#00E5FF", letterSpacing: 1.5, fontFamily: "JetBrains Mono, monospace", marginBottom: 12 }}>
                CREDIT REMEDIATION ADVICE (AI INSIGHT)
              </div>
              <div style={{ fontSize: 14, color: "#E2E8F0", lineHeight: 1.6, marginBottom: 16 }}>
                Based on historical credit repayments behaviors and features velocity checks, this wallet shows an{" "}
                <strong style={{ color: report.trajectory === "IMPROVING" ? "#34D399" : "#FF4D6A" }}>{report.trajectory.toLowerCase()}</strong>{" "}
                financial reliability profile index over the next 90 days.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {report.recommendations.map((rec: string, i: number) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 12, color: "#94A3B8" }}>
                    <span>⚡</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
