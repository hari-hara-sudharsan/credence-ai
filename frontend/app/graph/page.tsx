"use client";

import { useState } from "react";
import API from "@/lib/api";
import TrustGraph from "@/components/TrustGraph";
import WalletNode from "@/components/WalletNode";
import ProtocolNode from "@/components/ProtocolNode";
import RelationshipExplorer from "@/components/RelationshipExplorer";
import GraphInsights from "@/components/GraphInsights";

export default function GraphPage() {
  const [wallet, setWallet] = useState("");
  const [activeWallet, setActiveWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [graph, setGraph] = useState<any | null>(null);
  const [insights, setInsights] = useState<string>("");
  const [trustFlow, setTrustFlow] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadGraph = async () => {
    if (!wallet.trim()) {
      alert("Please input a valid wallet address.");
      return;
    }

    setLoading(true);
    setError(null);
    setActiveWallet(wallet.trim());

    try {
      const [gResp, iResp, tfResp] = await Promise.all([
        API.get(`/graph/${wallet.trim()}`),
        API.get(`/graph/${wallet.trim()}/insights`),
        API.get(`/graph/${wallet.trim()}/trust-flow`)
      ]);

      setGraph(gResp.data);
      setInsights(iResp.data.insights);
      setTrustFlow(tfResp.data);
    } catch (err) {
      setError("Failed to construct reputation graph.");
    } finally {
      setLoading(false);
    }
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
          <span>REPUTATION PROTOCOLS NODE MAP</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>GRAPH INTELLIGENCE</span>
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
            Financial Trust Graph
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
            Decentralized identity relationship mapping, trust propagation flow checking, and connection analytics.
          </p>
        </div>

        {/* Search controls row */}
        <div
          style={{
            background: "#0A1425",
            border: "1px solid #111C2E",
            borderRadius: 14,
            padding: 24,
            marginBottom: 32,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            display: "flex",
            gap: 16,
          }}
        >
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="Input Wallet Address (0x...) to build connection graph and trace trust paths"
            style={{
              flex: 1,
              background: "#050B14",
              border: "1px solid #1D2E49",
              borderRadius: 8,
              padding: "12px 16px",
              color: "#E2E8F0",
              fontSize: 14,
              outline: "none",
              fontFamily: "JetBrains Mono, monospace",
            }}
          />
          <button
            onClick={loadGraph}
            disabled={loading}
            style={{
              background: "#00E5FF",
              border: "none",
              borderRadius: 8,
              color: "#040C1A",
              fontWeight: 700,
              fontSize: 14,
              padding: "0 32px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "MAPPING..." : "CONSTRUCT GRAPH"}
          </button>
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

        {activeWallet && graph && trustFlow && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            
            {/* Top row status */}
            <div
              style={{
                background: "#0A1425",
                border: "1px solid #111C2E",
                borderRadius: 14,
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontSize: 11, color: "#64748B" }}>ACTIVE TARGET NODE</span>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#E2E8F0", fontFamily: "JetBrains Mono, monospace" }}>
                  {activeWallet}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 11, color: "#64748B" }}>REPUTATION PROPAGATION SCORE</span>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#34D399" }}>
                  {graph.network_score}/100
                </div>
              </div>
            </div>

            {/* Split layout: graph diagram and sidebar detail metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32, alignItems: "start" }}>
              <TrustGraph nodes={graph.nodes} edges={graph.edges} />

              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                
                <WalletNode
                  wallet={activeWallet}
                  creditScore={graph.nodes[0].metadata.credit_score}
                  risk={graph.nodes[0].metadata.risk}
                />

                <ProtocolNode protocolName="HashKey Lending" type="MoneyMarket" />

                <RelationshipExplorer edges={graph.edges} />

              </div>
            </div>

            {/* Full-width bottom layout: flow timeline and insights */}
            <GraphInsights
              insights={insights}
              trustSources={trustFlow.trust_sources}
              trustPath={trustFlow.trust_path}
            />

          </div>
        )}

      </div>
    </main>
  );
}
