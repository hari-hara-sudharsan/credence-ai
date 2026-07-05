"use client";

import OracleDashboard from "@/components/OracleDashboard";

export default function OraclePage() {
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
          <span>TRUST ENGINE INFRASTRUCTURE</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>MILESTONE C</span>
        </div>

        {/* Hero Section */}
        <div style={{ marginBottom: 48 }}>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#E2E8F0",
              letterSpacing: -1,
              marginBottom: 12,
            }}
          >
            Credence Oracle Network
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
            Institutional-grade verification for AI-powered credit decisions. Instantly query, inspect, and verify structured lending decisions published on-chain.
          </p>
        </div>

        {/* Main Dashboard Components */}
        <OracleDashboard />
      </div>
    </main>
  );
}
