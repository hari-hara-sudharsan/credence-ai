"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

/**
 * Credit Improvement Simulator — Credence AI
 *
 * Same ledger language as borrower/lender pages. The signature move
 * here is the before → after comparison: current score on the left,
 * projected on the right, with the delta called out in the middle
 * so the improvement is the first thing you see, not something you
 * have to calculate yourself.
 */

type SimResult = {
  projected_score: number;
  projected_rating: string;
  score_increase: number;
};

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

export default function SimulatorPage() {
  const [score, setScore] = useState(487);
  const [txs, setTxs] = useState(50);
  const [protocols, setProtocols] = useState(3);
  const [staking, setStaking] = useState(true);
  const [result, setResult] = useState<SimResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const simulate = async () => {
    setStatus("loading");
    try {
      const res = await API.post("/simulator", {
        current_score: score,
        extra_transactions: txs,
        extra_protocols: protocols,
        staking_enabled: staking,
      });
      setResult(res.data);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  const projectedDisplay = useCountUp(result?.projected_score ?? 0);
  const increaseDisplay = useCountUp(result?.score_increase ?? 0);

  return (
    <main className="min-h-screen bg-[#0B0E14] text-[#E8E6DE] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-sans { font-family: 'Inter', sans-serif; }

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

        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(61, 220, 151, 0.45); }
          50% { box-shadow: 0 0 0 4px rgba(61, 220, 151, 0); }
        }
        .pulse-ring { animation: pulse-ring 1.4s ease-in-out infinite; }

        @keyframes grow-bar {
          from { width: 0%; }
        }
        .grow-bar { animation: grow-bar 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }

        /* Custom checkbox */
        .custom-toggle {
          appearance: none;
          width: 40px;
          height: 22px;
          background: #2A3142;
          border-radius: 11px;
          position: relative;
          cursor: pointer;
          transition: background 0.2s;
          outline: none;
          flex-shrink: 0;
        }
        .custom-toggle:checked {
          background: #3DDC97;
        }
        .custom-toggle::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 16px;
          height: 16px;
          background: #0B0E14;
          border-radius: 50%;
          transition: transform 0.2s;
        }
        .custom-toggle:checked::after {
          transform: translateX(18px);
        }
        .custom-toggle:focus-visible {
          box-shadow: 0 0 0 2px #3DDC97;
        }

        @media (prefers-reduced-motion: reduce) {
          .rise-in, .shake-once, .pulse-ring, .grow-bar { animation: none !important; }
        }
      `}</style>

      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-10 font-mono text-xs tracking-[0.18em] text-[#6B7280] uppercase">
          <span>Scenario planner — what-if analysis</span>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl font-medium leading-[1.05] mb-3">
          Credit Improvement Simulator
        </h1>
        <p className="font-sans text-[#6B7280] text-base sm:text-lg mb-12 max-w-xl">
          Adjust the levers below and see how each change would move your
          on-chain credit score.
        </p>

        {/* Parameter inputs */}
        <div className="border border-[#2A3142] bg-[#1A1F2B]/60 rounded-sm px-6 sm:px-8 py-7 mb-12">
          <h2 className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase mb-6">
            Simulation parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Current score */}
            <div>
              <label className="font-mono text-xs tracking-[0.1em] text-[#6B7280] uppercase mb-2 block">
                Current score
              </label>
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full bg-transparent border border-[#2A3142] rounded-sm px-4 py-3 font-mono text-sm text-[#E8E6DE] focus:outline-none focus:border-[#3DDC97] transition-colors duration-200"
              />
            </div>

            {/* Extra transactions */}
            <div>
              <label className="font-mono text-xs tracking-[0.1em] text-[#6B7280] uppercase mb-2 block">
                Additional transactions
              </label>
              <input
                type="number"
                value={txs}
                onChange={(e) => setTxs(Number(e.target.value))}
                className="w-full bg-transparent border border-[#2A3142] rounded-sm px-4 py-3 font-mono text-sm text-[#E8E6DE] focus:outline-none focus:border-[#3DDC97] transition-colors duration-200"
              />
            </div>

            {/* Extra protocols */}
            <div>
              <label className="font-mono text-xs tracking-[0.1em] text-[#6B7280] uppercase mb-2 block">
                New protocol interactions
              </label>
              <input
                type="number"
                value={protocols}
                onChange={(e) => setProtocols(Number(e.target.value))}
                className="w-full bg-transparent border border-[#2A3142] rounded-sm px-4 py-3 font-mono text-sm text-[#E8E6DE] focus:outline-none focus:border-[#3DDC97] transition-colors duration-200"
              />
            </div>

            {/* Staking toggle */}
            <div className="flex items-center justify-between sm:justify-start gap-4 py-3">
              <label className="font-mono text-xs tracking-[0.1em] text-[#6B7280] uppercase">
                Enable staking
              </label>
              <input
                type="checkbox"
                checked={staking}
                onChange={(e) => setStaking(e.target.checked)}
                className="custom-toggle"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={simulate}
              disabled={status === "loading"}
              className="font-mono text-sm tracking-[0.08em] uppercase px-7 py-3 rounded-sm border border-[#3DDC97] text-[#0B0E14] bg-[#3DDC97] transition-all duration-200 hover:bg-[#34c688] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#3DDC97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3DDC97]"
            >
              {status === "loading" ? "Simulating…" : "Run Simulation"}
            </button>
          </div>
        </div>

        {/* Error state */}
        {status === "error" && (
          <div className="shake-once border border-[#B85C5C] bg-[#B85C5C]/10 rounded-sm px-6 py-5 mb-10 flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.12em] uppercase text-[#E08585]">
              Error
            </span>
            <span className="font-sans text-sm text-[#E8E6DE]/90">
              Simulation failed. Adjust parameters and try again.
            </span>
          </div>
        )}

        {/* Results */}
        {result && status === "idle" && (
          <div className="space-y-8">

            {/* Before → After comparison */}
            <div className="rise-in border border-[#2A3142] rounded-sm overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_1fr]">
                {/* Current */}
                <div className="px-6 sm:px-8 py-8 text-center">
                  <div className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase mb-3">
                    Current
                  </div>
                  <div className="font-display text-5xl sm:text-6xl font-medium tabular-nums text-[#6B7280]">
                    {score}
                  </div>
                </div>

                {/* Delta */}
                <div className="flex flex-col items-center justify-center px-4 border-x border-[#2A3142]">
                  <div className="font-mono text-xs tracking-[0.1em] text-[#6B7280] uppercase mb-2">
                    Δ
                  </div>
                  <div className="font-display text-3xl font-medium tabular-nums text-[#3DDC97]">
                    +{increaseDisplay}
                  </div>
                </div>

                {/* Projected */}
                <div className="px-6 sm:px-8 py-8 text-center">
                  <div className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase mb-3">
                    Projected
                  </div>
                  <div className="font-display text-5xl sm:text-6xl font-medium tabular-nums text-[#E8E6DE]">
                    {projectedDisplay}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-6 sm:px-8 pb-6">
                <div className="relative h-2 bg-[#2A3142] rounded-full overflow-hidden">
                  <div
                    className="grow-bar absolute left-0 top-0 bottom-0 rounded-full"
                    style={{
                      width: `${Math.min((result.projected_score / 850) * 100, 100)}%`,
                      background: "linear-gradient(90deg, #3DDC97, #00E5FF)",
                      boxShadow: "0 0 12px rgba(61, 220, 151, 0.3)",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-mono text-[10px] text-[#6B7280]">0</span>
                  <span className="font-mono text-[10px] text-[#6B7280]">850</span>
                </div>
              </div>
            </div>

            {/* Projected rating */}
            <div className="rise-in border border-[#2A3142] bg-[#1A1F2B]/60 rounded-sm px-6 sm:px-8 py-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase mb-2">
                  Projected rating
                </div>
                <div className="font-mono text-lg tracking-[0.1em] text-[#3DDC97] uppercase">
                  {result.projected_rating}
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs text-[#6B7280]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3DDC97]" />
                Simulation complete
              </div>
            </div>

            {/* Scenario summary */}
            <div className="rise-in border border-[#2A3142] rounded-sm px-6 sm:px-8 py-7">
              <h2 className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase mb-5">
                Scenario applied
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#2A3142] rounded-sm overflow-hidden">
                <div className="bg-[#0B0E14] px-5 py-5">
                  <div className="font-mono text-xs tracking-[0.1em] text-[#6B7280] uppercase mb-2">
                    Transactions
                  </div>
                  <div className="font-display text-2xl font-medium tabular-nums">
                    +{txs}
                  </div>
                </div>
                <div className="bg-[#0B0E14] px-5 py-5">
                  <div className="font-mono text-xs tracking-[0.1em] text-[#6B7280] uppercase mb-2">
                    Protocols
                  </div>
                  <div className="font-display text-2xl font-medium tabular-nums">
                    +{protocols}
                  </div>
                </div>
                <div className="bg-[#0B0E14] px-5 py-5">
                  <div className="font-mono text-xs tracking-[0.1em] text-[#6B7280] uppercase mb-2">
                    Staking
                  </div>
                  <div className="font-display text-2xl font-medium">
                    {staking ? "On" : "Off"}
                  </div>
                </div>
                <div className="bg-[#0B0E14] px-5 py-5">
                  <div className="font-mono text-xs tracking-[0.1em] text-[#6B7280] uppercase mb-2">
                    Score boost
                  </div>
                  <div className="font-display text-2xl font-medium tabular-nums text-[#3DDC97]">
                    +{result.score_increase}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}