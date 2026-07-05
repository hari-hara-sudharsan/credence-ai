"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/context/WalletContext";
import API from "@/lib/api";

import TrustScoreCard from "@/components/TrustScoreCard";
import ReputationTimeline from "@/components/ReputationTimeline";
import ScoreEvolutionChart from "@/components/ScoreEvolutionChart";
import ProtocolTrustMeter from "@/components/ProtocolTrustMeter";
import ScoreBreakdown from "@/components/ScoreBreakdown";
import { Card, CardContent } from "@/components/ui/card";

interface ScoreHistoryItem {
  date: string;
  score: number;
}

interface EvolutionEvent {
  timestamp: string;
  previous_score: number;
  current_score: number;
  delta: number;
  reason: string;
}

interface ReputationProfile {
  wallet: string;
  trust_score: number;
  rating: string;
  protocol_confidence: number;
  successful_loans: number;
  repaid_on_time: number;
  late_payments: number;
  current_credit_score: number;
  score_history: ScoreHistoryItem[];
  behavior_summary: string;
  events: EvolutionEvent[];
}

function SkeletonLoader() {
  return (
    <div className="space-y-10">
      {/* Top summary skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-[#2A3142] bg-[#1A1F2B]/40 rounded-sm p-6 h-28 animate-pulse">
            <div className="h-3 bg-[#2A3142] rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-[#2A3142] rounded w-1/2"></div>
          </div>
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-[#2A3142] bg-[#1A1F2B]/40 rounded-sm p-6 h-64 animate-pulse"></div>
        <div className="border border-[#2A3142] bg-[#1A1F2B]/40 rounded-sm p-6 h-64 animate-pulse"></div>
      </div>
    </div>
  );
}

export default function ReputationPage() {
  const { wallet } = useWallet();
  const [profile, setProfile] = useState<ReputationProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wallet) {
      setProfile(null);
      return;
    }

    const fetchReputation = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get(`/reputation/${wallet}`);
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching reputation profile:", err);
        setError("Failed to query on-chain reputation logs. Verify RPC connection and retry.");
      } finally {
        setLoading(false);
      }
    };

    fetchReputation();
  }, [wallet]);

  return (
    <main className="min-h-screen bg-[#040C1A] text-[#E2E8F0] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-sans { font-family: 'Inter', sans-serif; }

        @keyframes rise-in {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rise-in { animation: rise-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.3); }
          50% { box-shadow: 0 0 0 4px rgba(0, 229, 255, 0); }
        }
        .pulse-ring { animation: pulse-ring 1.4s ease-in-out infinite; }
      `}</style>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-8 font-mono text-xs tracking-[0.18em] text-[#6B7280] uppercase">
          <span>Credence Protocol — Underwriting Trust Standing</span>
        </div>

        {/* Header section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b border-[#2A3142]/40">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-medium leading-[1.1] mb-3 text-[#E8E6DE]">
              Reputation Profile
            </h1>
            <p className="font-sans text-[#6B7280] text-base sm:text-lg">
              Dynamic creditworthiness status calculated from your on-chain behavior history.
            </p>
          </div>

          <div className="font-mono text-xs text-[#6B7280] md:text-right">
            <div className="uppercase tracking-[0.14em] mb-1">Borrower Address</div>
            <div className="text-[#E8E6DE]/80 font-medium truncate max-w-[280px] sm:max-w-none">
              {wallet ? wallet : "Wallet not connected"}
            </div>
          </div>
        </div>

        {/* Wallet connection check */}
        {!wallet ? (
          <div className="rise-in border border-[#2A3142] bg-[#1A1F2B]/40 rounded-sm p-12 text-center max-w-2xl mx-auto space-y-6">
            <div className="flex justify-center">
              <span className="text-4xl">🔐</span>
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-semibold text-[#E8E6DE]">Access Denied</h2>
              <p className="font-sans text-sm text-[#6B7280] max-w-md mx-auto">
                Please connect your Web3 wallet using the navigation interface to query your dynamic credit profile and trust standing.
              </p>
            </div>
          </div>
        ) : loading ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="border border-[#FF4D6A] bg-[#FF4D6A]/5 rounded-sm p-6 flex flex-col md:flex-row items-center gap-4">
            <div className="font-mono text-xs tracking-[0.12em] uppercase text-[#FF4D6A] border border-[#FF4D6A] px-2 py-0.5 rounded-sm shrink-0">
              Error
            </div>
            <p className="font-sans text-sm text-[#E8E6DE]/90">
              {error}
            </p>
          </div>
        ) : !profile ? null : (
          <div className="space-y-10 rise-in">
            {/* Top Summaries grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-[#0B0E14]/50 border border-[#2A3142]/45 rounded-sm p-5">
                <span className="font-mono text-[9px] tracking-[0.08em] text-[#6B7280] uppercase">
                  Successful Repayments
                </span>
                <div className="font-display text-3xl font-semibold mt-1">
                  {profile.successful_loans}{" "}
                  <span className="font-sans text-xs text-[#6B7280] font-normal">
                    {profile.successful_loans === 1 ? "Loan" : "Loans"}
                  </span>
                </div>
              </div>

              <div className="bg-[#0B0E14]/50 border border-[#2A3142]/45 rounded-sm p-5">
                <span className="font-mono text-[9px] tracking-[0.08em] text-[#6B7280] uppercase">
                  Timely Settlements
                </span>
                <div className="font-display text-3xl font-semibold mt-1 text-[#3DDC97]">
                  {profile.repaid_on_time}{" "}
                  <span className="font-sans text-xs text-[#6B7280] font-normal">
                    {profile.repaid_on_time === 1 ? "Record" : "Records"}
                  </span>
                </div>
              </div>

              <div className="bg-[#0B0E14]/50 border border-[#2A3142]/45 rounded-sm p-5">
                <span className="font-mono text-[9px] tracking-[0.08em] text-[#6B7280] uppercase">
                  Late Payments & Overdues
                </span>
                <div className={`font-display text-3xl font-semibold mt-1 ${
                  profile.late_payments > 0 ? "text-[#FF4D6A]" : "text-[#E8E6DE]"
                }`}>
                  {profile.late_payments}{" "}
                  <span className="font-sans text-xs text-[#6B7280] font-normal">
                    {profile.late_payments === 1 ? "Violation" : "Violations"}
                  </span>
                </div>
              </div>
            </div>

            {/* Core reputation widgets layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Trust standing */}
              <div className="space-y-6">
                <TrustScoreCard
                  trustScore={profile.trust_score}
                  rating={profile.rating}
                  protocolConfidence={profile.protocol_confidence}
                />
                
                <ProtocolTrustMeter confidenceScore={profile.protocol_confidence} />
              </div>

              {/* Right Column: Score trends & explanations */}
              <div className="space-y-6">
                <ScoreEvolutionChart scoreHistory={profile.score_history} />

                {/* AI Underwriter Explanation */}
                <Card className="border-[#2A3142] bg-[#1A1F2B]/40 text-[#E8E6DE] p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#2A3142]/40">
                    <span className="inline-block w-1.5 h-3 bg-[#00E5FF] rounded-sm" />
                    <h4 className="font-mono text-xs tracking-[0.1em] text-[#E8E6DE] uppercase">
                      Reputation AI Summary Analysis
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <p className="font-sans text-sm text-[#E8E6DE]/90 leading-relaxed font-semibold italic">
                      "{profile.behavior_summary}"
                    </p>
                    <p className="font-sans text-xs text-[#6B7280] leading-relaxed">
                      This summary is generated by Credence's underwriting engine, which continuously parses on-chain transactions, repayment dates, and wallet liquidity parameters. Timely repayments strengthen this assessment and unlock preferential borrowing terms.
                    </p>
                  </div>
                </Card>

                {/* Score Breakdown Component */}
                <ScoreBreakdown wallet={wallet} />
              </div>
            </div>

            {/* Bottom Timeline Section */}
            <div className="pt-4">
              <ReputationTimeline events={profile.events} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
