"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/api";

interface Receipt {
  event: string;
  impact: string;
  verified: boolean;
  hash: string;
  timestamp: string;
}

export default function TrustReceiptsPage() {
  const params = useParams();
  const router = useRouter();
  const wallet = typeof params.wallet === "string" ? params.wallet : "";

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wallet) return;

    const fetchReceipts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get(`/trust/receipts/${wallet}`);
        setReceipts(response.data);
      } catch (err) {
        console.error("Error fetching receipts timeline:", err);
        setError("Failed to fetch verifiable trust receipts timeline.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [wallet]);

  return (
    <main
      className="min-h-screen bg-[#040C1A] text-[#E2E8F0] antialiased"
      style={{ fontFamily: "Inter, sans-serif", padding: "60px 0 100px" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="font-mono text-xs text-[#00E5FF] hover:text-[#00c8dd] mb-8 flex items-center gap-1 bg-transparent border-none cursor-pointer"
        >
          ← Go back
        </button>

        {/* Header Section */}
        <div className="mb-12">
          <div className="font-mono text-[10px] tracking-[0.25em] text-[#4A6080] uppercase mb-2">
            Verifiable Trust Receipt Layer
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight mb-4">
            Ecosystem Trust Timeline
          </h1>
          <p className="text-[#64748B] max-w-xl text-sm sm:text-base">
            Every score progression and reputation update is validated by a signed cryptographic receipt registered directly on the HashKey Chain.
          </p>
        </div>

        {loading ? (
          <div className="font-mono text-xs text-[#64748B] py-20 text-center">
            QUERYING TRUST MEMORY REGISTRY FROM CANCUN ETHERS RPC...
          </div>
        ) : error ? (
          <div className="border border-[#FF4D6A]/30 bg-[#FF4D6A]/5 rounded-xl p-6 text-center text-[#FF4D6A] font-mono text-sm">
            {error}
          </div>
        ) : receipts.length === 0 ? (
          <div className="border border-[#111C2E] bg-[#080F1E] rounded-2xl p-10 text-center text-[#64748B] font-mono text-sm">
            No verifiable receipts recorded yet for this entity.
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Wallet Address Label */}
            <div className="bg-[#080F1E] border border-[#111C2E] px-6 py-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-[#64748B] block mb-1">AUDIT ADDRESS</span>
                <span className="font-mono text-sm text-[#E2E8F0] select-all break-all">{wallet}</span>
              </div>
              <div className="bg-[#34D399]/10 text-[#34D399] font-mono text-xs px-3 py-1.5 rounded-lg border border-[#34D399]/20 font-bold">
                {receipts.length} VERIFIED RECEIPTS
              </div>
            </div>

            {/* Receipts vertical timeline */}
            <div className="relative border-l border-[#111C2E] ml-4 pl-8 space-y-6">
              {receipts.map((r, i) => {
                const isPositive = !r.impact.startsWith("-");
                const impactColor = isPositive ? "#34D399" : "#FF4D6A";
                
                return (
                  <div key={i} className="relative">
                    {/* Node Dot */}
                    <span
                      className="absolute -left-[37px] top-4 w-4 h-4 rounded-full border-2 bg-[#040C1A]"
                      style={{ borderColor: impactColor }}
                    />

                    {/* Receipt Card */}
                    <div className="bg-[#080F1E] border border-[#111C2E] rounded-xl p-6 hover:border-[#00E5FF]/20 transition-all duration-300 shadow-md">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div>
                          <span className="font-mono text-[9px] text-[#4A6080] block mb-0.5">ACTION EVENT</span>
                          <h3 className="font-sans text-base font-bold text-[#E2E8F0] tracking-wide">
                            {r.event}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3">
                          <div
                            className="font-mono text-sm font-bold px-3 py-1 rounded-md"
                            style={{
                              color: impactColor,
                              backgroundColor: `${impactColor}10`,
                              border: `1px solid ${impactColor}25`
                            }}
                          >
                            Impact: {r.impact}
                          </div>

                          <div className="bg-[#34D399]/10 border border-[#34D399]/20 text-[#34D399] text-[9px] font-mono font-bold px-2 py-1 rounded-md uppercase">
                            {r.verified ? "verified" : "pending"}
                          </div>
                        </div>
                      </div>

                      {/* Timeline Details */}
                      <div className="space-y-3 font-mono text-xs border-t border-[#111C2E] pt-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                          <span className="text-[#64748B]">PROOF HASH:</span>
                          <span className="text-[#A1A1AA] select-all break-all font-mono font-bold">
                            {r.hash}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#64748B]">TIMESTAMP:</span>
                          <span className="text-[#A1A1AA]">
                            {r.timestamp ? new Date(r.timestamp).toLocaleString() : "GENESIS BLOCK"}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
