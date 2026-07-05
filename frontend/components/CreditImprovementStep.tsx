"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AnimatedCounter from "./ui/AnimatedCounter";

interface Props {
  creditScore: number;
  interestRate: number;
}

export default function CreditImprovementStep({ creditScore, interestRate }: Props) {
  const [showImproved, setShowImproved] = useState(false);

  // Calculate projected improvement from successful repayment
  // Real logic: repayment adds +80 to +120 points depending on starting score
  const improvementBonus = creditScore < 400 ? 120 : creditScore < 600 ? 100 : 80;
  const projectedScore = Math.min(850, creditScore + improvementBonus);
  
  // Interest rate improves proportionally to the score improvement
  const projectedRate = Math.max(5, interestRate - (improvementBonus / 20));

  useEffect(() => {
    let active = true;
    const isDemo = typeof window !== "undefined" && window.location.search.includes("demo=true");
    const delay = isDemo ? 200 : 1200;

    const timer = setTimeout(() => {
      if (active) setShowImproved(true);
    }, delay);
    return () => { active = false; clearTimeout(timer); };
  }, []);


  return (
    <div style={{ padding: "10px 0", textAlign: "center" }}>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: "#E2E8F0", marginBottom: 8 }}>
        Credit Improvement Moment
      </h3>
      <p style={{ fontSize: 13, color: "#64748B", marginBottom: 24 }}>
        Your financial actions created portable on-chain reputation.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
          marginBottom: 32,
        }}
      >
        {/* Before */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: "#64748B", fontWeight: 700, letterSpacing: 0.5 }}>
            BEFORE
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#FF4D6A",
              margin: "6px 0",
              textDecoration: showImproved ? "line-through" : "none",
              opacity: showImproved ? 0.4 : 1,
              transition: "all 0.4s ease",
            }}
          >
            {creditScore}
          </div>
          <div style={{ fontSize: 12, color: "#FF4D6A", opacity: showImproved ? 0.4 : 1 }}>
            {interestRate}% Interest Rate
          </div>
        </div>

        {/* Arrow */}
        <div style={{ fontSize: 24, color: "#1D2E49", transition: "color 0.4s ease" }}>
          ➔
        </div>

        {/* After */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: "#34D399", fontWeight: 700, letterSpacing: 0.5 }}>
            AFTER
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: showImproved ? "#34D399" : "#64748B",
              margin: "4px 0",
              scale: showImproved ? "1.1" : "1.0",
              transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            {showImproved ? <AnimatedCounter value={projectedScore} /> : "---"}
          </div>

          <div style={{ fontSize: 12, color: showImproved ? "#34D399" : "#64748B" }}>
            {projectedRate.toFixed(0)}% Interest Rate
          </div>
        </div>
      </div>

      <Link
        href="/submission"
        style={{
          display: "block",
          width: "100%",
          background: "#34D399",
          border: "none",
          borderRadius: 8,
          color: "#040C1A",
          fontWeight: 800,
          fontSize: 13,
          padding: "12px 0",
          textDecoration: "none",
          transition: "all 0.2s ease",
        }}
      >
        FINISH & READ AUDIT DOCS ➔
      </Link>
    </div>
  );
}
