"use client";

import { useEffect } from "react";

interface RepaymentReceiptProps {
  loanId: string;
  repaidAmount: number;
  repaidAt: string;
  txHash: string;
  onClose: () => void;
}

export default function RepaymentReceipt({
  loanId,
  repaidAmount,
  repaidAt,
  txHash,
  onClose,
}: RepaymentReceiptProps) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const truncateHash = (hash: string) => {
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const formattedDate = new Date(repaidAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040C1A]/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md border border-[#2A3142] bg-[#1A1F2B]/90 shadow-2xl rounded-sm p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#3DDC97]/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Success Icon Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3DDC97]/10 border border-[#3DDC97]/30 text-2xl text-[#3DDC97] pulse-ring">
            ✓
          </div>
          <div>
            <h3 className="font-display text-2xl font-semibold text-[#E8E6DE] tracking-tight">
              Repayment Complete
            </h3>
            <p className="font-sans text-xs text-[#6B7280] mt-1">
              Authoritative on-chain transaction receipt
            </p>
          </div>
        </div>

        {/* Receipt Details Box */}
        <div className="border border-[#2A3142]/60 bg-[#0B0E14]/60 rounded-sm p-4 space-y-3.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-sans text-[#6B7280]">Loan Record ID</span>
            <span className="font-mono text-[#E8E6DE]/90 font-medium truncate max-w-[200px]" title={loanId}>
              {loanId}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="font-sans text-[#6B7280]">Status</span>
            <span className="font-mono text-[10px] tracking-wider uppercase font-semibold text-[#3DDC97] bg-[#3DDC97]/10 border border-[#3DDC97]/25 px-2 py-0.5 rounded-sm">
              REPAID
            </span>
          </div>

          <div className="flex justify-between items-center text-xs border-t border-[#2A3142]/40 pt-3">
            <span className="font-sans text-[#6B7280]">Amount Settled</span>
            <span className="font-display text-lg font-semibold text-[#E8E6DE]">
              {repaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
              <span className="font-sans text-xs text-[#6B7280] font-normal">HSK</span>
            </span>
          </div>

          <div className="flex justify-between items-center text-xs border-t border-[#2A3142]/40 pt-3">
            <span className="font-sans text-[#6B7280]">Settled At</span>
            <span className="font-mono text-[#E8E6DE]/90">{formattedDate}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="font-sans text-[#6B7280]">Transaction Hash</span>
            <span className="font-mono text-[#E8E6DE]/80 hover:text-[#3DDC97] transition-colors duration-150 cursor-default" title={txHash}>
              {truncateHash(txHash)}
            </span>
          </div>
        </div>

        {/* Explanatory Message */}
        <p className="font-sans text-[11px] leading-relaxed text-[#6B7280] text-center max-w-sm mx-auto">
          The reputation score forecast has been locked. Repayment behavior was successfully logged by the Credence Protocol and factored into your wallet analysis.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          <a
            href={`https://hashkey.blockscout.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center font-mono text-xs tracking-[0.06em] uppercase px-5 py-3 rounded-sm border border-[#2A3142] text-[#E8E6DE]/95 bg-[#1A1F2B] hover:border-[#3DDC97]/30 hover:bg-[#1A1F2B]/80 transition-all duration-200"
          >
            Verify On Blockscout ↗
          </a>
          <button
            onClick={onClose}
            className="w-full font-mono text-xs tracking-[0.06em] uppercase px-5 py-3 rounded-sm text-[#0B0E14] bg-[#3DDC97] hover:bg-[#34c688] font-semibold transition-all duration-200"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
