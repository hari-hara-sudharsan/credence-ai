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
  onRefresh: () => void;
}

export default function DepositCard({ position, onRefresh }: Props) {
  const [amount, setAmount] = useState("1000");
  const [loading, setLoading] = useState(false);

  const signAndVerify = async (action: string, amountVal: string): Promise<boolean> => {
    if (!window.ethereum) {
      alert("Please install MetaMask to authorize transactions.");
      return false;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const message = `Authorize ${action} of ${amountVal} HSK on Credence Lending Pool.`;
      await signer.signMessage(message);
      return true;
    } catch (err: any) {
      if (err.code === 4001 || err.message?.includes("rejected")) {
        alert("Transaction signature rejected.");
      } else {
        alert("Failed to sign transaction. Please try again.");
      }
      return false;
    }
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    try {
      const signed = await signAndVerify("deposit", amount);
      if (!signed) return;

      await API.post("/pool/deposit", {
        wallet: position.wallet,
        amount: parseFloat(amount)
      });
      onRefresh();
      alert(`Liquidity deposit of ${amount} HSK was successfully executed on-chain.`);
    } catch (err) {
      console.error(err);
      alert("Deposit failed. Check your wallet balance and RPC logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    try {
      const signed = await signAndVerify("withdrawal", amount);
      if (!signed) return;

      await API.post("/pool/withdraw", {
        wallet: position.wallet,
        amount: parseFloat(amount)
      });
      onRefresh();
      alert(`Withdrawal of ${amount} HSK successfully settled.`);
    } catch (err) {
      console.error(err);
      alert("Withdraw failed. Insufficient position balance.");
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
    </div>
  );
}
