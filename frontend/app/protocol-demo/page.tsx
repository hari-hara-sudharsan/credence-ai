"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

/**
 * Protocol Integration Demo — Credence AI
 *
 * Same ledger language as the rest of the app. The oracle response is
 * decomposed into labeled rows instead of a raw JSON dump — because the
 * point of a demo is to show the protocol what it will actually receive,
 * not ask it to parse a blob.
 */

type OracleResponse = {
  wallet: string;
  credit_score: number;
  rating: string;
  collateral_ratio: number;
  interest_rate: number;
  [key: string]: unknown;
};

function formatLabel(key: string) {
  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toLocaleString();
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

const PIPELINE_STEPS = [
  "Connecting to Credence Oracle",
  "Fetching on-chain credit data",
  "Returning protocol payload",
];

function PipelineLoader() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, PIPELINE_STEPS.length - 1));
    }, 600);
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

export default function ProtocolDemo() {
  const [wallet, setWallet] = useState("");
  const [data, setData] = useState<OracleResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canQuery = wallet.trim().length > 0;

  const check = async () => {
    if (!canQuery) return;
    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await API.get(`/oracle/score/${wallet}`);
      setData(res.data);
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMessage(
        "Oracle query failed. Check the wallet address and try again."
      );
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") check();
  };

  const responseKeys = data
    ? Object.keys(data).filter((k) => k !== "wallet")
    : [];

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

        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pulse-ring, .rise-in, .shake-once { animation: none !important; }
        }
      `}</style>

      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-10 font-mono text-xs tracking-[0.18em] text-[#6B7280] uppercase">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3DDC97]" />
          <span>Protocol integration — live oracle</span>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl font-medium leading-[1.05] mb-3">
          Protocol Integration Demo
        </h1>
        <p className="font-sans text-[#6B7280] text-base sm:text-lg mb-12 max-w-xl">
          Simulates how an HSK lending protocol queries the Credence Oracle
          for a borrower&apos;s credit standing.
        </p>

        {/* Query input */}
        <div
          className="border border-[#2A3142] bg-[#1A1F2B]/60 rounded-sm px-6 sm:px-8 py-7 mb-12"
          onKeyDown={onKeyDown}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase mb-2 block">
                Borrower wallet
              </label>
              <input
                className="w-full bg-transparent border border-[#2A3142] rounded-sm px-4 py-3 font-mono text-sm text-[#E8E6DE] placeholder:text-[#6B7280]/60 focus:outline-none focus:border-[#3DDC97] transition-colors duration-200"
                placeholder="0x..."
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={check}
                disabled={!canQuery || status === "loading"}
                className="font-mono text-sm tracking-[0.08em] uppercase px-7 py-3 rounded-sm border border-[#3DDC97] text-[#0B0E14] bg-[#3DDC97] transition-all duration-200 hover:bg-[#34c688] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#3DDC97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3DDC97] whitespace-nowrap"
              >
                {status === "loading" ? "Querying…" : "Query Oracle"}
              </button>
            </div>
          </div>

          {/* Simulated code snippet */}
          <div className="mt-5 border-t border-[#2A3142] pt-5">
            <div className="font-mono text-xs text-[#6B7280] mb-2 tracking-[0.1em] uppercase">
              Protocol call
            </div>
            <pre className="font-mono text-xs text-[#E8E6DE]/70 bg-[#0B0E14] border border-[#2A3142] rounded-sm px-4 py-3 overflow-x-auto">
              <span className="text-[#6B7280]">GET</span>{" "}
              <span className="text-[#3DDC97]">/oracle/score/</span>
              <span className="text-[#E8E6DE]">
                {wallet || "0x..."}
              </span>
            </pre>
          </div>
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

        {/* Oracle Response */}
        {data && status === "idle" && (
          <div className="space-y-8">
            {/* Header strip */}
            <div className="rise-in border border-[#3DDC97]/30 bg-[#3DDC97]/[0.04] rounded-sm px-6 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-[#3DDC97]" />
                <span className="font-mono text-sm tracking-[0.1em] uppercase text-[#3DDC97]">
                  Oracle responded — 200 OK
                </span>
              </div>
              <span className="font-mono text-xs text-[#6B7280]">
                {data.wallet
                  ? `${data.wallet.slice(0, 6)}…${data.wallet.slice(-4)}`
                  : "—"}
              </span>
            </div>

            {/* Response data rows */}
            <div className="rise-in border border-[#2A3142] rounded-sm overflow-hidden">
              <div className="hidden sm:grid grid-cols-2 bg-[#1A1F2B]/60 border-b border-[#2A3142] px-5 sm:px-8 py-3">
                <span className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase">
                  Field
                </span>
                <span className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase text-right">
                  Value
                </span>
              </div>

              {responseKeys.map((key) => {
                const value = data[key];
                const isScore = key === "credit_score";

                return (
                  <div
                    key={key}
                    className="grid grid-cols-1 sm:grid-cols-2 border-b border-[#2A3142] last:border-b-0 px-5 sm:px-8 py-5 hover:bg-[rgba(232,230,222,0.015)] transition-colors duration-200"
                  >
                    <span className="font-mono text-sm text-[#6B7280]">
                      {formatLabel(key)}
                    </span>
                    <span
                      className={[
                        "font-display text-2xl sm:text-3xl font-medium tabular-nums sm:text-right mt-1 sm:mt-0",
                        isScore ? "text-[#3DDC97]" : "text-[#E8E6DE]/90",
                      ].join(" ")}
                    >
                      {formatValue(value)}
                      {key.includes("rate") || key.includes("ratio")
                        ? "%"
                        : ""}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Raw JSON collapsible */}
            <details className="rise-in group">
              <summary className="font-mono text-xs tracking-[0.1em] text-[#6B7280] uppercase cursor-pointer hover:text-[#E8E6DE]/80 transition-colors duration-200 list-none flex items-center gap-2">
                <span className="inline-block transition-transform duration-200 group-open:rotate-90">
                  ▸
                </span>
                Raw JSON payload
              </summary>
              <pre className="mt-3 font-mono text-xs text-[#E8E6DE]/60 bg-[#0B0E14] border border-[#2A3142] rounded-sm px-5 py-4 overflow-x-auto max-h-64">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </main>
  );
}
