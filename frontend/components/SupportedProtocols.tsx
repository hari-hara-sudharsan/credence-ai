"use client";

interface SupportedProtocolsProps {
  selectedProtocol: string;
  onSelect: (protocol: string) => void;
}

const PROTOCOLS = [
  { id: "LENDING", name: "Lending", icon: "🏦", desc: "Capital LTV & APR terms" },
  { id: "INSURANCE", name: "Insurance", icon: "🛡️", desc: "Premium discount & coverage calculations" },
  { id: "RWA", name: "Real World Assets", icon: "🏢", desc: "Purchasing caps & compliance status" },
  { id: "DAO", name: "DAO Governance", icon: "🗳️", desc: "Voting weight modifiers & delegation recommendation" },
  { id: "INSTITUTIONAL", name: "Institutional", icon: "💼", desc: "Risk scoring audits & compliance check" }
];

export default function SupportedProtocols({
  selectedProtocol,
  onSelect
}: SupportedProtocolsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="inline-block w-1.5 h-3 bg-[#00E5FF] rounded-sm" />
        <h4 className="font-mono text-xs tracking-[0.1em] text-[#E8E6DE] uppercase">
          Supported Protocols
        </h4>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {PROTOCOLS.map((proto) => {
          const isSelected = selectedProtocol === proto.id;

          return (
            <button
              key={proto.id}
              onClick={() => onSelect(proto.id)}
              className={`flex flex-col items-center justify-between text-center p-4 border rounded-sm transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? "border-[#00E5FF] bg-[#00E5FF]/5 shadow-[0_0_12px_rgba(0,229,255,0.15)]" 
                  : "border-[#2A3142]/75 bg-[#1A1F2B]/20 hover:border-[#2A3142] hover:bg-[#1A1F2B]/40 text-[#6B7280]"
              }`}
            >
              <div className="text-2xl mb-2">{proto.icon}</div>
              <div className="space-y-1">
                <h5 className={`font-mono text-xs font-semibold ${
                  isSelected ? "text-[#00E5FF]" : "text-[#E8E6DE]/90"
                }`}>
                  {proto.name}
                </h5>
                <p className="font-sans text-[8px] leading-normal text-[#6B7280] hidden md:block max-w-[100px] mx-auto">
                  {proto.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
