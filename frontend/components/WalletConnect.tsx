"use client";

import { useWallet } from "@/context/WalletContext";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function WalletConnect() {
  const { wallet, setWallet } = useWallet();

  const connect = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setWallet(accounts[0]);
  };

  const truncated = wallet
    ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}`
    : null;

  return (
    <button
      onClick={connect}
      style={{
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.5,
        padding: "7px 16px",
        borderRadius: 8,
        border: wallet ? "1px solid #00E5FF44" : "1px solid #1A2740",
        background: wallet
          ? "rgba(0, 229, 255, 0.08)"
          : "linear-gradient(135deg, #0D1B2E, #111C2E)",
        color: wallet ? "#00E5FF" : "#94A3B8",
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        whiteSpace: "nowrap",
      }}
    >
      {wallet && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#34D399",
            boxShadow: "0 0 6px #34D399",
            flexShrink: 0,
          }}
        />
      )}
      {truncated ?? "Connect Wallet"}
    </button>
  );
}
