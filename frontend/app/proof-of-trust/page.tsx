"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Shield, 
  ArrowDown, 
  CheckCircle,
  Activity,
  Database,
  Search
} from "lucide-react";

export default function ProofOfTrustCenter() {
  const [proofs, setProofs] = useState<any[]>([]);

  useEffect(() => {
    // Generate some mock proofs for the UI to demonstrate the flow
    setProofs([
      { type: "HSP Settlement", impact: "+45", verified: true, hash: "0x8fa...3e60", id: "POT-1001" },
      { type: "Loan Repayment", impact: "+60", verified: true, hash: "0x1fa...3e60", id: "POT-1002" },
      { type: "Protocol Verification", impact: "+10", verified: true, hash: "0x2fa...3e60", id: "POT-1003" }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-[#E0E0E0] font-mono selection:bg-[#00FF00] selection:text-black">
      {/* Navigation */}
      <nav className="border-b border-[#333333] p-4 flex justify-between items-center bg-[#050505]">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-[#00FF00] font-bold text-xl tracking-tighter hover:text-white transition-colors">
            CREDENCE
          </Link>
          <span className="text-[#666666]">/</span>
          <span className="text-white font-medium">Proof-of-Trust (PoT)</span>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Credence Proof-of-Trust</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The cryptographic primitive that transforms verified financial behavior into reusable reputation.
          </p>
        </div>

        {/* The Timeline */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#111] border border-[#333] rounded-lg p-8 relative">
            <h2 className="text-2xl font-bold mb-8 text-center border-b border-[#333] pb-4">Verification Mechanism</h2>
            
            <div className="space-y-6 text-center">
              <div className="p-4 bg-black border border-[#333] rounded mx-auto w-64">
                <div className="font-bold">Financial Action</div>
                <div className="text-xs text-gray-500">(e.g. HSP Settlement)</div>
              </div>
              
              <div className="flex justify-center text-[#00FF00]"><ArrowDown size={24} /></div>
              
              <div className="p-4 bg-black border border-[#00FF00] rounded mx-auto w-64 text-[#00FF00] flex items-center justify-center gap-2">
                <Shield size={18} /> Proof Created ✓
              </div>

              <div className="flex justify-center text-[#00FF00]"><ArrowDown size={24} /></div>
              
              <div className="p-4 bg-black border border-[#00FF00] rounded mx-auto w-64 text-[#00FF00] flex items-center justify-center gap-2">
                <Database size={18} /> Oracle Verified ✓
              </div>

              <div className="flex justify-center text-[#00FF00]"><ArrowDown size={24} /></div>
              
              <div className="p-4 bg-black border border-[#00FF00] rounded mx-auto w-64 text-[#00FF00] flex items-center justify-center gap-2">
                <Activity size={18} /> Trust Increased ✓
              </div>
            </div>
          </div>
        </div>

        {/* Recent Proofs */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Search className="text-[#00FF00]" size={24} /> Recent Earned Proofs
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proofs.map((proof, idx) => (
              <div key={idx} className="bg-[#111] border border-[#333] p-6 rounded-md hover:border-[#00FF00] transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xs text-[#00FF00] mb-1">{proof.id}</div>
                    <h3 className="font-bold text-lg text-white">{proof.type}</h3>
                  </div>
                  <div className="bg-[#00FF00]/10 text-[#00FF00] px-3 py-1 rounded text-sm font-bold">
                    {proof.impact}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm mt-6 pt-4 border-t border-[#333]">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hash:</span>
                    <span className="text-gray-300">{proof.hash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Verification:</span>
                    <span className="text-[#00FF00] flex items-center gap-1">
                      <CheckCircle size={14}/> ON-CHAIN
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
