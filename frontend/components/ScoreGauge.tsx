"use client";

import { useEffect, useState } from "react";

export default function ScoreGauge({ score }: { score: number }) {
  const [animated, setAnimated] = useState(0);

  const SIZE = 250;
  const STROKE = 14;
  const R = (SIZE - STROKE) / 2;
  const CIRC = Math.PI * R; // half-circle
  const MAX = 850;

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;
    const target = Math.min(Math.max(score, 0), MAX);

    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setAnimated(ease * target);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const pct = animated / MAX;
  const dash = pct * CIRC;
  const color =
    score >= 700 ? "#00E5FF" : score >= 500 ? "#FFB830" : "#FF4D6A";
  const label =
    score >= 700 ? "Excellent" : score >= 500 ? "Fair" : "Poor";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={SIZE} height={SIZE / 2 + 20} viewBox={`0 0 ${SIZE} ${SIZE / 2 + 20}`}>
        {/* Track */}
        <path
          d={`M ${STROKE / 2} ${SIZE / 2} A ${R} ${R} 0 0 1 ${SIZE - STROKE / 2} ${SIZE / 2}`}
          fill="none"
          stroke="#1A2740"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d={`M ${STROKE / 2} ${SIZE / 2} A ${R} ${R} 0 0 1 ${SIZE - STROKE / 2} ${SIZE / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${CIRC}`}
          style={{ filter: `drop-shadow(0 0 8px ${color}88)`, transition: "stroke 0.4s" }}
        />
        {/* Score text */}
        <text
          x={SIZE / 2}
          y={SIZE / 2 - 8}
          textAnchor="middle"
          fontSize="42"
          fontWeight="800"
          fill={color}
          fontFamily="Inter, sans-serif"
          letterSpacing="-2"
        >
          {Math.round(animated)}
        </text>
        <text
          x={SIZE / 2}
          y={SIZE / 2 + 16}
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#4A6080"
          fontFamily="JetBrains Mono, monospace"
          letterSpacing="1.5"
        >
          / {MAX}
        </text>
      </svg>
      <span style={{
        color,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 1.5,
        fontFamily: "JetBrains Mono, monospace",
      }}>
        {label.toUpperCase()}
      </span>
    </div>
  );
}