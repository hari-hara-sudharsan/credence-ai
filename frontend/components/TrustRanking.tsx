"use client";

interface LeaderboardItem {
  rank: number;
  wallet: string;
  credit_score: number;
  trust_score: number;
  badge: string;
  risk: string;
}

interface Props {
  leaderboard: LeaderboardItem[];
}

export default function TrustRanking({ leaderboard }: Props) {
  const getRiskColor = (level: string) => {
    if (level === "LOW") return "#34D399";
    if (level === "MEDIUM") return "#FFB830";
    return "#FF4D6A";
  };

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#4A6080",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 20,
        }}
      >
        TOP REPUTATION LEADERBOARD
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #111C2E", textAlign: "left" }}>
              <th style={{ padding: "10px 8px", fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                RANK
              </th>
              <th style={{ padding: "10px 8px", fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                WALLET ADDRESS
              </th>
              <th style={{ padding: "10px 8px", fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                CREDIT SCORE
              </th>
              <th style={{ padding: "10px 8px", fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                BADGE SEAL
              </th>
              <th style={{ padding: "10px 8px", fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                RISK LEVEL
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((item) => (
              <tr key={item.wallet} style={{ borderBottom: "1px solid #111C2E", fontSize: 13, color: "#E2E8F0" }}>
                <td style={{ padding: "12px 8px", fontWeight: 700 }}>#{item.rank}</td>
                <td style={{ padding: "12px 8px", fontFamily: "JetBrains Mono, monospace" }}>{item.wallet}</td>
                <td style={{ padding: "12px 8px", fontWeight: 700, color: "#34D399" }}>{item.credit_score}</td>
                <td style={{ padding: "12px 8px" }}>
                  <span
                    style={{
                      fontSize: 8,
                      fontWeight: 800,
                      color: "#00E5FF",
                      background: "rgba(0, 229, 255, 0.05)",
                      border: "1px solid #00E5FF",
                      borderRadius: 4,
                      padding: "2px 6px",
                    }}
                  >
                    {item.badge}
                  </span>
                </td>
                <td style={{ padding: "12px 8px", fontWeight: 700, color: getRiskColor(item.risk) }}>
                  {item.risk}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
