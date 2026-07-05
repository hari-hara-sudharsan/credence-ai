"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TrustFlow from "@/components/TrustFlow";


export default function HomePage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  // Animated Timeline Simulation logic
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const timelineSteps = [
    { title: "Connect Wallet", desc: "User authenticates their public address via standard providers.", badge: "HASHKEY READY" },
    { title: "AI Credit Analysis", desc: "Predictive algorithms calculate creditworthiness & risk vectors.", badge: "AI VERIFIED" },
    { title: "Generate Loan Offer", desc: "Loan offer metrics adapt based on credit ranking parameters.", badge: "AI VERIFIED" },
    { title: "Oracle Verification", desc: "Signs cryptographically verifiable EIP-712 credential proofs.", badge: "ORACLE SIGNED" },
    { title: "Execute Lending Decision", desc: "Target lending protocol releases under-collateralized assets.", badge: "HASHKEY READY" }
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#040C1A",
        color: "#E2E8F0",
        fontFamily: "Inter, sans-serif",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Ambient background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(52, 211, 153, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(52, 211, 153, 0.02) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: -150,
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 600,
          background: "radial-gradient(ellipse at center, rgba(52, 211, 153, 0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 120px", position: "relative", zIndex: 10 }}>
        
        {/* ================= SECTION 1: HERO ================= */}
        <section style={{ textAlign: "center", marginBottom: 120 }}>
          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(52, 211, 153, 0.05)",
              border: "1px solid rgba(52, 211, 153, 0.15)",
              borderRadius: 20,
              padding: "6px 16px",
              marginBottom: 24,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D399" }} />
            <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#34D399", fontWeight: 700, letterSpacing: 0.5 }}>
              HASHKEY CHAIN DEFI INFRASTRUCTURE
            </span>
          </div>

          <h1
            style={{
              fontSize: 54,
              fontWeight: 800,
              color: "#E2E8F0",
              lineHeight: 1.1,
              letterSpacing: -1.5,
              maxWidth: 800,
              margin: "0 auto 20px",
            }}
          >
            The Trust Layer Powering HashKey Finance
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#64748B",
              lineHeight: 1.6,
              maxWidth: 680,
              margin: "0 auto 36px",
            }}
          >
            Credence AI transforms wallets into verifiable financial identities through AI underwriting, reputation, and on-chain trust infrastructure.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 60 }}>
            <button
              onClick={() => router.push("/borrow")}
              style={{
                background: "#34D399",
                border: "none",
                borderRadius: 8,
                padding: "12px 24px",
                color: "#040C1A",
                fontWeight: 850,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Start Credit Analysis
            </button>

            <button
              onClick={() => router.push("/architecture")}
              style={{
                background: "#0A1425",
                border: "1px solid #1D2E49",
                borderRadius: 8,
                padding: "12px 24px",
                color: "#E2E8F0",
                fontWeight: 750,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              View Architecture
            </button>
          </div>

          {/* Hero Visual Flow */}
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <TrustFlow />
          </div>

        </section>

        {/* ================= SECTION 2: PROBLEM ================= */}
        <section style={{ marginBottom: 120 }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#E2E8F0",
              textAlign: "center",
              marginBottom: 48,
              letterSpacing: -0.8,
            }}
          >
            DeFi Lending Has a Capital Efficiency Problem
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            <div style={{ background: "#0A1425", border: "1px solid #111C2E", borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#FF4D6A", marginBottom: 10 }}>
                Over-Collateralization
              </div>
              <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5, margin: 0 }}>
                Users often deposit more value than they borrow, locking valuable assets and reducing transaction velocity.
              </p>
            </div>

            <div style={{ background: "#0A1425", border: "1px solid #111C2E", borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#FF4D6A", marginBottom: 10 }}>
                No Credit Identity
              </div>
              <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5, margin: 0 }}>
                A wallet's historical performance, balance trends, and reliability indicators are completely ignored.
              </p>
            </div>

            <div style={{ background: "#0A1425", border: "1px solid #111C2E", borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#FF4D6A", marginBottom: 10 }}>
                Limited Risk Intelligence
              </div>
              <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5, margin: 0 }}>
                Protocols lack data-driven mechanisms to assess default probabilities, leading to strict borrowing terms.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SECTION 3: SOLUTION ================= */}
        <section style={{ marginBottom: 120, textAlign: "center" }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#E2E8F0",
              marginBottom: 48,
              letterSpacing: -0.8,
            }}
          >
            AI-Native Credit Infrastructure
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            <div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "rgba(52, 211, 153, 0.08)",
                  border: "1px solid #34D399",
                  color: "#34D399",
                  fontSize: 16,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                1
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0", marginBottom: 8 }}>Analyze</div>
              <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5, margin: 0 }}>
                AI evaluates wallet activity, reputation, and risk signals.
              </p>
            </div>

            <div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "rgba(0, 229, 255, 0.08)",
                  border: "1px solid #00E5FF",
                  color: "#00E5FF",
                  fontSize: 16,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                2
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0", marginBottom: 8 }}>Verify</div>
              <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5, margin: 0 }}>
                Oracle attestations make credit decisions verifiable on-chain.
              </p>
            </div>

            <div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "rgba(168, 85, 247, 0.08)",
                  border: "1px solid #A855F7",
                  color: "#A855F7",
                  fontSize: 16,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                3
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0", marginBottom: 8 }}>Lend</div>
              <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5, margin: 0 }}>
                Protocols issue smarter capital-efficient loans.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SECTION 4: MAIN FLOW ================= */}
        <section style={{ marginBottom: 120 }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#E2E8F0",
              textAlign: "center",
              marginBottom: 48,
              letterSpacing: -0.8,
            }}
          >
            How It Works
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 48, alignItems: "center" }}>
            
            {/* Steps navigation */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {timelineSteps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    style={{
                      background: isActive ? "rgba(52, 211, 153, 0.03)" : "transparent",
                      border: `1px solid ${isActive ? "#34D399" : "#111C2E"}`,
                      borderRadius: 10,
                      padding: 16,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: isActive ? "#34D399" : "#E2E8F0" }}>
                        {idx + 1}. {step.title}
                      </span>
                      {isActive && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            color: "#34D399",
                            background: "rgba(52, 211, 153, 0.1)",
                            border: "1px solid #34D399",
                            borderRadius: 4,
                            padding: "2px 6px",
                            fontFamily: "JetBrains Mono, monospace",
                          }}
                        >
                          {step.badge}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>{step.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Stage illustration panel */}
            <div
              style={{
                background: "#0A1425",
                border: "1px solid #111C2E",
                borderRadius: 14,
                padding: 40,
                minHeight: 280,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 850,
                  color: "#34D399",
                  letterSpacing: 2,
                  fontFamily: "JetBrains Mono, monospace",
                  marginBottom: 16,
                }}
              >
                LIVE STEP SIMULATION
              </div>

              <div style={{ fontSize: 24, fontWeight: 800, color: "#E2E8F0", marginBottom: 12 }}>
                {timelineSteps[activeStep].title}
              </div>

              <p style={{ fontSize: 14, color: "#94A3B8", maxWidth: 360, lineHeight: 1.5, margin: "0 0 24px" }}>
                {timelineSteps[activeStep].desc}
              </p>

              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#34D399",
                  background: "rgba(52, 211, 153, 0.1)",
                  border: "1px solid #34D399",
                  borderRadius: 6,
                  padding: "4px 12px",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {timelineSteps[activeStep].badge}
              </span>
            </div>

          </div>
        </section>

        {/* ================= SECTION 5: INFRASTRUCTURE LAYERS ================= */}
        <section style={{ marginBottom: 120 }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#E2E8F0",
              textAlign: "center",
              marginBottom: 48,
              letterSpacing: -0.8,
            }}
          >
            Infrastructure Layers
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            <div style={{ background: "#0A1425", border: "1px solid #111C2E", borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#34D399", marginBottom: 12 }}>
                Credit Intelligence
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13, color: "#64748B", display: "flex", flexDirection: "column", gap: 8 }}>
                <li>⚡ AI Underwriting & Scoring</li>
                <li>⚡ Risk Modeling Engine</li>
                <li>⚡ Probability of Default Forecast</li>
              </ul>
            </div>

            <div style={{ background: "#0A1425", border: "1px solid #111C2E", borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#00E5FF", marginBottom: 12 }}>
                Trust Infrastructure
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13, color: "#64748B", display: "flex", flexDirection: "column", gap: 8 }}>
                <li>⚡ EIP-712 Oracle Signatures</li>
                <li>⚡ Credit Passport V2</li>
                <li>⚡ Attestations Registry</li>
              </ul>
            </div>

            <div style={{ background: "#0A1425", border: "1px solid #111C2E", borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#A855F7", marginBottom: 12 }}>
                DeFi Infrastructure
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13, color: "#64748B", display: "flex", flexDirection: "column", gap: 8 }}>
                <li>⚡ Dynamic Lending Decisions</li>
                <li>⚡ Programmable Policies</li>
                <li>⚡ Developer APIs Keys</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================= SECTION 6: DEVELOPER CTA ================= */}
        <section
          style={{
            background: "linear-gradient(135deg, #0A192F 0%, #050B14 100%)",
            border: "1px solid #1D2E49",
            borderRadius: 14,
            padding: "48px 32px",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}
        >
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#E2E8F0", marginBottom: 12, letterSpacing: -0.8 }}>
            Integrate Credit Intelligence Into Any Protocol
          </h2>
          <p style={{ fontSize: 16, color: "#94A3B8", maxWidth: 540, margin: "0 auto 28px", lineHeight: 1.5 }}>
            Unlock capital efficiency for money markets with our verifiable credit-attestation registries.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            <button
              onClick={() => router.push("/developers")}
              style={{
                background: "#34D399",
                border: "none",
                borderRadius: 8,
                padding: "12px 24px",
                color: "#040C1A",
                fontWeight: 850,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              View APIs
            </button>

            <button
              onClick={() => router.push("/submission")}
              style={{
                background: "#0A1425",
                border: "1px solid #1D2E49",
                borderRadius: 8,
                padding: "12px 24px",
                color: "#E2E8F0",
                fontWeight: 750,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Read Docs
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}