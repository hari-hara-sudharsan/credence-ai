"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdapterCardProps {
  protocol: "LENDING" | "INSURANCE" | "RWA" | "DAO" | "INSTITUTIONAL";
}

const ADAPTER_DETAILS = {
  LENDING: {
    title: "Lending Protocol Adapter",
    description: "Computes capital efficiency limits, APR rates, and collateral requirements.",
    consumes: ["Core Credit Score", "Reputation Trust Score", "Loan History", "Default Probability"],
    produces: [
      { key: "max_ltv", label: "Max Loan-to-Value", desc: "Dynamic LTV cap based on rep score (30% - 85%)" },
      { key: "interest_rate", label: "Borrowing APR", desc: "Risk-adjusted APR rate (4% - 24%)" },
      { key: "max_loan", label: "Max Loan Limit", desc: "Calculated borrowing capacity in HSK terms" },
      { key: "eligible", label: "Eligibility Status", desc: "True if reputation metrics pass threshold checks" }
    ]
  },
  INSURANCE: {
    title: "Insurance Risk Adapter",
    description: "Calculates coverage capacities and risk premium multipliers.",
    consumes: ["Reputation Trust Score", "Asset Stability Score", "Timely Settlements"],
    produces: [
      { key: "risk_class", label: "Risk Classification", desc: "Tiers wallet into LOW, MEDIUM, or HIGH risk class" },
      { key: "coverage_limit", label: "Max Coverage Limit", desc: "Calculated liability coverage limit in HSK" },
      { key: "premium_discount", label: "Premium Discount", desc: "Reputation-based discount rate (0% - 30%)" }
    ]
  },
  RWA: {
    title: "Real World Asset Adapter",
    description: "Determines tokenized asset capacity, compliance clearances, and purchase caps.",
    consumes: ["Wallet Lifespan", "Transaction Frequency", "Credit Score", "Trust Score"],
    produces: [
      { key: "asset_limit", label: "RWA Allocation Limit", desc: "Cap on asset purchases and holding values" },
      { key: "risk", label: "RWA Risk Tier", desc: "Calculates risk exposure (LOW, MEDIUM, HIGH)" },
      { key: "institutional_grade", label: "Institutional Grade Check", desc: "Clears address for high-value tokenized options" }
    ]
  },
  DAO: {
    title: "DAO Governance Adapter",
    description: "Maps voting weights and delegation profiles based on protocol reputation.",
    consumes: ["Reputation Trust Score", "Protocol Diversity Score", "Reputation Rating"],
    produces: [
      { key: "voting_weight", label: "Voting Power Modifier", desc: "Boosts voting weight (HIGH, MEDIUM, LOW)" },
      { key: "delegate_recommended", label: "Delegation Clearance", desc: "Recommends account for delegate leadership roles" }
    ]
  },
  INSTITUTIONAL: {
    title: "Institutional Audit Adapter",
    description: "Consolidates comprehensive risk reviews and compliance checklists.",
    consumes: ["Financial Reliability Score", "Credit Score", "Trust Score", "Protocol Standing"],
    produces: [
      { key: "approved", label: "Compliance Clearance", desc: "Checks institutional eligibility rules" },
      { key: "confidence", label: "Underwriter Confidence", desc: "Protocol confidence indicator (0% - 100%)" },
      { key: "risk", label: "Audit Risk Rating", desc: "Outputs formal risk assessments (LOW, MEDIUM, HIGH)" }
    ]
  }
};

export default function AdapterCard({ protocol }: AdapterCardProps) {
  const details = ADAPTER_DETAILS[protocol];

  if (!details) return null;

  return (
    <Card className="border-[#2A3142] bg-[#1A1F2B]/40 text-[#E8E6DE] hover:border-[#00E5FF]/20 hover:bg-[#1A1F2B]/50 transition-all duration-300 relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#2A3142]/40">
        <div>
          <Badge className="font-mono text-[9px] tracking-widest uppercase border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/10 font-semibold px-2 py-0.5 rounded-sm">
            {protocol} ADAPTER
          </Badge>
          <h3 className="font-display text-xl font-medium text-[#E8E6DE]/95 mt-2">
            {details.title}
          </h3>
        </div>
      </CardHeader>
      
      <CardContent className="pt-5 space-y-6">
        <p className="font-sans text-xs text-[#6B7280] leading-relaxed">
          {details.description}
        </p>

        {/* Consumes Section */}
        <div className="space-y-2">
          <span className="font-mono text-[9px] tracking-[0.08em] text-[#6B7280] uppercase block">
            Consumes Credit Variables
          </span>
          <div className="flex flex-wrap gap-1.5">
            {details.consumes.map((varName) => (
              <span 
                key={varName}
                className="font-mono text-[10px] text-[#E8E6DE]/80 bg-[#0B0E14]/40 border border-[#2A3142]/45 px-2 py-0.5 rounded-sm"
              >
                {varName}
              </span>
            ))}
          </div>
        </div>

        {/* Produces Section */}
        <div className="space-y-3 border-t border-[#2A3142]/20 pt-4">
          <span className="font-mono text-[9px] tracking-[0.08em] text-[#6B7280] uppercase block">
            Produces Adapted Parameters
          </span>
          <div className="grid grid-cols-1 gap-2.5">
            {details.produces.map((prod) => (
              <div 
                key={prod.key}
                className="bg-[#0B0E14]/30 border border-[#2A3142]/30 rounded-sm p-2.5 flex items-start gap-3"
              >
                <code className="font-mono text-[10px] text-[#00E5FF] mt-0.5 shrink-0 bg-[#00E5FF]/5 border border-[#00E5FF]/10 px-1 py-0.5 rounded-sm">
                  {prod.key}
                </code>
                <div>
                  <h4 className="font-sans text-xs font-semibold text-[#E8E6DE]/90">{prod.label}</h4>
                  <p className="font-sans text-[10px] text-[#6B7280] mt-0.5 leading-relaxed">{prod.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
