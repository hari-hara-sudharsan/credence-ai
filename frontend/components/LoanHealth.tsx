interface LoanHealthProps {
  healthFactor: number;
  healthStatus: string;
}

export default function LoanHealth({ healthFactor, healthStatus }: LoanHealthProps) {
  // Map health status to colors
  let statusColor = "text-[#3DDC97]";
  let progressColor = "bg-[#3DDC97]";
  let dotColor = "bg-[#3DDC97]";
  let statusIcon = "🟢";

  if (healthStatus === "Healthy") {
    statusColor = "text-[#F5D061]";
    progressColor = "bg-[#F5D061]";
    dotColor = "bg-[#F5D061]";
    statusIcon = "🟡";
  } else if (healthStatus === "Warning") {
    statusColor = "text-[#E67E22]";
    progressColor = "bg-[#E67E22]";
    dotColor = "bg-[#E67E22]";
    statusIcon = "🟠";
  } else if (healthStatus === "Critical") {
    statusColor = "text-[#B85C5C]";
    progressColor = "bg-[#B85C5C]";
    dotColor = "bg-[#B85C5C]";
    statusIcon = "🔴";
  }

  // Calculate percentage for progress bar (max represented at health factor 2.5)
  const percent = Math.min((healthFactor / 2.5) * 100, 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs tracking-[0.1em] text-[#6B7280] uppercase">
          Health Factor
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#E8E6DE]/85">
            {statusIcon} {healthStatus}
          </span>
          <span className={`font-display text-lg font-medium ${statusColor}`}>
            {healthFactor.toFixed(2)}
          </span>
        </div>
      </div>
      
      {/* Progress Bar Container */}
      <div className="w-full bg-[#1A1F2B] h-2 rounded-full overflow-hidden border border-[#2A3142]/40">
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${progressColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-[10px] font-mono text-[#6B7280] tracking-[0.06em]">
        <span>CRITICAL (1.0)</span>
        <span>HEALTHY (1.5)</span>
        <span>EXCELLENT (2.0+)</span>
      </div>
    </div>
  );
}
