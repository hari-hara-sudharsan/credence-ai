"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import MarketplaceStats from "@/components/MarketplaceStats";
import BorrowerCard from "@/components/BorrowerCard";

import LenderExplorer from "@/components/LenderExplorer";
import ProtocolMatcher from "@/components/ProtocolMatcher";
import TrustRanking from "@/components/TrustRanking";

export default function MarketplacePage() {
  const [loading, setLoading] = useState(true);
  const [borrowers, setBorrowers] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  
  // Matches details
  const [lenderMatches, setLenderMatches] = useState<any[]>([]);
  const [protocolMatches, setProtocolMatches] = useState<any[]>([]);
  const [networkGraph, setNetworkGraph] = useState<any | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);

  // Search parameters
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [badgeFilter, setBadgeFilter] = useState("");

  const loadMarketplaceData = async () => {
    setLoading(true);
    try {
      const [bResp, lResp] = await Promise.all([
        API.get("/marketplace/borrowers"),
        API.get("/marketplace/top-wallets")
      ]);

      setBorrowers(bResp.data || []);
      setLeaderboard(lResp.data || []);
    } catch (err) {
      console.error("Failed to load marketplace database:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = `/marketplace/search?q=${searchQuery}`;
      if (riskFilter) url += `&risk_level=${riskFilter}`;
      if (badgeFilter) url += `&badge=${badgeFilter}`;

      const response = await API.get(url);
      setBorrowers(response.data || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectBorrower = async (wallet: string) => {
    setSelectedWallet(wallet);
    setMatchLoading(true);
    try {
      const [lResp, pResp, nResp] = await Promise.all([
        API.get(`/marketplace/match/lender/${wallet}`),
        API.get(`/marketplace/match/protocol/${wallet}`),
        API.get(`/marketplace/network/${wallet}`)
      ]);

      setLenderMatches(lResp.data || []);
      setProtocolMatches(pResp.data || []);
      setNetworkGraph(nResp.data || null);
    } catch (err) {
      console.error("Failed to load match parameters:", err);
    } finally {
      setMatchLoading(false);
    }
  };

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const totalCredit = borrowers.reduce((sum, b) => sum + b.available_credit, 0);

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
          <span>DECENTRALIZED CREDIT EXCHANGE</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>TRUST NETWORKS</span>
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
            Credence Trust Marketplace
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
            Where verified financial credentials, trust ranking coefficients, and capital matches create liquidity.
          </p>
        </div>

        {/* Market Stats */}
        {!loading && (
          <div style={{ marginBottom: 32 }}>
            <MarketplaceStats totalWallets={borrowers.length} totalCredit={totalCredit} />
          </div>
        )}

        {/* Search controls row */}
        <div
          style={{
            background: "#0A1425",
            border: "1px solid #111C2E",
            borderRadius: 14,
            padding: 24,
            marginBottom: 32,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr auto",
            gap: 16,
            alignItems: "end",
          }}
        >
          <div>
            <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
              SEARCH KEYWORDS
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wallet address or badge..."
              style={{
                width: "100%",
                background: "#050B14",
                border: "1px solid #1D2E49",
                borderRadius: 8,
                padding: "10px 14px",
                color: "#E2E8F0",
                fontSize: 13,
                outline: "none",
                fontFamily: "JetBrains Mono, monospace",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
              RISK FILTER
            </label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              style={{
                width: "100%",
                background: "#050B14",
                border: "1px solid #1D2E49",
                borderRadius: 8,
                padding: "10px 12px",
                color: "#E2E8F0",
                fontSize: 13,
                outline: "none",
                height: 38,
              }}
            >
              <option value="">All Risks</option>
              <option value="LOW">LOW Risk</option>
              <option value="MEDIUM">MEDIUM Risk</option>
              <option value="HIGH">HIGH Risk</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
              BADGE FILTER
            </label>
            <select
              value={badgeFilter}
              onChange={(e) => setBadgeFilter(e.target.value)}
              style={{
                width: "100%",
                background: "#050B14",
                border: "1px solid #1D2E49",
                borderRadius: 8,
                padding: "10px 12px",
                color: "#E2E8F0",
                fontSize: 13,
                outline: "none",
                height: 38,
              }}
            >
              <option value="">All Seals</option>
              <option value="INSTITUTIONAL_VERIFIED">Institutional Verified</option>
              <option value="GOLD">GOLD Seal</option>
              <option value="SILVER">SILVER Seal</option>
              <option value="BRONZE">BRONZE Seal</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            style={{
              background: "#00E5FF",
              border: "none",
              borderRadius: 8,
              color: "#040C1A",
              fontWeight: 700,
              fontSize: 13,
              padding: "0 28px",
              height: 38,
              cursor: "pointer",
            }}
          >
            SEARCH
          </button>
        </div>

        {/* Main Columns Grid Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32, alignItems: "start" }}>
          
          {/* Left Column: Verified Borrowers grid & Leaderboard */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            
            {loading ? (
              <div style={{ color: "#64748B", textAlign: "center", padding: "100px 0" }}>
                LOADING REPUTATION REGISTRIES...
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 16 }}>
                  VERIFIED DIRECTORY ({borrowers.length} WALLETS)
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {borrowers.map((b) => (
                    <div key={b.wallet} onClick={() => selectBorrower(b.wallet)} style={{ cursor: "pointer" }}>
                      <BorrowerCard borrower={b} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {leaderboard.length > 0 && <TrustRanking leaderboard={leaderboard} />}
          </div>

          {/* Right Column: Connection Networks & Match telemetries */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {selectedWallet ? (
              matchLoading ? (
                <div style={{ color: "#64748B", fontSize: 12 }}>COMPUTING COMPATIBILITY MATCHES...</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                  
                  {/* Trust Graph Node Display */}
                  {networkGraph && (
                    <div
                      style={{
                        background: "#0A1425",
                        border: "1px solid #111C2E",
                        borderRadius: 14,
                        padding: 24,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                      }}
                    >
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#00E5FF", letterSpacing: 2, fontFamily: "JetBrains Mono, monospace", marginBottom: 16 }}>
                        RELATIONSHIP TRUST GRAPH
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <span style={{ fontSize: 13, color: "#94A3B8" }}>Ecosystem Network index</span>
                        <span style={{ fontSize: 18, fontWeight: 800, color: "#34D399" }}>
                          {networkGraph.network_score}/100
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {networkGraph.connections.map((c: any, i: number) => (
                          <div
                            key={i}
                            style={{
                              background: "#050B14",
                              border: "1px solid #111C2E",
                              borderRadius: 8,
                              padding: "10px 14px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontSize: 12,
                            }}
                          >
                            <span style={{ color: "#E2E8F0" }}>
                              {c.name} ({c.type})
                            </span>
                            <span style={{ color: "#00E5FF", fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
                              {c.trust_relationship}% trust
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {lenderMatches.length > 0 && <LenderExplorer matches={lenderMatches} />}

                  {protocolMatches.length > 0 && <ProtocolMatcher matches={protocolMatches} />}

                </div>
              )
            ) : (
              <div
                style={{
                  background: "#0A1425",
                  border: "1px dashed #111C2E",
                  borderRadius: 14,
                  padding: "60px 24px",
                  textAlign: "center",
                  color: "#64748B",
                  fontSize: 13,
                }}
              >
                ℹ️ Select any verified borrower profile on the left to view lender pool compatibility, protocol eligibility, and trust relationship network maps.
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}