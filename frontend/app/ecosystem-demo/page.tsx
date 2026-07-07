"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useWallet } from "@/context/WalletContext";

export default function EcosystemDemoPage() {
  const { wallet } = useWallet();
  const [profile, setProfile] = useState<any | null>(null);
  const [score, setScore] = useState(742);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async (address: string) => {
    setLoading(true);
    try {
      const res = await API.get(`/v1/ecosystem/profile/${address}`);
      if (res.data?.profiles) {
        setProfile(res.data.profiles);
      }
      
      // Fetch score
      const scoreRes = await API.post("/insights/", { wallet: address });
      if (scoreRes.data?.credit_score) {
        setScore(scoreRes.data.credit_score);
      }
    } catch (err) {
      console.error(err);
      // Fallback mocks matching structure
      setProfile({
        lending: { score: 750, risk: "LOW" },
        payment: { score: 820, risk: "LOW", frequency: "HIGH" },
        insurance: { score: 900, premiumRisk: "LOW" },
        rwa: { score: 820, verified: true, limit: 82000 },
        dao: { score: 780, participationRate: 78, standing: "EXCELLENT" },
        agent: { score: 800, autonomyLimit: 4000, validation: true }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wallet && wallet.trim().length > 0) {
      fetchProfile(wallet.trim());
    } else {
      // Default fallback when wallet is not connected yet
      setProfile({
        lending: { score: 750, risk: "LOW" },
        payment: { score: 820, risk: "LOW", frequency: "HIGH" },
        insurance: { score: 900, premiumRisk: "LOW" },
        rwa: { score: 820, verified: true, limit: 82000 },
        dao: { score: 780, participationRate: 78, standing: "EXCELLENT" },
        agent: { score: 800, autonomyLimit: 4000, validation: true }
      });
    }
  }, [wallet]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#040C1A",
        color: "#E2E8F0",
        fontFamily: "Inter, sans-serif",
        padding: "80px 24px 100px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        
        {/* Header Block */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 10,
              color: "#34D399",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#34D399" }}></span>
            Composability Dashboard
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              background: "linear-gradient(135deg, #FFFFFF 0%, #64748B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -1,
              margin: 0,
            }}
          >
            Ecosystem Consumer Applications
          </h1>
          <p style={{ color: "#64748B", fontSize: 14, marginTop: 8, maxWidth: 600 }}>
            One Financial Identity, Multiple Applications. Discover how independent platforms consume your unified Credence credit passport parameters in real-time.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2.5fr", gap: 32 }}>
          
          {/* Passport overview */}
          <div
            style={{
              background: "rgba(10, 18, 30, 0.3)",
              border: "1px solid #111C2E",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <h3 style={{ margin: "0 0 16px 0", fontSize: 16, fontWeight: 700 }}>Ecosystem Passport</h3>
            
            <div style={{ borderBottom: "1px solid #111C2E", paddingBottom: 16, marginBottom: 20 }}>
              <span style={{ display: "block", fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                Connected Wallet
              </span>
              <span style={{ display: "block", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "#E2E8F0", wordBreak: "break-all" }}>
                {wallet || "0x123f2312b9d4e5f2a1b9d4f2e512c0192a83bb22"}
              </span>
            </div>

            <div style={{ marginBottom: 20 }}>
              <span style={{ display: "block", fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                Unified Trust Score
              </span>
              <span style={{ fontSize: 36, fontWeight: 800, color: "#34D399" }}>
                {score}
              </span>
            </div>

            <div
              style={{
                background: "rgba(52, 211, 153, 0.04)",
                border: "1px solid rgba(52, 211, 153, 0.15)",
                borderRadius: 10,
                padding: 14,
                fontSize: 12,
                color: "#34D399",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              ✓ Unified Identity Verified on UCVN
            </div>
          </div>

          {/* Connected Applications list */}
          <div>
            <h3 style={{ margin: "0 0 20px 0", fontSize: 18, fontWeight: 800 }}>Consuming Applications</h3>
            
            {loading || !profile ? (
              <p style={{ color: "#64748B", fontSize: 13 }}>Fetching consumer endpoints...</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                
                {/* Lending Card */}
                <div style={{ background: "rgba(17, 28, 46, 0.3)", border: "1px solid #111C2E", borderRadius: 12, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#FFF" }}>Lending App</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#34D399" }}>✓ CONNECTED</span>
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div>
                      <span style={{ display: "block", fontSize: 10, color: "#4A6080" }}>Score</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#FFF" }}>{profile.lending?.score || score}</span>
                    </div>
                    <div>
                      <span style={{ display: "block", fontSize: 10, color: "#4A6080" }}>Risk Standing</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#34D399" }}>{profile.lending?.risk || "LOW"}</span>
                    </div>
                  </div>
                </div>

                {/* PayFi Card */}
                <div style={{ background: "rgba(17, 28, 46, 0.3)", border: "1px solid #111C2E", borderRadius: 12, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#FFF" }}>PayFi Payments</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#34D399" }}>✓ CONNECTED</span>
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div>
                      <span style={{ display: "block", fontSize: 10, color: "#4A6080" }}>Score</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#FFF" }}>{profile.payment?.score || score}</span>
                    </div>
                    <div>
                      <span style={{ display: "block", fontSize: 10, color: "#4A6080" }}>Risk Standing</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#00E5FF" }}>{profile.payment?.risk || "LOW"}</span>
                    </div>
                  </div>
                </div>

                {/* RWA Card */}
                <div style={{ background: "rgba(17, 28, 46, 0.3)", border: "1px solid #111C2E", borderRadius: 12, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#FFF" }}>RWA Tokenization</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#34D399" }}>✓ CONNECTED</span>
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div>
                      <span style={{ display: "block", fontSize: 10, color: "#4A6080" }}>RWA Limit</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#FFF" }}>${profile.rwa?.limit?.toLocaleString() || "82,000"}</span>
                    </div>
                    <div>
                      <span style={{ display: "block", fontSize: 10, color: "#4A6080" }}>Asset Verification</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#34D399" }}>{profile.rwa?.verified ? "VERIFIED ✓" : "PENDING"}</span>
                    </div>
                  </div>
                </div>

                {/* DAO Governance Card */}
                <div style={{ background: "rgba(17, 28, 46, 0.3)", border: "1px solid #111C2E", borderRadius: 12, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#FFF" }}>DAO Governance</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8" }}>READY</span>
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div>
                      <span style={{ display: "block", fontSize: 10, color: "#4A6080" }}>Score</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#FFF" }}>{profile.dao?.score || score}</span>
                    </div>
                    <div>
                      <span style={{ display: "block", fontSize: 10, color: "#4A6080" }}>DAO Standing</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#FFF" }}>{profile.dao?.standing || "EXCELLENT"}</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            <div
              style={{
                marginTop: 24,
                padding: 20,
                background: "rgba(0, 229, 255, 0.04)",
                border: "1px solid rgba(0, 229, 255, 0.15)",
                borderRadius: 12,
                fontSize: 12,
                lineHeight: 1.6,
                color: "#94A3B8",
              }}
            >
              <strong style={{ color: "#FFF" }}>Cross-App Verification Consensus:</strong> Consumer applications do not require independent credit checks or KYC procedures. By query-attesting to the unified UCVN registry separated by EIP-712 domain scopes, the same on-chain credential acts as the primary trust layer everywhere.
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
