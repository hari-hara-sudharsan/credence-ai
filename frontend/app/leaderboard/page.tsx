"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import API from "@/lib/api";

/**
 * Leaderboard — Credence AI
 *
 * Same ledger system as the other pages, but this is the one place
 * where rank is real information, not decoration — so it's the
 * organizing device. Rank position drives type scale and border
 * weight directly: #1 reads heaviest, and presence tapers down the
 * list, so the hierarchy is visible before you read a single number.
 */

type WalletEntry = {
  rank: number;
  wallet: string;
  score: number;
  segment: string;
  badges?: string[];
};

function truncate(address: string) {
  if (!address || address.length <= 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function rankTone(rank: number) {
  if (rank === 1) return "text-[#3DDC97]";
  if (rank <= 3) return "text-[#E8E6DE]";
  return "text-[#6B7280]";
}

function rankScale(rank: number) {
  if (rank === 1) return "text-4xl sm:text-5xl";
  if (rank <= 3) return "text-3xl sm:text-4xl";
  return "text-2xl sm:text-3xl";
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-[64px_1fr_auto] sm:grid-cols-[80px_1fr_140px_auto] items-center gap-4 px-5 sm:px-8 py-5 border-b border-[#2A3142] animate-pulse">
      <div className="h-8 w-10 bg-[#1A1F2B] rounded-sm" />
      <div className="h-4 w-40 bg-[#1A1F2B] rounded-sm" />
      <div className="hidden sm:block h-4 w-16 bg-[#1A1F2B] rounded-sm" />
      <div className="h-4 w-20 bg-[#1A1F2B] rounded-sm justify-self-end" />
    </div>
  );
}

export default function LeaderboardPage() {
  const [data, setData] = useState<WalletEntry[]>([]);
  const [status, setStatus] = useState<"loading" | "idle" | "error">(
    "loading"
  );

  useEffect(() => {
    API.get("/leaderboard")
      .then((res) => {
        setData(res.data);
        setStatus("idle");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0E14] text-[#E8E6DE] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-sans { font-family: 'Inter', sans-serif; }

        @keyframes rise-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rise-in { animation: rise-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }

        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse { animation: pulse-soft 1.6s ease-in-out infinite; }

        .row-hover { transition: background-color 0.2s ease, transform 0.2s ease; }
        .row-hover:hover { background-color: rgba(232, 230, 222, 0.025); }

        @media (prefers-reduced-motion: reduce) {
          .rise-in, .animate-pulse { animation: none !important; }
        }
      `}</style>

      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-10 font-mono text-xs tracking-[0.18em] text-[#6B7280] uppercase">
          <span>Ranked by on-chain credit score</span>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl font-medium leading-[1.05] mb-3">
          Top Credit Wallets
        </h1>
        <p className="font-sans text-[#6B7280] text-base sm:text-lg mb-12">
          The highest-standing wallets on Credence, ranked live.
        </p>

        {/* Error state */}
        {status === "error" && (
          <div className="border border-[#B85C5C] bg-[#B85C5C]/10 rounded-sm px-6 py-5 mb-10 flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.12em] uppercase text-[#E08585]">
              Error
            </span>
            <span className="font-sans text-sm text-[#E8E6DE]/90">
              Could not load the leaderboard. Try refreshing the page.
            </span>
          </div>
        )}

        {/* Table */}
        <div className="border border-[#2A3142] rounded-sm overflow-hidden">
          {/* Header row */}
          <div className="hidden sm:grid grid-cols-[80px_1fr_140px_auto] gap-4 px-5 sm:px-8 py-3 bg-[#1A1F2B]/60 border-b border-[#2A3142] font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase">
            <div>Rank</div>
            <div>Wallet</div>
            <div>Segment</div>
            <div className="text-right">Score</div>
          </div>

          {status === "loading" &&
            Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

          {status === "idle" &&
            data.map((wallet, i) => (
              <Link
                key={wallet.wallet}
                href={`/passport/${wallet.wallet}`}
                className="rise-in row-hover grid grid-cols-[64px_1fr_auto] sm:grid-cols-[80px_1fr_140px_auto] items-center gap-4 px-5 sm:px-8 py-5 border-b border-[#2A3142] last:border-b-0 cursor-pointer no-underline block"
                style={{ animationDelay: `${Math.min(i * 45, 400)}ms` }}
              >
                {/* Rank */}
                <div
                  className={[
                    "font-display font-medium tabular-nums",
                    rankScale(wallet.rank),
                    rankTone(wallet.rank),
                  ].join(" ")}
                >
                  {wallet.rank}
                </div>

                {/* Wallet + badges */}
                <div className="min-w-0">
                  <div className="font-mono text-sm sm:text-base text-[#E8E6DE]/90 truncate">
                    {truncate(wallet.wallet)}
                  </div>
                  {wallet.badges && wallet.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {wallet.badges.map((badge) => (
                        <span
                          key={badge}
                          className="font-mono text-[10px] tracking-[0.08em] uppercase px-2 py-0.5 rounded-sm border border-[#2A3142] text-[#6B7280]"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Segment shown inline on mobile, where the column is hidden */}
                  <div className="sm:hidden font-mono text-xs text-[#6B7280] mt-2">
                    {wallet.segment}
                  </div>
                </div>

                {/* Segment (desktop column) */}
                <div className="hidden sm:block font-mono text-sm text-[#6B7280]">
                  {wallet.segment}
                </div>

                {/* Score */}
                <div className="text-right">
                  <span
                    className={[
                      "font-display font-medium tabular-nums",
                      rankScale(wallet.rank),
                      wallet.rank === 1 ? "text-[#3DDC97]" : "text-[#E8E6DE]",
                    ].join(" ")}
                  >
                    {wallet.score}
                  </span>
                </div>
              </Link>
            ))}

          {status === "idle" && data.length === 0 && (
            <div className="px-5 sm:px-8 py-10 text-center font-mono text-sm text-[#6B7280]">
              No ranked wallets yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}