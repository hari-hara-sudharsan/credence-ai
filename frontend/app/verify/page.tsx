"use client";

import { useState } from "react";
import VerificationExplorer from "@/components/VerificationExplorer";
import VerificationCard from "@/components/VerificationCard";
import VerificationTimeline from "@/components/VerificationTimeline";
import ProtocolProfileGrid from "@/components/ProtocolProfileGrid";

export default function VerifyPage() {
  const [result, setResult] = useState<any | null>(null);
  const [proof, setProof] = useState<any | null>(null);
  const [activeProofTab, setActiveProofTab] = useState<"METADATA" | "JSON">("METADATA");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleSearchResult = (searchResult: any, searchProof: any) => {
    setResult(searchResult);
    setProof(searchProof);
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
          <span>PUBLIC GATEWAY GATE</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>UNIVERSAL VERIFICATION</span>
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
            Universal Credit Verification
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
            Verify any wallet's financial identity, credential status, and trust adapter ratings instantly across the HashKey ecosystem.
          </p>
        </div>

        {/* UCVN Explorer search */}
        <VerificationExplorer onSearchResult={handleSearchResult} />

        {result && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32,
              animation: "fade-in 0.4s ease",
            }}
          >
            {/* Top row: Summary verification card */}
            <VerificationCard result={result} />

            {/* Middle row: Protocol Profiles Grid */}
            <ProtocolProfileGrid profiles={result.protocol_profiles} />

            {/* Bottom Row: Workflow timeline and Proof Bundle JSON */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
              <VerificationTimeline verifiedAt={result.verified_at} />

              {/* Cryptographic Proof Bundle Panel */}
              <div
                style={{
                  background: "#0A1425",
                  border: "1px solid #111C2E",
                  borderRadius: 14,
                  padding: 24,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                    borderBottom: "1px solid #111C2E",
                    paddingBottom: 12,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#4A6080", letterSpacing: 1.5, fontFamily: "JetBrains Mono, monospace" }}>
                    VERIFICATION PROOF BUNDLE
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["METADATA", "JSON"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveProofTab(tab)}

                        style={{
                          background: activeProofTab === tab ? "rgba(0, 229, 255, 0.08)" : "transparent",
                          border: activeProofTab === tab ? "1px solid #00E5FF" : "1px solid transparent",
                          borderRadius: 6,
                          color: activeProofTab === tab ? "#00E5FF" : "#64748B",
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "4px 10px",
                          cursor: "pointer",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {activeProofTab === "METADATA" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 12 }}>
                    <div>
                      <div style={{ fontSize: 9, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 3 }}>
                        VERIFICATION PROOF HASH
                      </div>
                      <div style={{ fontFamily: "JetBrains Mono, monospace", color: "#00E5FF", wordBreak: "break-all" }}>
                        {proof.verification_hash}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 9, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 3 }}>
                        ORACLE DIGITAL SIGNATURE
                      </div>
                      <div style={{ fontFamily: "JetBrains Mono, monospace", color: "#E2E8F0", wordBreak: "break-all", maxHeight: 40, overflowY: "auto" }}>
                        {proof.oracle_signature}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
                      <div>
                        <div style={{ fontSize: 9, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 3 }}>
                          PASSPORT HASH
                        </div>
                        <div style={{ fontFamily: "JetBrains Mono, monospace", color: "#94A3B8" }}>
                          {proof.passport_hash.substring(0, 8)}...{proof.passport_hash.substring(proof.passport_hash.length - 6)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 9, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 3 }}>
                          ATTESTATION HASH
                        </div>
                        <div style={{ fontFamily: "JetBrains Mono, monospace", color: "#94A3B8" }}>
                          {proof.attestation_hash.substring(0, 8)}...{proof.attestation_hash.substring(proof.attestation_hash.length - 6)}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <pre
                    style={{
                      background: "#050B14",
                      border: "1px solid #111C2E",
                      borderRadius: 8,
                      padding: 16,
                      fontSize: 11,
                      color: "#34D399",
                      fontFamily: "JetBrains Mono, monospace",
                      overflow: "auto",
                      maxHeight: 200,
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    {JSON.stringify(proof, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
