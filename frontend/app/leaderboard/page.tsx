"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function LeaderboardPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    API.get("/leaderboard")
      .then((res) => setData(res.data));
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-8">
      <h1 className="text-5xl font-bold mb-8">
        Top Credit Wallets
      </h1>
      <div className="space-y-4">
        {data.map((wallet) => (
          <div
            key={wallet.wallet}
            className="border p-4 rounded bg-[#0A101C] border-gray-800"
          >
            <div className="text-xl font-semibold text-white mb-2">
              Rank #{wallet.rank}
            </div>
            <div className="text-gray-300">
              <span className="font-semibold text-gray-400">Wallet:</span> {wallet.wallet}
            </div>
            <div className="text-gray-300">
              <span className="font-semibold text-gray-400">Score:</span> {wallet.score}
            </div>
            <div className="text-gray-300">
              <span className="font-semibold text-gray-400">Segment:</span> {wallet.segment}
            </div>
            <div className="text-gray-300">
              <span className="font-semibold text-gray-400">Badges:</span> {wallet.badges ? wallet.badges.join(", ") : ""}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
