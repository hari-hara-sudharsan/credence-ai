"use client";

import { useEffect, useRef, useState } from "react";

import API from "@/lib/api";
import { useWallet } from "@/context/WalletContext";

/**
 * Lender Dashboard — Credence AI
 *
 * Same ledger system as the other pages, but the framing is different:
 * this is one party underwriting a stranger's wallet, so the page
 * leads with a verdict (approve / decline / risk tier) before the
 * supporting detail — that's the one question a lender actually
 * scans for first. The pipeline loader narrates the three real calls
 * this page makes: scoring, terms, then the written report.
 */

type CreditProfile = {
  credit_score: number;
  rating: string;
  probability_of_default: number;
};

type LendingTerms = {
  eligible: boolean;
  interest_rate: number;
  collateral_ratio: number;
  risk_level: string;
};

type UnderwritingReport = {
  report: string;
};

type DashboardData = {
  credit: CreditProfile;
  lending: LendingTerms;
  report: UnderwritingReport;
};

const PIPELINE_STEPS = [
  "Scoring credit profile",
  "Calculating lending terms",
  "Writing underwriting report",
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

function riskTone(level: string) {
  const l = level.toLowerCase();
  if (l.includes("low")) return "text-[#3DDC97] border-[#3DDC97]";
  if (l.includes("high")) return "text-[#E08585] border-[#B85C5C]";
  return "text-[#E8C97A] border-[#E8C97A]";
}

function PipelineLoader() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, PIPELINE_STEPS.length - 1));
    }, 750);
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

const REPORT_SECTION_META: Record<string, { icon: string; color: string }> = {
  "Institutional Credit Report": { icon: "🏦", color: "#00E5FF" },
  "Wallet Overview": { icon: "👛", color: "#00E5FF" },
  "Risk Assessment": { icon: "⚠️", color: "#FFB830" },
  Strengths: { icon: "🟢", color: "#34D399" },
  Weaknesses: { icon: "🔴", color: "#FF4D6A" },
  "Lending Recommendation": { icon: "📝", color: "#A78BFA" },
};

