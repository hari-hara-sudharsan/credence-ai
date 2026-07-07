"use client";

import { useState } from "react";
import API from "@/lib/api";
import { useWallet } from "@/context/WalletContext";

export default function DevelopersPage() {
  const { wallet } = useWallet();
  const [method, setMethod] = useState("verifyTrust");
  const [walletInput, setWalletInput] = useState(wallet || "0x5bb83E60a7a05A0e1b077B66412a26306e334208");
  const [appType, setAppType] = useState("LENDING");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const getCodeSnippet = () => {
    switch (method) {
      case "verifyTrust":
        return `import Credence from "@credence/sdk";\n\n// 1. Initialize\nCredence.init("YOUR_API_KEY");\n\n// 2. Verify wallet trust metrics\nconst res = await Credence.verifyTrust("${walletInput}");\nconsole.log(res);`;
      case "getProtocolProfile":
        return `import Credence from "@credence/sdk";\n\n// 1. Initialize\nCredence.init("YOUR_API_KEY");\n\n// 2. Get multi-protocol credentials\nconst res = await Credence.getProtocolProfile("${walletInput}");\nconsole.log(res);`;
      case "evaluate":
        return `import Credence from "@credence/sdk";\n\n// 1. Initialize\nCredence.init("YOUR_API_KEY");\n\n// 2. Request risk evaluation decision\nconst res = await Credence.protocol.evaluate({\n  wallet: "${walletInput}",\n  type: "${appType}"\n});\nconsole.log(res);`;
      case "graph":
        return `import Credence from "@credence/sdk";\n\n// 1. Initialize\nCredence.init("YOUR_API_KEY");\n\n// 2. Resolve trust connections network rank\nconst res = await Credence.graph("${walletInput}");\nconsole.log(res);`;
      default:
        return "";
    }
  };

  const executeSDKCall = async () => {
    setLoading(true);
    setResult(null);
    try {
      let endpoint = "";
      if (method === "verifyTrust") {
        endpoint = `/ai/risk/${walletInput}`;
      } else if (method === "getProtocolProfile") {
        endpoint = `/v1/ecosystem/profile/${walletInput}`;
      } else if (method === "evaluate") {
        endpoint = `/v1/protocol/decision?wallet=${walletInput}&application=${appType}`;
      } else if (method === "graph") {
        const [graphRes, insightsRes] = await Promise.all([
          API.get(`/graph/${walletInput}`),
          API.get(`/graph/insights/${walletInput}`)
        ]);
        setResult({
          nodesCount: graphRes.data?.nodes?.length || 0,
          edgesCount: graphRes.data?.edges?.length || 0,
          rank: insightsRes.data?.rank || "WATCHLIST",
          opportunities: insightsRes.data?.opportunities || []
        });
        setLoading(false);
        return;
      }

      const res = await API.get(endpoint);
      setResult(res.data);
    } catch (err: any) {
      console.error(err);
      setResult({
        error: "SDK Request Failed",
        detail: err.response?.data?.detail || err.message || "Network Timeout"
      });
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
        padding: "80px 24px 100px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        
        {/* Top Header */}
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
            Developer Portal & SDK
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
            SDK Integration & Console
          </h1>
          <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>
            Query, manage, and consume EIP-712 reputation credentials on HashKey Chain with ease.
          </p>
        </div>

        {/* Explain how it works */}
        <div
          style={{
            background: "rgba(0, 229, 255, 0.02)",
            border: "1px solid rgba(0, 229, 255, 0.15)",
            borderRadius: 14,
            padding: 24,
            marginBottom: 32,
            fontSize: 13,
            lineHeight: 1.6,
            color: "#94A3B8",
          }}
        >
          <strong style={{ color: "#00E5FF", display: "block", marginBottom: 8, fontSize: 14 }}>
            How does the SDK work?
          </strong>
          <p style={{ margin: "0 0 8px 0" }}>
            The `@credence/sdk` is package-structured at <code>/packages/credence-sdk</code>. It exposes pre-formed HTTP query handlers built in TypeScript that directly communicate with the Credence evaluation engines.
          </p>
          <p style={{ margin: 0 }}>
            By importing this SDK, decentralized money markets can fetch raw FICO ratings, evaluate borrower risk weights on-chain, and trigger automated smart contract liquidations/repayments seamlessly.
          </p>
        </div>

        {/* Console Playground */}
        <div
          style={{
            background: "rgba(10, 18, 30, 0.4)",
            border: "1px solid #111C2E",
            borderRadius: 16,
            padding: 24,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          {/* Controls */}
          <div>
            <h3 style={{ margin: "0 0 16px 0", fontSize: 15, fontWeight: 800 }}>SDK Method Playground</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 10, color: "#64748B", display: "block", marginBottom: 4 }}>SDK METHOD</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  style={{ width: "100%", background: "#050B14", border: "1px solid #1D2E49", borderRadius: 8, padding: "8px 12px", color: "#FFF", fontSize: 13 }}
                >
                  <option value="verifyTrust">verifyTrust(wallet)</option>
                  <option value="getProtocolProfile">getProtocolProfile(wallet)</option>
                  <option value="evaluate">protocol.evaluate(wallet, type)</option>
                  <option value="graph">graph(wallet)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 10, color: "#64748B", display: "block", marginBottom: 4 }}>WALLET ADDRESS</label>
                <input
                  type="text"
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                  style={{ width: "100%", background: "#050B14", border: "1px solid #1D2E49", borderRadius: 8, padding: "8px 12px", color: "#FFF", fontSize: 13, fontFamily: "JetBrains Mono, monospace" }}
                />
              </div>

              {method === "evaluate" && (
                <div>
                  <label style={{ fontSize: 10, color: "#64748B", display: "block", marginBottom: 4 }}>APPLICATION TYPE</label>
                  <select
                    value={appType}
                    onChange={(e) => setAppType(e.target.value)}
                    style={{ width: "100%", background: "#050B14", border: "1px solid #1D2E49", borderRadius: 8, padding: "8px 12px", color: "#FFF", fontSize: 13 }}
                  >
                    <option value="LENDING">LENDING</option>
                    <option value="PAYFI">PAYFI</option>
                    <option value="RWA">RWA</option>
                  </select>
                </div>
              )}

              <button
                onClick={executeSDKCall}
                disabled={loading}
                style={{
                  background: "#34D399",
                  border: "none",
                  borderRadius: 8,
                  color: "#030A16",
                  fontWeight: 800,
                  fontSize: 13,
                  padding: "10px 0",
                  cursor: "pointer",
                  marginTop: 10
                }}
              >
                {loading ? "EXECUTING CALL..." : "RUN SDK METHOD"}
              </button>
            </div>
          </div>

          {/* Code preview & Output */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <span style={{ fontSize: 10, color: "#64748B", display: "block", marginBottom: 4 }}>TYPESCRIPT SNIPPET</span>
              <pre
                style={{
                  background: "#050B14",
                  border: "1px solid #1D2E49",
                  borderRadius: 8,
                  padding: 16,
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 11,
                  color: "#94A3B8",
                  margin: 0,
                  overflowX: "auto"
                }}
              >
                {getCodeSnippet()}
              </pre>
            </div>

            <div>
              <span style={{ fontSize: 10, color: "#64748B", display: "block", marginBottom: 4 }}>CONSOLE OUTPUT</span>
              <pre
                style={{
                  background: "#020713",
                  border: "1px solid #111C2E",
                  borderRadius: 8,
                  padding: 16,
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 11,
                  color: "#34D399",
                  margin: 0,
                  minHeight: 120,
                  overflowX: "auto"
                }}
              >
                {result ? JSON.stringify(result, null, 2) : "// Run method to observe live JSON payloads"}
              </pre>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
