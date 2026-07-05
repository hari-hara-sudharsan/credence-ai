"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import SystemHealth from "@/components/SystemHealth";
import SecurityMonitor from "@/components/SecurityMonitor";
import APIMetrics from "@/components/APIMetrics";
import ContractMonitor from "@/components/ContractMonitor";
import IncidentTimeline from "@/components/IncidentTimeline";

export default function SystemPage() {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<any | null>(null);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [contracts, setContracts] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any | null>(null);
  
  // Production Readiness
  const [readiness, setReadiness] = useState<any | null>(null);

  const loadSystemData = async () => {
    setLoading(true);
    try {
      const [hResp, mResp, cResp, iResp, rResp] = await Promise.all([
        API.get("/system/health"),
        API.get("/system/metrics"),
        API.get("/system/contracts"),
        API.get("/system/incidents"),
        API.get("/system/readiness")
      ]);

      setHealth(hResp.data);
      setMetrics(mResp.data);
      setContracts(cResp.data || []);
      setIncidents(iResp.data);
      setReadiness(rResp.data);
    } catch (err) {
      console.error("Failed to load system dashboard telemetry:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSystemData();
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
          <span>PRODUCTION TELEMETRY</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>RELIABILITY SHIELD</span>
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
            Infrastructure Status
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
            Real-time monitoring, security enforcement audits, contract validations, and production readiness checks.
          </p>
        </div>

        {loading ? (
          <div style={{ color: "#64748B", textAlign: "center", padding: "100px 0" }}>
            CONSOLIDATING SYSTEM TELEMETRY NODES...
          </div>
        ) : (
          health &&
          metrics && (
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              
              {/* Row 1: Readiness Score Gauge */}
              {readiness && (
                <div
                  style={{
                    background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
                    border: "1px solid #1D2E49",
                    borderRadius: 14,
                    padding: 24,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: 32,
                    alignItems: "center",
                  }}
                >
                  <div>
                    <span style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                      PRODUCTION READINESS SCORE
                    </span>
                    <div style={{ fontSize: 44, fontWeight: 800, color: "#34D399" }}>
                      {readiness.production_score}%{" "}
                      <span style={{ fontSize: 18, color: "#34D399", fontWeight: 700 }}>
                        {readiness.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace", display: "block", marginBottom: 8 }}>
                      MITIGATION CHECKLISTS FOR RELEASE
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {readiness.recommendations.map((rec: string, idx: number) => (
                        <div key={idx} style={{ fontSize: 12, color: "#94A3B8" }}>
                          🔹 {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Row 2: Health services check */}
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32, alignItems: "start" }}>
                <SystemHealth
                  status={health.status}
                  oracle={health.oracle_status}
                  contracts={health.contract_status}
                  uptime={health.uptime}
                />
                
                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                  <APIMetrics
                    avgLatency={`${metrics.average_latency_ms || 120}ms`}
                    totalRequests={metrics.request_count}
                  />
                  <SecurityMonitor failedSignatures={metrics.failed_signatures} />
                </div>
              </div>

              {/* Row 3: Contracts & timeline */}
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32 }}>
                <ContractMonitor contracts={contracts} />
                {incidents && <IncidentTimeline history={incidents.history} />}
              </div>

            </div>
          )
        )}

      </div>
    </main>
  );
}
