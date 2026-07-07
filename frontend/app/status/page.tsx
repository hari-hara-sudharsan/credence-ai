"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function StatusDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalTransactions: 124500,
    trustEvents: 18320,
    settlements: 5420,
    protocolsConnected: 12
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#030815",
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
            Operations Dashboard
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
            Credence Production Status
          </h1>
          <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>
            Real-time status tracking and health metrics across the HashKey Chain trust economy.
          </p>
        </div>

        {/* Status Indicators Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 40 }}>
          
          {[
            { title: "Identity Layer", status: "ONLINE", color: "#34D399" },
            { title: "AI Underwriting", status: "ONLINE", color: "#34D399" },
            { title: "Oracle Network", status: "ONLINE", color: "#34D399" },
            { title: "Smart Contracts", status: "ONLINE", color: "#34D399" },
            { title: "HSP Settlement", status: "CONNECTED", color: "#00E5FF" },
            { title: "Trust Graph", status: "SYNCED", color: "#34D399" }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(10, 18, 30, 0.4)",
                border: "1px solid #111C2E",
                borderRadius: 16,
                padding: 24,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8" }}>{item.title}</span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: 800,
                  color: item.color,
                  background: `rgba(${item.color === "#34D399" ? "52, 211, 153" : "0, 229, 255"}, 0.08)`,
                  border: `1px solid rgba(${item.color === "#34D399" ? "52, 211, 153" : "0, 229, 255"}, 0.25)`,
                  borderRadius: 4,
                  padding: "4px 8px"
                }}
              >
                {item.status}
              </span>
            </div>
          ))}

        </div>

        {/* Telemetry Metrics Panel */}
        <div
          style={{
            background: "rgba(10, 18, 30, 0.4)",
            border: "1px solid #111C2E",
            borderRadius: 24,
            padding: 32,
          }}
        >
          <h3 style={{ margin: "0 0 24px 0", fontSize: 16, fontWeight: 800 }}>Ecosystem Analytics Telemetry</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            <div>
              <span style={{ display: "block", fontSize: 10, color: "#64748B", textTransform: "uppercase", marginBottom: 6 }}>
                Total Transactions
              </span>
              <strong style={{ fontSize: 28, fontWeight: 900, color: "#FFF" }}>
                {metrics.totalTransactions.toLocaleString()}
              </strong>
            </div>
            
            <div>
              <span style={{ display: "block", fontSize: 10, color: "#64748B", textTransform: "uppercase", marginBottom: 6 }}>
                Trust Events Logged
              </span>
              <strong style={{ fontSize: 28, fontWeight: 900, color: "#34D399" }}>
                {metrics.trustEvents.toLocaleString()}
              </strong>
            </div>
            
            <div>
              <span style={{ display: "block", fontSize: 10, color: "#64748B", textTransform: "uppercase", marginBottom: 6 }}>
                HSP Settlements
              </span>
              <strong style={{ fontSize: 28, fontWeight: 900, color: "#FFF" }}>
                {metrics.settlements.toLocaleString()}
              </strong>
            </div>
            
            <div>
              <span style={{ display: "block", fontSize: 10, color: "#64748B", textTransform: "uppercase", marginBottom: 6 }}>
                Consumer Protocols
              </span>
              <strong style={{ fontSize: 28, fontWeight: 900, color: "#00E5FF" }}>
                {metrics.protocolsConnected}
              </strong>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
