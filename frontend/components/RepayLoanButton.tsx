"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/context/WalletContext";
import API from "@/lib/api";
import RepaymentProgress from "./RepaymentProgress";
import RepaymentReceipt from "./RepaymentReceipt";

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

interface RepayLoanButtonProps {
  loan: Loan;
  onSuccess: () => void;
}

type RepaymentStage = "preparing" | "signature" | "broadcasting" | "confirming" | "completed" | "idle";

export default function RepayLoanButton({ loan, onSuccess }: RepayLoanButtonProps) {
  const { wallet } = useWallet();
  const [stage, setStage] = useState<RepaymentStage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<{
    loanId: string;
    amount: number;
    timestamp: string;
    txHash: string;
  } | null>(null);

  // Repayment is allowed for ACTIVE and DEFAULTED status
  const canRepay = loan.status === "ACTIVE" || loan.status === "DEFAULTED";

  if (!canRepay) return null;

  const handleRepay = async () => {
    if (!window.ethereum) {
      setError("Web3 provider not detected. Please install MetaMask.");
      setStage("idle");
      return;
    }

    setError(null);
    setReceiptData(null);
    setStage("preparing");

    try {
      // 1. Prepare (artificial small delay for premium visual feedback)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 2. Ensure user is on HashKey Chain Mainnet
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xB1" }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xB1",
                chainName: "HashKey Chain",
                rpcUrls: ["https://mainnet.hsk.xyz"],
                nativeCurrency: { name: "HSK", symbol: "HSK", decimals: 18 },
                blockExplorerUrls: ["https://hashkey.blockscout.com"],
              },
            ],
          });
        } else if (switchError.code !== 4001) {
          throw switchError;
        }
      }

      // 3. Request signature
      setStage("signature");
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Ensure the wallet connected matches the borrower wallet
      const accounts = await provider.send("eth_requestAccounts", []);
      const activeAddress = accounts[0]?.toLowerCase();
      
      if (activeAddress !== wallet.toLowerCase()) {
        throw new Error(
          `Connected wallet (${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}) does not match borrower address.`
        );
      }

      const signer = await provider.getSigner();
      const message = `Authorize repayment for loan ${loan.loan_id} on Credence Protocol.`;
      await signer.signMessage(message);

      // 4. Broadcasting
      setStage("broadcasting");
      
      // 5. Confirming on-chain (combined into the FastAPI request)
      setStage("confirming");
      const response = await API.post("/repayment", {
        wallet: wallet,
        loan_id: loan.loan_id,
      });

      if (response.data && response.data.success) {
        setReceiptData({
          loanId: response.data.loan_id,
          amount: loan.amount,
          timestamp: new Date().toISOString(),
          txHash: response.data.transaction_hash,
        });
        setStage("completed");
      } else {
        throw new Error(response.data?.message || "On-chain repayment execution failed.");
      }
    } catch (err: any) {
      console.error("Repayment error:", err);
      // Clean up signature rejection vs actual errors
      if (err.code === 4001 || err.message?.includes("rejected")) {
        setError("Signature request rejected by user.");
      } else {
        setError(err.message || "An unexpected error occurred during repayment.");
      }
      setStage("idle");
    }
  };

  const handleCloseReceipt = () => {
    setStage("idle");
    setReceiptData(null);
    onSuccess();
  };

  return (
    <div className="w-full">
      <button
        onClick={handleRepay}
        disabled={stage !== "idle"}
        className="w-full font-mono text-xs tracking-[0.08em] uppercase px-5 py-3 rounded-sm border border-[#3DDC97] text-[#3DDC97] bg-[#3DDC97]/5 transition-all duration-200 hover:bg-[#3DDC97] hover:text-[#0B0E14] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Repay Loan
      </button>

      {/* Progress & Error overlay modal */}
      {stage !== "idle" && stage !== "completed" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040C1A]/80 backdrop-blur-sm">
          <div className="w-full max-w-sm">
            <RepaymentProgress stage={stage} />
          </div>
        </div>
      )}

      {/* Error Popup */}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040C1A]/80 backdrop-blur-sm">
          <div className="w-full max-w-sm border border-[#B85C5C]/50 bg-[#1A1F2B]/95 rounded-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#B85C5C]/30 text-[#B85C5C]">
              <span className="text-lg">⚠️</span>
              <h4 className="font-mono text-xs tracking-[0.1em] uppercase font-semibold">
                Repayment Failed
              </h4>
            </div>
            <p className="font-sans text-xs leading-relaxed text-[#E8E6DE]/90">
              {error}
            </p>
            <button
              onClick={() => setError(null)}
              className="w-full font-mono text-xs tracking-[0.06em] uppercase px-4 py-2.5 rounded-sm border border-[#2A3142] text-[#E8E6DE]/90 bg-[#1A1F2B] hover:bg-[#1A1F2B]/75 transition-all duration-150"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* Receipt popup */}
      {stage === "completed" && receiptData && (
        <RepaymentReceipt
          loanId={receiptData.loanId}
          repaidAmount={receiptData.amount}
          repaidAt={receiptData.timestamp}
          txHash={receiptData.txHash}
          onClose={handleCloseReceipt}
        />
      )}
    </div>
  );
}
