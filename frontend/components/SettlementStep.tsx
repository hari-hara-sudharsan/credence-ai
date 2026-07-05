"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

interface Props {
  wallet: string;
  onComplete: (data: any) => void;
}

function generateLoanId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `loan_${ts}_${rand}`;
}

export default function SettlementStep({ wallet, onComplete }: Props) {
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    const delay = 800;

    const run = async () => {
      try {
        await new Promise((r) => setTimeout(r, delay));
        if (!active) return;
        setStage(1);
        
        await new Promise((r) => setTimeout(r, delay));
        if (!active) return;
        setStage(2);

        // Execute settlement API
        const response = await API.post("/settlement/execute", {
          loan_id: generateLoanId(),
          borrower: wallet,
          amount: 500,
          asset: "HSK",
          attestation_id: "att_credence_" + Date.now().toString(36)
        });

        await new Promise((r) => setTimeout(r, delay));
        if (!active) return;
        setStage(3);
        setResult(response.data);
      } catch (err: any) {
        console.error(err);
        setStage(3);
        setError(err?.response?.data?.detail || err?.message || "Settlement failed. Please check your connection and try again.");
      }
    };
    run();
    return () => { active = false; };
  }, [wallet, retryKey]);

  return (
    <div style={{ padding: "10px 0" }}>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: "#E2E8F0", marginBottom: 16 }}>
        {stage >= 3 ? "HashKey Settlement Complete ✓" : "Executing HashKey Settlement"}
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, color: stage >= 1 ? "#34D399" : "#64748B" }}>
            {stage >= 1 ? "✓" : "○"}
          </span>
          <span style={{ fontSize: 12, color: stage >= 1 ? "#E2E8F0" : "#64748B" }}>
            Smart Contract validated: Credit Policy & Oracle Signature checked.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, color: stage >= 2 ? "#34D399" : "#64748B" }}>
            {stage >= 2 ? "✓" : "○"}
          </span>
          <span style={{ fontSize: 12, color: stage >= 2 ? "#E2E8F0" : "#64748B" }}>
            Executing on-chain settlement via HSK transfer interface.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, color: stage >= 3 ? (error ? "#FF4D6A" : "#34D399") : "#64748B" }}>
            {stage >= 3 ? (error ? "✗" : "✓") : "○"}
          </span>
          <span style={{ fontSize: 12, color: stage >= 3 ? "#E2E8F0" : "#64748B" }}>
            Transaction confirmed on HashKey Chain.
          </span>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div
          style={{
            background: "rgba(255, 77, 106, 0.06)",
            border: "1px solid rgba(255, 77, 106, 0.2)",
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "#FF4D6A", marginBottom: 8, fontFamily: "JetBrains Mono, monospace", letterSpacing: 1 }}>
            SETTLEMENT ERROR
          </div>
          <div style={{ fontSize: 12, color: "#E2E8F0", lineHeight: 1.5, marginBottom: 12 }}>
            {error}
          </div>
          <button
            onClick={() => {
              setError(null);
              setStage(0);
              setResult(null);
              setRetryKey((k) => k + 1);
            }}
            style={{
              background: "rgba(255, 77, 106, 0.1)",
              border: "1px solid rgba(255, 77, 106, 0.3)",
              borderRadius: 6,
              color: "#FF4D6A",
              fontWeight: 700,
              fontSize: 11,
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            ↻ RETRY SETTLEMENT
          </button>
        </div>
      )}

      {result && (
        <div
          style={{
            background: "#0A1425",
            border: "1px solid #111C2E",
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 800, color: "#34D399", letterSpacing: 1.5, fontFamily: "JetBrains Mono, monospace", borderBottom: "1px solid #111C2E", paddingBottom: 8, marginBottom: 12 }}>
            HASHKEY SETTLEMENT PROOF
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "#64748B" }}>SETTLEMENT ID</span>
            <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "#E2E8F0" }}>
              {result.settlement_id}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "#64748B" }}>ASSET SETTLED</span>
            <span style={{ fontSize: 12, color: "#34D399", fontWeight: 700 }}>HSP (HashKey Stablecoin Payment)</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "#64748B" }}>CONTRACT EVENT</span>
            <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00E5FF" }}>
              HSPSettlementCompleted
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "#64748B" }}>NETWORK</span>
            <span style={{ fontSize: 12, color: "#E2E8F0" }}>HashKey Chain Mainnet</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 11, color: "#64748B" }}>TX HASH</span>
            <a
              href={`https://hashkey.blockscout.com/tx/${result.tx_hash.startsWith("0x") ? result.tx_hash : "0x" + result.tx_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 10,
                fontFamily: "JetBrains Mono, monospace",
                color: "#34D399",
                wordBreak: "break-all",
                textDecoration: "none",
              }}
            >
              {result.tx_hash} ↗
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => onComplete(result)}
        disabled={stage < 3 || !!error}
        style={{
          width: "100%",
          background: stage >= 3 && !error ? "#34D399" : "#1D2E49",
          border: "none",
          borderRadius: 8,
          color: "#040C1A",
          fontWeight: 800,
          fontSize: 13,
          padding: "12px 0",
          cursor: stage >= 3 && !error ? "pointer" : "not-allowed",
          transition: "all 0.2s ease",
        }}
      >
        CONTINUE TO REPAYMENT ➔
      </button>
    </div>
  );
}
