"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function MarketplacePage() {
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState(1000);
  const [purpose, setPurpose] = useState("");
  const [listings, setListings] = useState<any[]>([]);

  const refresh = async () => {
    const res = await API.get("/marketplace/listings");
    setListings(res.data);
  };

  useEffect(() => {
    refresh();
  }, []);

  const createRequest = async () => {
    await API.post("/marketplace/request", {
      wallet,
      loan_amount: amount,
      purpose,
    });
    refresh();
  };

  return (
    <main className="max-w-6xl mx-auto p-8">
      <h1 className="text-5xl font-bold mb-8">
        Lending Marketplace
      </h1>
      <div className="space-y-4 mb-8">
        <input
          placeholder="Wallet"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          className="border p-2 w-full bg-transparent border-gray-700 text-white rounded"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border p-2 w-full bg-transparent border-gray-700 text-white rounded"
        />
        <input
          placeholder="Purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="border p-2 w-full bg-transparent border-gray-700 text-white rounded"
        />
        <button
          onClick={createRequest}
          className="border px-6 py-2 border-gray-700 bg-gray-800 hover:bg-gray-700 transition rounded font-semibold text-white"
        >
          Request Loan
        </button>
      </div>

      <div className="space-y-4">
        {listings.map((listing, idx) => (
          <div key={idx} className="border p-4 rounded bg-[#0A101C] border-gray-800 text-gray-300">
            <div className="text-xl font-bold text-white mb-2">Loan Request: {listing.loan_amount} HSK</div>
            <div><span className="font-semibold text-gray-400">Wallet:</span> {listing.wallet}</div>
            <div><span className="font-semibold text-gray-400">Score:</span> {listing.credit_score}</div>
            <div><span className="font-semibold text-gray-400">Segment:</span> {listing.segment}</div>
            <div><span className="font-semibold text-gray-400">Interest:</span> {listing.interest_rate}%</div>
            <div><span className="font-semibold text-gray-400">Purpose:</span> {listing.purpose}</div>
            <div><span className="font-semibold text-gray-400">Badges:</span> {listing.badges ? listing.badges.join(", ") : ""}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
