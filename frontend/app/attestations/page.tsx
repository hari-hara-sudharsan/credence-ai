"use client";

import { useEffect, useRef, useState } from "react";
import API from "@/lib/api";
import { useWallet } from "@/context/WalletContext";
import AttestationCard from "@/components/AttestationCard";

const PIPELINE_STEPS = [
  "Analyzing wallet on-chain profile",
  "Calculating credit risk features",
  "Generating EIP-712 typed offer payload",
  "Signing underwriting decision via Oracle key",
];

function PipelineLoader() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, PIPELINE_STEPS.length - 1));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        border: "1px solid #1D2E49",
        background: "rgba(10, 20, 37, 0.6)",
        borderRadius: 12,
        padding: "24px 32px",
        marginBottom: 32,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {PIPELINE_STEPS.map((step, i) => {
          const state = i < stepIndex ? "done" : i === stepIndex ? "active" : "pending";
          return (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: `1.5px solid ${
                    state === "done"
                      ? "#34D399"
                      : state === "active"
                      ? "#00E5FF"
                      : "#1F2E47"
                  }`,
                  background: state === "done" ? "#34D399" : "transparent",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  color: state === "done" ? "#0A1425" : state === "active" ? "#00E5FF" : "#4A6080",
                  flexShrink: 0,
                  transition: "all 0.3s ease",
                }}
              >
                {state === "done" ? "✓" : ""}
              </span>
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 13,
                  letterSpacing: 0.5,
                  color: state === "pending" ? "#4A6080" : "#E2E8F0",
                  transition: "all 0.3s ease",
                }}
              >
                {step}
                {state === "active" ? "..." : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AttestationsPage() {
  const { wallet } = useWallet();
  const [inputWallet, setInputWallet] = useState("");
  const [attestation, setAttestation] = useState<any | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<
    "VERIFIED" | "INVALID" | "EXPIRED" | "LOADING" | "IDLE"
  >("IDLE");

  // Pre-fill input with connected wallet
  useEffect(() => {
    if (wallet) {
      setInputWallet(wallet);
    }
  }, [wallet]);

  const requestAttestation = async () => {
    if (!inputWallet) {
      setErrorMessage("Please enter a valid wallet address.");
      return;
    }
    setStatus("loading");
    setErrorMessage(null);
    setAttestation(null);
    setVerificationStatus("IDLE");

    try {
      const response = await API.post("/attestation", { wallet: inputWallet });
      setAttestation(response.data);
      setStatus("idle");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(
        err.response?.data?.detail || "Could not generate attestation. Ensure backend is running."
      );
    }
  };

  const verifyAttestation = async () => {
    if (!attestation) return;
    setVerificationStatus("LOADING");

    try {
      // Small simulated latency for natural UI experience
      await new Promise((resolve) => setTimeout(resolve, 800));

      const response = await API.post("/attestation/verify", { attestation });
      if (response.data.verified) {
        // Check expiry status
        const isExpired = new Date(attestation.expires_at).getTime() < Date.now();
        setVerificationStatus(isExpired ? "EXPIRED" : "VERIFIED");
      } else {
        setVerificationStatus("INVALID");
      }
    } catch (err) {
      setVerificationStatus("INVALID");
    }
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
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
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
          <span>SECURE ORACLE NETWORK</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>SPRINT C1</span>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: "#E2E8F0",
              letterSpacing: -0.5,
              marginBottom: 12,
            }}
          >
            Verifiable AI Underwriting Console
          </h1>
          <p style={{ fontSize: 16, color: "#64748B", margin: 0 }}>
            Generate and verify EIP-712 cryptographically signed loan offers backed by the Credence AI Oracle.
          </p>
        </div>

        {/* Input Card */}
        <div
          style={{
            background: "#0A1425",
            border: "1px solid #111C2E",
            borderRadius: 12,
            padding: 24,
            marginBottom: 32,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 11,
                fontWeight: 700,
                color: "#4A6080",
                letterSpacing: 1,
              }}
            >
              SUBJECT WALLET ADDRESS
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              <input
                type="text"
                value={inputWallet}
                onChange={(e) => setInputWallet(e.target.value)}
                placeholder="0x..."
                style={{
                  flex: 1,
                  background: "#050B14",
                  border: "1px solid #1D2E49",
                  borderRadius: 8,
                  padding: "12px 16px",
                  color: "#E2E8F0",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <button
                onClick={requestAttestation}
                disabled={status === "loading" || !inputWallet}
                style={{
                  background: "linear-gradient(90deg, #00E5FF, #00B0FF)",
                  border: "none",
                  borderRadius: 8,
                  color: "#040C1A",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "0 24px",
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  opacity: status === "loading" ? 0.6 : 1,
                  transition: "all 0.2s ease",
                }}
              >
                {status === "loading" ? "GENERATING..." : "REQUEST ATTESTATION"}
              </button>
            </div>
            {!wallet && (
              <span style={{ fontSize: 11, color: "#64748B", fontFamily: "Inter, sans-serif" }}>
                💡 Tip: Connect your Metamask/Web3 wallet in the Navbar to autofill your address.
              </span>
            )}
          </div>
        </div>

        {/* Loader */}
        {status === "loading" && <PipelineLoader />}

        {/* Error message */}
        {status === "error" && errorMessage && (
          <div
            style={{
              background: "rgba(255, 77, 106, 0.08)",
              border: "1px solid rgba(255, 77, 106, 0.3)",
              borderRadius: 8,
              padding: "16px 20px",
              color: "#FF4D6A",
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              marginBottom: 32,
            }}
          >
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        {/* Attestation Result */}
        {attestation && status === "idle" && (
          <div style={{ animation: "fade-in 0.5s ease" }}>
            <AttestationCard
              attestation={attestation}
              onVerify={verifyAttestation}
              verificationStatus={verificationStatus}
            />
          </div>
        )}
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
