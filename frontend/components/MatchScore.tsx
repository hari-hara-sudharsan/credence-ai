"use client";

interface Props {
  score: number;
  size?: number;
  label?: string;
}

export default function MatchScore({ score, size = 80, label = "MATCH" }: Props) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 75 ? "#34D399" : score >= 50 ? "#F59E0B" : score >= 30 ? "#FB923C" : "#EF4444";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background circle */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(100,116,139,0.12)" strokeWidth={4}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
        {/* Center text */}
        <text
          x={size / 2} y={size / 2}
          textAnchor="middle" dominantBaseline="central"
          fill={color} fontSize={size * 0.28} fontWeight={800}
          style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
        >
          {score}
        </text>
      </svg>
      <span style={{ fontSize: 9, color: "#64748B", fontWeight: 700, letterSpacing: 1.5 }}>{label}</span>
    </div>
  );
}
