"use client";

interface Props {
  score: number;
  max?: number;
  size?: number;
}

export default function TrustIndicator({ score, max = 850, size = 120 }: Props) {
  const percentage = (score / max) * 100;
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  let gaugeColor = "#34D399";
  if (score < 550) gaugeColor = "#FF4D6A";
  else if (score < 700) gaugeColor = "#FFB830";

  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#111C2E"
          strokeWidth="6"
        />
        {/* Foreground dynamic stroke circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={gaugeColor}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      {/* Central label */}
      <div style={{ position: "absolute", textAlign: "center" }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#E2E8F0" }}>{score}</div>
        <div style={{ fontSize: 9, color: "#64748B", fontWeight: 700, letterSpacing: 0.5, marginTop: 2 }}>
          OF {max}
        </div>
      </div>
    </div>
  );
}
