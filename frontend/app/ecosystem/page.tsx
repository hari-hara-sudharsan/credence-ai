"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/context/WalletContext";
import API from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

interface ProtocolOpportunity {
  protocol: string;
  eligibility: number;
  offer: string;
  approved: boolean;
  reason: string;
}

interface AIRecommendation {
  wallet: string;
  qualifications: string[];
  receiptsCount: number;
  recommendation: string;
}

export default function EcosystemPage() {
  const { wallet } = useWallet();
  const [opportunities, setOpportunities] = useState<ProtocolOpportunity[]>([]);
  const [aiRec, setAiRec] = useState<AIRecommendation | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolOpportunity | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wallet) {
      setOpportunities([]);
      setAiRec(null);
      setSelectedProtocol(null);
      return;
    }

    const fetchEcosystemData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [oppRes, recRes] = await Promise.all([
          API.get(`/api/v1/ecosystem/access/${wallet}`), // retrieves general availability
          API.get(`/api/v1/ecosystem/recommend/${wallet}`)
        ]);

        // Synthesize detailed matching cards using the backend matching logic
        const profilesRes = await API.get(`/api/v1/ecosystem/profile/${wallet}`);
        const profiles = profilesRes.data.profiles;

        // Build actual matched data based on profile scores
        const list: ProtocolOpportunity[] = [
          {
            protocol: "Lending",
            eligibility: Math.round((profiles.lending.score / 1000) * 100),
            offer: "Prime Loan (Low Interest)",
            approved: profiles.lending.score >= 550,
            reason: `Wallet credit rating: ${profiles.lending.risk} risk profile.`
          },
          {
            protocol: "Insurance",
            eligibility: Math.round((profiles.insurance.score / 1000) * 100),
            offer: profiles.insurance.score >= 800 ? "30% Premium Discount" : "Reduced Premium",
            approved: profiles.insurance.score >= 500,
            reason: `Risk score qualifies for premium adjustments.`
          },
          {
            protocol: "RWA",
            eligibility: Math.round((profiles.rwa.score / 1000) * 100),
            offer: `Up to ${profiles.rwa.limit.toLocaleString()} HSK limit`,
            approved: rwaApproved(profiles.rwa.score),
            reason: profiles.rwa.verified ? "Verified KYC/On-chain Reputation." : "Standard verification required."
          },
          {
            protocol: "DAO",
            eligibility: Math.round((profiles.dao.score / 1000) * 100),
            offer: "Proposal Creation Rights",
            approved: profiles.dao.score >= 550,
            reason: `Voting reliability is: ${profiles.dao.standing}.`
          },
          {
            protocol: "AI Agents",
            eligibility: Math.round((profiles.agent.score / 1000) * 100),
            offer: `Autonomy limit: ${profiles.agent.autonomyLimit.toLocaleString()} HSK`,
            approved: profiles.agent.validation,
            reason: profiles.agent.validation ? "Agent credentials validated." : "Autonomy score below threshold."
          },
          {
            protocol: "PayFi",
            eligibility: Math.round((profiles.payment.score / 1000) * 100),
            offer: "Instant checkout lines",
            approved: profiles.payment.score >= 550,
            reason: `Transaction frequency class: ${profiles.payment.frequency}.`
          }
        ];

        setOpportunities(list);
        setAiRec(recRes.data);

        // Pre-select Lending
        setSelectedProtocol(list[0]);
      } catch (err: any) {
        console.error("Error loading ecosystem integrations:", err);
        setError("Failed to fetch ecosystem opportunities. Verify backend routing.");
      } finally {
        setLoading(false);
      }
    };

    fetchEcosystemData();
  }, [wallet]);

  function rwaApproved(score: number): boolean {
    return score >= 550;
  }

  return (
    <main className="min-h-screen bg-[#040C1A] text-[#E2E8F0] antialiased pb-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="relative overflow-hidden border-b border-[#111C2E] bg-[#050E1E] py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#083344] via-[#040C1A] to-[#040C1A] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#164E63] bg-[#083344]/30 px-3 py-1 text-xs font-semibold text-[#22D3EE]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
              INTEGRATION NETWORK
            </div>
            <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Credence Trust Network
            </h1>
            <p className="mt-3 text-lg text-[#94A3B8] max-w-2xl font-sans">
              Seamlessly verify and propagate porting trust scores across all HashKey Chain decentralized applications.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {!wallet ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#1E293B] rounded-lg bg-[#050E1E]">
            <h3 className="text-lg font-semibold text-white">Wallet Not Connected</h3>
            <p className="mt-2 text-sm text-[#94A3B8] max-w-sm mx-auto text-center">
              Connect your Web3 wallet to register external applications, verify eligibility, and view the HashKey Trust Network.
            </p>
          </div>
        ) : loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-64 bg-[#0A1424] border border-[#1E293B] rounded-sm" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-[#0A1424] border border-[#1E293B] rounded-sm" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-[#7F1D1D] bg-[#450A0A]/20 p-6 text-[#F87171]">
            <p className="font-medium">System Alert</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Top Row: SVG Visualization & AI recommendation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Visual Graph */}
              <div className="lg:col-span-2">
                <Card className="bg-[#050E1E] border-[#111C2E] rounded-sm shadow-2xl overflow-hidden h-full">
                  <CardContent className="p-8 flex flex-col justify-between h-full">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-white mb-2">HashKey Trust Network Map</h2>
                      <p className="text-xs text-[#94A3B8] mb-6">Interactive graphic showing authorized branches connecting your identity to ecosystem protocols.</p>
                    </div>

                    <div className="flex items-center justify-center bg-[#030914] border border-[#111C2E] rounded-md p-6 relative overflow-hidden">
                      <svg width="100%" height="280" viewBox="0 0 500 280" className="max-w-lg">
                        {/* Lines */}
                        <g stroke="#164E63" strokeWidth="2" strokeDasharray="5,5">
                          <line x1="250" y1="140" x2="110" y2="60" className="animate-[pulse_2s_infinite]" />
                          <line x1="250" y1="140" x2="250" y2="40" className="animate-[pulse_2s_infinite]" />
                          <line x1="250" y1="140" x2="390" y2="60" className="animate-[pulse_2s_infinite]" />
                          <line x1="250" y1="140" x2="110" y2="220" className="animate-[pulse_2s_infinite]" />
                          <line x1="250" y1="140" x2="250" y2="240" className="animate-[pulse_2s_infinite]" />
                          <line x1="250" y1="140" x2="390" y2="220" className="animate-[pulse_2s_infinite]" />
                        </g>

                        {/* Central Hub Node: Wallet & Identity */}
                        <circle cx="250" cy="140" r="28" fill="#083344" stroke="#22D3EE" strokeWidth="2" />
                        <text x="250" y="144" fill="#22D3EE" fontSize="10" textAnchor="middle" fontWeight="bold">CREDENCE</text>

                        {/* Surrounding Protocol Nodes */}
                        {/* Lending */}
                        <circle cx="110" cy="60" r="20" fill={opportunities[0]?.approved ? "#0D261F" : "#1A1010"} stroke={opportunities[0]?.approved ? "#34D399" : "#EF4444"} strokeWidth="1.5" />
                        <text x="110" y="93" fill="#E2E8F0" fontSize="9" textAnchor="middle">Lending</text>

                        {/* Insurance */}
                        <circle cx="250" cy="40" r="20" fill={opportunities[1]?.approved ? "#0D261F" : "#1A1010"} stroke={opportunities[1]?.approved ? "#34D399" : "#EF4444"} strokeWidth="1.5" />
                        <text x="250" y="15" fill="#E2E8F0" fontSize="9" textAnchor="middle">Insurance</text>

                        {/* RWA */}
                        <circle cx="390" cy="60" r="20" fill={opportunities[2]?.approved ? "#0D261F" : "#1A1010"} stroke={opportunities[2]?.approved ? "#34D399" : "#EF4444"} strokeWidth="1.5" />
                        <text x="390" y="93" fill="#E2E8F0" fontSize="9" textAnchor="middle">RWA</text>

                        {/* DAO */}
                        <circle cx="110" cy="220" r="20" fill={opportunities[3]?.approved ? "#0D261F" : "#1A1010"} stroke={opportunities[3]?.approved ? "#34D399" : "#EF4444"} strokeWidth="1.5" />
                        <text x="110" y="253" fill="#E2E8F0" fontSize="9" textAnchor="middle">DAO</text>

                        {/* AI Agents */}
                        <circle cx="250" cy="240" r="20" fill={opportunities[4]?.approved ? "#0D261F" : "#1A1010"} stroke={opportunities[4]?.approved ? "#34D399" : "#EF4444"} strokeWidth="1.5" />
                        <text x="250" y="272" fill="#E2E8F0" fontSize="9" textAnchor="middle">AI Agents</text>

                        {/* PayFi */}
                        <circle cx="390" cy="220" r="20" fill={opportunities[5]?.approved ? "#0D261F" : "#1A1010"} stroke={opportunities[5]?.approved ? "#34D399" : "#EF4444"} strokeWidth="1.5" />
                        <text x="390" y="253" fill="#E2E8F0" fontSize="9" textAnchor="middle">PayFi</text>
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: AI Ecosystem recommendations */}
              <div>
                <Card className="bg-[#050E1E] border-[#111C2E] rounded-sm shadow-2xl h-full flex flex-col justify-between">
                  <CardContent className="p-8">
                    <h2 className="font-display text-2xl font-bold text-white mb-4">AI Ecosystem Recommendation</h2>
                    
                    <div className="bg-[#083344]/20 border border-[#164E63] rounded-sm p-4 text-[#22D3EE] text-sm leading-relaxed mb-6 font-sans italic">
                      "{aiRec?.recommendation ?? 'Evaluating ecosystem qualifications...'}"
                    </div>

                    <div>
                      <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider font-sans block mb-3">Qualified Roles</span>
                      <div className="flex flex-wrap gap-2">
                        {aiRec?.qualifications.map((q, idx) => (
                          <span key={idx} className="text-xs font-mono text-[#34D399] bg-[#0D261F] px-2 py-1 rounded border border-[#1A4D3E]">
                            {q}
                          </span>
                        )) ?? <span className="text-xs text-[#64748B]">None.</span>}
                      </div>
                    </div>

                    <div className="mt-6 border-t border-[#111C2E] pt-6 text-xs text-[#64748B]">
                      Telemetry verified based on {aiRec?.receiptsCount ?? 0} cryptographic trust receipts.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom Row: Protocol Cards Grid & Detail view */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Opportunities Grid */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="font-display text-2xl font-bold text-white">Trust Marketplace Opportunities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {opportunities.map((item) => (
                    <Card 
                      key={item.protocol}
                      onClick={() => setSelectedProtocol(item)}
                      className={`cursor-pointer transition-all border rounded-sm ${selectedProtocol?.protocol === item.protocol ? 'bg-[#0A1A2F] border-[#22D3EE] shadow-2xl' : 'bg-[#050E1E] border-[#111C2E] hover:border-[#1E293B]'}`}
                    >
                      <CardContent className="p-5 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-base">{item.protocol}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${item.approved ? 'bg-[#0D261F] text-[#34D399]' : 'bg-[#450A0A]/40 text-[#EF4444]'}`}>
                              {item.approved ? "Ready ✓" : "Restricted ✖"}
                            </span>
                          </div>
                          <span className="text-xs text-[#94A3B8] block mt-1">{item.offer}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-[#64748B] block font-mono">Fit Score</span>
                          <span className="font-mono text-xl font-bold text-[#34D399]">{item.eligibility}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Selection Detail Panel */}
              <div>
                {selectedProtocol && (
                  <Card className="bg-[#050E1E] border-[#22D3EE] rounded-sm shadow-2xl">
                    <CardContent className="p-8">
                      <span className="text-xs text-[#22D3EE] font-mono block mb-1">INTEGRATION CONTEXT</span>
                      <h3 className="font-display text-3xl font-bold text-white mb-6">{selectedProtocol.protocol} Protocol</h3>

                      <div className="space-y-6">
                        <div>
                          <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider">WALLET ELIGIBILITY</span>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-4xl font-bold text-white font-mono">{selectedProtocol.eligibility}%</span>
                            <span className="text-xs text-[#64748B]">eligibility rating</span>
                          </div>
                        </div>

                        <div className="border-t border-[#111C2E] pt-6">
                          <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider">OFFER PARAMETERS</span>
                          <p className="mt-2 text-sm text-[#E2E8F0] font-mono bg-[#030914] border border-[#111C2E] p-3 rounded-sm">
                            {selectedProtocol.offer}
                          </p>
                        </div>

                        <div className="border-t border-[#111C2E] pt-6">
                          <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider">DECISION EXPLANATION</span>
                          <p className="mt-2 text-sm text-[#94A3B8] leading-relaxed">
                            {selectedProtocol.reason}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
