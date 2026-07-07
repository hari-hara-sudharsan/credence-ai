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
  const { wallet } = useWallet();
  const [metrics, setMetrics] = useState<any | null>(null);
  const [position, setPosition] = useState<any | null>(null);

  const [score, setScore] = useState<number>(600);
  const [limit, setLimit] = useState<number>(5000);
  const [rate, setRate] = useState<number>(5.0);

  useEffect(() => {
    if (wallet) {
      API.get(`/v1/trust/${wallet}`).then((res) => {
        if (res.data?.trustScore) {
          setScore(res.data.trustScore);
        }
      }).catch(console.error);

      API.get(`/v1/protocol/decision?wallet=${wallet}&application=LENDING`).then((res) => {
        if (res.data && res.data.terms) {
          setLimit(res.data.terms.limit || 5000);
          setRate(res.data.terms.interestRate || 5.0);
        }
      }).catch(console.error);
    }
  }, [wallet]);

  const refreshData = async (optimisticData?: { balanceChange?: number; type?: "deposit" | "withdraw" }) => {
    // Always fetch pool stats
    try {
      const statsRes = await API.get("/pool/stats");
      setMetrics(statsRes.data);
    } catch (err) {
      console.error(err);
      setMetrics((prev: any) => {
        const base = prev || {
          total_liquidity: 5000.0,
          borrowed_amount: 1500.0,
          available_liquidity: 3500.0,
          utilization_rate: 30.0,
          average_interest: 5.0,
          health: "HEALTHY"
        };
        if (optimisticData?.balanceChange) {
          const change = optimisticData.balanceChange;
          if (optimisticData.type === "deposit") {
            const newTotal = base.total_liquidity + change;
            const newAvail = base.available_liquidity + change;
            return {
              ...base,
              total_liquidity: newTotal,
              available_liquidity: newAvail,
              utilization_rate: (base.borrowed_amount / newTotal) * 100
            };
          } else {
            const newTotal = Math.max(0, base.total_liquidity - change);
            const newAvail = Math.max(0, base.available_liquidity - change);
            return {
              ...base,
              total_liquidity: newTotal,
              available_liquidity: newAvail,
              utilization_rate: newTotal > 0 ? (base.borrowed_amount / newTotal) * 100 : 0
            };
          }
        }
        return base;
      });
    }

    // Only fetch lender position if wallet is provided
    if (wallet && wallet.trim().length > 0) {
      try {
        const positionRes = await API.get(`/pool/lender/${wallet.trim()}`);
        setPosition(positionRes.data);
      } catch (err) {
        console.error(err);
        setPosition((prev: any) => {
          const base = prev || { wallet, balance: 0, shares: 0, yield_earned: 0 };
          if (optimisticData?.balanceChange) {
            const change = optimisticData.balanceChange;
            if (optimisticData.type === "deposit") {
              return {
                ...base,
                balance: base.balance + change,
                shares: base.shares + change
              };
            } else {
              return {
                ...base,
                balance: Math.max(0, base.balance - change),
                shares: Math.max(0, base.shares - change)
              };
            }
          }
          return base;
        });
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
            <BorrowPanel score={score} limit={limit} rate={rate} />
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
