"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function EcosystemPage() {
  const [wallet, setWallet] = useState("0x5bb83E60a7a05A0e1b077B66412a26306e334208");
  const [profiles, setProfiles] = useState<any>(null);
  const [credit, setCredit] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const evaluateProfiles = async () => {
    setLoading(true);
    try {
      const resProfile = await API.get(`/api/v1/profiles/${wallet.trim()}`);
      const resCredit = await API.get(`/api/v1/credit/${wallet.trim()}`);
      setProfiles(resProfile.data);
      setCredit(resCredit.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    evaluateProfiles();
  }, []);

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
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Eyebrow */}
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: "#00E5FF",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Ecosystem Composability
        </div>

        {/* Hero */}
        <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>
              Multi-Protocol Credit Profiles
            </h1>
            <p style={{ fontSize: 16, color: "#64748B", margin: 0, lineHeight: 1.6 }}>
              Demonstrating how external dApps securely consume Credence trust metrics to customize financial terms.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <input
              type="text"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              placeholder="0x..."
              style={{
                background: "#081325",
                border: "1px solid #111C2E",
                borderRadius: 8,
                padding: "10px 14px",
                color: "#E2E8F0",
                fontSize: 13,
                width: 320,
                fontFamily: "JetBrains Mono, monospace",
                outline: "none",
              }}
            />
            <button
              onClick={evaluateProfiles}
              style={{
                background: "#34D399",
                border: "none",
                borderRadius: 8,
                color: "#040C1A",
                fontWeight: 800,
                fontSize: 13,
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              EVALUATE TERMS
            </button>
          </div>
        </div>

        {/* Main Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <p style={{ color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
              Evaluating Multi-Protocol Terms...
            </p>
          </div>
        ) : profiles && credit ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            
            {/* Lending Adapter */}
            <div
              style={{
                background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
                border: "1px solid #1D2E49",
                borderRadius: 14,
                padding: 28,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontSize: 24 }}>🏦</span>
                <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#34D399", border: "1px solid #34D39944", padding: "4px 8px", borderRadius: 4 }}>
                  LENDING PROTOCOL
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0", marginBottom: 12 }}>
                Adaptive Borrowing Terms
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>Lending Score</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{profiles.lending_score}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>Interest Rate APR</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#34D399" }}>{credit.interest}% APR</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>Credit Limit</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#00E5FF" }}>${credit.limit}</span>
                </div>
              </div>
            </div>

            {/* Insurance Adapter */}
            <div
              style={{
                background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
                border: "1px solid #1D2E49",
                borderRadius: 14,
                padding: 28,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontSize: 24 }}>🛡️</span>
                <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#34D399", border: "1px solid #34D39944", padding: "4px 8px", borderRadius: 4 }}>
                  DEFI INSURANCE
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0", marginBottom: 12 }}>
                Risk Premium Customizer
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>Insurance Score</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{profiles.payment_score}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>Premium Discount</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#34D399" }}>
                    {profiles.payment_score > 700 ? "35%" : profiles.payment_score > 500 ? "15%" : "0%"} Discount
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>Risk Tier</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#00E5FF" }}>
                    {profiles.payment_score > 700 ? "PRIME" : "RETAIL"}
                  </span>
                </div>
              </div>
            </div>

            {/* RWA Adapter */}
            <div
              style={{
                background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
                border: "1px solid #1D2E49",
                borderRadius: 14,
                padding: 28,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontSize: 24 }}>💼</span>
                <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#34D399", border: "1px solid #34D39944", padding: "4px 8px", borderRadius: 4 }}>
                  RWA TOKENIZATION
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0", marginBottom: 12 }}>
                Real World Asset Financing
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>RWA Score</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{profiles.rwa_score}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>Financing Limit</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#34D399" }}>
                    ${(profiles.rwa_score * 750).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>Collateral Floor</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#00E5FF" }}>
                    {profiles.rwa_score > 700 ? "110%" : "130%"} Min LTV
                  </span>
                </div>
              </div>
            </div>

            {/* PayFi Adapter */}
            <div
              style={{
                background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
                border: "1px solid #1D2E49",
                borderRadius: 14,
                padding: 28,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontSize: 24 }}>💳</span>
                <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#34D399", border: "1px solid #34D39944", padding: "4px 8px", borderRadius: 4 }}>
                  PAYMENT INFRASTRUCTURE (PAYFI)
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0", marginBottom: 12 }}>
                Merchant Liquidity Settle
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>Reputation Standing</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{profiles.institution_score}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>Settle Grace Period</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#34D399" }}>
                    {profiles.institution_score > 750 ? "15 Days" : "7 Days"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>Default Risk Index</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#FF4D6A" }}>
                    {credit.defaultProbability}%
                  </span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <p style={{ color: "#64748B" }}>No ecosystem profile data found.</p>
        )}
      </div>
    </main>
  );
}
