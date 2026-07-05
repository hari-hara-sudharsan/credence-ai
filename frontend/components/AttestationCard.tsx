"use client";

import { useState } from "react";
import VerificationStatus from "@/components/VerificationStatus";
import SignatureViewer from "@/components/SignatureViewer";

interface Attestation {
  wallet: string;
  offer_id: string;
  offer_hash: string;
  credit_score: number;

  risk_level: string;
  approved_amount: number;
  interest_rate: number;
  collateral_ratio: number;
  duration_days: number;
  issued_at: string;
  expires_at: string;
  oracle_version: string;
  signature: string;
  attestation_id: string;
  attestation_version: string;
}

interface Props {
  attestation: Attestation;
  onVerify: () => Promise<void>;
  verificationStatus: "VERIFIED" | "INVALID" | "EXPIRED" | "LOADING" | "IDLE";
}

export default function AttestationCard({ attestation, onVerify, verificationStatus }: Props) {
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    setVerifying(true);
    await onVerify();
    setVerifying(false);
  };

  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(attestation.approved_amount);

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* Top light glow bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, #00E5FF, #34D399)",
        }}
      />

      {/* Header Info */}
      <div
        style={{
          padding: "24px 24px 16px",
          borderBottom: "1px solid #111C2E",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 10,
                fontWeight: 700,
                color: "#00E5FF",
                background: "rgba(0, 229, 255, 0.08)",
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              {attestation.attestation_id}
            </span>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 10,
                color: "#4A6080",
              }}
            >
              v{attestation.attestation_version}
            </span>
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "#E2E8F0",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Verifiable AI Underwriting Attestation
          </h3>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 11,
              color: "#4A6080",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            Subject Wallet: {attestation.wallet.substring(0, 10)}...{attestation.wallet.substring(attestation.wallet.length - 8)}
          </p>
        </div>

        {/* Verification Status */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <VerificationStatus status={verificationStatus} />
          <button
            onClick={handleVerify}
            disabled={verifying}
            style={{
              background: "#111C2E",
              border: "1px solid #1D2E49",
              borderRadius: 6,
              color: "#E2E8F0",
              fontSize: 10,
              fontWeight: 600,
              fontFamily: "JetBrains Mono, monospace",
              padding: "4px 10px",
              cursor: verifying ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {verifying ? "VERIFYING..." : "RUN VERIFICATION CHECK"}
          </button>
        </div>
      </div>

      {/* Metrics Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 1,
          background: "#111C2E",
        }}
      >
        <div style={{ background: "#0A1425", padding: "16px 24px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>
            CREDIT SCORE
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: attestation.credit_score >= 700 ? "#34D399" : attestation.credit_score >= 600 ? "#FFB830" : "#FF4D6A", fontFamily: "Inter, sans-serif" }}>
            {attestation.credit_score}
          </div>
        </div>

        <div style={{ background: "#0A1425", padding: "16px 24px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>
            APPROVED AMOUNT
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#00E5FF", fontFamily: "Inter, sans-serif" }}>
            {formattedAmount} <span style={{ fontSize: 12, fontWeight: 500, color: "#4A6080" }}>HSK</span>
          </div>
        </div>

        <div style={{ background: "#0A1425", padding: "16px 24px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>
            INTEREST RATE
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#FFB830", fontFamily: "Inter, sans-serif" }}>
            {attestation.interest_rate}% <span style={{ fontSize: 12, fontWeight: 500, color: "#4A6080" }}>APR</span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
          background: "#111C2E",
          borderTop: "1px solid #111C2E",
        }}
      >
        <div style={{ background: "#0A1425", padding: "16px 24px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>
            COLLATERAL RATIO
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0", fontFamily: "Inter, sans-serif" }}>
            {attestation.collateral_ratio}%
          </div>
        </div>

        <div style={{ background: "#0A1425", padding: "16px 24px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>
            DURATION
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0", fontFamily: "Inter, sans-serif" }}>
            {attestation.duration_days} Days
          </div>
        </div>
      </div>

      {/* Date fields / signatures */}
      <div style={{ padding: "20px 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            color: "#64748B",
            marginBottom: 16,
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div>
            <span>ISSUED: </span>
            <span style={{ color: "#E2E8F0", fontFamily: "JetBrains Mono, monospace" }}>
              {new Date(attestation.issued_at).toLocaleString()}
            </span>
          </div>
          <div>
            <span>EXPIRES: </span>
            <span style={{ color: "#E2E8F0", fontFamily: "JetBrains Mono, monospace" }}>
              {new Date(attestation.expires_at).toLocaleString()}
            </span>
          </div>
        </div>

        {/* EIP-712 cryptographic signature viewer nested */}
        <SignatureViewer
          signature={attestation.signature}
          oracleSigner="0x2988f0bE02e1a679430aEb4A6B9B10429F1e8e80" // Oracle signer address
          verifyingContract="0x2988f0bE02e1a679430aEb4A6B9B10429F1e8e80" // LoanManager verify contract
          chainId={177}
        />
      </div>
    </div>
  );
}