function FormattedReport({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  const sections: { title: string; body: string }[] = [];

  for (let i = 0; i < parts.length; i++) {
    const chunk = parts[i].trim();
    if (!chunk) continue;

    if (i % 2 === 1) {
      sections.push({ title: chunk, body: "" });
    } else {
      if (sections.length > 0) {
        sections[sections.length - 1].body += chunk;
      } else {
        sections.push({ title: "", body: chunk });
      }
    }
  }

  return (
    <div className="flex flex-col gap-0">
      {sections.map((section, idx) => {
        const meta = REPORT_SECTION_META[section.title] ?? { icon: "◎", color: "#94A3B8" };
        const body = section.body.replace(/^\n+/, "").replace(/\n+$/, "");
        if (!section.title && !body) return null;

        return (
          <div
            key={idx}
            className="py-4 border-b border-[#2A3142]/40 last:border-b-0"
          >
            {section.title && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{meta.icon}</span>
                <h3
                  className="font-sans text-sm font-bold tracking-wide"
                  style={{ color: meta.color }}
                >
                  {section.title}
                </h3>
              </div>
            )}
            {body && (
              <p className="font-sans text-sm text-[#94A3B8] leading-7 pl-6">
                {body}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function LenderPage() {
  const { wallet: connectedWallet } = useWallet();
  const [wallet, setWallet] = useState("");

  useEffect(() => {
    if (connectedWallet) setWallet(connectedWallet);
  }, [connectedWallet]);

  const [data, setData] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canAnalyze = wallet.trim().length > 0;

  const analyze = async () => {
    if (!canAnalyze) return;
    setStatus("loading");
    setErrorMessage(null);

    try {
      const [credit, lending, report] = await Promise.all([
        API.post("/credit/score", { wallet }),
        API.post("/lending/decision", { wallet }),
        API.post("/report", { wallet }),
      ]);

      setData({
        credit: credit.data,
        lending: lending.data,
        report: report.data,
      });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        "Could not underwrite this wallet. Check the address and try again."
      );
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") analyze();
  };

  const score = useCountUp(data?.credit.credit_score ?? 0);

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
          <span>Underwriting record — live analysis</span>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl font-medium leading-[1.05] mb-3">
          Lender Dashboard
        </h1>
        <p className="font-sans text-[#6B7280] text-base sm:text-lg mb-12 max-w-xl">
          Underwrite a borrower&apos;s wallet before you commit capital.
        </p>

        {/* Input row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12" onKeyDown={onKeyDown}>
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
              onClick={analyze}
              disabled={!canAnalyze || status === "loading"}
              className="font-mono text-sm tracking-[0.08em] uppercase px-7 py-3 rounded-sm border border-[#3DDC97] text-[#0B0E14] bg-[#3DDC97] transition-all duration-200 hover:bg-[#34c688] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#3DDC97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3DDC97] whitespace-nowrap"
            >
              {status === "loading" ? "Underwriting…" : "Underwrite"}
            </button>
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

        {/* Results */}
        {data && status === "idle" && (
          <div className="space-y-10">
            {/* Verdict strip — the first thing a lender scans for */}
            <div
              className={[
                "rise-in border rounded-sm px-6 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-4",
                data.lending.eligible
                  ? "border-[#3DDC97]/50 bg-[#3DDC97]/[0.06]"
                  : "border-[#2A3142] bg-[#1A1F2B]/60",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={[
                    "inline-block w-2 h-2 rounded-full",
                    data.lending.eligible ? "bg-[#3DDC97]" : "bg-[#6B7280]",
                  ].join(" ")}
                />
                <span className="font-mono text-sm tracking-[0.1em] uppercase">
                  {data.lending.eligible
                    ? "Recommended for lending"
                    : "Not recommended for lending"}
                </span>
              </div>
              <span
                className={[
                  "font-mono text-xs tracking-[0.1em] uppercase px-2.5 py-1 rounded-sm border",
                  riskTone(data.lending.risk_level),
                ].join(" ")}
              >
                {data.lending.risk_level} risk
              </span>
            </div>

            {/* Credit profile */}
            <div className="rise-in border border-[#2A3142] bg-[#1A1F2B]/60 rounded-sm px-6 sm:px-8 py-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div>
                <div className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase mb-2">
                  Credit profile
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-6xl sm:text-7xl font-medium tabular-nums tracking-tight text-[#E8E6DE]">
                    {score}
                  </span>
                  <span className="font-mono text-sm text-[#6B7280]">
                    / 850
                  </span>
                </div>
                <div className="font-mono text-sm text-[#3DDC97] mt-2 tracking-[0.08em] uppercase">
                  {data.credit.rating}
                </div>
              </div>

              <div className="sm:text-right">
                <div className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase mb-2">
                  Default probability
                </div>
                <div className="font-display text-4xl font-medium tabular-nums">
                  {data.credit.probability_of_default}%
                </div>
              </div>
            </div>

            {/* Lending terms — record grid */}
            <div className="rise-in border border-[#2A3142] rounded-sm px-6 sm:px-8 py-7">
              <h2 className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase mb-6">
                Lending terms
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#2A3142] rounded-sm overflow-hidden">
                <div className="bg-[#0B0E14] px-5 py-5">
                  <div className="font-mono text-xs tracking-[0.1em] text-[#6B7280] uppercase mb-2">
                    Interest rate
                  </div>
                  <div className="font-display text-3xl font-medium tabular-nums">
                    {data.lending.interest_rate}%
                  </div>
                </div>
                <div className="bg-[#0B0E14] px-5 py-5">
                  <div className="font-mono text-xs tracking-[0.1em] text-[#6B7280] uppercase mb-2">
                    Collateral ratio
                  </div>
                  <div className="font-display text-3xl font-medium tabular-nums">
                    {data.lending.collateral_ratio}%
                  </div>
                </div>
                <div className="bg-[#0B0E14] px-5 py-5">
                  <div className="font-mono text-xs tracking-[0.1em] text-[#6B7280] uppercase mb-2">
                    Eligible
                  </div>
                  <div className="font-display text-3xl font-medium">
                    {data.lending.eligible ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            </div>

            {/* AI underwriting report */}
            <div className="rise-in border border-[#2A3142] rounded-sm px-6 sm:px-8 py-7">
              <h2 className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase mb-5">
                AI underwriting report
              </h2>
              <FormattedReport text={data.report.report ?? "No report available."} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}