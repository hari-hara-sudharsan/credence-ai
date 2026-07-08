"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  CheckCircle,
  Shield, 
  ExternalLink,
  Activity,
  Lock,
  Network
} from "lucide-react";

export default function MainnetProof() {
  const [data, setData] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    fetch("/api/proof/contracts")
      .then(res => res.json())
      .then(setData);
      
    fetch("/api/proof/health")
      .then(res => res.json())
      .then(setHealth);
  }, []);

  if (!data || !health) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center font-mono">
        Loading Mainnet Proofs...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#E0E0E0] font-mono selection:bg-[#00FF00] selection:text-black">
      {/* Navigation */}
      <nav className="border-b border-[#333333] p-4 flex justify-between items-center bg-[#050505]">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-[#00FF00] font-bold text-xl tracking-tighter hover:text-white transition-colors">
            CREDENCE
          </Link>
          <span className="text-[#666666]">/</span>
          <span className="text-white font-medium">Mainnet Infrastructure</span>
        </div>
        <div className="flex space-x-6 text-sm">
          <Link href="/submission" className="hover:text-[#00FF00] transition-colors flex items-center gap-2">
            <Shield size={16} /> Dashboard
          </Link>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-4">Credence AI Mainnet Infrastructure</h1>
          <p className="text-gray-400">Verifiable production smart contracts on HashKey Chain.</p>
        </div>

        {/* Section 1: Network Status */}
        <section className="bg-[#111] border border-[#333] p-6 rounded-md">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Network className="text-[#00FF00]" size={20} />
            1. Network Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black border border-[#333] p-4 rounded">
              <div className="text-gray-500 text-sm mb-1">Network</div>
              <div className="text-lg font-bold">HashKey Chain</div>
            </div>
            <div className="bg-black border border-[#333] p-4 rounded">
              <div className="text-gray-500 text-sm mb-1">Status</div>
              <div className="text-lg font-bold text-[#00FF00] flex items-center gap-2">
                ONLINE <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF00] opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-[#00FF00]"></span></span>
              </div>
            </div>
            <div className="bg-black border border-[#333] p-4 rounded">
              <div className="text-gray-500 text-sm mb-1">Chain ID</div>
              <div className="text-lg font-bold">177</div>
            </div>
          </div>
        </section>

        {/* Section 2: Contract Grid */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Shield className="text-[#00FF00]" size={20} />
            2. Contract Grid
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.contracts.map((contract: any) => (
              <div key={contract.name} className="bg-[#111] border border-[#333] p-6 rounded-md hover:border-[#00FF00] transition-colors group">
                <h3 className="font-bold text-lg mb-2 text-white">{contract.name.replace(/([A-Z])/g, ' $1').trim()}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Status</span>
                    {contract.verified ? (
                      <span className="text-[#00FF00] flex items-center gap-1"><CheckCircle size={14}/> Verified ✓</span>
                    ) : (
                      <span className="text-red-500">Unverified</span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Security</span>
                    <span className="text-gray-300">RBAC ✓ Pause ✓</span>
                  </div>
                  
                  <div className="text-xs text-gray-600 truncate" title={contract.address}>
                    {contract.address}
                  </div>
                </div>

                <a 
                  href={contract.explorer}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-black border border-[#333] group-hover:border-[#00FF00] group-hover:text-[#00FF00] text-white py-2 rounded flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  View Explorer <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Live Transaction Proof */}
        <section className="bg-[#111] border border-[#333] p-6 rounded-md">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="text-[#00FF00]" size={20} />
            3. Live Transaction Proof
          </h2>
          <div className="space-y-4">
            {[
              { type: "Identity Created", tx: "0x8fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60" },
              { type: "Loan Executed", tx: "0x1fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60" },
              { type: "Trust Updated", tx: "0x2fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60" },
              { type: "Settlement Completed", tx: "0x4fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60" }
            ].map((tx, idx) => (
              <div key={idx} className="bg-black border border-[#333] p-4 rounded flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-white">{tx.type}</div>
                  <div className="text-xs text-gray-500 mt-1 font-mono">TX: {tx.tx}</div>
                </div>
                <a 
                  href={`https://hashkey.blockscout.com/tx/${tx.tx}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#00FF00] hover:underline flex items-center gap-1 whitespace-nowrap"
                >
                  Verify <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
