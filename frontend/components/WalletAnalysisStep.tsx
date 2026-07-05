"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

interface Props {
  wallet: string;
  onComplete: (data: any) => void;
}

export default function WalletAnalysisStep({ wallet, onComplete }: Props) {
  const [analyzing, setAnalyzing] = useState(true);
  const [progress, setProgress] = useState("Connecting to RPC node...");

  useEffect(() => {
    let active = true;
    const isDemo = typeof window !== "undefined" && window.location.search.includes("demo=true");
    const delay = isDemo ? 200 : 800;

    const run = async () => {
      try {
        await new Promise((r) => setTimeout(r, delay));
        if (!active) return;
        setProgress("Analyzing transaction history...");
        
        await new Promise((r) => setTimeout(r, delay));
        if (!active) return;
        setProgress("Evaluating reputation...");

        await new Promise((r) => setTimeout(r, delay));
        if (!active) return;
        setProgress("Calculating lending capacity...");

        const response = await API.post("/wallet/analyze", { wallet: wallet.trim() });
        
        await new Promise((r) => setTimeout(r, delay));
        if (!active) return;
        onComplete(response.data);
      } catch (err) {
        console.error(err);
        setProgress("Analysis failed — unable to reach verification network.");
        // Pass error state — no fake data
        onComplete({
          wallet,
          balance: 0,
          tx_count: 0,
          active_months: 0,
          repayment_ratio: 0,
          error: "Backend verification unavailable"
        });
      }
    };
    run();
    return () => { active = false; };
  }, [wallet]);

  return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ display: "inline-block", position: "relative", marginBottom: 24 }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: "3.5px solid rgba(52, 211, 153, 0.15)",
            borderTopColor: "#34D399",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0", marginBottom: 8 }}>
        Reputation Assessment Engine
      </h3>
      <p style={{ fontSize: 13, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
        {progress}
      </p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
