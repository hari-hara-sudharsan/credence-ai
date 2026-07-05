"use client";

import { useWallet } from "@/context/WalletContext";

export default function WalletConnect() {
  const { wallet, chainId, isCorrectChain, connect, disconnect, switchToMainnet } = useWallet();

  const truncated = wallet
    ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}`
    : null;

  const showWrongNetwork = wallet && !isCorrectChain && chainId !== null;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      {showWrongNetwork && (
        <button
          onClick={switchToMainnet}
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.5,
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid #FF4D6A44",
            background: "rgba(255, 77, 106, 0.08)",
            color: "#FF4D6A",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#FF4D6A",
              boxShadow: "0 0 6px #FF4D6A",
              flexShrink: 0,
            }}
          />
          Wrong Network
        </button>
      )}

      <button
        onClick={wallet ? disconnect : connect}
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
        {wallet && isCorrectChain && (
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
        {wallet ? truncated : "Connect Wallet"}
      </button>
    </div>
  );
}
