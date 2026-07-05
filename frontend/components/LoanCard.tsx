import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoanHealth from "./LoanHealth";
import LoanTimeline from "./LoanTimeline";
import RepayLoanButton from "./RepayLoanButton";

interface CreditImpact {
  current_credit_score: number;
  projected_score_repaid: number;
  repaid_score_change: number;
  projected_score_overdue: number;
  overdue_score_change: number;
  protocol_trust_impact: string;
}

interface Loan {
  loan_id: string;
  status: string;
  amount: number;
  interest_rate: number;
  collateral_ratio: number;
  duration: number;
  created_at: string;
  due_date: string;
  health_factor: number;
  health_status: string;
  credit_impact: CreditImpact;
}

export default function LoanCard({ loan, onSuccess }: { loan: Loan; onSuccess?: () => void }) {
  // Determine badge styling based on status
  let badgeStyle = "border-gray-500 text-gray-400 bg-gray-500/10";
  if (loan.status === "ACTIVE") {
    badgeStyle = "border-[#3DDC97] text-[#3DDC97] bg-[#3DDC97]/10 pulse-ring";
  } else if (loan.status === "REPAID") {
    badgeStyle = "border-emerald-500 text-emerald-500 bg-emerald-500/10";
  } else if (loan.status === "DEFAULTED") {
    badgeStyle = "border-[#B85C5C] text-[#B85C5C] bg-[#B85C5C]/10";
  } else if (loan.status === "CANCELLED") {
    badgeStyle = "border-red-400 text-red-400 bg-red-400/5";
  }

  // Helper to truncate UUID
  const truncateId = (id: string) => {
    if (id.length <= 12) return id;
    return `${id.slice(0, 8)}...${id.slice(-4)}`;
  };

  const impact = loan.credit_impact;

  return (
    <Card className="border-[#2A3142] bg-[#1A1F2B]/40 text-[#E8E6DE] transition-all duration-300 hover:border-[#3DDC97]/30 hover:bg-[#1A1F2B]/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-[#2A3142]/40">
        <div>
          <span className="font-mono text-[10px] tracking-[0.1em] text-[#6B7280] uppercase">
            Loan ID
          </span>
          <h3 className="font-mono text-sm text-[#E8E6DE]/90 font-medium mt-0.5" title={loan.loan_id}>
            #{truncateId(loan.loan_id)}
          </h3>
        </div>
        <Badge className={`font-mono text-[10px] tracking-[0.08em] px-2.5 py-0.5 rounded-sm border uppercase ${badgeStyle}`}>
          {loan.status}
        </Badge>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {/* Core numbers grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0B0E14]/50 border border-[#2A3142]/30 rounded-sm p-3">
            <span className="font-mono text-[10px] tracking-[0.08em] text-[#6B7280] uppercase">
              Principal Amount
            </span>
            <div className="font-display text-2xl font-semibold mt-1">
              {loan.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="font-sans text-sm text-[#6B7280] font-normal">HSK</span>
            </div>
          </div>
          
          <div className="bg-[#0B0E14]/50 border border-[#2A3142]/30 rounded-sm p-3">
            <span className="font-mono text-[10px] tracking-[0.08em] text-[#6B7280] uppercase">
              Interest Rate
            </span>
            <div className="font-display text-2xl font-semibold mt-1 text-[#3DDC97]">
              {loan.interest_rate}% <span className="font-sans text-sm text-[#6B7280] font-normal">APR</span>
            </div>
          </div>

          <div className="bg-[#0B0E14]/50 border border-[#2A3142]/30 rounded-sm p-3">
            <span className="font-mono text-[10px] tracking-[0.08em] text-[#6B7280] uppercase">
              Collateral Ratio
            </span>
            <div className="font-display text-2xl font-semibold mt-1">
              {loan.collateral_ratio}%
            </div>
          </div>

          <div className="bg-[#0B0E14]/50 border border-[#2A3142]/30 rounded-sm p-3">
            <span className="font-mono text-[10px] tracking-[0.08em] text-[#6B7280] uppercase">
              Duration
            </span>
            <div className="font-display text-2xl font-semibold mt-1">
              {loan.duration} <span className="font-sans text-sm text-[#6B7280] font-normal">Days</span>
            </div>
          </div>
        </div>

        {/* Health Component */}
        <div className="pt-2">
          <LoanHealth healthFactor={loan.health_factor} healthStatus={loan.health_status} />
        </div>

        {/* Timeline Component */}
        <div className="border-t border-[#2A3142]/40 pt-5">
          <LoanTimeline 
            status={loan.status} 
            createdAt={loan.created_at} 
            dueDate={loan.due_date} 
          />
        </div>

        {/* Credit Impact Forecast Panel */}
        {impact && (
          <div className="border border-[#2A3142]/60 bg-[#0B0E14]/60 rounded-sm p-4 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-1 h-3 bg-[#3DDC97] rounded-sm" />
              <h4 className="font-mono text-xs tracking-[0.1em] text-[#E8E6DE] uppercase">
                Credit Score Impact Forecast
              </h4>
            </div>
            
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-[#6B7280]">Current Reputation Score</span>
                <span className="font-mono text-[#E8E6DE]/90 font-medium">{impact.current_credit_score}</span>
              </div>
              
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-[#6B7280]">If repaid on time</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-[#E8E6DE]/95">{impact.projected_score_repaid}</span>
                  <span className="text-[#3DDC97] font-semibold text-[10px]">
                    (+{impact.repaid_score_change})
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-[#6B7280]">If overdue</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-[#E8E6DE]/95">{impact.projected_score_overdue}</span>
                  <span className="text-[#B85C5C] font-semibold text-[10px]">
                    ({impact.overdue_score_change})
                  </span>
                </div>
              </div>
              
              <div className="border-t border-[#2A3142]/40 mt-3 pt-2.5 flex justify-between items-center text-[10px] font-mono">
                <span className="text-[#6B7280] uppercase">Protocol Trust Impact</span>
                <span className={`uppercase font-semibold tracking-wider ${
                  impact.repaid_score_change > 0 ? "text-[#3DDC97]" : "text-[#6B7280]"
                }`}>
                  {impact.protocol_trust_impact}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Repayment Button */}
        {(loan.status === "ACTIVE" || loan.status === "DEFAULTED") && (
          <div className="pt-2 border-t border-[#2A3142]/40">
            <RepayLoanButton loan={loan} onSuccess={onSuccess || (() => {})} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
