"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import API from "@/lib/api";
import { useWallet } from "@/context/WalletContext";
import LoanSummary from "@/components/LoanSummary";
import LoanCard from "@/components/LoanCard";

interface CreditImpact {
  current_credit_score: number;
  projected_score_repaid: number;
  repaid_score_change: number;
  projected_score_overdue: number;
  overdue_score_change: number;
  protocol_trust_impact: string;
}

interface Loan {
  loan_id: string;
  status: string;
  amount: number;
  interest_rate: number;
  collateral_ratio: number;
  duration: number;
  created_at: string;
  due_date: string;
  health_factor: number;
  health_status: string;
  credit_impact: CreditImpact;
}

interface Summary {
  total_loans: number;
  active_loans: number;
  completed_loans: number;
  total_borrowed: number;
  outstanding: number;
}

interface DashboardData {
  wallet: string;
  summary: Summary;
  loans: Loan[];
}

interface RepaymentRecord {
  loan_id: string;
  repaid_at: string;
  transaction_hash: string;
  amount: number;
  status: string;
}

function SkeletonLoader() {
  return (
    <div className="space-y-10">
      {/* Summary Skeletons */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border border-[#2A3142] bg-[#1A1F2B]/40 rounded-sm p-6 h-28 animate-pulse">
            <div className="h-3 bg-[#2A3142] rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-[#2A3142] rounded w-3/4 mb-3"></div>
            <div className="h-2 bg-[#2A3142] rounded w-2/3"></div>
          </div>
        ))}
      </div>

      {/* Loan Card Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {[1, 2].map((i) => (
          <div key={i} className="border border-[#2A3142] bg-[#1A1F2B]/40 rounded-sm p-6 space-y-6 animate-pulse">
            <div className="flex justify-between items-center pb-4 border-b border-[#2A3142]/40">
              <div className="h-4 bg-[#2A3142] rounded w-1/3"></div>
              <div className="h-6 bg-[#2A3142] rounded w-1/4"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="bg-[#0B0E14]/50 border border-[#2A3142]/30 rounded-sm p-3 h-16">
                  <div className="h-3 bg-[#2A3142] rounded w-1/2 mb-2"></div>
                  <div className="h-5 bg-[#2A3142] rounded w-3/4"></div>
                </div>
              ))}
            </div>
            <div className="h-4 bg-[#2A3142] rounded w-full"></div>
            <div className="h-10 bg-[#2A3142] rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BorrowerLoansPage() {
  const { wallet } = useWallet();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [history, setHistory] = useState<RepaymentRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    if (!wallet) return;
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/borrower/${wallet}`);
      setData(response.data);
    } catch (err) {
      console.error("Error fetching borrower loans:", err);
      setError("Failed to query on-chain loan state. Please ensure the RPC node is reachable.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRepaymentHistory = async () => {
    if (!wallet) return;
    setHistoryLoading(true);
    try {
      const response = await API.get(`/repayment/history/${wallet}`);
      setHistory(response.data);
    } catch (err) {
      console.error("Error fetching repayment history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (wallet) {
      fetchDashboardData();
      fetchRepaymentHistory();
    } else {
      setData(null);
      setHistory([]);
    }
  }, [wallet]);

  return (
    <main className="min-h-screen bg-[#040C1A] text-[#E2E8F0] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-sans { font-family: 'Inter', sans-serif; }

        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(61, 220, 151, 0.45); }
          50% { box-shadow: 0 0 0 4px rgba(61, 220, 151, 0); }
        }
        .pulse-ring { animation: pulse-ring 1.4s ease-in-out infinite; }

        @keyframes rise-in {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rise-in { animation: rise-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-8 font-mono text-xs tracking-[0.18em] text-[#6B7280] uppercase">
          <span>Credence Protocol — Borrower Control Center</span>
        </div>

        {/* Header section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b border-[#2A3142]/40">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-medium leading-[1.1] mb-3 text-[#E8E6DE]">
              Borrower Dashboard
            </h1>
            <p className="font-sans text-[#6B7280] text-base sm:text-lg">
              Monitor all on-chain loans secured by Credence AI.
            </p>
          </div>

          <div className="font-mono text-xs text-[#6B7280] md:text-right">
            <div className="uppercase tracking-[0.14em] mb-1">Borrower Address</div>
            <div className="text-[#E8E6DE]/80 font-medium truncate max-w-[280px] sm:max-w-none">
              {wallet ? wallet : "Wallet not connected"}
            </div>
          </div>
        </div>

        {/* Connection State check */}
        {!wallet ? (
          <div className="rise-in border border-[#2A3142] bg-[#1A1F2B]/40 rounded-sm p-12 text-center max-w-2xl mx-auto space-y-6">
            <div className="flex justify-center">
              <span className="text-4xl">🔑</span>
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-semibold text-[#E8E6DE]">Connect Your Wallet</h2>
              <p className="font-sans text-sm text-[#6B7280] max-w-md mx-auto">
                Connect your Web3 wallet using the network interface to view active, pending, or completed on-chain loans.
              </p>
            </div>
          </div>
        ) : loading ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="border border-[#B85C5C] bg-[#B85C5C]/5 rounded-sm p-6 flex flex-col md:flex-row items-center gap-4">
            <div className="font-mono text-xs tracking-[0.12em] uppercase text-[#B85C5C] border border-[#B85C5C] px-2 py-0.5 rounded-sm shrink-0">
              Error
            </div>
            <p className="font-sans text-sm text-[#E8E6DE]/90">
              {error}
            </p>
          </div>
        ) : !data || data.loans.length === 0 ? (
          /* Empty state */
          <div className="rise-in border border-[#2A3142] bg-[#1A1F2B]/20 rounded-sm p-12 text-center max-w-2xl mx-auto space-y-6">
            <div className="flex justify-center text-4xl">ℹ️</div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-medium text-[#E8E6DE]">No active loans found.</h2>
              <p className="font-sans text-sm text-[#6B7280] max-w-md mx-auto">
                It looks like this wallet does not have any active or pending loans on-chain. Evaluate your standing and create your first AI-underwritten loan offer.
              </p>
            </div>
            <div className="pt-2">
              <Link 
                href="/borrower" 
                className="inline-block font-mono text-xs tracking-[0.08em] uppercase px-6 py-3 rounded-sm border border-[#3DDC97] text-[#0B0E14] bg-[#3DDC97] transition-all duration-200 hover:bg-[#34c688] font-semibold"
              >
                Create your first AI-powered loan offer
              </Link>
            </div>
          </div>
        ) : (
          /* Active dashboard state */
          <div className="space-y-10 rise-in">
            {/* Summary Cards */}
            <LoanSummary summary={data.summary} />

            {/* List Header */}
            <div className="flex items-center justify-between pt-4 border-b border-[#2A3142]/40 pb-4">
              <h2 className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase">
                Active & Completed Loans
              </h2>
              <span className="font-mono text-[10px] text-[#6B7280] bg-[#1A1F2B] px-2.5 py-1 rounded-sm">
                {data.loans.length} {data.loans.length === 1 ? "Record" : "Records"}
              </span>
            </div>

            {/* Loans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.loans.map((loan) => (
                <LoanCard 
                  key={loan.loan_id} 
                  loan={loan} 
                  onSuccess={() => {
                    fetchDashboardData();
                    fetchRepaymentHistory();
                  }}
                />
              ))}
            </div>

            {/* Repayment History Section */}
            <div className="pt-8 border-t border-[#2A3142]/40 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-3 bg-[#3DDC97] rounded-sm" />
                  <h2 className="font-mono text-xs tracking-[0.14em] text-[#E8E6DE] uppercase">
                    On-Chain Repayment History
                  </h2>
                </div>
                <span className="font-mono text-[10px] text-[#6B7280] bg-[#1A1F2B] px-2.5 py-1 rounded-sm font-semibold font-mono">
                  {history.length} {history.length === 1 ? "Receipt" : "Receipts"}
                </span>
              </div>

              {historyLoading ? (
                <div className="border border-[#2A3142] bg-[#1A1F2B]/10 rounded-sm p-8 text-center animate-pulse font-mono text-xs text-[#6B7280]">
                  Loading historical events from ledger...
                </div>
              ) : history.length === 0 ? (
                <div className="border border-[#2A3142]/40 bg-[#1A1F2B]/10 rounded-sm p-8 text-center font-sans text-sm text-[#6B7280]">
                  No repayment history found for this wallet.
                </div>
              ) : (
                <div className="border border-[#2A3142] bg-[#1A1F2B]/20 rounded-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#2A3142] bg-[#0B0E14]/40 font-mono text-[10px] tracking-wider text-[#6B7280] uppercase">
                          <th className="py-3 px-4 font-medium">Date</th>
                          <th className="py-3 px-4 font-medium">Loan ID</th>
                          <th className="py-3 px-4 font-medium">Amount Settled</th>
                          <th className="py-3 px-4 font-medium">Tx Hash</th>
                          <th className="py-3 px-4 font-medium">Status</th>
                          <th className="py-3 px-4 font-medium text-right">Verification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2A3142]/40 font-sans text-xs">
                        {history.map((record) => (
                          <tr key={record.transaction_hash} className="hover:bg-[#1A1F2B]/40 transition-colors duration-150 text-[#E8E6DE]/90">
                            <td className="py-3 px-4 font-mono text-[#6B7280]">
                              {new Date(record.repaid_at).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </td>
                            <td className="py-3 px-4 font-mono truncate max-w-[120px]" title={record.loan_id}>
                              #{record.loan_id.slice(0, 8)}...
                            </td>
                            <td className="py-3 px-4 font-display font-semibold text-[#E8E6DE]">
                              {record.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                              <span className="font-sans text-[10px] text-[#6B7280] font-normal">HSK</span>
                            </td>
                            <td className="py-3 px-4 font-mono text-[#6B7280] truncate max-w-[120px]" title={record.transaction_hash}>
                              {record.transaction_hash.slice(0, 10)}...{record.transaction_hash.slice(-8)}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-mono text-[9px] tracking-wider font-semibold text-[#3DDC97] bg-[#3DDC97]/10 border border-[#3DDC97]/20 px-2 py-0.5 rounded-sm">
                                {record.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <a
                                href={`https://hashkey.blockscout.com/tx/${record.transaction_hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-[10px] text-[#3DDC97] hover:underline"
                              >
                                Verify On Blockscout ↗
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
