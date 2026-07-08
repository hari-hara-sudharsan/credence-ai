"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    // In a real app: API.get("/api/network/leaderboard")
    setLeaders([
      { rank: 1, wallet: "0x12...3456", score: 950 },
      { rank: 2, wallet: "0x45...6789", score: 910 },
      { rank: 3, wallet: "0xab...cdef", score: 885 },
      { rank: 4, wallet: "0x99...8877", score: 860 },
      { rank: 5, wallet: "0x55...4433", score: 845 }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-[#E0E0E0] font-mono selection:bg-[#00FF00] selection:text-black pb-20">
      <nav className="border-b border-[#333333] p-4 flex justify-between items-center bg-[#050505]">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-[#00FF00] font-bold text-xl tracking-tighter hover:text-white transition-colors">
            CREDENCE
          </Link>
          <span className="text-[#666666]">/</span>
          <Link href="/network" className="text-white font-medium hover:text-[#00FF00] transition-colors">
            Trust Network
          </Link>
          <span className="text-[#666666]">/</span>
          <span className="text-white font-medium">Leaderboard</span>
        </div>
      </nav>

      <main className="p-8 max-w-4xl mx-auto space-y-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-4">
            <Trophy className="text-[#EAB308]" size={36} /> Top Trusted Wallets
          </h1>
          <p className="text-gray-400 mt-4">
            The most reputable actors across the HashKey Chain. Addresses are censored for privacy.
          </p>
        </div>

        <div className="bg-[#111] border border-[#333] rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#050505] border-b border-[#333]">
              <tr>
                <th className="p-4 font-bold text-gray-400">Rank</th>
                <th className="p-4 font-bold text-gray-400">Wallet</th>
                <th className="p-4 font-bold text-gray-400">Trust Score</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((user) => (
                <tr key={user.rank} className="border-b border-[#333] hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4">
                    <span className={`
                      font-bold text-lg
                      ${user.rank === 1 ? 'text-[#EAB308]' : ''}
                      ${user.rank === 2 ? 'text-gray-300' : ''}
                      ${user.rank === 3 ? 'text-amber-600' : ''}
                    `}>
                      #{user.rank}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-white">{user.wallet}</td>
                  <td className="p-4 text-[#00FF00] font-bold text-xl">{user.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
