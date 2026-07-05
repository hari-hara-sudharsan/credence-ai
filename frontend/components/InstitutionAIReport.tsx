"use client";

import { useState } from "react";
import API from "@/lib/api";

interface Props {
  initialReport: string;
}

export default function InstitutionAIReport({ initialReport }: Props) {
  const [scenario, setScenario] = useState("MARKET_CRASH");
  const [severity, setSeverity] = useState("HIGH");
  const [loading, setLoading] = useState(false);
  const [stressResult, setStressResult] = useState<any | null>(null);

  const triggerStressTest = async () => {
    setLoading(true);
    try {
      const response = await API.post("/institution/stress-test", {
        scenario: scenario,
        severity: severity
      });
      setStressResult(response.data);
    } catch (err) {
      alert("Stress testing simulation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#00E5FF", letterSpacing: 2, fontFamily: "JetBrains Mono, monospace", marginBottom: 12 }}>
          AI NARRATIVE INTEGRITY REPORT
        </div>
        <p style={{ margin: 0, fontSize: 13, color: "#94A3B8", lineHeight: 1.5 }}>
          {initialReport}
        </p>
      </div>

      <div style={{ borderTop: "1px solid #111C2E", paddingTop: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#FF4D6A", letterSpacing: 2, fontFamily: "JetBrains Mono, monospace", marginBottom: 16 }}>
          STRESS TESTING SIMULATOR
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 10, color: "#64748B", display: "block", marginBottom: 4 }}>
              SCENARIO
            </label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              style={{
                width: "100%",
                background: "#050B14",
                border: "1px solid #1D2E49",
                borderRadius: 8,
                padding: "8px 12px",
                color: "#E2E8F0",
                fontSize: 13,
                outline: "none",
              }}
            >
              <option value="MARKET_CRASH">MARKET CRASH</option>
              <option value="LIQUIDITY_CRUNCH">LIQUIDITY CRUNCH</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 10, color: "#64748B", display: "block", marginBottom: 4 }}>
              SEVERITY
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              style={{
                width: "100%",
                background: "#050B14",
                border: "1px solid #1D2E49",
                borderRadius: 8,
                padding: "8px 12px",
                color: "#E2E8F0",
                fontSize: 13,
                outline: "none",
              }}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>

          <button
            onClick={triggerStressTest}
            disabled={loading}
            style={{
              background: "#FF4D6A",
              border: "none",
              borderRadius: 8,
              color: "#E2E8F0",
              fontWeight: 700,
              fontSize: 13,
              padding: "0 20px",
              height: 36,
              marginTop: 18,
              cursor: "pointer",
            }}
          >
            {loading ? "SIMULATING..." : "RUN STRESS"}
          </button>
        </div>

        {stressResult && (
          <div
            style={{
              background: "#050B14",
              border: "1px solid #1D2E49",
              borderRadius: 8,
              padding: 16,
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 9, color: "#64748B", display: "block" }}>CURRENT HEALTH</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#34D399" }}>
                  {stressResult.current_health}
                </span>
              </div>
              <div>
                <span style={{ fontSize: 9, color: "#64748B", display: "block" }}>PROJECTED HEALTH</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#FF4D6A" }}>
                  {stressResult.projected_health}
                </span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: 9, color: "#64748B", display: "block", marginBottom: 6 }}>
                MITIGATION ACTIONS ROADMAP
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {stressResult.recommended_actions.map((act: string, i: number) => (
                  <div key={i} style={{ fontSize: 11, color: "#94A3B8" }}>
                    ⚠️ {act}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
