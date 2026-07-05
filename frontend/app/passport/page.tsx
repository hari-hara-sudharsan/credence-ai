"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PassportIndexPage() {
  const [wallet, setWallet] = useState("");
  const router = useRouter();

  const handleAssess = (e: React.FormEvent) => {
    e.preventDefault();
    if (wallet.trim()) {
      router.push(`/passport/${wallet.trim()}`);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#040C1A",
        color: "#E2E8F0",
        fontFamily: "Inter, sans-serif",
        padding: "100px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          background: "#0A1425",
          border: "1px solid #111C2E",
          borderRadius: 14,
          padding: 32,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#34D399",
            letterSpacing: 2,
            fontFamily: "JetBrains Mono, monospace",
            marginBottom: 16,
          }}
        >
          CREDIT IDENTITY ENGINE
        </div>
        
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, letterSpacing: -0.5 }}>
          Assess Your Wallet
        </h1>
        
        <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5, marginBottom: 24 }}>
          Enter your EVM public wallet address to compile your Credit Passport and view risk scores.
        </p>

        <form onSubmit={handleAssess} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            type="text"
            placeholder="0x..."
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            style={{
              width: "100%",
              background: "#050B14",
              border: "1px solid #1D2E49",
              borderRadius: 8,
              padding: "12px 16px",
              color: "#E2E8F0",
              fontSize: 14,
              fontFamily: "JetBrains Mono, monospace",
              outline: "none",
            }}
          />

          <button
            type="submit"
            disabled={!wallet.trim()}
            style={{
              background: wallet.trim() ? "#34D399" : "#1D2E49",
              border: "none",
              borderRadius: 8,
              padding: "12px 0",
              color: "#040C1A",
              fontWeight: 850,
              fontSize: 14,
              cursor: wallet.trim() ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
            }}
          >
            COMPILE CREDIT PASSPORT
          </button>
        </form>
      </div>
    </main>
  );
}
