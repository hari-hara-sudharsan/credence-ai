"use client";

import { useState } from "react";
import { ethers } from "ethers";
import API from "@/lib/api";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Props {
  position: {
    wallet: string;
    balance: number;
    shares: number;
    yield_earned: number;
  };
  onRefresh: (optimisticData?: { balanceChange?: number; type?: "deposit" | "withdraw" }) => void;
}

const LENDING_POOL_ABI = [
  "function deposit() external payable",
  "function withdraw(uint256 sharesToBurn) external"
];
const LENDING_POOL_ADDRESS = "0x928BA9D30669c41695422a68a1C307a6529F0050";

export default function DepositCard({ position, onRefresh }: Props) {
  const [amount, setAmount] = useState("1000");
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to authorize transactions.");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(LENDING_POOL_ADDRESS, LENDING_POOL_ABI, signer);

      // Execute on-chain deposit
      const value = ethers.parseEther(amount);
      const tx = await contract.deposit({ value });
      await tx.wait();

      try {
        await API.post("/pool/deposit", {
          wallet: position.wallet,
          amount: parseFloat(amount)
        });
      } catch (apiErr) {
        console.warn("Backend API call failed, applying frontend fallback:", apiErr);
      }
      onRefresh({ balanceChange: parseFloat(amount), type: "deposit" });
      alert(`Liquidity deposit of ${amount} HSK was successfully executed on-chain.`);
    } catch (err: any) {
      console.error(err);
      if (err.code === 4001 || err.message?.includes("rejected")) {
        alert("Transaction rejected by user.");
      } else {
        alert("Deposit failed. Check your wallet balance and RPC logs.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to authorize transactions.");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(LENDING_POOL_ADDRESS, LENDING_POOL_ABI, signer);

      // Execute on-chain withdraw
      const shares = ethers.parseEther(amount);
      const tx = await contract.withdraw(shares);
      await tx.wait();

      try {
        await API.post("/pool/withdraw", {
          wallet: position.wallet,
          amount: parseFloat(amount)
        });
      } catch (apiErr) {
        console.warn("Backend API call failed, applying frontend fallback:", apiErr);
      }
      onRefresh({ balanceChange: parseFloat(amount), type: "withdraw" });
      alert(`Withdrawal of ${amount} HSK successfully settled on-chain.`);
    } catch (err: any) {
      console.error(err);
      if (err.code === 4001 || err.message?.includes("rejected")) {
        alert("Transaction rejected by user.");
      } else {
        alert("Withdraw failed. Insufficient position balance or pool liquidity.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#34D399",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 20,
        }}
      >
        LENDER POSITION CONTROLS
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#64748B" }}>Your Total Balance</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0" }}>
            {position.balance.toLocaleString()} HSK
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111C2E", paddingBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#64748B" }}>Accrued Yield</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#34D399" }}>
            +{position.yield_earned} HSK
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
            AMOUNT (HSK CAPITAL)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: "100%",
              background: "#050B14",
              border: "1px solid #1D2E49",
              borderRadius: 8,
              padding: "10px 14px",
              color: "#E2E8F0",
              fontSize: 13,
              fontFamily: "JetBrains Mono, monospace",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <button
            onClick={handleDeposit}
            disabled={loading}
            style={{
              background: "#34D399",
              border: "none",
              borderRadius: 8,
              color: "#040C1A",
              fontWeight: 800,
              fontSize: 13,
              padding: "10px 0",
              cursor: "pointer",
            }}
          >
            DEPOSIT
          </button>
          <button
            onClick={handleWithdraw}
            disabled={loading}
            style={{
              background: "transparent",
              border: "1px solid #1D2E49",
              borderRadius: 8,
              color: "#E2E8F0",
              fontWeight: 800,
              fontSize: 13,
              padding: "10px 0",
              cursor: "pointer",
            }}
          >
            WITHDRAW
          </button>
        </div>
      </div>

      {/* Real On-chain Explanation Block */}
      <div
        style={{
          marginTop: 24,
          padding: 16,
          background: "rgba(0, 229, 255, 0.03)",
          border: "1px solid rgba(0, 229, 255, 0.15)",
          borderRadius: 8,
          fontSize: 12,
          color: "#94A3B8",
          lineHeight: 1.5,
        }}
      >
        <strong style={{ color: "#00E5FF", display: "block", marginBottom: 6 }}>Real On-chain Operations Info:</strong>
        <p style={{ margin: "0 0 8px 0" }}>
          <strong>✓ Deposit:</strong> Sends HSK stablecoins into the <code>LendingPool</code> smart contract. The contract mints LP shares proportional to your deposit, recording your absolute ownership fraction of the pool.
        </p>
        <p style={{ margin: 0 }}>
          <strong>✓ Withdraw:</strong> Burns your pool LP shares. The contract calculates your accrued yield dynamically from on-chain loan interest repayments and returns your original principal plus earnings.
        </p>
      </div>
    </div>
  );
}
