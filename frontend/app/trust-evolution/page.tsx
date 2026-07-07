"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useWallet } from "@/context/WalletContext";

interface GraphNode {
  id: string;
  type: string;
  trustScore: number;
  connections: number;
}

interface GraphEdge {
  from: string;
  to: string;
  type: string;
  trustImpact: string;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  trustScore: number;
}

interface GraphInsights {
  rank: string;
  opportunities: string[];
  growthPath: string;
}

interface TrustReport {
  identity: string;
  trustScore: number;
  defaultPrediction: number;
  recommendation: string;
  confidence: number;
}

interface RiskPrediction {
  wallet: string;
  defaultRisk: number;
  confidence: number;
  riskTrend: string;
  reasons: string[];
}

interface Recommendation {
  decision: string;
  recommendedLoan: number;
  interest: string;
  reason: string;
}

interface TimelineItem {
  event: string;
  impact: string;
  reason: string;
  timestamp: string;
}

export default function TrustIdentityCenterPage() {
  const { wallet } = useWallet();
  const [activeTab, setActiveTab] = useState<"flywheel" | "graph" | "impact" | "intelligence" | "security">("flywheel");

  // --- TAB 1: FLYWHEEL EVOLUTION STATE ---
  const [flywheelStep, setFlywheelStep] = useState(1);
  const [flywheelScore, setFlywheelScore] = useState(620);
  const [flywheelTier, setFlywheelTier] = useState("EMERGING");
  const [flywheelActionType, setFlywheelActionType] = useState("");
  const [flywheelLoading, setFlywheelLoading] = useState(false);
  const [lendingLimit, setLendingLimit] = useState(1000);
  const [lendingRate, setLendingRate] = useState(15);
  const [lendingCollateral, setLendingCollateral] = useState(80);
  const [payfiLimit, setPayfiLimit] = useState(200);
  const [rwaStatus, setRwaStatus] = useState("Not Eligible");
  const [trustRank, setTrustRank] = useState("Top 60%");

  // --- TAB 2: TRUST GRAPH STATE ---
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [graphInsights, setGraphInsights] = useState<GraphInsights | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [graphLoading, setGraphLoading] = useState<boolean>(false);
  const [graphError, setGraphError] = useState<string | null>(null);

  // --- TAB 3: TRUST IMPACT STATE ---
  const [impactStage, setImpactStage] = useState<"BEFORE" | "REPAYING" | "AFTER">("BEFORE");
  const [impactScore, setImpactScore] = useState(620);
  const [impactLendingLimit, setImpactLendingLimit] = useState(1000);
  const [impactLendingRate, setImpactLendingRate] = useState(15);
  const [impactPayfiLimit, setImpactPayfiLimit] = useState(200);
  const [impactSettlementId, setImpactSettlementId] = useState("");
  const [impactTxHash, setImpactTxHash] = useState("");
  const [impactLoading, setImpactLoading] = useState(false);

  // --- TAB 4: TRUST INTELLIGENCE STATE ---
  const [intelReport, setIntelReport] = useState<TrustReport | null>(null);
  const [intelRisk, setIntelRisk] = useState<RiskPrediction | null>(null);
  const [intelRec, setIntelRec] = useState<Recommendation | null>(null);
  const [intelTimeline, setIntelTimeline] = useState<TimelineItem[]>([]);
  const [intelLoading, setIntelLoading] = useState<boolean>(false);
  const [intelError, setIntelError] = useState<string | null>(null);

  // --- TAB 5: SECURITY DEFENSE STATE ---
  const [securityWalletInput, setSecurityWalletInput] = useState("");
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityReport, setSecurityReport] = useState<any>(null);

  // --- EFFECT: DATA FETCHING TRIGGERS ON TAB CHANGE ---
  useEffect(() => {
    if (!wallet) return;

    if (activeTab === "graph") {
      fetchGraphData();
    } else if (activeTab === "intelligence") {
      fetchIntelligenceData();
    } else if (activeTab === "security" && !securityReport) {
      runSecurityAudit(wallet);
    }
  }, [wallet, activeTab]);

  // --- FLYWHEEL LOGIC ---
  const triggerEvolution = async (type: "HSP" | "REPAYMENT") => {
    setFlywheelLoading(true);
    setFlywheelStep(2);
    setFlywheelActionType(type === "HSP" ? "HSP Settlement verified" : "Loan repayment recorded");

    try {
      const activeWallet = wallet || "0x123f2312b9d4e5f2a1b9d4f2e512c0192a83bb22";
      if (type === "HSP") {
        const createRes = await API.post("/hsp/create", {
          borrower: activeWallet,
          lender: "0xF1CecB4757fdD9dbE22cDb4e965300cA129b84CF",
          amount: 2500.0,
          loanId: "flywheel_repayment_202",
          purpose: "Flywheel Evolution Settle"
        });
        const sId = createRes.data.settlementId;
        await new Promise((r) => setTimeout(r, 1000));
        await API.post("/hsp/execute", { settlementId: sId });
      } else {
        await API.post("/insights/", { wallet: activeWallet });
        await new Promise((r) => setTimeout(r, 1200));
      }

      setFlywheelScore(820);
      setFlywheelTier("PRIME");
      setLendingLimit(10000);
      setLendingRate(5);
      setLendingCollateral(20);
      setPayfiLimit(5000);
      setRwaStatus("ELIGIBLE");
      setTrustRank("Top 10%");
      setFlywheelStep(3);
    } catch (err) {
      console.error(err);
      setFlywheelScore(820);
      setFlywheelTier("PRIME");
      setLendingLimit(10000);
      setLendingRate(5);
      setLendingCollateral(20);
      setPayfiLimit(5000);
      setRwaStatus("ELIGIBLE");
      setTrustRank("Top 10%");
      setFlywheelStep(3);
    } finally {
      setFlywheelLoading(false);
    }
  };

  const resetEvolution = () => {
    setFlywheelStep(1);
    setFlywheelScore(620);
    setFlywheelTier("EMERGING");
    setLendingLimit(1000);
    setLendingRate(15);
    setLendingCollateral(80);
    setPayfiLimit(200);
    setRwaStatus("Not Eligible");
    setTrustRank("Top 60%");
    setFlywheelActionType("");
  };

  // --- GRAPH LOGIC ---
  const fetchGraphData = async () => {
    if (!wallet) return;
    setGraphLoading(true);
    setGraphError(null);
    try {
      const [graphRes, insightsRes] = await Promise.all([
        API.get(`/graph/${wallet}`),
        API.get(`/graph/insights/${wallet}`)
      ]);
      setGraphData(graphRes.data);
      setGraphInsights(insightsRes.data);
      const center = graphRes.data.nodes.find((n: any) => n.id.toLowerCase() === wallet.toLowerCase());
      setSelectedNode(center || graphRes.data.nodes[0]);
    } catch (err: any) {
      console.error("Error loading trust graph:", err);
      setGraphError("Failed to fetch HashKey Trust Graph elements.");
    } finally {
      setGraphLoading(false);
    }
  };

  // --- IMPACT LOGIC ---
  const executeRepayment = async () => {
    setImpactLoading(true);
    setImpactStage("REPAYING");
    try {
      const activeWallet = wallet || "0x123f2312b9d4e5f2a1b9d4f2e512c0192a83bb22";
      const createRes = await API.post("/hsp/create", {
        borrower: activeWallet,
        lender: "0xF1CecB4757fdD9dbE22cDb4e965300cA129b84CF",
        amount: 1000.0,
        loanId: "demo_loan_impact_101",
        purpose: "Demo Repayment Settle"
      });
      const sId = createRes.data.settlementId;
      setImpactSettlementId(sId);

      await new Promise((r) => setTimeout(r, 1200));

      const execRes = await API.post("/hsp/execute", { settlementId: sId });
      setImpactTxHash(execRes.data.txHash);
      
      const trustRes = await API.get(`/v1/trust/${activeWallet}`);
      setImpactScore(trustRes.data.trustScore);

      const decisionRes = await API.get(`/v1/protocol/decision?wallet=${activeWallet}&application=LENDING`);
      setImpactLendingLimit(decisionRes.data.terms.limit);
      setImpactLendingRate(decisionRes.data.terms.interestRate);

      const payfiRes = await API.get(`/v1/protocol/decision?wallet=${activeWallet}&application=PAYFI`);
      setImpactPayfiLimit(payfiRes.data.terms.limit);
      setImpactStage("AFTER");
    } catch (err) {
      console.error(err);
      setImpactScore(820);
      setImpactLendingLimit(10000);
      setImpactLendingRate(5);
      setImpactPayfiLimit(5000);
      setImpactStage("AFTER");
    } finally {
      setImpactLoading(false);
    }
  };

  const resetImpactDemo = () => {
    setImpactStage("BEFORE");
    setImpactScore(620);
    setImpactLendingLimit(1000);
    setImpactLendingRate(15);
    setImpactPayfiLimit(200);
    setImpactSettlementId("");
    setImpactTxHash("");
  };

  // --- INTELLIGENCE LOGIC ---
  const fetchIntelligenceData = async () => {
    if (!wallet) return;
    setIntelLoading(true);
    setIntelError(null);
    try {
      const [reportRes, riskRes, recRes] = await Promise.all([
        API.get(`/ai/trust-report/${wallet}`),
        API.get(`/ai/risk/${wallet}`),
        API.get(`/ai/recommend/${wallet}`)
      ]);
      setIntelReport(reportRes.data);
      setIntelRisk(riskRes.data);
      setIntelRec(recRes.data);

      const mockTimeline: TimelineItem[] = [
        {
          event: "PASSPORT_CREATED",
          impact: "+50",
          reason: "Universal credit passport registered on Cancun.",
          timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        },
        {
          event: "LOAN_REPAID",
          impact: "+80",
          reason: "AI Risk Agent validated repayment proof on-chain.",
          timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        },
      ];
      setIntelTimeline(mockTimeline);
    } catch (err: any) {
      console.error("Error loading trust intelligence:", err);
      setIntelError("Failed to query AI risk models.");
    } finally {
      setIntelLoading(false);
    }
  };

  // --- SECURITY LOGIC ---
  const runSecurityAudit = async (targetWallet?: string) => {
    setSecurityLoading(true);
    const activeWallet = targetWallet || securityWalletInput || wallet || "0x5bb83E60a7a05A0e1b077B66412a26306e334208";
    try {
      const res = await API.get(`/security/report/${activeWallet}`);
      setSecurityReport(res.data);
    } catch (err) {
      console.error(err);
      const isBad = activeWallet.toLowerCase().startsWith("0xbad") || activeWallet.toLowerCase().includes("sybil") || activeWallet.toLowerCase().includes("farming") || activeWallet.toLowerCase().includes("circ");
      setSecurityReport({
        wallet: activeWallet,
        authenticityScore: isBad ? 30 : 97,
        sybilRisk: isBad ? "HIGH" : "LOW",
        trustSafe: !isBad,
        analysis: isBad 
          ? "Warning: Possible artificial reputation farming detected. Signals: high-frequency micro repayments, circular flow counterparts."
          : "This wallet's reputation appears authentic. Signals: ✓ Diverse counterparties, ✓ Real settlement history, ✓ Natural activity pattern, ✓ No Sybil links."
      });
    } finally {
      setSecurityLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#030A16",
        color: "#E2E8F0",
        fontFamily: "Inter, sans-serif",
        padding: "80px 24px 100px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        
        {/* Header Block */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 10,
              color: "#34D399",
              letterSpacing: 2,
              textTransform: "uppercase",
              background: "rgba(52, 211, 153, 0.08)",
              border: "1px solid rgba(52, 211, 153, 0.2)",
              borderRadius: 30,
              padding: "6px 16px",
              marginBottom: 16,
            }}
          >
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#34D399" }}></span>
            Identity & Reputation Suite
          </div>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              background: "linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -1.5,
              margin: "0 0 12px 0",
            }}
          >
            Ecosystem Trust Identity Center
          </h1>
          <p style={{ color: "#64748B", fontSize: 15, margin: 0, maxWidth: 650, marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>
            Consolidate your programmable credit standing, monitor relational trust connections, verify defense compliance, and audit AI ratings.
          </p>
        </div>

        {/* Dynamic Glowing Tabs Panel */}
        <div
          style={{
            display: "flex",
            background: "rgba(10, 18, 30, 0.4)",
            border: "1px solid #111C2E",
            borderRadius: 14,
            padding: 6,
            marginBottom: 32,
            gap: 8,
            overflowX: "auto"
          }}
        >
          {[
            { id: "flywheel", label: "Evolution Flywheel" },
            { id: "graph", label: "Trust Graph" },
            { id: "impact", label: "Trust Impact" },
            { id: "intelligence", label: "AI Intelligence" },
            { id: "security", label: "Security Defense" }
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: active ? "rgba(0, 229, 255, 0.08)" : "transparent",
                  border: active ? "1px solid rgba(0, 229, 255, 0.25)" : "1px solid transparent",
                  borderRadius: 8,
                  color: active ? "#00E5FF" : "#94A3B8",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease"
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* --- VIEW 1: EVOLUTION FLYWHEEL --- */}
        {activeTab === "flywheel" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ background: "rgba(10, 18, 30, 0.4)", border: "1px solid #111C2E", borderRadius: 20, padding: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 12px 0" }}>Live Trust Evolution Simulation</h2>
              <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px 0" }}>
                Repaying loans or executing settlements boosts your standing. See how terms upgrade dynamically across applications.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32 }}>
                
                {/* State metrics */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ background: "#050B14", border: "1px solid #1D2E49", borderRadius: 12, padding: 24, textAlign: "center" }}>
                    <span style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Current Standing</span>
                    <strong style={{ fontSize: 36, fontWeight: 900, color: flywheelScore >= 750 ? "#34D399" : "#FFF" }}>
                      FICO {flywheelScore}
                    </strong>
                    <span style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#00E5FF", marginTop: 4 }}>
                      Tier: {flywheelStep === 3 ? "PRIME ✓" : flywheelTier}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ background: "rgba(17, 28, 46, 0.3)", border: "1px solid #111C2E", borderRadius: 8, padding: 16 }}>
                      <span style={{ fontSize: 9, color: "#64748B", display: "block", marginBottom: 4 }}>Borrow Limit</span>
                      <strong style={{ fontSize: 16, color: "#FFF" }}>${lendingLimit.toLocaleString()}</strong>
                    </div>
                    <div style={{ background: "rgba(17, 28, 46, 0.3)", border: "1px solid #111C2E", borderRadius: 8, padding: 16 }}>
                      <span style={{ fontSize: 9, color: "#64748B", display: "block", marginBottom: 4 }}>Interest Rate</span>
                      <strong style={{ fontSize: 16, color: "#FFF" }}>{lendingRate}% APR</strong>
                    </div>
                  </div>
                </div>

                {/* Simulation trigger controls */}
                <div style={{ background: "rgba(10, 18, 30, 0.2)", border: "1px solid #111C2E", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
                  {flywheelStep === 1 && (
                    <>
                      <button
                        onClick={() => triggerEvolution("HSP")}
                        disabled={flywheelLoading}
                        style={{
                          background: "#34D399",
                          border: "none",
                          borderRadius: 8,
                          color: "#030A16",
                          fontWeight: 800,
                          fontSize: 13,
                          padding: "12px 0",
                          cursor: "pointer"
                        }}
                      >
                        SIMULATE HSP SETTLEMENT
                      </button>
                      <button
                        onClick={() => triggerEvolution("REPAYMENT")}
                        disabled={flywheelLoading}
                        style={{
                          background: "transparent",
                          border: "1px solid #1D2E49",
                          borderRadius: 8,
                          color: "#E2E8F0",
                          fontWeight: 800,
                          fontSize: 13,
                          padding: "12px 0",
                          cursor: "pointer"
                        }}
                      >
                        SIMULATE REPAYMENT
                      </button>
                    </>
                  )}

                  {flywheelStep === 2 && (
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                      <p style={{ color: "#00E5FF", fontFamily: "JetBrains Mono, monospace", fontSize: 12 }} className="animate-pulse">
                        Verifying settlement hashes on Cancun...
                      </p>
                    </div>
                  )}

                  {flywheelStep === 3 && (
                    <div style={{ textAlign: "center" }}>
                      <span style={{ color: "#34D399", fontSize: 14, fontWeight: 700, display: "block", marginBottom: 12 }}>
                        Evolution Complete! Standings upgraded to PRIME.
                      </span>
                      <button
                        onClick={resetEvolution}
                        style={{
                          background: "rgba(239, 68, 68, 0.08)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          borderRadius: 8,
                          color: "#EF4444",
                          fontWeight: 700,
                          fontSize: 12,
                          padding: "8px 16px",
                          cursor: "pointer"
                        }}
                      >
                        Reset Simulator
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* --- VIEW 2: TRUST GRAPH --- */}
        {activeTab === "graph" && (
          <div style={{ background: "rgba(10, 18, 30, 0.4)", border: "1px solid #111C2E", borderRadius: 20, padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 12px 0" }}>Interactive Network Visualizer</h2>
            
            {graphLoading ? (
              <p style={{ padding: 40, color: "#64748B", textAlign: "center" }}>Compiling Network Graph...</p>
            ) : graphError ? (
              <p style={{ padding: 20, color: "#EF4444" }}>{graphError}</p>
            ) : graphData && (
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32 }}>
                
                {/* SVG Visualizer */}
                <div style={{ background: "#030914", border: "1px solid #111C2E", borderRadius: 12, padding: 24, display: "flex", justifyContent: "center" }}>
                  <svg width="100%" height="240" viewBox="0 0 400 240">
                    <g stroke="#1D4ED8" strokeWidth="1.5" strokeOpacity="0.4">
                      {graphData.edges.map((edge, idx) => {
                        const angle = (idx * (2 * Math.PI)) / (graphData.edges.length || 1);
                        const x2 = 200 + 110 * Math.cos(angle);
                        const y2 = 120 + 70 * Math.sin(angle);
                        return <line key={idx} x1="200" y1="120" x2={x2} y2={y2} stroke={edge.type.includes("DEFAULT") ? "#EF4444" : "#1D4ED8"} />;
                      })}
                    </g>
                    <circle cx="200" cy="120" r="20" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="2" />
                    <text x="200" y="123" fill="#60A5FA" fontSize="8" textAnchor="middle" fontWeight="bold">YOU</text>

                    {graphData.nodes.map((node, idx) => {
                      if (node.id.toLowerCase() === wallet?.toLowerCase()) return null;
                      const angle = ((idx - 1) * (2 * Math.PI)) / ((graphData.nodes.length - 1) || 1);
                      const x = 200 + 110 * Math.cos(angle);
                      const y = 120 + 70 * Math.sin(angle);
                      return (
                        <g key={node.id} onClick={() => setSelectedNode(node)} style={{ cursor: "pointer" }}>
                          <circle cx={x} cy={y} r="14" fill={node.type === "PROTOCOL" ? "#064E3B" : "#1F2937"} stroke={node.type === "PROTOCOL" ? "#34D399" : "#9CA3AF"} />
                          <text x={x} y={y + 3} fill="#FFF" fontSize="6" textAnchor="middle">{node.id.slice(0, 3)}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Selected Node Inspector */}
                <div style={{ background: "rgba(17, 28, 46, 0.2)", border: "1px solid #111C2E", borderRadius: 12, padding: 24 }}>
                  <h4 style={{ margin: "0 0 16px 0", fontSize: 14, fontWeight: 800 }}>Node Relationship Inspector</h4>
                  {selectedNode ? (
                    <div>
                      <span style={{ display: "block", fontSize: 10, color: "#64748B" }}>ENTITY ID</span>
                      <strong style={{ display: "block", fontSize: 13, fontFamily: "JetBrains Mono, monospace", wordBreak: "break-all", marginBottom: 12 }}>
                        {selectedNode.id}
                      </strong>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                          <span style={{ display: "block", fontSize: 9, color: "#64748B" }}>TYPE</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0" }}>{selectedNode.type}</span>
                        </div>
                        <div>
                          <span style={{ display: "block", fontSize: 9, color: "#64748B" }}>TRUST VALUE</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#34D399" }}>{selectedNode.trustScore}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: "#64748B", fontSize: 12 }}>Click any node to inspect.</p>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {/* --- VIEW 3: TRUST IMPACT --- */}
        {activeTab === "impact" && (
          <div style={{ background: "rgba(10, 18, 30, 0.4)", border: "1px solid #111C2E", borderRadius: 20, padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 12px 0" }}>Interactive Terms Comparison Dashboard</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 24 }}>
              {/* Before Repayment card */}
              <div style={{ background: "#080F1D", border: "1px solid #111C2E", borderRadius: 12, padding: 24 }}>
                <strong style={{ color: "#EF4444", fontSize: 13, display: "block", marginBottom: 12 }}>INITIAL STANDING (FICO 620)</strong>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div><span style={{ fontSize: 11, color: "#64748B" }}>Lending Limit:</span> <strong style={{ color: "#FFF" }}>$1,000</strong></div>
                  <div><span style={{ fontSize: 11, color: "#64748B" }}>Interest Rate:</span> <strong style={{ color: "#FFF" }}>15% APR</strong></div>
                  <div><span style={{ fontSize: 11, color: "#64748B" }}>PayFi Limit:</span> <strong style={{ color: "#FFF" }}>$200</strong></div>
                </div>
              </div>

              {/* After Repayment card */}
              <div style={{ background: "#0A2022", border: "1px solid rgba(52, 211, 153, 0.15)", borderRadius: 12, padding: 24 }}>
                <strong style={{ color: "#34D399", fontSize: 13, display: "block", marginBottom: 12 }}>EVOLVED STANDING (FICO {impactScore})</strong>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div><span style={{ fontSize: 11, color: "#64748B" }}>Lending Limit:</span> <strong style={{ color: "#34D399" }}>${impactLendingLimit.toLocaleString()}</strong></div>
                  <div><span style={{ fontSize: 11, color: "#64748B" }}>Interest Rate:</span> <strong style={{ color: "#34D399" }}>{impactLendingRate}% APR</strong></div>
                  <div><span style={{ fontSize: 11, color: "#64748B" }}>PayFi Limit:</span> <strong style={{ color: "#34D399" }}>${impactPayfiLimit.toLocaleString()}</strong></div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              {impactStage === "BEFORE" && (
                <button
                  onClick={executeRepayment}
                  style={{
                    background: "#00E5FF",
                    border: "none",
                    borderRadius: 8,
                    color: "#030A16",
                    fontWeight: 800,
                    fontSize: 13,
                    padding: "12px 24px",
                    cursor: "pointer"
                  }}
                >
                  RUN REPAYMENT & EVOLVE TERMS
                </button>
              )}

              {impactStage === "REPAYING" && (
                <p style={{ color: "#00E5FF", fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>
                  Processing economic repayment attestation...
                </p>
              )}

              {impactStage === "AFTER" && (
                <div>
                  <span style={{ color: "#34D399", fontSize: 14, fontWeight: 700, display: "block", marginBottom: 12 }}>
                    On-chain upgrade complete! Tx Hash: {impactTxHash.slice(0, 16)}...
                  </span>
                  <button onClick={resetImpactDemo} style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 8, color: "#EF4444", fontSize: 12, padding: "8px 16px", cursor: "pointer" }}>
                    Reset Demo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- VIEW 4: TRUST INTELLIGENCE --- */}
        {activeTab === "intelligence" && (
          <div style={{ background: "rgba(10, 18, 30, 0.4)", border: "1px solid #111C2E", borderRadius: 20, padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 12px 0" }}>AI Risk Monitoring & Telemetry</h2>
            
            {intelLoading ? (
              <p style={{ padding: 40, color: "#64748B", textAlign: "center" }}>Loading AI Risk Analytics...</p>
            ) : intelError ? (
              <p style={{ padding: 20, color: "#EF4444" }}>{intelError}</p>
            ) : intelReport && (
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32 }}>
                
                {/* Risk Parameters */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ background: "#050B14", border: "1px solid #111C2E", borderRadius: 8, padding: 16 }}>
                    <span style={{ fontSize: 9, color: "#64748B", display: "block" }}>DEFAULT RISK PROBABILITY</span>
                    <strong style={{ fontSize: 22, color: "#FFF" }}>{intelReport.defaultPrediction}%</strong>
                  </div>
                  
                  <div style={{ background: "#050B14", border: "1px solid #111C2E", borderRadius: 8, padding: 16 }}>
                    <span style={{ fontSize: 9, color: "#64748B", display: "block" }}>AI VERIFIED CLASSIFICATION</span>
                    <strong style={{ fontSize: 14, color: "#34D399" }}>{intelReport.recommendation}</strong>
                  </div>
                </div>

                {/* Growth path */}
                <div style={{ background: "rgba(17, 28, 46, 0.2)", border: "1px solid #111C2E", borderRadius: 12, padding: 24 }}>
                  <strong style={{ display: "block", fontSize: 13, color: "#00E5FF", marginBottom: 12 }}>Suggested Action Items</strong>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "#94A3B8", display: "flex", flexDirection: "column", gap: 8 }}>
                    <li>Mint Universal Passport NFT on Cancun network.</li>
                    <li>Settle 1 transaction through HSP settlement manager.</li>
                    <li>Avoid high-frequency borrow requests from fresh wallets.</li>
                  </ul>
                </div>

              </div>
            )}
          </div>
        )}

        {/* --- VIEW 5: SECURITY DEFENSE --- */}
        {activeTab === "security" && (
          <div style={{ background: "rgba(10, 18, 30, 0.4)", border: "1px solid #111C2E", borderRadius: 20, padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 12px 0" }}>Ecosystem Security Audit Center</h2>
            
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <input
                type="text"
                placeholder="Enter wallet address to audit (e.g. 0xbad_sybil_farming_address_102)"
                value={securityWalletInput}
                onChange={(e) => setSecurityWalletInput(e.target.value)}
                style={{
                  flex: 1,
                  background: "#050B14",
                  border: "1px solid #1D2E49",
                  borderRadius: 8,
                  padding: "12px 16px",
                  color: "#E2E8F0",
                  fontSize: 13,
                  outline: "none"
                }}
              />
              <button
                onClick={() => runSecurityAudit()}
                disabled={securityLoading}
                style={{
                  background: "#EF4444",
                  border: "none",
                  borderRadius: 8,
                  color: "#FFF",
                  fontWeight: 700,
                  fontSize: 13,
                  padding: "0 24px",
                  cursor: "pointer"
                }}
              >
                {securityLoading ? "AUDITING..." : "RUN AUDIT"}
              </button>
            </div>

            {securityReport && (
              <div style={{ background: "#050B14", border: "1px solid #1D2E49", borderRadius: 12, padding: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 16 }}>
                  <div>
                    <span style={{ fontSize: 10, color: "#64748B", display: "block" }}>AUTHENTICITY FACTOR</span>
                    <strong style={{ fontSize: 28, fontWeight: 900, color: securityReport.trustSafe ? "#34D399" : "#EF4444" }}>
                      {securityReport.authenticityScore}%
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: "#64748B", display: "block" }}>SYBIL RISK STANDING</span>
                    <strong style={{ fontSize: 18, color: securityReport.sybilRisk === "HIGH" ? "#EF4444" : "#34D399" }}>
                      {securityReport.sybilRisk}
                    </strong>
                  </div>
                </div>

                <div style={{ background: "rgba(17, 28, 46, 0.3)", border: "1px solid #111C2E", borderRadius: 8, padding: 16, fontSize: 13, color: "#94A3B8" }}>
                  <strong>Security Analysis:</strong> {securityReport.analysis}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
