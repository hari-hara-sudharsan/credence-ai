"use client";

import { useState } from "react";
import API from "@/lib/api";

export default function ProtocolModelsPage() {
  const [wallet, setWallet] = useState("");
  const [data, setData] = useState<any>(null);

  const analyze = async () => {
    const res = await API.post("/protocol-models", { wallet });
    setData(res.data);
  };

  return (
    <main className="max-w-6xl mx-auto p-8">
      <h1 className="text-5xl font-bold mb-8">
        Multi-Protocol Risk Models
      </h1>
      <div className="flex gap-4">
        <input
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          className="border border-gray-700 bg-transparent text-white p-3 flex-1 rounded"
          placeholder="Wallet"
        />
        <button
          onClick={analyze}
          className="border border-gray-700 bg-gray-800 hover:bg-gray-700 transition px-6 rounded font-semibold"
        >
          Analyze
        </button>
      </div>
      {data && (
        <pre className="mt-8 border border-gray-800 p-6 rounded bg-[#0A101C] text-gray-300 overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  );
}
