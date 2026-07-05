"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import SubmissionChecklist from "@/components/SubmissionChecklist";
import TechStack from "@/components/TechStack";

export default function SubmissionPage() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any | null>(null);

  const loadReport = async () => {
    try {
      const response = await API.get("/submission/audit-report");
      setReport(response.data);
    } catch (err) {
      console.error("Failed to load audit report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const contracts = [
    { name: "GovernanceRegistry", address: "0x98297dF9f8ffC79bc8e6BA3Ec606136adacb6f81", explorer: "https://hashkey.blockscout.com/address/0x98297dF9f8ffC79bc8e6BA3Ec606136adacb6f81" },
    { name: "CreditPassportV2", address: "0xD6b040736e948621c5b6E0a494473c47a6113eA8", explorer: "https://hashkey.blockscout.com/address/0xD6b040736e948621c5b6E0a494473c47a6113eA8" },
    { name: "OracleRegistry", address: "0x2Dd78Fd9B8F40659Af32eF98555B8b31bC97A351", explorer: "https://hashkey.blockscout.com/address/0x2Dd78Fd9B8F40659Af32eF98555B8b31bC97A351" },
    { name: "LoanManager", address: "0x2988f0bE02e1a679430aEb4A6B9B10429F1e8e80", explorer: "https://hashkey.blockscout.com/address/0x2988f0bE02e1a679430aEb4A6B9B10429F1e8e80" }
  ];

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
          <span>PRODUCTION READINESS OVERVIEW</span>
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
            Credence AI Submission Center
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
            Production readiness overview for decentralized credit infrastructure.
          </p>
        </div>

        {loading ? (
          <div style={{ color: "#64748B", textAlign: "center", padding: "80px 0" }}>
            CONSOLIDATING SYSTEM TELEMETRY AUDIT CHECKS...
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            
            {/* Top row: Metrics cards */}
            {report && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                <div style={{ background: "#0A1425", border: "1px solid #111C2E", borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>
                    SECURITY AUDIT SCORE
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#34D399" }}>
                    {report.security_score} / 100
                  </div>
                </div>

                <div style={{ background: "#0A1425", border: "1px solid #111C2E", borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>
                    INTEGRATION TESTS PASSED
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#00E5FF" }}>
                    {report.tests_passed}
                  </div>
                </div>

                <div style={{ background: "#0A1425", border: "1px solid #111C2E", borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>
                    CONTRACTS STATE VERIFICATION
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: report.contracts_verified ? "#34D399" : "#FFB830" }}>
                    {report.contracts_verified ? "ONLINE" : "DEGRADED"}
                  </div>
                </div>

                <div style={{ background: "#0A1425", border: "1px solid #111C2E", borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>
                    PRODUCTION STANDBY STATUS
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#34D399" }}>
                    READY
                  </div>
                </div>
              </div>
            )}

            {/* Checklist & tech stack */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32, alignItems: "start" }}>
              <SubmissionChecklist report={report} />
              <TechStack />
            </div>

            {/* Smart Contract addresses tables */}
            <div
              style={{
                background: "#0A1425",
                border: "1px solid #111C2E",
                borderRadius: 14,
                padding: 24,
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#34D399",
                  letterSpacing: 2,
                  fontFamily: "JetBrains Mono, monospace",
                  marginBottom: 20,
                }}
              >
                DEPLOYED ON-CHAIN SMART CONTRACTS
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>

                  <thead>
                    <tr style={{ borderBottom: "1px solid #111C2E", color: "#64748B" }}>
                      <th style={{ padding: "12px 16px" }}>Contract</th>
                      <th style={{ padding: "12px 16px" }}>Address</th>
                      <th style={{ padding: "12px 16px" }}>Network</th>
                      <th style={{ padding: "12px 16px" }}>Explorer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((c, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #0D1626" }}>
                        <td style={{ padding: "16px", fontWeight: 700, color: "#E2E8F0" }}>{c.name}</td>
                        <td style={{ padding: "16px", fontFamily: "JetBrains Mono, monospace", color: "#94A3B8" }}>{c.address}</td>
                        <td style={{ padding: "16px", color: "#94A3B8" }}>HashKey Chain</td>
                        <td style={{ padding: "16px" }}>
                          <a href={c.explorer} target="_blank" rel="noopener noreferrer" style={{ color: "#34D399", textDecoration: "none" }}>View ↗</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Demo Resources Links Section */}
            <div
              style={{
                background: "#0A1425",
                border: "1px solid #111C2E",
                borderRadius: 14,
                padding: 24,
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#34D399",
                  letterSpacing: 2,
                  fontFamily: "JetBrains Mono, monospace",
                  marginBottom: 20,
                }}
              >
                SUBMISSION & DEMO RESOURCES
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                <a
                  href="/demo"
                  style={{
                    background: "#050B14",
                    border: "1px solid #1D2E49",
                    borderRadius: 8,
                    padding: 16,
                    textAlign: "center",
                    textDecoration: "none",
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 750, color: "#34D399" }}>Live App Demo ↗</div>
                </a>

                <a
                  href="https://github.com/hari-hara-sudharsan/credence-ai"
                  style={{
                    background: "#050B14",
                    border: "1px solid #1D2E49",
                    borderRadius: 8,
                    padding: 16,
                    textAlign: "center",
                    textDecoration: "none",
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 750, color: "#E2E8F0" }}>GitHub Codebase ↗</div>
                </a>

                <a
                  href="#"
                  style={{
                    background: "#050B14",
                    border: "1px solid #1D2E49",
                    borderRadius: 8,
                    padding: 16,
                    textAlign: "center",
                    textDecoration: "none",
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 750, color: "#E2E8F0" }}>Demo Video Tour ↗</div>
                </a>

                <a
                  href="/documentation"
                  style={{
                    background: "#050B14",
                    border: "1px solid #1D2E49",
                    borderRadius: 8,
                    padding: 16,
                    textAlign: "center",
                    textDecoration: "none",
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 750, color: "#E2E8F0" }}>System API Docs ↗</div>
                </a>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
