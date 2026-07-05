"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/context/WalletContext";
import API from "@/lib/api";

import SupportedProtocols from "@/components/SupportedProtocols";
import AdapterCard from "@/components/AdapterCard";
import IntegrationFlow from "@/components/IntegrationFlow";
import { Card, CardContent } from "@/components/ui/card";

interface ContractResponse {
  wallet: string;
  adapter_version: string;
  protocol: string;
  generated_at: string;
  expires_at: string;
  integration_result: any;
}

export default function IntegrationsPage() {
  const { wallet } = useWallet();
  const [selectedProtocol, setSelectedProtocol] = useState<string>("LENDING");
  const [contract, setContract] = useState<ContractResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Trigger live API simulation
  const runSimulation = async () => {
    if (!wallet) return;
    setLoading(true);
    setError(null);
    setContract(null);
    try {
      const response = await API.get(`/integrations/${selectedProtocol}/${wallet}`);
      setContract(response.data);
    } catch (err: any) {
      console.error("Simulation error:", err);
      setError(
        err.response?.data?.detail || 
        "Failed to simulate integration. Ensure the local backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // Run automatically when protocol changes and wallet is connected
  useEffect(() => {
    if (wallet) {
      runSimulation();
    } else {
      setContract(null);
    }
  }, [selectedProtocol, wallet]);

  const renderLendingResults = (result: any) => (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-[#0B0E14]/40 border border-[#2A3142]/40 rounded-sm p-4">
        <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">Max LTV Cap</span>
        <div className="font-display text-2xl font-bold text-[#E8E6DE] mt-1">{result.max_ltv}%</div>
      </div>
      <div className="bg-[#0B0E14]/40 border border-[#2A3142]/40 rounded-sm p-4">
        <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">Borrowing APR</span>
        <div className="font-display text-2xl font-bold text-[#3DDC97] mt-1">{result.interest_rate}%</div>
      </div>
      <div className="bg-[#0B0E14]/40 border border-[#2A3142]/40 rounded-sm p-4 col-span-2">
        <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">Maximum Loan Limit</span>
        <div className="font-display text-2xl font-bold text-[#00E5FF] mt-1">
          {result.max_loan.toLocaleString()}{" "}
          <span className="font-sans text-xs text-[#6B7280] font-normal">HSK</span>
        </div>
      </div>
    </div>
  );

  const renderInsuranceResults = (result: any) => (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-[#0B0E14]/40 border border-[#2A3142]/40 rounded-sm p-4">
        <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">Risk Tier</span>
        <div className="font-display text-xl font-bold text-[#E8E6DE] mt-1">{result.risk_class}</div>
      </div>
      <div className="bg-[#0B0E14]/40 border border-[#2A3142]/40 rounded-sm p-4">
        <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">Premium Discount</span>
        <div className="font-display text-2xl font-bold text-[#3DDC97] mt-1">{result.premium_discount}%</div>
      </div>
      <div className="bg-[#0B0E14]/40 border border-[#2A3142]/40 rounded-sm p-4 col-span-2">
        <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">Liability Coverage Limit</span>
        <div className="font-display text-2xl font-bold text-[#00E5FF] mt-1">
          {result.coverage_limit.toLocaleString()}{" "}
          <span className="font-sans text-xs text-[#6B7280] font-normal">HSK</span>
        </div>
      </div>
    </div>
  );

  const renderRwaResults = (result: any) => (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-[#0B0E14]/40 border border-[#2A3142]/40 rounded-sm p-4">
        <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">Compliance Grading</span>
        <div className="font-display text-xs font-bold text-[#3DDC97] mt-2 uppercase">
          {result.institutional_grade ? "Institutional Approved" : "Standard Retails"}
        </div>
      </div>
      <div className="bg-[#0B0E14]/40 border border-[#2A3142]/40 rounded-sm p-4">
        <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">Sybil Risk Tier</span>
        <div className="font-display text-xl font-bold text-[#E8E6DE] mt-1">{result.risk}</div>
      </div>
      <div className="bg-[#0B0E14]/40 border border-[#2A3142]/40 rounded-sm p-4 col-span-2">
        <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">Asset Acquisition Capacity</span>
        <div className="font-display text-2xl font-bold text-[#00E5FF] mt-1">
          {result.asset_limit.toLocaleString()}{" "}
          <span className="font-sans text-xs text-[#6B7280] font-normal">HSK</span>
        </div>
      </div>
    </div>
  );

  const renderDaoResults = (result: any) => (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-[#0B0E14]/40 border border-[#2A3142]/40 rounded-sm p-4 col-span-2">
        <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">Governance Voting Weight</span>
        <div className="font-display text-2xl font-bold text-[#00E5FF] mt-1">{result.voting_weight}</div>
      </div>
      <div className="bg-[#0B0E14]/40 border border-[#2A3142]/40 rounded-sm p-4 col-span-2">
        <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">Delegate Status Recommendation</span>
        <div className="font-display text-xs font-bold mt-2 uppercase">
          {result.delegate_recommended ? (
            <span className="text-[#3DDC97]">Highly Recommended</span>
          ) : (
            <span className="text-[#6B7280]">Delegate Role Not Suggested</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderInstitutionalResults = (result: any) => (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-[#0B0E14]/40 border border-[#2A3142]/40 rounded-sm p-4">
        <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">Compliance Status</span>
        <div className={`font-display text-xs font-bold mt-2 uppercase ${
          result.approved ? "text-[#3DDC97]" : "text-[#FF4D6A]"
        }`}>
          {result.approved ? "AUDIT PASSED" : "AUDIT FLAGGED"}
        </div>
      </div>
      <div className="bg-[#0B0E14]/40 border border-[#2A3142]/40 rounded-sm p-4">
        <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">Audit Risk Level</span>
        <div className="font-display text-xl font-bold text-[#E8E6DE] mt-1">{result.risk}</div>
      </div>
      <div className="bg-[#0B0E14]/40 border border-[#2A3142]/40 rounded-sm p-4 col-span-2">
        <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">Underwriter Confidence Index</span>
        <div className="font-display text-2xl font-bold text-[#00E5FF] mt-1">{result.confidence}%</div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#040C1A] text-[#E2E8F0] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-sans { font-family: 'Inter', sans-serif; }

        @keyframes rise-in {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rise-in { animation: rise-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.3); }
          50% { box-shadow: 0 0 0 4px rgba(0, 229, 255, 0); }
        }
        .pulse-ring { animation: pulse-ring 1.4s ease-in-out infinite; }
      `}</style>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-12">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-[#6B7280] uppercase">
          <span>Credence Protocol — Integration Framework Portal</span>
        </div>

        {/* Hero Section */}
        <div className="pb-8 border-b border-[#2A3142]/40">
          <h1 className="font-display text-4xl sm:text-5xl font-medium leading-[1.1] mb-4 text-[#E8E6DE]">
            Developer Integration Hub
          </h1>
          <p className="font-sans text-[#6B7280] text-base sm:text-lg max-w-3xl">
            Integrate Credence AI with any HashKey protocol using standardized, secure, and type-safe infrastructure adapters.
          </p>
        </div>

        {/* Pipeline Diagram */}
        <div className="rise-in">
          <IntegrationFlow />
        </div>

        {/* Selector grid */}
        <div className="rise-in">
          <SupportedProtocols 
            selectedProtocol={selectedProtocol}
            onSelect={(p) => setSelectedProtocol(p)}
          />
        </div>

        {/* Double Column: Details & Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 rise-in">
          {/* Column Left: Adapter Specs */}
          <div>
            <AdapterCard protocol={selectedProtocol as any} />
          </div>

          {/* Column Right: Live Simulator */}
          <div className="space-y-6">
            <Card className="border-[#2A3142] bg-[#1A1F2B]/40 text-[#E8E6DE] p-6 relative overflow-hidden">
              {/* Glow */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#00E5FF]/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between pb-4 border-b border-[#2A3142]/40 mb-5">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-3 bg-[#00E5FF] rounded-sm" />
                  <h4 className="font-mono text-xs tracking-[0.1em] text-[#E8E6DE] uppercase">
                    Live Adapter Simulator
                  </h4>
                </div>
                {loading && (
                  <span className="font-mono text-[9px] text-[#00E5FF] animate-pulse uppercase">
                    QUERYING ADAPTER…
                  </span>
                )}
              </div>

              {/* Simulation Result */}
              {!wallet ? (
                <div className="border border-dashed border-[#2A3142]/65 bg-[#0B0E14]/20 rounded-sm p-10 text-center font-sans text-xs text-[#6B7280] space-y-3">
                  <span className="text-2xl block">🔐</span>
                  <p className="max-w-xs mx-auto">
                    Please connect your Web3 wallet using the navigation bar to run live adapter simulation contracts.
                  </p>
                </div>
              ) : loading ? (
                <div className="border border-[#2A3142] bg-[#0B0E14]/10 rounded-sm p-10 text-center font-mono text-xs text-[#6B7280] animate-pulse">
                  Fetching dynamic protocol profile mapping from ledger...
                </div>
              ) : error ? (
                <div className="border border-[#FF4D6A]/30 bg-[#FF4D6A]/5 rounded-sm p-5 space-y-3 text-center">
                  <span className="text-lg">⚠️</span>
                  <p className="font-sans text-xs text-[#E8E6DE]/90">{error}</p>
                  <button 
                    onClick={runSimulation}
                    className="font-mono text-[10px] tracking-wider uppercase border border-[#FF4D6A] text-[#FF4D6A] bg-[#FF4D6A]/10 px-4 py-2 rounded-sm cursor-pointer hover:bg-[#FF4D6A]/20"
                  >
                    Retry Query
                  </button>
                </div>
              ) : !contract ? (
                <div className="border border-[#2A3142]/50 bg-[#0B0E14]/10 rounded-sm p-10 text-center space-y-4">
                  <p className="font-sans text-xs text-[#6B7280]">
                    Connection established. Trigger the simulator to compute live values.
                  </p>
                  <button 
                    onClick={runSimulation}
                    className="font-mono text-xs tracking-wider uppercase bg-[#00E5FF] text-[#0B0E14] px-5 py-2.5 rounded-sm font-semibold hover:bg-[#00c5dd] transition-all cursor-pointer"
                  >
                    Execute Adapter Contract
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Visual Mappings Panel */}
                  <div className="space-y-4">
                    <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase block">
                      Parsed Contract Terms
                    </span>
                    {selectedProtocol === "LENDING" && renderLendingResults(contract.integration_result)}
                    {selectedProtocol === "INSURANCE" && renderInsuranceResults(contract.integration_result)}
                    {selectedProtocol === "RWA" && renderRwaResults(contract.integration_result)}
                    {selectedProtocol === "DAO" && renderDaoResults(contract.integration_result)}
                    {selectedProtocol === "INSTITUTIONAL" && renderInstitutionalResults(contract.integration_result)}
                  </div>

                  {/* Contract details envelope */}
                  <div className="border border-[#2A3142] bg-[#0B0E14]/50 rounded-sm p-4 space-y-2.5 font-mono text-[10px] text-[#6B7280]">
                    <div className="flex justify-between">
                      <span>Adapter Version</span>
                      <span className="text-[#E8E6DE]/80">{contract.adapter_version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Generated At</span>
                      <span className="text-[#E8E6DE]/80">
                        {new Date(contract.generated_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expires At</span>
                      <span className="text-[#E8E6DE]/80">
                        {new Date(contract.expires_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={runSimulation}
                      className="font-mono text-[10px] tracking-wider uppercase border border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/5 px-4 py-2 rounded-sm cursor-pointer hover:bg-[#00E5FF]/10 transition-all"
                    >
                      Re-run Simulation
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* JSON Preview Panel */}
        {contract && (
          <div className="border border-[#2A3142] bg-[#0B0E14]/65 rounded-sm p-5 space-y-4 rise-in">
            <div className="flex items-center justify-between border-b border-[#2A3142]/40 pb-3 font-mono text-[10px] text-[#6B7280] uppercase">
              <span>GET /integrations/{selectedProtocol}/{contract.wallet.slice(0, 6)}...</span>
              <span className="text-[#3DDC97]">200 OK</span>
            </div>
            <pre className="font-mono text-xs leading-relaxed text-[#00E5FF] bg-[#0B0E14]/30 rounded-sm p-4 overflow-x-auto border border-[#2A3142]/30 max-h-96">
              {JSON.stringify(contract, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
