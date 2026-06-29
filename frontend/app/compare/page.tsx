"use client";

import { useEffect, useState } from "react";

import API from "@/lib/api";

/**
 * Wallet Comparison — Credence AI
 *
 * Same ledger system as the other pages, but the signature move here
 * is structural, not animated: two wallets are laid out as mirrored
 * rows of the same metric, so a difference is visible as a row, not
 * something you have to diff out of two JSON blocks by eye.
 */

type WalletMetrics = {
  credit_score: number;
  rating: string;
  [key: string]: unknown;
};

type CompareResult = {
  wallet_a: WalletMetrics;
  wallet_b: WalletMetrics;
};

const METRIC_LABELS: Record<string, string> = {
  credit_score: "Credit score",
  rating: "Rating",
};

function formatLabel(key: string) {
  return (
    METRIC_LABELS[key] ??
    key
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

function formatValue(value: unknown) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toLocaleString();
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

function truncate(address: string) {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export default function ComparePage() {
  const [walletA, setWalletA] = useState("");
  const [walletB, setWalletB] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canCompare = walletA.trim().length > 0 && walletB.trim().length > 0;

  const compare = async () => {
    if (!canCompare) return;
    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await API.post("/compare/", {
        wallet_a: walletA,
        wallet_b: walletB,
      });
      setResult(res.data);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        "Could not compare these wallets. Check both addresses and try again."
      );
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") compare();
  };

  // every key present on either side, in a stable order
  const metricKeys = result
    ? Array.from(
        new Set([
          ...Object.keys(result.wallet_a ?? {}),
          ...Object.keys(result.wallet_b ?? {}),
        ])
      ).filter((key) => key !== "wallet")
    : [];

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

        @keyframes dash {
          to { stroke-dashoffset: -24; }
        }
        .vs-line { animation: dash 1.6s linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .rise-in, .shake-once, .vs-line { animation: none !important; }
        }
      `}</style>

      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-10 font-mono text-xs tracking-[0.18em] text-[#6B7280] uppercase">
          <span>Two records, side by side</span>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl font-medium leading-[1.05] mb-3">
          Wallet Comparison
        </h1>
        <p className="font-sans text-[#6B7280] text-base sm:text-lg mb-12 max-w-xl">
          Set two wallets against each other, metric by metric.
        </p>

        {/* Input row */}
        <div
          className="border border-[#2A3142] bg-[#1A1F2B]/60 rounded-sm px-6 sm:px-8 py-7 mb-10"
          onKeyDown={onKeyDown}
        >
          <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 items-center">
            <div>
              <label className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase mb-2 block">
                Wallet A
              </label>
              <input
                className="w-full bg-transparent border border-[#2A3142] rounded-sm px-4 py-3 font-mono text-sm text-[#E8E6DE] placeholder:text-[#6B7280]/60 focus:outline-none focus:border-[#3DDC97] transition-colors duration-200"
                placeholder="0x..."
                value={walletA}
                onChange={(e) => setWalletA(e.target.value)}
              />
            </div>

            <div className="hidden sm:flex flex-col items-center justify-center pt-6">
              <span className="font-mono text-xs text-[#6B7280] uppercase tracking-[0.1em]">
                vs
              </span>
            </div>

            <div>
              <label className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase mb-2 block">
                Wallet B
              </label>
              <input
                className="w-full bg-transparent border border-[#2A3142] rounded-sm px-4 py-3 font-mono text-sm text-[#E8E6DE] placeholder:text-[#6B7280]/60 focus:outline-none focus:border-[#3DDC97] transition-colors duration-200"
                placeholder="0x..."
                value={walletB}
                onChange={(e) => setWalletB(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={compare}
              disabled={!canCompare || status === "loading"}
              className="font-mono text-sm tracking-[0.08em] uppercase px-7 py-3 rounded-sm border border-[#3DDC97] text-[#0B0E14] bg-[#3DDC97] transition-all duration-200 hover:bg-[#34c688] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#3DDC97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3DDC97]"
            >
              {status === "loading" ? "Comparing…" : "Compare wallets"}
            </button>
            {!canCompare && (
              <span className="font-mono text-xs text-[#6B7280]">
                Enter both wallet addresses to compare.
              </span>
            )}
          </div>
        </div>

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

        {/* Result: mirrored ledger */}
        {result && status === "idle" && (
          <div className="rise-in border border-[#2A3142] rounded-sm overflow-hidden">
            {/* Column headers naming the actual wallets */}
            <div className="grid grid-cols-[1fr_120px_1fr] sm:grid-cols-[1fr_220px_1fr] bg-[#1A1F2B]/60 border-b border-[#2A3142]">
              <div className="px-5 sm:px-8 py-4 font-mono text-xs text-[#6B7280] truncate">
                {truncate(walletA)}
              </div>
              <div className="px-3 py-4 font-mono text-xs text-[#6B7280] flex items-center justify-center">
                —
              </div>
              <div className="px-5 sm:px-8 py-4 font-mono text-xs text-[#6B7280] text-right truncate">
                {truncate(walletB)}
              </div>
            </div>

            {/* Mirrored rows, one per metric */}
            {metricKeys.map((key) => {
              const valA = result.wallet_a?.[key];
              const valB = result.wallet_b?.[key];
              const numericCompare =
                typeof valA === "number" && typeof valB === "number";
              const aWins = numericCompare && (valA as number) > (valB as number);
              const bWins = numericCompare && (valB as number) > (valA as number);

              return (
                <div
                  key={key}
                  className="grid grid-cols-[1fr_120px_1fr] sm:grid-cols-[1fr_220px_1fr] border-b border-[#2A3142] last:border-b-0"
                >
                  <div
                    className={[
                      "px-5 sm:px-8 py-5 font-display text-2xl sm:text-3xl font-medium tabular-nums",
                      aWins ? "text-[#3DDC97]" : "text-[#E8E6DE]/90",
                    ].join(" ")}
                  >
                    {formatValue(valA)}
                  </div>

                  <div className="px-3 py-5 flex items-center justify-center">
                    <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.05em] sm:tracking-[0.1em] text-[#6B7280] uppercase text-center">
                      {formatLabel(key)}
                    </span>
                  </div>

                  <div
                    className={[
                      "px-5 sm:px-8 py-5 font-display text-2xl sm:text-3xl font-medium tabular-nums text-right",
                      bWins ? "text-[#3DDC97]" : "text-[#E8E6DE]/90",
                    ].join(" ")}
                  >
                    {formatValue(valB)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}