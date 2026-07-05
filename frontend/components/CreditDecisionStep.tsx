import { useEffect, useState } from "react";
import TrustIndicator from "./ui/TrustIndicator";
import ScoreBreakdown from "./ScoreBreakdown";
import API from "@/lib/api";

interface Props {
  analysis: any;
  wallet: string;
  onNext: () => void;
}

export default function CreditDecisionStep({ analysis, wallet, onNext }: Props) {
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wallet) return;
    setLoading(true);
    API.get(`/underwriting/report/${wallet}`)
      .then((res) => {
        setReport(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load underwriting report:", err);
        setLoading(false);
      });
  }, [wallet]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <p style={{ color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
          Loading Underwriting Report...
        </p>
      </div>
    );
  }

  const score = report?.credit_score || 350;
  const rating = report?.badge || "WATCHLIST";
  const riskLevel = report?.risk_level || "MEDIUM RISK";

  return (
    <div style={{ padding: "10px 0" }}>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: "#E2E8F0", marginBottom: 16 }}>
        Your Wallet Trust Profile
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr",
          gap: 24,
          marginBottom: 24,
        }}
      >
        {/* Score display */}
        <div
          style={{
            background: "#0A1425",
            border: "1px solid #111C2E",
            borderRadius: 12,
            padding: 24,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TrustIndicator score={score} />
          <div style={{ fontSize: 11, fontWeight: 700, color: "#34D399", marginTop: 12 }}>
            {rating} • {riskLevel}
          </div>
          <div style={{ fontSize: 10, color: "#64748B", marginTop: 4 }}>
            Default Probability: {report?.default_probability.toFixed(1)}%
          </div>
        </div>

        {/* Dynamic breakdown from AI Underwriting Summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              background: "rgba(52, 211, 153, 0.03)",
              border: "1px solid rgba(52, 211, 153, 0.1)",
              borderRadius: 8,
              padding: 16,
              fontSize: 12,
              color: "#94A3B8",
              lineHeight: 1.5,
            }}
          >
            <strong>AI Underwriter Note:</strong> {report?.summary}
          </div>
        </div>
      </div>

      {/* Score Breakdown Component for complete visibility */}
      <div style={{ marginBottom: 24 }}>
        <ScoreBreakdown wallet={wallet} />
      </div>

      <button
        onClick={onNext}
        style={{
          width: "100%",
          background: "#34D399",
          border: "none",
          borderRadius: 8,
          color: "#040C1A",
          fontWeight: 800,
          fontSize: 13,
          padding: "12px 0",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        CONTINUE TO LOAN OFFER ➔
      </button>
    </div>
  );
}
