"use client";

import { useState } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function ConnectWallet({
  onConnect,
}: {
  onConnect: (wallet: string) => void;
}) {
  const [wallet, setWallet] = useState("");

  const connect = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setWallet(accounts[0]);
    onConnect(accounts[0]);
  };

  const truncated = wallet
    ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}`
    : null;

  return (
    <div>
      <button
        onClick={connect}
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 0.5,
          padding: "10px 20px",
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

      {wallet && (
        <p
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "#4A6080",
            fontFamily: "JetBrains Mono, monospace",
            letterSpacing: 0.3,
          }}
        >
          {wallet}
        </p>
      )}
    </div>
  );
}