"use client";

import ArchitectureViewer from "@/components/ArchitectureViewer";
import SystemOverview from "@/components/SystemOverview";

export default function ArchitecturePage() {
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
          <span>ARCHITECTURAL SCHEMATICS DIAGRAM</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>CREDENCE AI</span>
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
            System Architecture
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
            A detailed breakdown of Credence AI's multi-layered credit scoring and blockchain identity registry pipeline.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 32, alignItems: "start" }}>
          <SystemOverview />
          <ArchitectureViewer />
        </div>

      </div>
    </main>
  );
}
