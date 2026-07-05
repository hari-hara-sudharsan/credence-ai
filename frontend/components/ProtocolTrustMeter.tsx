"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ProtocolTrustMeterProps {
  confidenceScore: number;
}

export default function ProtocolTrustMeter({ confidenceScore }: ProtocolTrustMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(confidenceScore), 150);
    return () => clearTimeout(timer);
  }, [confidenceScore]);

  // Determine confidence tier
  let tierLabel = "Moderate Confidence";
  let tierStyle = "text-[#FFB830]";
  let meterColor = "bg-[#FFB830]";
  let glowColor = "shadow-[#FFB830]/10";
  
  if (animatedScore >= 85) {
    tierLabel = "Institutional Grade";
    tierStyle = "text-[#00E5FF]";
    meterColor = "bg-[#00E5FF]";
    glowColor = "shadow-[#00E5FF]/20";
  } else if (animatedScore >= 70) {
    tierLabel = "High Confidence";
    tierStyle = "text-[#3DDC97]";
    meterColor = "bg-[#3DDC97]";
    glowColor = "shadow-[#3DDC97]/25";
  } else if (animatedScore < 40) {
    tierLabel = "Elevated Protocol Risk";
    tierStyle = "text-[#FF4D6A]";
    meterColor = "bg-[#FF4D6A]";
    glowColor = "shadow-[#FF4D6A]/10";
  }

  return (
    <Card className="border-[#2A3142] bg-[#1A1F2B]/40 text-[#E8E6DE] transition-all duration-300 hover:border-[#00E5FF]/20 hover:bg-[#1A1F2B]/50 overflow-hidden relative">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#2A3142]/40">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-3 bg-[#00E5FF] rounded-sm" />
            <h4 className="font-mono text-xs tracking-[0.1em] text-[#E8E6DE] uppercase">
              Protocol Confidence Meter
            </h4>
          </div>
          <span className={`font-mono text-[10px] tracking-wider uppercase font-semibold ${tierStyle}`}>
            {tierLabel}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-6 justify-between pt-2">
          {/* Main big percentage */}
          <div className="space-y-1">
            <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase">
              Confidence Index
            </span>
            <div className="flex items-baseline gap-1">
              <span className={`font-display text-5xl font-bold ${tierStyle}`}>
                {confidenceScore}
              </span>
              <span className="font-sans text-lg text-[#6B7280] font-medium">%</span>
            </div>
          </div>

          {/* Description */}
          <div className="flex-1 space-y-4 max-w-sm">
            <p className="font-sans text-xs text-[#E8E6DE]/80 leading-relaxed">
              This metric evaluates how confidently the underwriting engine can approve new credit limits for your wallet based on on-chain behavior.
            </p>
            
            {/* Visual bar meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-[9px] text-[#6B7280]">
                <span>Risk Exposure</span>
                <span>{100 - confidenceScore}%</span>
              </div>
              <div className="h-2 w-full bg-[#1A2740] rounded-full overflow-hidden">
                <div 
                  className={`h-full ${meterColor} transition-all duration-1000 ease-out shadow-sm ${glowColor}`} 
                  style={{ width: `${animatedScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
