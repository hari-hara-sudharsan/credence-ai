"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import DemoControlCenter from "@/components/DemoControlCenter";
import JourneyTimeline from "@/components/JourneyTimeline";
import ScenarioRunner from "@/components/ScenarioRunner";
import SystemValidation from "@/components/SystemValidation";
import DemoMetrics from "@/components/DemoMetrics";

export default function DemoPage() {
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  
  // Validation status
  const [validation, setValidation] = useState<any | null>(null);

  // Demo reports
  const [report, setReport] = useState<any | null>(null);

  // Judge Mode
  const [judgeMode, setJudgeMode] = useState<any | null>(null);

  // Current execution result
  const [runResult, setRunResult] = useState<any | null>(null);

  const loadDemoData = async () => {
    setLoading(true);
    try {
      const [sResp, vResp, rResp, jResp] = await Promise.all([
        API.get("/demo/scenarios"),
        API.get("/demo/validation"),
        API.get("/demo/report"),
        API.get("/demo/judge-mode")
      ]);

      setScenarios(sResp.data || []);
      setValidation(vResp.data);
      setReport(rResp.data);
      setJudgeMode(jResp.data);
    } catch (err) {
      console.error("Failed to load system configs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunScenario = async () => {
    if (!activeScenario) return;
    setRunning(true);
    setRunResult(null);
    try {
      const response = await API.post(`/demo/run/${activeScenario}`);
      setRunResult(response.data);
      
      // Refresh status report and metrics count
      const [vResp, rResp] = await Promise.all([
        API.get("/demo/validation"),
        API.get("/demo/report")
      ]);
      setValidation(vResp.data);
      setReport(rResp.data);
    } catch (err) {
      alert("Scenario execution failed.");
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    loadDemoData();
  }, []);

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
          <span>INTELLIGENT SYSTEM COCKPIT</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>E2E SYSTEM VALIDATION</span>
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
            Live Infrastructure Validation
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
            Trigger real system components end-to-end to simulate borrower journeys, protocol checks, and institutional risks scans.
          </p>
        </div>

        {loading ? (
          <div style={{ color: "#64748B", textAlign: "center", padding: "100px 0" }}>
            CONSOLIDATING INFRASTRUCTURE SCHEMAS...
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            
            {/* Judge Mode Panel */}
            {judgeMode && (
              <div
                style={{
                  background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
                  border: "1px solid #1D2E49",
                  borderRadius: 14,
                  padding: 24,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                  display: "grid",
                  gridTemplateColumns: "1.2fr 2fr",
                  gap: 32,
                  alignItems: "center",
                }}
              >
                <div>
                  <span style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                    JUDGE EVALUATION STORY
                  </span>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#E2E8F0", margin: "8px 0 0" }}>
                    "{judgeMode.story}"
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <span style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", display: "block", marginBottom: 6 }}>
                      WALKTHROUGH STEPS
                    </span>
                    {judgeMode.steps.map((st: string, idx: number) => (
                      <div key={idx} style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>
                        {idx + 1}. {st}
                      </div>
                    ))}
                  </div>

                  <div>
                    <span style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", display: "block", marginBottom: 6 }}>
                      TECHNICAL HIGHLIGHTS
                    </span>
                    {judgeMode.technical_highlights.map((th: string, idx: number) => (
                      <div key={idx} style={{ fontSize: 11, color: "#34D399", marginBottom: 4 }}>
                        ⚡ {th}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Metrics grids */}
            {report && (
              <DemoMetrics
                totalRuns={report.total_runs}
                averageDuration={report.average_duration_sec}
              />
            )}

            {/* Selector panel */}
            <DemoControlCenter
              scenarios={scenarios}
              activeScenario={activeScenario}
              onSelect={setActiveScenario}
              onRun={handleRunScenario}
              loading={running}
            />

            {/* Row 2: Scenario outcome and Journey Timeline */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32, alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <ScenarioRunner result={runResult} />
                {validation && (
                  <SystemValidation
                    status={validation.overall_status}
                    reports={validation.reports}
                  />
                )}
              </div>

              {runResult && <JourneyTimeline steps={runResult.steps} />}
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
