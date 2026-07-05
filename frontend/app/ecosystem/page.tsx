"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import NetworkHealth from "@/components/NetworkHealth";
import CreditDistribution from "@/components/CreditDistribution";
import RiskHeatmap from "@/components/RiskHeatmap";
import ProtocolAnalytics from "@/components/ProtocolAnalytics";
import WalletSegments from "@/components/WalletSegments";
import EcosystemTrends from "@/components/EcosystemTrends";

export default function EcosystemPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [risk, setRisk] = useState<any | null>(null);
  const [distribution, setDistribution] = useState<any | null>(null);
  const [protocols, setProtocols] = useState<any[]>([]);
  const [report, setReport] = useState<string>("");
  const [alerts, setAlerts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [healthResp, riskResp, distResp, protResp, repResp, alertResp] = await Promise.all([
        API.get("/ecosystem/health"),
        API.get("/ecosystem/risk"),
        API.get("/ecosystem/distribution"),
        API.get("/ecosystem/protocols"),
        API.get("/ecosystem/report"),
        API.get("/ecosystem/alerts")
      ]);

      setMetrics(healthResp.data);
      setRisk(riskResp.data);
      setDistribution(distResp.data);
      setProtocols(protResp.data);
      setReport(repResp.data.report);
      setAlerts(alertResp.data);
    } catch (err: any) {
      setError("Failed to fetch ecosystem intelligence metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getAlertColor = (sev: string) => {
    if (sev === "HIGH") return "#FF4D6A";
    if (sev === "MEDIUM") return "#FFB830";
    return "#34D399";
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
          <span>NETWORK INDEXING NODE</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>GLOBAL MACRO INTELLIGENCE</span>
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
            HashKey Credit Intelligence Network
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
            Real-time systemic risk modeling, credit allocation, and capital health intelligence across the decentralized credit economy.
          </p>
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

        {loading ? (
          <div style={{ color: "#64748B", textAlign: "center", padding: "100px 0" }}>
            AGGREGATING ECOSYSTEM TELEMETRY...
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 32, animation: "fade-in 0.4s ease" }}>
            
            {/* Top row: Health & Brackets distribution */}
            {metrics && distribution && (
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32 }}>
                <NetworkHealth metrics={metrics} />
                <CreditDistribution distribution={distribution} />
              </div>
            )}

            {/* Middle row: Heatmaps & Wallet segments */}
            {risk && metrics && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 32 }}>
                <RiskHeatmap riskData={risk} />
                <WalletSegments total={metrics.total_wallets} verified={metrics.verified_passports} />
              </div>
            )}

            {/* Protocol analytics table */}
            {protocols.length > 0 && <ProtocolAnalytics protocols={protocols} />}

            {/* Narrative Summary card */}
            {report && <EcosystemTrends reportText={report} />}

            {/* Real-time Systemic Alerts Section */}
            {alerts.length > 0 && (
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
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#4A6080",
                    letterSpacing: 1.5,
                    fontFamily: "JetBrains Mono, monospace",
                    marginBottom: 20,
                  }}
                >
                  SYSTEMIC SAFETY RISK ALERTS
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {alerts.map((alert, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#050B14",
                        borderLeft: `4px solid ${getAlertColor(alert.severity)}`,
                        borderRadius: "0 8px 8px 0",
                        padding: "16px 20px",
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: 16,
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 6 }}>
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 800,
                              color: getAlertColor(alert.severity),
                              background: `${getAlertColor(alert.severity)}1A`,
                              border: `1px solid ${getAlertColor(alert.severity)}`,
                              borderRadius: 4,
                              padding: "2px 6px",
                              fontFamily: "JetBrains Mono, monospace",
                            }}
                          >
                            {alert.severity} ALERT
                          </span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{alert.message}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.4 }}>
                          Recommendation: {alert.recommendation}
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: 10,
                          color: "#64748B",
                          fontFamily: "JetBrains Mono, monospace",
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid #111C2E",
                          borderRadius: 6,
                          padding: "4px 10px",
                        }}
                      >
                        {alert.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
