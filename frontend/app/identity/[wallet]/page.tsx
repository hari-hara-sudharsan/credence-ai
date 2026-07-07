"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/api";

interface FinancialDNA {
  trust: number;
  credit: number;
  reliability: number;
  risk: number;
  activity: number;
}

interface TimelineEvent {
  event: string;
  impact: string;
  reason: string;
  timestamp: string;
}

interface IdentityData {
  wallet: string;
  type: string;
  confidence: number;
  tier: string;
  passportStatus: string;
  passportId: number;
  recommendation: string;
  financialDNA: FinancialDNA;
  timeline: TimelineEvent[];
}

export default function IdentityPage() {
  const params = useParams();
  const router = useRouter();
  const wallet = typeof params.wallet === "string" ? params.wallet : "";

  const [data, setData] = useState<IdentityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wallet) return;

    const fetchIdentity = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get(`/api/trust/identity/${wallet}`);
        setData(response.data);
      } catch (err) {
        console.error("Error fetching identity data:", err);
        setError("Failed to query ecosystem trust identity memory.");
      } finally {
        setLoading(false);
      }
    };

    fetchIdentity();
  }, [wallet]);

  // DNA percentages helper
  const getDnaPercent = (key: keyof FinancialDNA, val: number) => {
    if (key === "trust" || key === "credit" || key === "reliability") {
      // Out of 1000
      return Math.round(val / 10);
    }
    // Out of 100
    return Math.round(val);
  };

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
        
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => router.back()}
          className="font-mono text-xs text-[#00E5FF] hover:text-[#00c8dd] mb-8 flex items-center gap-1 bg-transparent border-none cursor-pointer"
        >
          ← Go back
        </button>

        {/* Title Block */}
        <div className="mb-10">
          <div className="font-mono text-[10px] tracking-[0.2em] text-[#4A6080] uppercase mb-2">
            Credence Trust OS identity Registry
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight mb-3">
            Universal Financial Identity
          </h1>
          <p className="text-[#64748B] max-w-xl text-sm sm:text-base">
            Dynamic on-chain record combining credit history, reputation metrics, neural underwriting, and entity type verification.
          </p>
        </div>

        {loading ? (
          <div className="font-mono text-xs text-[#64748B] py-20 text-center">
            CONSOLIDATING DYNAMIC FINANCIAL MEMORY GRAPH...
          </div>
        ) : error || !data ? (
          <div className="border border-[#FF4D6A]/30 bg-[#FF4D6A]/5 rounded-xl p-6 text-center text-[#FF4D6A] font-mono text-sm">
            {error || "Ecosystem identity record not found for this wallet."}
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Identity Container Overview Card */}
            <div className="bg-[#080F1E] border border-[#111C2E] rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-[#111C2E] mb-6">
                <div>
                  <div className="font-mono text-[10px] text-[#64748B] uppercase mb-1">
                    ENTITY IDENTIFIER
                  </div>
                  <div className="font-mono text-sm sm:text-base text-[#E2E8F0] select-all break-all">
                    {data.wallet}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-[#0A1425] border border-[#111C2E] px-4 py-2 rounded-xl">
                    <div className="font-mono text-[9px] text-[#64748B] uppercase mb-0.5">
                      CLASSIFICATION
                    </div>
                    <div className="text-sm font-bold text-[#00E5FF] tracking-wide">
                      {data.type} ({data.confidence}%)
                    </div>
                  </div>

                  <div className="bg-[#0A1425] border border-[#111C2E] px-4 py-2 rounded-xl">
                    <div className="font-mono text-[9px] text-[#64748B] uppercase mb-0.5">
                      TRUST TIER
                    </div>
                    <div className="text-sm font-bold text-[#34D399] tracking-wide">
                      {data.tier}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
                <div>
                  <span className="text-[#64748B]">PASSPORT V2 STATUS: </span>
                  <span className="text-[#34D399] font-bold">{data.passportStatus}</span>
                </div>
                <div className="md:text-right">
                  <span className="text-[#64748B]">SUGGESTION: </span>
                  <span className="text-[#E2E8F0] font-bold">{data.recommendation}</span>
                </div>
              </div>
            </div>

            {/* Financial DNA Section */}
            <div className="bg-[#080F1E] border border-[#111C2E] rounded-2xl p-6 sm:p-8 shadow-xl">
              <h2 className="font-display text-xl font-bold mb-6 text-[#E2E8F0]">
                Financial DNA Profile
              </h2>

              <div className="space-y-6">
                {(Object.keys(data.financialDNA) as Array<keyof FinancialDNA>).map((key) => {
                  const val = data.financialDNA[key];
                  const percent = getDnaPercent(key, val);
                  
                  // Color styling based on metric
                  let barColor = "#00E5FF"; // cyan
                  if (key === "risk") barColor = "#FF4D6A"; // red
                  if (key === "trust") barColor = "#34D399"; // green
                  if (key === "reliability") barColor = "#FFB830"; // gold

                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="uppercase tracking-wider text-[#64748B]">
                          {key}
                        </span>
                        <span className="text-[#E2E8F0] font-bold">
                          {val} {key === "risk" || key === "activity" ? "%" : "/ 1000"}
                        </span>
                      </div>
                      
                      {/* Custom bar matching request: trust ██████████ 92% */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 bg-[#0A1425] border border-[#111C2E] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: barColor,
                              boxShadow: `0 0 12px ${barColor}55`,
                            }}
                          />
                        </div>
                        <span className="font-mono text-xs text-[#64748B] w-8 text-right">
                          {percent}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Identity Timeline */}
            <div className="bg-[#080F1E] border border-[#111C2E] rounded-2xl p-6 sm:p-8 shadow-xl">
              <h2 className="font-display text-xl font-bold mb-6 text-[#E2E8F0]">
                Identity Timeline
              </h2>

              <div className="relative border-l-2 border-[#111C2E] ml-4 pl-6 space-y-8 font-mono">
                {data.timeline.map((event, i) => (
                  <div key={i} className="relative">
                    {/* Event node */}
                    <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#00E5FF] bg-[#040C1A]" />
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 mb-1">
                      <div className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wide">
                        {event.event.replace("_", " ")}
                      </div>
                      <div className="text-[10px] text-[#4A6080]">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <p className="text-xs text-[#94A3B8] m-0 mb-2 leading-relaxed">
                      {event.reason}
                    </p>

                    <span className="text-[10px] font-bold text-[#34D399] bg-[#34D399]/10 px-2 py-0.5 rounded-md">
                      Impact: {event.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
