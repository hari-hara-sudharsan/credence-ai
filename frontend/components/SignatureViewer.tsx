"use client";

import { useState } from "react";

interface Props {
  signature: string;
  oracleSigner: string;
  verifyingContract: string;
  chainId: number;
}

export default function SignatureViewer({ signature, oracleSigner, verifyingContract, chainId }: Props) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        background: "#050B14",
        border: "1px solid #111C2E",
        borderRadius: 10,
        padding: 16,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#4A6080",
            letterSpacing: 1.2,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          CRYPTOGRAPHIC PROOF (EIP-712)
        </span>
        <button
          onClick={copyToClipboard}
          style={{
            background: copied ? "rgba(52, 211, 153, 0.1)" : "rgba(0, 229, 255, 0.1)",
            border: `1px solid ${copied ? "#34D399" : "#00E5FF"}`,
            borderRadius: 6,
            padding: "4px 10px",
            fontSize: 10,
            fontWeight: 600,
            color: copied ? "#34D399" : "#00E5FF",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {copied ? "COPIED!" : "COPY SIG"}
        </button>
      </div>

      {/* Raw Signature Code Block */}
      <div
        style={{
          background: "#02060D",
          border: "1px solid #162235",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          overflowX: "auto",
        }}
      >
        <code
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 11,
            color: "#00E5FF",
            wordBreak: "break-all",
            whiteSpace: "pre-wrap",
          }}
        >
          {signature}
        </code>
      </div>

      {/* Verification Parameters */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#4A6080",
              letterSpacing: 1,
              fontFamily: "JetBrains Mono, monospace",
              marginBottom: 4,
            }}
          >
            ORACLE SIGNER
          </div>
          <div
            style={{
              fontSize: 11,
              fontFamily: "JetBrains Mono, monospace",
              color: "#94A3B8",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            title={oracleSigner}
          >
            {oracleSigner}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#4A6080",
              letterSpacing: 1,
              fontFamily: "JetBrains Mono, monospace",
              marginBottom: 4,
            }}
          >
            VERIFYING CONTRACT
          </div>
          <div
            style={{
              fontSize: 11,
              fontFamily: "JetBrains Mono, monospace",
              color: "#94A3B8",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            title={verifyingContract}
          >
            {verifyingContract}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#4A6080",
              letterSpacing: 1,
              fontFamily: "JetBrains Mono, monospace",
              marginBottom: 4,
            }}
          >
            DOMAIN NAME
          </div>
          <div
            style={{
              fontSize: 11,
              fontFamily: "JetBrains Mono, monospace",
              color: "#94A3B8",
            }}
          >
            Credence AI
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#4A6080",
              letterSpacing: 1,
              fontFamily: "JetBrains Mono, monospace",
              marginBottom: 4,
            }}
          >
            CHAIN ID
          </div>
          <div
            style={{
              fontSize: 11,
              fontFamily: "JetBrains Mono, monospace",
              color: "#94A3B8",
            }}
          >
            {chainId} (HashKey Mainnet)
          </div>
        </div>
      </div>
    </div>
  );
}
