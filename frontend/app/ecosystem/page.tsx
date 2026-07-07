"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/context/WalletContext";
import API from "@/lib/api";

interface ProtocolOpportunity {
  protocol: string;
  eligibility: number;
  offer: string;
  approved: boolean;
  reason: string;
}

interface AIRecommendation {
  wallet: string;
  qualifications: string[];
  receiptsCount: number;
  recommendation: string;
}

export default function EcosystemMarketplacePage() {
  const { wallet } = useWallet();
  const [activeTab, setActiveTab] = useState<"directory" | "marketplace">("directory");
  const [opportunities, setOpportunities] = useState<ProtocolOpportunity[]>([]);
  const [aiRec, setAiRec] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- MARKETPLACE STATE ---
  const [protocolsList, setProtocolsList] = useState<any[]>([]);
  const [newProtocolName, setNewProtocolName] = useState("");
  const [newProtocolCategory, setNewProtocolCategory] = useState("LENDING");
  const [newProtocolTargetUrl, setNewProtocolTargetUrl] = useState("");
  const [newProtocolMinScore, setNewProtocolMinScore] = useState("600");
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (!wallet) return;

    if (activeTab === "directory") {
      fetchEcosystemData();
    } else {
      fetchMarketplaceData();
    }
  }, [wallet, activeTab]);

  const fetchEcosystemData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [oppRes, recRes] = await Promise.all([
        API.get(`/v1/ecosystem/access/${wallet}`),
        API.get(`/v1/ecosystem/recommend/${wallet}`)
      ]);

      const profilesRes = await API.get(`/profiles/${wallet}`);
      const score = profilesRes.data.lending_score || 700;

      const list: ProtocolOpportunity[] = [
        {
          protocol: "Lending Protocol",
          eligibility: 95,
          offer: "Prime Loan Line (5% APR)",
          approved: score >= 550,
          reason: "Score meets prime lending risk requirements."
        },
        {
          protocol: "PayFi Payments Pool",
          eligibility: 90,
          offer: "$5,000 Instant Transfer limit",
          approved: score >= 600,
          reason: "Accrued reliability factor verified."
        },
        {
          protocol: "RWA Tokenization Pool",
          eligibility: 85,
          offer: "Eligible for real estate collateral assets",
          approved: score >= 650,
          reason: "Universal identity and streak updates complete."
        }
      ];

      setOpportunities(list);
      setAiRec(recRes.data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch dynamic ecosystem opportunities.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketplaceData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/marketplace/protocols");
      setProtocolsList(res.data || []);
    } catch (err) {
      setProtocolsList([
        { name: "Keystone Lending", category: "LENDING", verified: true, minScore: 600, requestCount: 45 },
        { name: "Pebble PayFi", category: "PAYFI", verified: true, minScore: 550, requestCount: 18 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const registerProtocol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProtocolName.trim() || !wallet) return;
    setRegistering(true);

    try {
      await API.post("/marketplace/register", {
        name: newProtocolName.trim(),
        category: newProtocolCategory,
        targetUrl: newProtocolTargetUrl.trim() || "https://example.com",
        minScore: parseInt(newProtocolMinScore),
        sender: wallet
      });
      alert("Application registered successfully! Pending governance authorization.");
      setNewProtocolName("");
      fetchMarketplaceData();
    } catch (err) {
      alert("Failed to submit registration request to the governance contract.");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#040C1B",
        color: "#E2E8F0",
        fontFamily: "Inter, sans-serif",
        padding: "80px 24px 100px",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        
        {/* Header Block */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 10,
              color: "#00E5FF",
              letterSpacing: 2,
              textTransform: "uppercase",
              background: "rgba(0, 229, 255, 0.08)",
              border: "1px solid rgba(0, 229, 255, 0.2)",
              borderRadius: 30,
              padding: "6px 16px",
              marginBottom: 16,
            }}
          >
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#00E5FF" }}></span>
            Ecosystem Integrations
          </div>
          <h1
            style={{
              fontSize: 34,
              fontWeight: 900,
              background: "linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -1.5,
              margin: "0 0 12px 0",
            }}
          >
            Ecosystem & Marketplace Registry
          </h1>
          <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>
            Connect with verified money market protocols consuming Credence identity scores.
          </p>
        </div>

        {/* Tab Controls */}
        <div
          style={{
            display: "flex",
            background: "rgba(10, 18, 30, 0.4)",
            border: "1px solid #111C2E",
            borderRadius: 14,
            padding: 6,
            marginBottom: 32,
            gap: 8,
          }}
        >
          <button
            onClick={() => setActiveTab("directory")}
            style={{
              flex: 1,
              padding: "10px 16px",
              background: activeTab === "directory" ? "rgba(0, 229, 255, 0.08)" : "transparent",
              border: activeTab === "directory" ? "1px solid rgba(0, 229, 255, 0.25)" : "1px solid transparent",
              borderRadius: 8,
              color: activeTab === "directory" ? "#00E5FF" : "#94A3B8",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Ecosystem Directory
          </button>
          <button
            onClick={() => setActiveTab("marketplace")}
            style={{
              flex: 1,
              padding: "10px 16px",
              background: activeTab === "marketplace" ? "rgba(0, 229, 255, 0.08)" : "transparent",
              border: activeTab === "marketplace" ? "1px solid rgba(0, 229, 255, 0.25)" : "1px solid transparent",
              borderRadius: 8,
              color: activeTab === "marketplace" ? "#00E5FF" : "#94A3B8",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Marketplace Registry
          </button>
        </div>

        {/* Tab 1: Ecosystem Directory */}
        {activeTab === "directory" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {!wallet ? (
              <p style={{ textAlign: "center", color: "#64748B", padding: 40 }}>Please connect your wallet.</p>
            ) : loading ? (
              <p style={{ textAlign: "center", color: "#64748B" }}>Syncing Ecosystem Access...</p>
            ) : (
              <>
                {/* AI Advice */}
                {aiRec && (
                  <div style={{ background: "rgba(52, 211, 153, 0.03)", border: "1px solid rgba(52, 211, 153, 0.15)", borderRadius: 12, padding: 20 }}>
                    <strong style={{ color: "#34D399", fontSize: 13, display: "block", marginBottom: 6 }}>AI Matching recommendation:</strong>
                    <span style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5 }}>{aiRec.recommendation}</span>
                  </div>
                )}

                {/* Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                  {opportunities.map((opp, idx) => (
                    <div key={idx} style={{ background: "#0A1425", border: "1px solid #111C2E", borderRadius: 14, padding: 24 }}>
                      <strong style={{ fontSize: 15, display: "block", color: "#E2E8F0", marginBottom: 8 }}>{opp.protocol}</strong>
                      <span style={{ fontSize: 12, color: "#94A3B8", display: "block", marginBottom: 12 }}>{opp.reason}</span>
                      <div style={{ borderTop: "1px solid #111C2E", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "#64748B" }}>Yield/Offer:</span>
                        <strong style={{ fontSize: 12, color: "#00E5FF" }}>{opp.offer}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 2: Marketplace Registry */}
        {activeTab === "marketplace" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32 }}>
            {/* List */}
            <div style={{ background: "rgba(10, 18, 30, 0.4)", border: "1px solid #111C2E", borderRadius: 16, padding: 24 }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: 16, fontWeight: 800 }}>Registered Consumer Applications</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {protocolsList.map((p, idx) => (
                  <div key={idx} style={{ background: "#050B14", border: "1px solid #111C2E", borderRadius: 8, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ display: "block", fontSize: 13, color: "#FFF" }}>{p.name}</strong>
                      <span style={{ fontSize: 11, color: "#64748B" }}>Category: {p.category} | Min Score: {p.minScore}</span>
                    </div>
                    <span style={{ fontSize: 10, color: p.verified ? "#34D399" : "#FFB800", background: `rgba(${p.verified ? "52,211,153" : "255,184,0"}, 0.08)`, border: `1px solid rgba(${p.verified ? "52,211,153" : "255,184,0"}, 0.25)`, borderRadius: 4, padding: "4px 8px" }}>
                      {p.verified ? "VERIFIED" : "PENDING"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration Form */}
            <div style={{ background: "rgba(10, 18, 30, 0.4)", border: "1px solid #111C2E", borderRadius: 16, padding: 24 }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: 16, fontWeight: 800 }}>Register New Application</h3>
              <form onSubmit={registerProtocol} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 10, color: "#64748B", display: "block", marginBottom: 4 }}>PROTOCOL NAME</label>
                  <input type="text" value={newProtocolName} onChange={(e) => setNewProtocolName(e.target.value)} required style={{ width: "100%", background: "#050B14", border: "1px solid #1D2E49", borderRadius: 8, padding: "8px 12px", color: "#FFF", fontSize: 13 }} />
                </div>

                <div>
                  <label style={{ fontSize: 10, color: "#64748B", display: "block", marginBottom: 4 }}>MINIMUM FICO REQUIRED</label>
                  <input type="number" value={newProtocolMinScore} onChange={(e) => setNewProtocolMinScore(e.target.value)} required style={{ width: "100%", background: "#050B14", border: "1px solid #1D2E49", borderRadius: 8, padding: "8px 12px", color: "#FFF", fontSize: 13 }} />
                </div>

                <button type="submit" disabled={registering || !wallet} style={{ width: "100%", background: "#00E5FF", border: "none", borderRadius: 8, color: "#030A16", fontWeight: 700, padding: "10px 0", cursor: "pointer", marginTop: 10 }}>
                  {registering ? "REGISTERING..." : "SUBMIT APPLICATION"}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
