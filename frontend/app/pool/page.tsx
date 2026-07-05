"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useWallet } from "@/context/WalletContext";
import LiquidityDashboard from "@/components/LiquidityDashboard";
import DepositCard from "@/components/DepositCard";
import BorrowPanel from "@/components/BorrowPanel";
import InterestModel from "@/components/InterestModel";
import PoolAnalytics from "@/components/PoolAnalytics";

export default function PoolPage() {
  const { wallet: connectedWallet } = useWallet();
  const [metrics, setMetrics] = useState<any | null>(null);
  const [position, setPosition] = useState<any | null>(null);
  const wallet = connectedWallet || "";

  const refreshData = async () => {
    // Always fetch pool stats
    try {
      const statsRes = await API.get("/pool/stats");
      setMetrics(statsRes.data);
    } catch (err) {
      console.error(err);
      setMetrics({
        total_liquidity: 0,
        borrowed_amount: 0,
        available_liquidity: 0,
        utilization_rate: 0,
        average_interest: 0,
        health: "INITIALIZING"
      });
    }

    // Only fetch lender position if wallet is provided
    if (wallet && wallet.trim().length > 0) {
      try {
        const positionRes = await API.get(`/pool/lender/${wallet.trim()}`);
        setPosition(positionRes.data);
      } catch (err) {
        console.error(err);
        setPosition({ wallet, balance: 0, shares: 0, yield_earned: 0 });
      }
    } else {
      setPosition({ wallet: "", balance: 0, shares: 0, yield_earned: 0 });
    }
  };

  useEffect(() => {
    refreshData();
  }, [wallet]);

  if (!metrics || !position) return <p style={{ padding: 40, color: "#64748B" }}>Loading Lending Pool details...</p>;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#040C1A",
        color: "#E2E8F0",
        fontFamily: "Inter, sans-serif",
        padding: "60px 0 100px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: "#4A6080",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          <span>LENDING INFRASTRUCTURE</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>DECENTRALIZED LENDING POOL</span>
        </div>

        {/* Hero Section */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#E2E8F0",
              letterSpacing: -1,
              marginBottom: 12,
            }}
          >
            AI-Powered Lending Pool
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 750, lineHeight: 1.5 }}>
            Capital-efficient lending powered by wallet intelligence. Earn yields as a lender or borrow under-collateralized assets backed by cryptographic credit score credentials.
          </p>
        </div>

        {/* Stats strip */}
        <LiquidityDashboard metrics={metrics} />

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32, alignItems: "start" }}>
          
          {/* Left Column: controls & positioning */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <DepositCard position={position} onRefresh={refreshData} />
            <BorrowPanel score={742} limit={5000} rate={5.0} />
          </div>

          {/* Right Column: Dynamic interest & analytics */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <InterestModel />
            <PoolAnalytics />
          </div>

        </div>

      </div>
    </main>
  );
}
