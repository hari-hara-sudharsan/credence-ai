"use client";

interface EvolutionEvent {
  timestamp: string;
  previous_score: number;
  current_score: number;
  delta: number;
  reason: string;
}

interface ReputationTimelineProps {
  events: EvolutionEvent[];
}

export default function ReputationTimeline({ events }: ReputationTimelineProps) {
  // Standard lifecycle steps
  const LIFECYCLE_STEPS = [
    { label: "Loan Created", desc: "Liability recorded on-chain", icon: "📄" },
    { label: "Loan Repaid", desc: "Principal settled dynamically", icon: "✓" },
    { label: "Trust Increased", desc: "Protocol reputational gain", icon: "📈" },
    { label: "Credit Improved", desc: "Future rates adjusted lower", icon: "💎" },
  ];

  return (
    <div className="border border-[#2A3142] bg-[#1A1F2B]/40 rounded-sm p-6 space-y-8 text-[#E8E6DE]">
      {/* 1. Protocol Lifecycle Pipeline */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-3 bg-[#00E5FF] rounded-sm" />
          <h4 className="font-mono text-xs tracking-[0.1em] text-[#E8E6DE] uppercase">
            Reputation Lifecycle Pipeline
          </h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {LIFECYCLE_STEPS.map((step, idx) => (
            <div 
              key={step.label}
              className="bg-[#0B0E14]/40 border border-[#2A3142]/40 rounded-sm p-3.5 relative flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{step.icon}</span>
                <span className="font-mono text-[10px] text-[#4A6080]">0{idx + 1}</span>
              </div>
              <div className="mt-4">
                <h5 className="font-mono text-xs font-semibold text-[#E8E6DE]">{step.label}</h5>
                <p className="font-sans text-[10px] text-[#6B7280] mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Chronological History Log */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-3 bg-[#00E5FF] rounded-sm" />
          <h4 className="font-mono text-xs tracking-[0.1em] text-[#E8E6DE] uppercase">
            Chronological Reputation Ledger
          </h4>
        </div>

        {events.length === 0 ? (
          <div className="border border-dashed border-[#2A3142] bg-[#0B0E14]/20 rounded-sm p-6 text-center font-sans text-xs text-[#6B7280]">
            No behavior events recorded. Create or repay a loan to trigger events.
          </div>
        ) : (
          <div className="relative border-l border-[#2A3142]/65 ml-2.5 pl-6 space-y-6">
            {events.map((event, idx) => {
              const formattedDate = new Date(event.timestamp).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              });
              const isPositive = event.delta >= 0;

              return (
                <div key={idx} className="relative">
                  {/* Timeline dot */}
                  <span className={`absolute -left-[31px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full border ${
                    isPositive ? "bg-[#3DDC97] border-[#3DDC97]" : "bg-[#FF4D6A] border-[#FF4D6A]"
                  }`} />

                  {/* Event content */}
                  <div className="bg-[#0B0E14]/40 border border-[#2A3142]/30 rounded-sm p-3.5 space-y-2 max-w-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[#2A3142]/20 pb-2">
                      <span className="font-mono text-[10px] text-[#6B7280]">{formattedDate}</span>
                      
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className="text-[#6B7280]">Trust Score:</span>
                        <span className="text-[#E8E6DE]/90 font-medium">
                          {event.previous_score} → {event.current_score}
                        </span>
                        <span className={`font-semibold ${isPositive ? "text-[#3DDC97]" : "text-[#FF4D6A]"}`}>
                          ({isPositive ? `+${event.delta}` : event.delta})
                        </span>
                      </div>
                    </div>
                    
                    <p className="font-sans text-xs text-[#E8E6DE]/85 leading-relaxed">
                      {event.reason}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
