"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Credence AI — About
 *
 * Visual language: a ledger, not a landing page. The hero reads like a
 * live credit-score entry — score, wallet, verification — because that's
 * the one thing this product actually does. Everything below is set as
 * dividing ledger lines, not cards, to keep the page feeling like a
 * record rather than a brochure.
 */

function useCountUp(target: number, durationMs = 1400, startWhenVisible = true) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!startWhenVisible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const progress = Math.min((now - start) / durationMs, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setValue(Math.round(eased * target));
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, durationMs, startWhenVisible]);

  return { value, ref };
}

export default function AboutPage() {
  const { value: score, ref: scoreRef } = useCountUp(742);

  return (
    <main className="min-h-screen bg-[#0B0E14] text-[#E8E6DE] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-sans { font-family: 'Inter', sans-serif; }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(61, 220, 151, 0.45); }
          50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(61, 220, 151, 0); }
        }
        .verified-dot {
          animation: pulse-dot 2.2s ease-in-out infinite;
        }

        @keyframes rise-in {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rise-in {
          animation: rise-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes grid-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .ledger-grid {
          animation: grid-fade 1.2s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .verified-dot, .rise-in, .ledger-grid { animation: none !important; }
        }
      `}</style>

      {/* faint ledger-line backdrop */}
      <div
        className="ledger-grid fixed inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 47px, #E8E6DE 47px, #E8E6DE 48px)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        {/* Eyebrow — a real ledger label, not decoration */}
        <div
          className="rise-in flex items-center gap-2 mb-10 font-mono text-xs tracking-[0.18em] text-[#6B7280] uppercase"
          style={{ animationDelay: "0ms" }}
        >
          <span>Record 0x4C2 — HashKey Chain</span>
        </div>

        {/* Hero: the score readout, the signature element */}
        <div
          className="rise-in mb-6"
          style={{ animationDelay: "80ms" }}
        >
          <h1 className="font-display text-5xl sm:text-6xl font-medium leading-[1.05] mb-3">
            About <span className="text-[#E8E6DE]">Credence AI</span>
          </h1>
          <p className="font-sans text-[#6B7280] text-base sm:text-lg max-w-xl">
            On-chain credit infrastructure for decentralized finance.
          </p>
        </div>

        {/* Score entry card — styled as a real ledger row, not a UI card */}
        <div
          className="rise-in border border-[#2A3142] bg-[#1A1F2B]/60 rounded-sm px-6 sm:px-8 py-7 mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
          style={{ animationDelay: "180ms" }}
        >
          <div>
            <div className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase mb-2">
              Wallet credit score
            </div>
            <div className="flex items-baseline gap-3">
              <span
                ref={scoreRef}
                className="font-display text-6xl sm:text-7xl font-medium tabular-nums tracking-tight text-[#E8E6DE]"
              >
                {score}
              </span>
              <span className="font-mono text-sm text-[#6B7280]">/ 850</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <div className="flex items-center gap-2">
              <span className="verified-dot inline-block w-1.5 h-1.5 rounded-full bg-[#3DDC97]" />
              <span className="font-mono text-xs tracking-[0.12em] text-[#3DDC97] uppercase">
                Verified on-chain
              </span>
            </div>
            <div className="font-mono text-xs text-[#6B7280]">
              0x71A9...4f2C
            </div>
          </div>
        </div>

        {/* Ledger entries — two real statements, set as record rows */}
        <div className="rise-in" style={{ animationDelay: "280ms" }}>
          <div className="border-t border-[#2A3142]" />

          <div className="grid sm:grid-cols-[140px_1fr] gap-x-8 gap-y-3 py-8 border-b border-[#2A3142]">
            <div className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase pt-1">
              What it is
            </div>
            <p className="font-sans text-lg leading-8 text-[#E8E6DE]/90">
              Credence AI is an AI-powered, on-chain credit infrastructure
              platform built on HashKey Chain.
            </p>
          </div>

          <div className="grid sm:grid-cols-[140px_1fr] gap-x-8 gap-y-3 py-8 border-b border-[#2A3142]">
            <div className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase pt-1">
              How it works
            </div>
            <p className="font-sans text-lg leading-8 text-[#E8E6DE]/90">
              The platform evaluates wallet behavior, generates credit
              scores, publishes credit records on-chain, and provides
              lending intelligence for decentralized finance.
            </p>
          </div>
        </div>

        {/* Footer note — closes the ledger metaphor quietly */}
        <div
          className="rise-in mt-10 font-mono text-xs text-[#6B7280]"
          style={{ animationDelay: "360ms" }}
        >
          Every score is written once it's confirmed. Nothing here is editable after the fact.
        </div>
      </div>
    </main>
  );
}