"use client";

import { useState } from "react";
import AIAgentChat from "@/components/AIAgentChat";
import BorrowerAdvisor from "@/components/BorrowerAdvisor";
import LenderAdvisor from "@/components/LenderAdvisor";
import ProtocolAdvisor from "@/components/ProtocolAdvisor";
import AgentInsights from "@/components/AgentInsights";

export default function AgentsPage() {
  const [insights, setInsights] = useState<any[]>([]);

  const handleSearchResult = (newInsights: any[]) => {
    setInsights(newInsights);
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
          <span>AUTONOMOUS ADVISOR AGENTS</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>MILESTONE E</span>
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
            Credence AI Financial Agents
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
            Autonomous intelligence providing explainable advice for borrowers, lenders, and protocols.
          </p>
        </div>

        {/* Grid panel */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32, alignItems: "start" }}>
          
          {/* Chat Workspace */}
          <AIAgentChat onSearchResult={handleSearchResult} />

          {/* Sidebar stack */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {insights.length > 0 && <AgentInsights insights={insights} />}
            <BorrowerAdvisor />
            <LenderAdvisor />
            <ProtocolAdvisor />
          </div>

        </div>
      </div>
    </main>
  );
}
