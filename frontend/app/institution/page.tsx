"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import InstitutionOverview from "@/components/InstitutionOverview";
import ExposureDashboard from "@/components/ExposureDashboard";
import PortfolioRisk from "@/components/PortfolioRisk";
import WalletRiskTable from "@/components/WalletRiskTable";
import PolicyCompliance from "@/components/PolicyCompliance";
import InstitutionAIReport from "@/components/InstitutionAIReport";

export default function InstitutionPage() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any | null>(null);
  const [exposure, setExposure] = useState<any | null>(null);
  const [aiReport, setAiReport] = useState<string>("");

  const loadCommandCenterData = async () => {
    setLoading(true);
    try {
      const [dResp, eResp, rResp] = await Promise.all([
        API.get("/institution/dashboard"),
        API.get("/institution/exposure"),
        API.get("/institution/report")
      ]);

      setDashboard(dResp.data);
      setExposure(eResp.data);
      setAiReport(rResp.data.report);
    } catch (err) {
      console.error("Command Center loading failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommandCenterData();
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
          <span>ENTERPRISE RISK NODE</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>PORTFOLIO SHIELD</span>
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
            Institutional Command Center
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
            AI-powered risk intelligence, macro stress testing, and real-time compliance enforcement for organizations.
          </p>
        </div>

        {loading ? (
          <div style={{ color: "#64748B", textAlign: "center", padding: "100px 0" }}>
            CONSOLIDATING PORTFOLIO METRICS...
          </div>
        ) : (
          dashboard &&
          exposure && (
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              
              {/* Stats Overview */}
              <InstitutionOverview
                exposure={dashboard.total_exposure}
                health={dashboard.portfolio_score}
                wallets={dashboard.wallets}
                risk={dashboard.risk}
              />

              {/* Row 1: Exposure and segmentations */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 32 }}>
                <ExposureDashboard
                  totalExposure={exposure.total_exposure}
                  riskAdjusted={exposure.risk_adjusted_exposure}
                />
                
                <PortfolioRisk segments={dashboard.segments} />
              </div>

              {/* Row 2: Risks table and policies list */}
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32 }}>
                <WalletRiskTable wallets={exposure.highest_risk_wallets} />

                <PolicyCompliance
                  healthyCount={dashboard.segments.PRIME + dashboard.segments.TRUSTED}
                  watchlistCount={dashboard.segments.WATCHLIST + dashboard.segments.HIGH_RISK}
                />
              </div>

              {/* Row 3: Narrative reports and Stress Tests */}
              <InstitutionAIReport initialReport={aiReport} />

            </div>
          )
        )}

      </div>
    </main>
  );
}
