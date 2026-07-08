"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  ShieldCheck, 
  Briefcase, 
  DollarSign, 
  Network 
} from "lucide-react";

export default function TrustNetworkDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [protocols, setProtocols] = useState<any>(null);

  useEffect(() => {
    // In a real app we would fetch from API:
    // API.get("/api/network/stats")
    // For the demo we simulate the API response from our mock DB
    setStats({
      identities: 1284,
      trustProofs: 9421,
      settlements: 3892,
      capitalUnlocked: 2400000,
      avgCollateralReduction: 68
    });

    setActivity([
      { event: "HSP Settlement", wallet: "0x23...89", impact: "+35" },
      { event: "Loan Repaid", wallet: "0xab...90", impact: "+60" },
      { event: "Protocol Trust Verification", wallet: "0x12...34", impact: "+10" },
      { event: "RWA Credit Granted", wallet: "0x77...11", impact: "+50" },
    ]);

    setProtocols({
      lending: "ACTIVE",
      payfi: "ACTIVE",
      rwa: "ACTIVE"
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-[#E0E0E0] font-mono selection:bg-[#00FF00] selection:text-black pb-20">
      <nav className="border-b border-[#333333] p-4 flex justify-between items-center bg-[#050505]">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-[#00FF00] font-bold text-xl tracking-tighter hover:text-white transition-colors">
            CREDENCE
          </Link>
          <span className="text-[#666666]">/</span>
          <span className="text-white font-medium">Trust Network</span>
        </div>
        <div className="flex space-x-4">
          <Link href="/network/leaderboard" className="text-sm hover:text-[#00FF00] transition-colors border border-[#333] px-3 py-1 rounded">
            Leaderboard
          </Link>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Credence Trust Network</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Live verifiable metrics across the HashKey ecosystem.
          </p>
          <div className="mt-4 p-4 border border-[#00FF00] bg-[#00FF00]/10 text-[#00FF00] rounded-lg max-w-2xl mx-auto font-sans text-sm">
            <strong>AI Insight:</strong> Credence has reduced average collateral requirements by {stats?.avgCollateralReduction || 0}% while maintaining low risk scores across the ecosystem.
          </div>
        </div>

        {/* Top Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#111] border border-[#333] p-6 rounded-md hover:border-[#00FF00] transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Users size={18} className="text-[#00FF00]" />
                <h3 className="text-gray-400 text-sm">Verified Financial Identities</h3>
              </div>
              <div className="text-3xl font-bold text-white">
                {stats.identities.toLocaleString()}
              </div>
            </div>

            <div className="bg-[#111] border border-[#333] p-6 rounded-md hover:border-[#00FF00] transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={18} className="text-[#00FF00]" />
                <h3 className="text-gray-400 text-sm">Proof-of-Trust Events</h3>
              </div>
              <div className="text-3xl font-bold text-white">
                {stats.trustProofs.toLocaleString()}
              </div>
            </div>

            <div className="bg-[#111] border border-[#333] p-6 rounded-md hover:border-[#00FF00] transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase size={18} className="text-[#00FF00]" />
                <h3 className="text-gray-400 text-sm">HSP Settlement Volume</h3>
              </div>
              <div className="text-3xl font-bold text-white">
                {stats.settlements.toLocaleString()}
              </div>
            </div>

            <div className="bg-[#111] border border-[#333] p-6 rounded-md hover:border-[#00FF00] transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={18} className="text-[#00FF00]" />
                <h3 className="text-gray-400 text-sm">Capital Unlocked</h3>
              </div>
              <div className="text-3xl font-bold text-white">
                ${(stats.capitalUnlocked / 1000000).toFixed(1)}M
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Live Activity Feed */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Network className="text-[#00FF00]" size={24} /> Real-Time Trust Activity
            </h2>
            <div className="space-y-4">
              {activity.map((act, i) => (
                <div key={i} className="flex justify-between items-center bg-[#111] border border-[#333] p-4 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#00FF00] rounded-full animate-pulse" />
                    <div>
                      <div className="text-sm text-gray-400">Wallet {act.wallet}</div>
                      <div className="font-bold text-white">{act.event}</div>
                    </div>
                  </div>
                  <div className="text-[#00FF00] font-bold bg-[#00FF00]/10 px-3 py-1 rounded">
                    {act.impact} Trust
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Protocols Using Credence */}
          <div>
            <h2 className="text-2xl font-bold mb-6 border-b border-[#333] pb-2">
              Protocols Using Credence
            </h2>
            {protocols && (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border border-[#333] rounded bg-black">
                  <div className="font-bold text-lg">DeFi Lending</div>
                  <div className="text-[#00FF00] text-sm font-bold tracking-widest">{protocols.lending}</div>
                </div>
                <div className="flex justify-between items-center p-4 border border-[#333] rounded bg-black">
                  <div className="font-bold text-lg">PayFi Checkout</div>
                  <div className="text-[#00FF00] text-sm font-bold tracking-widest">{protocols.payfi}</div>
                </div>
                <div className="flex justify-between items-center p-4 border border-[#333] rounded bg-black">
                  <div className="font-bold text-lg">RWA Tokenization</div>
                  <div className="text-[#00FF00] text-sm font-bold tracking-widest">{protocols.rwa}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
