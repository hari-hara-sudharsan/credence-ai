"use client";

import { useState } from "react";
import API from "@/lib/api";

interface Props {
  wallet: string;
  onSimulate: (predicted: number, gain: number) => void;
}

export default function ActionSimulator({ wallet, onSimulate }: Props) {
  const [action, setAction] = useState("REPAY_LOAN");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const simulateImpact = async () => {
    if (!wallet) return;
    setLoading(true);
    try {
      const response = await API.post("/optimize/simulate", {
        wallet: wallet,
        action: action
      });
      setResult(response.data);
      onSimulate(response.data.predicted_score, response.data.score_difference);
    } catch (err) {
      alert("Failed to simulate action impact.");
    } finally {
      setLoading(false);
    }
  };

  const actionOptions = [
    { value: "REPAY_LOAN", label: "Repay Active Loan Settle" },
    { value: "INCREASE_ACTIVITY", label: "Increase Contract Interactions" },
    { value: "DIVERSIFY_PROTOCOLS", label: "Diversify Asset Allocations" },
    { value: "BUILD_HISTORY", label: "Build Account History Longevity" },
    { value: "REDUCE_RISK", label: "Lower Exposure Debt Bounds" },
    { value: "IMPROVE_COLLATERAL", label: "Increase Vault Collaterals" }
  ];

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#00E5FF",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        CREDIT ACTION SIMULATOR
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
            CHOOSE SIMULATED ACTION
          </label>
          <div style={{ display: "flex", gap: 12 }}>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
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
            >
              {actionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={simulateImpact}
              disabled={loading || !wallet}
              style={{
                background: "#00E5FF",
                border: "none",
                borderRadius: 8,
                color: "#040C1A",
                fontWeight: 700,
                fontSize: 13,
                padding: "0 20px",
                cursor: loading || !wallet ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "CALCULATING..." : "SIMULATE"}
            </button>
          </div>
        </div>

        {result && (
          <div
            style={{
              background: "#050B14",
              border: "1px solid #111C2E",
              borderRadius: 8,
              padding: 16,
              marginTop: 10,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 9, color: "#64748B", display: "block" }}>PROJECTED SCORE</span>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#34D399" }}>
                  {result.predicted_score}{" "}
                  <span style={{ fontSize: 13, color: "#34D399", fontWeight: 700 }}>
                    (+{result.score_difference})
                  </span>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 9, color: "#64748B", display: "block" }}>CONFIDENCE RATIO</span>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#00E5FF", fontFamily: "JetBrains Mono, monospace" }}>
                  {result.confidence}%
                </div>

              </div>
            </div>

            <p style={{ margin: 0, fontSize: 12, color: "#94A3B8", lineHeight: 1.5 }}>
              <strong>Logic:</strong> {result.reason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
