"use client";

import { useState } from "react";
import API from "@/lib/api";

export default function DevelopersPage() {
  const [wallet, setWallet] = useState("0x5bb83E60a7a05A0e1b077B66412a26306e334208");
  const [endpoint, setEndpoint] = useState("/api/v1/trust");
  const [responsePayload, setResponsePayload] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("credence_live_test_7f28c9b01e3");

  const sendRequest = async () => {
    setLoading(true);
    setResponsePayload(null);
    try {
      const res = await API.get(`${endpoint}/${wallet.trim()}`);
      setResponsePayload(res.data);
    } catch (err: any) {
      setResponsePayload({ error: err.response?.data?.detail || err.message });
    } finally {
      setLoading(false);
    }
  };

  const sdkCode = `import { Credence } from "@credence/trust-sdk";

// Initialize the SDK with your API Key
const credence = new Credence({
  apiKey: "${apiKey}"
});

// Verify trust profile for any HashKey wallet
const profile = await credence.verify("${wallet}");

console.log("Trust Score:", profile.trustScore);
console.log("Risk Tier:", profile.tier); // e.g. "PRIME"

if (profile.trustScore > 800) {
  unlockPremiumFinancialTerms();
}`;

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
          Developer Infrastructure
        </div>

        {/* Hero */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>
            Programmable Trust API
          </h1>
          <p style={{ fontSize: 16, color: "#64748B", maxWidth: 800, margin: 0, lineHeight: 1.6 }}>
            Integrate Credence's real-time AI credit and reputation data into any HashKey application with a single API call.
          </p>
        </div>

        {/* Developer Key & Specs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 40 }}>
          <div
            style={{
              background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
              border: "1px solid #1D2E49",
              borderRadius: 14,
              padding: 24,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#E2E8F0" }}>
              API Access Credentials
            </h3>
            <p style={{ fontSize: 12, color: "#64748B", marginBottom: 16 }}>
              Use your credentials to authenticate programmatic HTTPS queries to the Credence network.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: "#64748B" }}>PROJECT API KEY</label>
              <input
                type="text"
                readOnly
                value={apiKey}
                style={{
                  background: "#050B14",
                  border: "1px solid #1D2E49",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "#34D399",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              />
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
              border: "1px solid #1D2E49",
              borderRadius: 14,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#E2E8F0" }}>
                Developer SDK Integration
              </h3>
              <p style={{ fontSize: 12, color: "#64748B", margin: 0, lineHeight: 1.5 }}>
                Get started quickly using our pre-built Javascript/TypeScript SDK package `@credence/trust-sdk`.
              </p>
            </div>
            <code style={{ fontSize: 11, color: "#34D399", fontFamily: "JetBrains Mono, monospace", background: "#050B14", padding: "8px 12px", borderRadius: 8, border: "1px solid #1D2E49" }}>
              npm install @credence/trust-sdk
            </code>
          </div>
        </div>

        {/* API Playground Sandbox */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32 }}>
          {/* Playground Panel */}
          <div
            style={{
              background: "#081325",
              border: "1px solid #111C2E",
              borderRadius: 16,
              padding: 32,
              boxShadow: "0 12px 48px rgba(0,0,0,0.3)",
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#E2E8F0", marginBottom: 20 }}>
              Endpoint Sandbox Explorer
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 24 }}>
              <div>
                <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
                  SELECT TRUST ENDPOINT
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["/api/v1/trust", "/api/v1/credit", "/api/v1/reputation", "/api/profiles"].map((ep) => (
                    <button
                      key={ep}
                      onClick={() => setEndpoint(ep)}
                      style={{
                        flex: 1,
                        background: endpoint === ep ? "#00E5FF" : "#050B14",
                        border: "1px solid #1D2E49",
                        borderRadius: 8,
                        color: endpoint === ep ? "#040C1A" : "#94A3B8",
                        fontWeight: 700,
                        fontSize: 11,
                        padding: "8px 0",
                        cursor: "pointer",
                      }}
                    >
                      {ep.replace("/api/", "")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
                  TARGET WALLET ADDRESS
                </label>
                <input
                  type="text"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#050B14",
                    border: "1px solid #1D2E49",
                    borderRadius: 8,
                    padding: "10px 14px",
                    color: "#E2E8F0",
                    fontSize: 13,
                    fontFamily: "JetBrains Mono, monospace",
                    outline: "none",
                  }}
                />
              </div>

              <button
                onClick={sendRequest}
                disabled={loading}
                style={{
                  background: "#34D399",
                  border: "none",
                  borderRadius: 8,
                  color: "#040C1A",
                  fontWeight: 800,
                  fontSize: 13,
                  padding: "12px 0",
                  cursor: "pointer",
                }}
              >
                {loading ? "SENDING REQUEST..." : "SEND TEST REQUEST ➔"}
              </button>
            </div>

            {/* Sandbox Response Payload */}
            <div>
              <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
                JSON RESPONSE PAYLOAD
              </label>
              <pre
                style={{
                  background: "#050B14",
                  border: "1px solid #1D2E49",
                  borderRadius: 8,
                  padding: 16,
                  color: "#00E5FF",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 11.5,
                  overflowX: "auto",
                  minHeight: 180,
                  margin: 0,
                }}
              >
                {responsePayload
                  ? JSON.stringify(responsePayload, null, 2)
                  : "// Press Send to receive structured payload response"}
              </pre>
            </div>
          </div>

          {/* Code Snippet Panel */}
          <div
            style={{
              background: "#081325",
              border: "1px solid #111C2E",
              borderRadius: 16,
              padding: 32,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0", marginBottom: 16 }}>
              Integration Snippet
            </h3>
            <pre
              style={{
                background: "#050B14",
                border: "1px solid #1D2E49",
                borderRadius: 8,
                padding: 16,
                color: "#E2E8F0",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 11.5,
                overflowX: "auto",
                flex: 1,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {sdkCode}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
