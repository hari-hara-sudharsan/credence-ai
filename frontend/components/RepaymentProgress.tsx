interface RepaymentProgressProps {
  stage: "preparing" | "signature" | "broadcasting" | "confirming" | "completed";
}

const STAGES = [
  { key: "preparing", label: "Preparing Transaction", icon: "⚙️" },
  { key: "signature", label: "Waiting For Signature", icon: "🔑" },
  { key: "broadcasting", label: "Broadcasting", icon: "📡" },
  { key: "confirming", label: "Waiting For Block Confirmation", icon: "⛓️" },
  { key: "completed", label: "Completed", icon: "✓" },
];

export default function RepaymentProgress({ stage }: RepaymentProgressProps) {
  const currentIdx = STAGES.findIndex((s) => s.key === stage);

  return (
    <div className="border border-[#2A3142] bg-[#1A1F2B]/80 rounded-sm p-6 space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-[#2A3142]/40">
        <span className="inline-block w-1.5 h-3 bg-[#3DDC97] rounded-sm" />
        <h4 className="font-mono text-xs tracking-[0.1em] text-[#E8E6DE] uppercase">
          Repayment Progress Status
        </h4>
      </div>

      <div className="space-y-4">
        {STAGES.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isActive = idx === currentIdx;
          const isPending = idx > currentIdx;

          return (
            <div key={step.key} className="flex items-center gap-3.5">
              {/* Step indicator */}
              <div 
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-mono transition-all duration-300 ${
                  isCompleted 
                    ? "border-[#3DDC97] bg-[#3DDC97] text-[#0B0E14]" 
                    : isActive 
                    ? "border-[#3DDC97] text-[#3DDC97] pulse-ring" 
                    : "border-[#2A3142] text-[#6B7280]"
                }`}
              >
                {isCompleted ? "✓" : step.icon}
              </div>

              {/* Label */}
              <span 
                className={`font-mono text-xs tracking-[0.04em] transition-colors duration-300 ${
                  isActive 
                    ? "text-[#E8E6DE] font-semibold" 
                    : isCompleted 
                    ? "text-[#E8E6DE]/70" 
                    : "text-[#6B7280]"
                }`}
              >
                {step.label}
                {isActive && stage !== "completed" && "…"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
