interface LoanTimelineProps {
  status: string;
  createdAt: string;
  dueDate: string;
}

export default function LoanTimeline({ status, createdAt, dueDate }: LoanTimelineProps) {
  const formatDate = (isoString: string) => {
    if (!isoString) return "Pending";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return isoString;
    }
  };

  // Determine stage states
  const isCreated = true; // Always true
  const isActive = status === "ACTIVE" || status === "DEFAULTED" || status === "REPAID";
  const isRepayed = status === "REPAID";
  const isOverdue = status === "DEFAULTED";

  return (
    <div className="space-y-4">
      <div className="font-mono text-xs tracking-[0.1em] text-[#6B7280] uppercase">
        Loan Lifecycle Timeline
      </div>

      <div className="relative flex items-center justify-between py-2">
        {/* Connection Line */}
        <div className="absolute left-4 right-4 top-1/2 h-[2px] -translate-y-1/2 bg-[#2A3142] z-0" />
        
        {/* Completed Connection Lines */}
        <div 
          className={`absolute left-4 top-1/2 h-[2px] -translate-y-1/2 bg-[#3DDC97] transition-all duration-500 z-0`}
          style={{ 
            width: isRepayed ? "calc(100% - 32px)" : isActive ? "50%" : "0%" 
          }}
        />

        {/* Step 1: Created */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#3DDC97] bg-[#0B0E14] text-[#3DDC97] text-xs font-mono">
            ✓
          </div>
          <span className="mt-2 font-mono text-[10px] tracking-[0.06em] text-[#E8E6DE] uppercase">
            Created
          </span>
          <span className="font-mono text-[9px] text-[#6B7280]">
            {formatDate(createdAt)}
          </span>
        </div>

        {/* Step 2: Active */}
        <div className="relative z-10 flex flex-col items-center">
          <div 
            className={`flex h-8 w-8 items-center justify-center rounded-full border bg-[#0B0E14] text-xs font-mono transition-all duration-300 ${
              isActive 
                ? "border-[#3DDC97] text-[#3DDC97]" 
                : "border-[#2A3142] text-[#6B7280]"
            }`}
          >
            {isActive ? "✓" : "2"}
          </div>
          <span 
            className={`mt-2 font-mono text-[10px] tracking-[0.06em] uppercase ${
              isActive ? "text-[#E8E6DE]" : "text-[#6B7280]"
            }`}
          >
            Active
          </span>
          <span className="font-mono text-[9px] text-[#6B7280]">
            {createdAt ? "On-chain" : "Awaiting"}
          </span>
        </div>

        {/* Step 3: Repayment */}
        <div className="relative z-10 flex flex-col items-center">
          <div 
            className={`flex h-8 w-8 items-center justify-center rounded-full border bg-[#0B0E14] text-xs font-mono transition-all duration-300 ${
              isRepayed 
                ? "border-[#3DDC97] text-[#3DDC97]" 
                : isOverdue 
                ? "border-[#B85C5C] text-[#B85C5C] pulse-ring" 
                : isActive 
                ? "border-[#F5D061] text-[#F5D061]" 
                : "border-[#2A3142] text-[#6B7280]"
            }`}
          >
            {isRepayed ? "✓" : "3"}
          </div>
          <span 
            className={`mt-2 font-mono text-[10px] tracking-[0.06em] uppercase ${
              isRepayed 
                ? "text-[#3DDC97]" 
                : isOverdue 
                ? "text-[#B85C5C]" 
                : isActive 
                ? "text-[#F5D061]" 
                : "text-[#6B7280]"
            }`}
          >
            {isRepayed ? "Settled" : isOverdue ? "Overdue" : "Due"}
          </span>
          <span className="font-mono text-[9px] text-[#6B7280]">
            {dueDate ? formatDate(dueDate) : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
