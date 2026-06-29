"use client";

import { useState } from "react";

interface WalletFormProps {
  onAnalyze: (wallet: string) => void;
}

export default function WalletForm({ onAnalyze }: WalletFormProps) {
  const [wallet, setWallet] = useState("");

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && wallet.trim()) onAnalyze(wallet);
  };

  return (
    <div style={{ display: "flex", gap: 12 }} onKeyDown={onKeyDown}>
      <input
        placeholder="Enter HSK wallet address (0x…)"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        style={{
          flex: 1,
          background: "#070F1C",
          border: "1px solid #1A2740",
          borderRadius: 10,
          padding: "12px 16px",
          color: "#E2E8F0",
          fontSize: 14,
          fontFamily: "JetBrains Mono, monospace",
          outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#00E5FF55";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 229, 255, 0.08)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#1A2740";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
      <button
        onClick={() => wallet.trim() && onAnalyze(wallet)}
        disabled={!wallet.trim()}
        style={{
          background: !wallet.trim()
            ? "#0D1B2E"
            : "linear-gradient(135deg, #00C9E4, #0090C8)",
          border: "none",
          borderRadius: 10,
          color: !wallet.trim() ? "#2E4060" : "#fff",
          fontSize: 14,
          fontWeight: 700,
          padding: "12px 28px",
          cursor: !wallet.trim() ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          boxShadow: !wallet.trim() ? "none" : "0 4px 20px rgba(0, 229, 255, 0.2)",
          letterSpacing: 0.3,
          whiteSpace: "nowrap",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Analyze →
      </button>
    </div>
  );
}