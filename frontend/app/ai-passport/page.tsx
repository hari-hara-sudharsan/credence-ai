"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Brain, CheckCircle, Hash, Search, ShieldCheck } from "lucide-react";

export default function AIDecisionPassportPage() {
  const [passport, setPassport] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Mock fetching data on load
  useEffect(() => {
    setPassport({
      id: "AI-10291",
      wallet: "0x1234...ABCD",
      decision: "APPROVE_LOAN",
      confidence: 94,
      inputs: {
        walletAge: 90,
        hspHistory: 95,
        repaymentHistory: 88,
        riskScore: 5
      },
      reasoning: [
        "Strong repayment behavior (+180 pts)",
        "Verified HSP settlements (+90 pts)",
        "No manipulation detected"
      ],
      oracle: "Verified ✓",
      hash: "0x8fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60"
    });
    setLoaded(true);
  }, []);

  if (!loaded) return <div className="min-h-screen bg-black text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#000000] text-[#E0E0E0] font-mono selection:bg-[#00FF00] selection:text-black pb-20">
      <nav className="border-b border-[#333333] p-4 flex justify-between items-center bg-[#050505]">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-[#00FF00] font-bold text-xl tracking-tighter hover:text-white transition-colors">
            CREDENCE
          </Link>
          <span className="text-[#666666]">/</span>
          <span className="text-white font-medium">AI Transparency Center</span>
        </div>
      </nav>

      <main className="p-8 max-w-5xl mx-auto space-y-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-4">
            <Brain className="text-[#00FF00]" size={40} /> AI Decision Passport
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Credence makes AI financial decisions transparent, verifiable, and bounded by smart contracts.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto flex gap-2">
          <input 
            type="text" 
            placeholder="Enter AI Decision ID or Wallet..."
            className="flex-1 bg-[#111] border border-[#333] p-3 rounded text-white focus:outline-none focus:border-[#00FF00]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-[#00FF00] text-black px-6 py-3 rounded font-bold hover:bg-white transition-colors flex items-center gap-2">
            <Search size={18} /> Search
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Main Passport Info */}
          <div className="bg-[#111] border border-[#333] rounded-lg p-6">
            <h2 className="text-xl font-bold border-b border-[#333] pb-4 mb-4 flex justify-between">
              <span>Decision: <span className="text-[#00FF00]">{passport.decision}</span></span>
              <span className="text-gray-500 text-sm">{passport.id}</span>
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">AI Confidence Score</span>
                  <span className="text-[#00FF00] font-bold">{passport.confidence}%</span>
                </div>
                <div className="w-full bg-[#333] rounded-full h-2">
                  <div className="bg-[#00FF00] h-2 rounded-full" style={{ width: `${passport.confidence}%` }}></div>
                </div>
              </div>

              <div>
                <h3 className="text-gray-400 text-sm mb-3">Cryptographic Verification</h3>
                <div className="bg-black border border-[#333] p-3 rounded space-y-3 font-mono text-xs">
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={16} className="text-[#00FF00] mt-0.5" />
                    <div>
                      <span className="text-gray-500 block">Oracle Signature</span>
                      <span className="text-[#00FF00]">{passport.oracle}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Hash size={16} className="text-gray-400 mt-0.5" />
                    <div className="overflow-hidden">
                      <span className="text-gray-500 block">On-chain Hash (Keccak256)</span>
                      <span className="text-gray-300 break-all">{passport.hash}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reasoning and Inputs */}
          <div className="bg-[#111] border border-[#333] rounded-lg p-6 flex flex-col">
            <h2 className="text-xl font-bold border-b border-[#333] pb-4 mb-4">
              AI Reasoning Engine
            </h2>
            
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-gray-400 text-sm mb-2">Input Factors</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Repayment History</span>
                    <span className="text-[#00FF00]">{"█".repeat(Math.floor(passport.inputs.repaymentHistory / 10))} {passport.inputs.repaymentHistory}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>HSP Reliability</span>
                    <span className="text-[#00FF00]">{"█".repeat(Math.floor(passport.inputs.hspHistory / 10))} {passport.inputs.hspHistory}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Trust Authenticity (Age)</span>
                    <span className="text-gray-400">{"█".repeat(Math.floor(passport.inputs.walletAge / 10))} {passport.inputs.walletAge}%</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-gray-400 text-sm mb-2">Explainability Output</h3>
                <ul className="space-y-2">
                  {passport.reasoning.map((r: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm bg-[#1a1a1a] p-2 rounded">
                      <CheckCircle size={16} className="text-[#00FF00] mt-0.5 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
