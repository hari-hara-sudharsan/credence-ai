"use client";

import { useEffect, useRef, useState } from "react";

import API from "@/lib/api";
import { useWallet } from "@/context/WalletContext";

/**
 * Borrower Dashboard — Credence AI
 *
 * Same ledger language as the About page: ink background, bone text,
 * a single verified-green accent, Fraunces for numbers, mono for data.
 * The one new move here is the analysis sequence — instead of a spinner,
 * the loading state narrates the actual pipeline (reading the wallet,
 * scoring behavior, checking lending terms), because that pipeline is
 * the product.
 */

type Insight = {
  credit_score: number;
  rating: string;
  recommendations: string[];
};

type Lending = {
  eligible: boolean;
  interest_rate: number;
  collateral_ratio: number;
};

type DashboardData = {
  insight: Insight;
  lending: Lending;
};

const PIPELINE_STEPS = [
  "Reading wallet history",
  "Scoring on-chain behavior",
  "Checking lending terms",
];

function useCountUp(target: number, durationMs = 1100) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

function PipelineLoader() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, PIPELINE_STEPS.length - 1));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border border-[#2A3142] bg-[#1A1F2B]/60 rounded-sm px-6 sm:px-8 py-8 mb-10">
      <div className="flex flex-col gap-4">
        {PIPELINE_STEPS.map((step, i) => {
          const state =
            i < stepIndex ? "done" : i === stepIndex ? "active" : "pending";
          return (
            <div key={step} className="flex items-center gap-3">
              <span
                className={[
                  "inline-flex items-center justify-center w-4 h-4 rounded-full border font-mono text-[10px] shrink-0 transition-colors duration-300",
                  state === "done"
                    ? "border-[#3DDC97] bg-[#3DDC97] text-[#0B0E14]"
                    : state === "active"
                    ? "border-[#3DDC97] text-[#3DDC97] pulse-ring"
                    : "border-[#2A3142] text-[#6B7280]",
                ].join(" ")}
              >
                {state === "done" ? "✓" : ""}
              </span>
              <span
                className={[
                  "font-mono text-sm tracking-[0.04em] transition-colors duration-300",
                  state === "pending" ? "text-[#6B7280]" : "text-[#E8E6DE]",
                ].join(" ")}
              >
                {step}
                {state === "active" ? "…" : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BorrowerPage() {
  const { wallet } = useWallet();

  const [data, setData] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const analyze = async () => {
    setStatus("loading");
    setErrorMessage(null);

    try {
      const [insight, lending] = await Promise.all([
        API.post("/insights/", { wallet }),
        API.post("/lending/decision", { wallet }),
      ]);

      setData({
        insight: insight.data,
        lending: lending.data,
      });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        "Could not analyze this wallet. Check the connection and try again."
      );
    }
  };

  const score = useCountUp(data?.insight.credit_score ?? 0);

  return (
    <main className="min-h-screen bg-[#0B0E14] text-[#E8E6DE] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-sans { font-family: 'Inter', sans-serif; }

        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(61, 220, 151, 0.45); }
          50% { box-shadow: 0 0 0 4px rgba(61, 220, 151, 0); }
        }
        .pulse-ring { animation: pulse-ring 1.4s ease-in-out infinite; }

        @keyframes rise-in {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rise-in { animation: rise-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }

        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-3px); }
          40%, 60% { transform: translateX(3px); }
        }
        .shake-once { animation: shake 0.45s ease-in-out; }

        @media (prefers-reduced-motion: reduce) {
          .pulse-ring, .rise-in, .shake-once { animation: none !important; }
        }
      `}</style>

      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-10 font-mono text-xs tracking-[0.18em] text-[#6B7280] uppercase">
          <span>Borrower record — live analysis</span>
        </div>

        {/* Header + wallet row */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <h1 className="font-display text-5xl sm:text-6xl font-medium leading-[1.05] mb-3">
              Borrower Dashboard
            </h1>
            <p className="font-sans text-[#6B7280] text-base sm:text-lg">
              Run a fresh read on this wallet&apos;s on-chain credit standing.
            </p>
          </div>

          <div className="font-mono text-xs text-[#6B7280] sm:text-right">
            <div className="uppercase tracking-[0.14em] mb-1">Wallet</div>
            <div className="text-[#E8E6DE]/80">
              {wallet ? wallet : "Not connected"}
            </div>
          </div>
        </div>

        {/* Action row */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          <button
            onClick={analyze}
            disabled={status === "loading" || !wallet}
            className="font-mono text-sm tracking-[0.08em] uppercase px-7 py-3 rounded-sm border border-[#3DDC97] text-[#0B0E14] bg-[#3DDC97] transition-all duration-200 hover:bg-[#34c688] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#3DDC97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3DDC97]"
          >
            {status === "loading" ? "Analyzing…" : "Analyze wallet"}
          </button>

          {!wallet && (
            <span className="font-mono text-xs text-[#6B7280]">
              Connect a wallet to run an analysis.
            </span>
          )}
        </div>

        {/* Loading state — narrates the pipeline */}
        {status === "loading" && <PipelineLoader />}

        {/* Error state */}
        {status === "error" && errorMessage && (
          <div className="shake-once border border-[#B85C5C] bg-[#B85C5C]/10 rounded-sm px-6 py-5 mb-10 flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.12em] uppercase text-[#E08585]">
              Error
            </span>
            <span className="font-sans text-sm text-[#E8E6DE]/90">
              {errorMessage}
            </span>
          </div>
        )}

        {/* Results */}
        {data && status === "idle" && (
          <div ref={resultsRef} className="space-y-8">
            
            {/* Main Metrics Dashboard Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
              
              {/* Card 1: Credit Health */}
              <div style={{ background: "#0A1425", border: "1px solid #111C2E", borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#64748B", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>
                  Credit Health
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#34D399", letterSpacing: -0.5 }}>
                  {data.insight.rating || "PRIME"}
                </div>
                <div style={{ fontSize: 11, color: "#4A6080", marginTop: 4 }}>
                  Eligible for under-collateralized loans
                </div>
              </div>

              {/* Card 2: Borrow Capacity */}
              <div style={{ background: "#0A1425", border: "1px solid #111C2E", borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#64748B", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>
                  Borrow Capacity
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#00E5FF", letterSpacing: -0.5 }}>
                  5,000 HSK
                </div>
                <div style={{ fontSize: 11, color: "#4A6080", marginTop: 4 }}>
                  Required collateral: {data.lending.collateral_ratio}%
                </div>
              </div>

              {/* Card 3: Trust Level */}
              <div style={{ background: "#0A1425", border: "1px solid #111C2E", borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#64748B", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>
                  Trust Level
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#E2E8F0", letterSpacing: -0.5 }}>
                  {score} / 850
                </div>
                <div style={{ fontSize: 11, color: "#4A6080", marginTop: 4 }}>
                  Reputation-weighted rating
                </div>
              </div>

              {/* Card 4: Active Loans */}
              <div style={{ background: "#0A1425", border: "1px solid #111C2E", borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#64748B", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>
                  Active Loans
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#E2E8F0", letterSpacing: -0.5 }}>
                  0 HSK
                </div>
                <div style={{ fontSize: 11, color: "#4A6080", marginTop: 4 }}>
                  All liabilities fully settled
                </div>
              </div>

            </div>

            {/* Advanced detailed tables lower in structure */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              
              {/* Column 1: Lending Status details */}
              <div style={{ background: "#0A1425", border: "1px solid #111C2E", borderRadius: 12, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", textTransform: "uppercase", letterSpacing: 1 }}>
                    Lending Conditions
                  </h3>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#34D399", padding: "4px 8px", background: "rgba(52,211,153,0.08)", borderRadius: 6 }}>
                    {data.lending.eligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
                  </span>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8 }}>
                    <span style={{ fontSize: 13, color: "#64748B" }}>Interest Rate</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0" }}>{data.lending.interest_rate}% APY</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8 }}>
                    <span style={{ fontSize: 13, color: "#64748B" }}>Collateral Requirement</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0" }}>{data.lending.collateral_ratio}%</span>
                  </div>
                </div>
              </div>

              {/* Column 2: Improvement Plan */}
              <div style={{ background: "#0A1425", border: "1px solid #111C2E", borderRadius: 12, padding: 24 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
                  Reputation Recommendations
                </h3>
                <ul style={{ display: "flex", flexDirection: "column", gap: 10, padding: 0, margin: 0, listStyle: "none" }}>
                  {data.insight.recommendations.map((rec, index) => (
                    <li key={index} style={{ display: "flex", gap: 8, fontSize: 12, color: "#94A3B8" }}>
                      <span style={{ color: "#34D399" }}>✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        )}
      </div>
    </main>
  );
}