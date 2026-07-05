"use client";

const STEPS = [
  { label: "Wallet Address", desc: "Target Ethereum address input", icon: "🔑" },
  { label: "Credence AI", desc: "Core assessment engine", icon: "🧠" },
  { label: "Protocol Profile", desc: "Consolidated score context", icon: "📊" },
  { label: "Protocol Adapter", desc: "Standardized transformation factory", icon: "⚙️" },
  { label: "Target Protocol", desc: "Client contract response payload", icon: "📡" }
];

export default function IntegrationFlow() {
  return (
    <div className="border border-[#2A3142] bg-[#1A1F2B]/40 rounded-sm p-6 space-y-6 text-[#E8E6DE]">
      <div className="flex items-center gap-2 pb-3 border-b border-[#2A3142]/40">
        <span className="inline-block w-1.5 h-3 bg-[#00E5FF] rounded-sm" />
        <h4 className="font-mono text-xs tracking-[0.1em] text-[#E8E6DE] uppercase">
          Standardized Adapter Transformation Pipeline
        </h4>
      </div>

      {/* Horizontal Pipeline layout */}
      <div className="hidden md:flex items-center justify-between gap-2 pt-2 relative">
        {/* Continuous background glowing connector line */}
        <div className="absolute top-8 left-10 right-10 h-[2px] bg-[#2A3142]/65 z-0">
          <div className="h-full bg-gradient-to-r from-[#00E5FF] via-[#3DDC97] to-[#00E5FF] animate-pulse-line w-full" />
        </div>

        {STEPS.map((step, idx) => (
          <div 
            key={step.label} 
            className="flex flex-col items-center text-center z-10 space-y-3 relative group w-44"
          >
            {/* Step node */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B0E14] border border-[#2A3142] group-hover:border-[#00E5FF]/45 group-hover:bg-[#1A2740]/40 transition-all duration-300 text-lg relative">
              {/* Outer pulsing ring for first/active items */}
              <div className="absolute inset-0 rounded-full border border-[#00E5FF]/20 pulse-ring" />
              <span>{step.icon}</span>
            </div>

            {/* Labels */}
            <div className="space-y-1">
              <h5 className="font-mono text-xs font-semibold text-[#E8E6DE]">
                {step.label}
              </h5>
              <p className="font-sans text-[9px] leading-relaxed text-[#6B7280] max-w-[130px] mx-auto">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Vertical Pipeline layout for mobile screens */}
      <div className="flex md:hidden flex-col gap-6 pl-4 border-l border-[#2A3142] relative">
        {STEPS.map((step, idx) => (
          <div key={step.label} className="relative pl-6 space-y-1">
            {/* Step node dot */}
            <span className="absolute -left-[23px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-[#2A3142] bg-[#0B0E14] text-[9px]">
              {step.icon}
            </span>
            <h5 className="font-mono text-xs font-semibold text-[#E8E6DE]">
              {step.label}
            </h5>
            <p className="font-sans text-[10px] text-[#6B7280]">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse-line {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.95; }
        }
        .animate-pulse-line {
          animation: pulse-line 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
