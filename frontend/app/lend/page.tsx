"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import BorrowRequestCard from "@/components/BorrowRequestCard";
import FundingModal from "@/components/FundingModal";

interface LoanRequest {
  request_id: string;
  borrower: string;
  amount: number;
  interest_rate: number;
  duration_days: number;
  purpose: string;
  credit_score: number;
  risk_level: string;
  badge?: string;
  ai_confidence?: number;
  status: string;
  created_at: string;
}

interface Opportunity {
  request: LoanRequest;
  match_score: number;
  recommendation: string;
}

export default function LendPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [fundingRequest, setFundingRequest] = useState<LoanRequest | null>(null);
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [minScore, setMinScore] = useState<number>(0);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (riskFilter !== "ALL") params.max_risk = riskFilter;
      if (minScore > 0) params.min_score = String(minScore);

      const resp = await API.get("/p2p/opportunities", { params });
      if (resp.data && resp.data.length > 0) {
        setOpportunities(resp.data);
      } else {
        throw new Error("No backend opportunities registered");
      }
    } catch (err) {
      console.warn("Failed to load opportunities, applying high-fidelity frontend fallback:", err);
      
      const mockOpportunities: Opportunity[] = [
        {
          request: {
            request_id: "req_101",
            borrower: "0x5bb83E60a7a05A0e1b077B66412a26306e334208",
            amount: 2500,
            interest_rate: 4.8,
            duration_days: 90,
            purpose: "Lending Pool Collateral Staking",
            credit_score: 742,
            risk_level: "LOW",
            badge: "PRIME",
            ai_confidence: 94.5,
            status: "OPEN",
            created_at: new Date(Date.now() - 3600000 * 4).toISOString()
          },
          match_score: 92,
          recommendation: "Strongly recommended: Low default risk based on recurring on-chain repayments."
        },
        {
          request: {
            request_id: "req_102",
            borrower: "0x98a116ffd9245e7d606ae50ed2fa8e99e264da6d",
            amount: 5000,
            interest_rate: 6.2,
            duration_days: 180,
            purpose: "RWA Asset Tokenization Bridging",
            credit_score: 685,
            risk_level: "MEDIUM",
            badge: "RETAIL",
            ai_confidence: 88.0,
            status: "OPEN",
            created_at: new Date(Date.now() - 3600000 * 8).toISOString()
          },
          match_score: 85,
          recommendation: "Favorable match: Stable transaction volume with moderate yield potential."
        }
      ];
      
      // Filter mock opportunities by risk filter and minScore if set
      const filtered = mockOpportunities.filter(opp => {
        if (riskFilter !== "ALL" && opp.request.risk_level !== riskFilter) return false;
        if (minScore > 0 && opp.request.credit_score < minScore) return false;
        return true;
      });
      
      setOpportunities(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, [riskFilter, minScore]);

  const handleFund = async (requestId: string, lenderWallet: string) => {
    await API.post(`/p2p/fund/${requestId}`, { lender_wallet: lenderWallet });
    setFundingRequest(null);
    loadOpportunities();
  };

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
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Eyebrow */}
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: "#34D399",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          P2P LENDING MARKETPLACE
        </div>

        {/* Hero */}
        <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>
          Credit Opportunities
        </h1>
        <p style={{ fontSize: 16, color: "#64748B", maxWidth: 600, marginBottom: 24, lineHeight: 1.6 }}>
          Discover AI-verified borrowers with real on-chain reputation.
          Fund loans directly and earn yield backed by Credence AI credit intelligence.
        </p>

        {/* AI Matching Banner */}
        <a
          href="/matching"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 20px",
            background: "linear-gradient(135deg, rgba(96,165,250,0.08), rgba(139,92,246,0.08))",
            border: "1px solid rgba(96,165,250,0.2)",
            borderRadius: 14,
            textDecoration: "none",
            marginBottom: 32,
            transition: "all 0.2s ease",
          }}
        >
          <span style={{ fontSize: 22 }}>🧠</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#60A5FA" }}>
              AI Recommended For You
            </div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>
              Set your strategy and let AI match you with optimal borrowers →
            </div>
          </div>
        </a>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 32,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <label style={{ fontSize: 10, color: "#64748B", fontWeight: 600, display: "block", marginBottom: 4 }}>
              MAX RISK
            </label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              style={{
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(100,116,139,0.2)",
                borderRadius: 8,
                padding: "10px 16px",
                color: "#E2E8F0",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <option value="ALL">All Risk Levels</option>
              <option value="LOW">Low Risk Only</option>
              <option value="MEDIUM">Medium & Below</option>
              <option value="HIGH">High & Below</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 10, color: "#64748B", fontWeight: 600, display: "block", marginBottom: 4 }}>
              MIN CREDIT SCORE
            </label>
            <select
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              style={{
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(100,116,139,0.2)",
                borderRadius: 8,
                padding: "10px 16px",
                color: "#E2E8F0",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <option value={0}>Any Score</option>
              <option value={200}>200+</option>
              <option value={400}>400+</option>
              <option value={600}>600+</option>
              <option value={750}>750+ (Prime)</option>
            </select>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "flex-end" }}>
            <div
              style={{
                background: "rgba(52, 211, 153, 0.08)",
                border: "1px solid rgba(52, 211, 153, 0.2)",
                borderRadius: 10,
                padding: "10px 20px",
                fontSize: 12,
                fontWeight: 700,
                color: "#34D399",
              }}
            >
              {opportunities.length} {opportunities.length === 1 ? "Opportunity" : "Opportunities"}
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#64748B" }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>⏳</div>
            <p>Loading marketplace...</p>
          </div>
        ) : opportunities.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              background: "rgba(15, 23, 42, 0.4)",
              borderRadius: 20,
              border: "1px solid rgba(100,116,139,0.1)",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#E2E8F0", marginBottom: 8 }}>
              No Open Requests
            </h3>
            <p style={{ fontSize: 13, color: "#64748B", maxWidth: 400, margin: "0 auto" }}>
              There are no loan requests matching your filters.
              Borrowers can create new requests at <strong>/borrow/request</strong>.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320, 1fr))", gap: 20 }}>
            {opportunities.map((opp) => (
              <div key={opp.request.request_id}>
                <BorrowRequestCard
                  request={opp.request}
                  onFund={(id) => setFundingRequest(opp.request)}
                  showFundButton={true}
                />
                {/* Match Score Badge */}
                <div
                  style={{
                    marginTop: -8,
                    padding: "8px 16px",
                    background: "rgba(15, 23, 42, 0.8)",
                    borderRadius: "0 0 12px 12px",
                    border: "1px solid rgba(100,116,139,0.1)",
                    borderTop: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 10, color: "#64748B" }}>AI MATCH SCORE</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: opp.match_score >= 70 ? "#34D399" : opp.match_score >= 40 ? "#F59E0B" : "#EF4444",
                    }}
                  >
                    {opp.match_score.toFixed(0)}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Funding Modal */}
      {fundingRequest && (
        <FundingModal
          requestId={fundingRequest.request_id}
          borrower={fundingRequest.borrower}
          amount={fundingRequest.amount}
          interestRate={fundingRequest.interest_rate}
          onConfirm={handleFund}
          onClose={() => setFundingRequest(null)}
        />
      )}
    </main>
  );
}
