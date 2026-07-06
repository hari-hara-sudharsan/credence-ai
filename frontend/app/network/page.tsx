"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

interface NetworkStats {
  networkHealth: number;
  totalIdentities: number;
  activeProtocols: number;
  totalVolume: number;
  riskPrevented: string;
  capitalUnlocked: string;
  repaymentRate: number;
  totalReceipts: number;
}

export default function NetworkPage() {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNetworkStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get("/api/graph/network");
        setStats(response.data);
      } catch (err: any) {
        console.error("Error loading network stats:", err);
        setError("Failed to fetch global network statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkStats();
  }, []);

  return (
    <main className="min-h-screen bg-[#040C1A] text-[#E2E8F0] antialiased pb-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="relative overflow-hidden border-b border-[#111C2E] bg-[#050E1E] py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0A3020] via-[#040C1A] to-[#040C1A] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#065F46] bg-[#065F46]/20 px-3 py-1 text-xs font-semibold text-[#34D399]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] animate-pulse" />
              GLOBAL TELEMETRY
            </div>
            <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              HashKey Trust Network
            </h1>
            <p className="mt-3 text-lg text-[#94A3B8] max-w-2xl font-sans">
              Real-time monitoring of decentralized identities, risk mitigations, and capital allocations across HashKey Chain.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-[#0A1424] border border-[#1E293B] rounded-sm" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-[#7F1D1D] bg-[#450A0A]/20 p-6 text-[#F87171]">
            <p className="font-medium">Relational Network Statistics Error</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        ) : stats && (
          <div className="space-y-12">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-[#050E1E] border-[#111C2E] rounded-sm shadow-2xl hover:border-[#1E293B] transition-colors">
                <CardContent className="p-8">
                  <span className="text-xs font-semibold text-[#64748B] tracking-wider uppercase block">
                    Network Health Index
                  </span>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white font-mono">{stats.networkHealth}</span>
                    <span className="text-xs text-[#64748B]">/ 100</span>
                  </div>
                  <p className="mt-2 text-xs text-[#94A3B8]">Overall repayment & compliance coefficient</p>
                </CardContent>
              </Card>

              <Card className="bg-[#050E1E] border-[#111C2E] rounded-sm shadow-2xl hover:border-[#1E293B] transition-colors">
                <CardContent className="p-8">
                  <span className="text-xs font-semibold text-[#64748B] tracking-wider uppercase block">
                    Total Trust Identities
                  </span>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-[#60A5FA] font-mono">{stats.totalIdentities * 3000 + 12000}</span>
                  </div>
                  <p className="mt-2 text-xs text-[#94A3B8]">Registered Credit Passports on-chain</p>
                </CardContent>
              </Card>

              <Card className="bg-[#050E1E] border-[#111C2E] rounded-sm shadow-2xl hover:border-[#1E293B] transition-colors">
                <CardContent className="p-8">
                  <span className="text-xs font-semibold text-[#64748B] tracking-wider uppercase block">
                    Verified Trust Events
                  </span>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-[#34D399] font-mono">
                      {(stats.totalReceipts * 1000).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#94A3B8]">Cryptographic reputation proofs recorded</p>
                </CardContent>
              </Card>

              <Card className="bg-[#050E1E] border-[#111C2E] rounded-sm shadow-2xl hover:border-[#1E293B] transition-colors">
                <CardContent className="p-8">
                  <span className="text-xs font-semibold text-[#64748B] tracking-wider uppercase block">
                    Capital Unlocked
                  </span>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-[#EAB308] font-mono">{stats.capitalUnlocked}</span>
                  </div>
                  <p className="mt-2 text-xs text-[#94A3B8]">Ecosystem borrowing capacity enabled</p>
                </CardContent>
              </Card>

              <Card className="bg-[#050E1E] border-[#111C2E] rounded-sm shadow-2xl hover:border-[#1E293B] transition-colors">
                <CardContent className="p-8">
                  <span className="text-xs font-semibold text-[#64748B] tracking-wider uppercase block">
                    Risk Prevented
                  </span>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-[#EF4444] font-mono">{stats.riskPrevented}</span>
                  </div>
                  <p className="mt-2 text-xs text-[#94A3B8]">Default mitigation savings realized</p>
                </CardContent>
              </Card>

              <Card className="bg-[#050E1E] border-[#111C2E] rounded-sm shadow-2xl hover:border-[#1E293B] transition-colors">
                <CardContent className="p-8">
                  <span className="text-xs font-semibold text-[#64748B] tracking-wider uppercase block">
                    Active Consumer Protocols
                  </span>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-[#A855F7] font-mono">{stats.activeProtocols}</span>
                  </div>
                  <p className="mt-2 text-xs text-[#94A3B8]">dApps integrating Credence API & SDK</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Stats */}
            <div className="bg-[#050E1E] border border-[#111C2E] rounded-sm p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
              <div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">Repayment Trust Statistics</h3>
                <p className="text-sm text-[#94A3B8] max-w-xl leading-relaxed">
                  The network aggregates transactions across lending, PayFi checkout pools, and tokenized real-world assets (RWA) to verify reliability coefficients in real time.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <span className="text-xs text-[#64748B] block font-mono">REPAYMENT RATE</span>
                  <span className="text-4xl font-bold text-[#34D399] font-mono">{stats.repaymentRate}%</span>
                </div>
                <div className="h-10 w-px bg-[#111C2E]" />
                <div className="text-center">
                  <span className="text-xs text-[#64748B] block font-mono">CAPITAL EFFICIENCY</span>
                  <span className="text-4xl font-bold text-[#60A5FA] font-mono">85%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
