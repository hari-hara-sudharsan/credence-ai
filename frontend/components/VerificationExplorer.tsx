"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

interface Props {
  initialHash?: string;
  onSearchResult?: (result: any, proof: any) => void;
}

export default function VerificationExplorer({ initialHash, onSearchResult }: Props) {
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // If initialHash changes, autofill the input
  useEffect(() => {
    if (initialHash) {
      setInputVal(initialHash);
    }
  }, [initialHash]);

  const handleAction = async () => {
    if (!inputVal.trim()) {
      setError("Please enter a valid input.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      if (onSearchResult) {
        // Mode 1: UCVN Search
        const response = await API.get(`/verify/${inputVal.trim()}`);
        const proofResponse = await API.get(`/verify/${inputVal.trim()}/proof`);
        onSearchResult(response.data, proofResponse.data);
      } else {
        // Mode 2: Oracle Attestation verification
        const response = await API.post("/oracle/verify", { attestation_hash: inputVal.trim() });
        setResult(response.data);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Verification failed. Check the details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isUcvnMode = !!onSearchResult;

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        marginBottom: 32,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#4A6080",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        {isUcvnMode ? "UCVN TRUST INDEX SEARCH (ON-CHAIN RESOLVER)" : "VERIFICATION EXPLORER (ON-CHAIN READ)"}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: result ? 20 : 0 }}>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={isUcvnMode ? "Input Wallet Address (0x...)" : "Paste Attestation Hash (0x...)"}
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
          onClick={handleAction}
          disabled={loading || !inputVal.trim()}
          style={{
            background: "#00E5FF",
            border: "none",
            borderRadius: 8,
            color: "#040C1A",
            fontWeight: 700,
            fontSize: 14,
            padding: "0 24px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            transition: "all 0.2s ease",
          }}
        >
          {loading ? (isUcvnMode ? "SEARCHING..." : "VERIFYING...") : (isUcvnMode ? "VERIFY WALLET" : "VERIFY")}
        </button>
      </div>

      {error && (
        <div style={{ color: "#FF4D6A", fontSize: 13, marginTop: 12, fontFamily: "Inter, sans-serif" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Renders result if Attestation Mode has result */}
      {!isUcvnMode && result && (
        <div
          style={{
            background: "#050B14",
            border: "1px solid #111C2E",
            borderRadius: 10,
            padding: 20,
            marginTop: 16,
            animation: "slide-down 0.3s ease",
          }}
        >
          {result.exists ? (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                  borderBottom: "1px solid #111C2E",
                  paddingBottom: 12,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0" }}>
                  Verification Status
                </span>
                <span
                  style={{
                    background: result.verified
                      ? "rgba(52, 211, 153, 0.08)"
                      : "rgba(255, 77, 106, 0.08)",
                    border: `1px solid ${result.verified ? "#34D399" : "#FF4D6A"}`,
                    color: result.verified ? "#34D399" : "#FF4D6A",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {result.verified ? "🟢 VALID ATTESTATION" : result.revoked ? "🔴 REVOKED" : "🟡 EXPIRED"}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 9, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 3 }}>
                    ISSUING ORACLE
                  </div>
                  <div style={{ fontSize: 12, color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>
                    {result.oracle}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 9, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 3 }}>
                    TIMESTAMP
                  </div>
                  <div style={{ fontSize: 12, color: "#E2E8F0", fontFamily: "JetBrains Mono, monospace" }}>
                    {new Date(result.issued_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: "#FF4D6A", textAlign: "center", padding: 12 }}>
              ❌ Attestation Hash not found on-chain.
            </div>
          )}
        </div>
      )}
      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
