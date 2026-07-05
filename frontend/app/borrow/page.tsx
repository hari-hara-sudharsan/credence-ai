"use client";

import BorrowFlow from "@/components/BorrowFlow";

export default function BorrowPage() {
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
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        
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
          <span>Credence Protocol</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>Under-Collateralized Borrow Flow</span>
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
            Lending Infrastructure
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 750, lineHeight: 1.5 }}>
            Experience how Credence AI evaluates wallet history to build borrowing power and executes smart contract settlements via HashKey Stablecoin Payment (HSP).
          </p>
        </div>

        {/* WOW Story Segment */}
        <div
          style={{
            background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
            border: "1px solid #1D2E49",
            borderRadius: 14,
            padding: 24,
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#34D399",
              letterSpacing: 0.5,
            }}
          >
            "Credence AI turned wallet history into borrowing power."
          </span>
        </div>

        {/* P2P Loan Request Banner */}
        <a
          href="/borrow/request"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 20px",
            background: "linear-gradient(135deg, rgba(52,211,153,0.08), rgba(96,165,250,0.08))",
            border: "1px solid rgba(52,211,153,0.2)",
            borderRadius: 14,
            textDecoration: "none",
            marginBottom: 32,
            transition: "all 0.2s ease",
          }}
        >
          <span style={{ fontSize: 22 }}>📋</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#34D399" }}>
              Request P2P Loan
            </div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>
              Create a loan request backed by your AI credit reputation — lenders fund you directly →
            </div>
          </div>
        </a>

        {/* BorrowFlow Container */}
        <BorrowFlow />

      </div>
    </main>
  );
}
