"use client";

import { useState } from "react";

interface Props {
  passport: any;
  vcDoc: any;
}

export default function AttestationViewer({ passport, vcDoc }: Props) {
  const [activeTab, setActiveTab] = useState<"METADATA" | "JSON">("METADATA");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
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
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#4A6080",
            letterSpacing: 1.5,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          CRYPTOGRAPHIC EVIDENCE & DATA
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {(["METADATA", "JSON"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? "rgba(0, 229, 255, 0.08)" : "transparent",
                border: activeTab === tab ? "1px solid #00E5FF" : "1px solid transparent",
                borderRadius: 6,
                color: activeTab === tab ? "#00E5FF" : "#64748B",
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

      {activeTab === "METADATA" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontSize: 9, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
              PASSPORT HASH (IMMUTABLE ON-CHAIN REF)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  fontSize: 13,
                  color: "#00E5FF",
                  fontFamily: "JetBrains Mono, monospace",
                  wordBreak: "break-all",
                  flex: 1,
                }}
              >
                {passport.passport_hash}
              </div>
              <button
                onClick={() => copyToClipboard(passport.passport_hash)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#64748B",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                📋
              </button>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 9, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
              ORACLE SIGNATURE (PROOF.JWS)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  fontSize: 11,
                  color: "#E2E8F0",
                  fontFamily: "JetBrains Mono, monospace",
                  wordBreak: "break-all",
                  maxHeight: 48,
                  overflowY: "auto",
                  flex: 1,
                  lineHeight: 1.4,
                }}
              >
                {passport.signature}
              </div>
              <button
                onClick={() => copyToClipboard(passport.signature)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#64748B",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                📋
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 9, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
                METADATA URI
              </div>
              <div style={{ fontSize: 12, color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>
                {passport.metadata_uri}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 9, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
                ORACLE ATTESTATION REF
              </div>
              <div style={{ fontSize: 12, color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>
                {passport.oracle_attestation_id}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <pre
            style={{
              background: "#050B14",
              border: "1px solid #111C2E",
              borderRadius: 8,
              padding: 16,
              fontSize: 11,
              color: "#34D399",
              fontFamily: "JetBrains Mono, monospace",
              overflowX: "auto",
              maxHeight: 250,
              overflowY: "auto",
              margin: 0,
            }}
          >
            {JSON.stringify(vcDoc, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
