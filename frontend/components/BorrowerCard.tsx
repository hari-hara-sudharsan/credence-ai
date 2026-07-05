"use client";

interface BorrowerItem {
  wallet: string;
  credit_score: number;
  trust_score: number;
  risk_level: string;
  passport_verified: boolean;
  trust_badge: string;
  available_credit: number;
  protocol_profiles: any[];
  rank: number;
}

interface Props {
  borrower: BorrowerItem;
}

export default function BorrowerCard({ borrower }: Props) {
  const getRiskColor = (level: string) => {
    if (level === "LOW") return "#34D399";
    if (level === "MEDIUM") return "#FFB830";
    return "#FF4D6A";
  };

  const getBadgeColor = (badge: string) => {
    if (badge === "INSTITUTIONAL_VERIFIED") return "#00E5FF";
    if (badge === "GOLD") return "#FFD700";
    if (badge === "SILVER") return "#C0C0C0";
    return "#CD7F32";
  };

  return (
    <div
      style={{
        background: "#0A1425",
        border: `1px solid ${getBadgeColor(borrower.trust_badge)}33`,
        borderRadius: 14,
        padding: 20,
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 14,
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: getBadgeColor(borrower.trust_badge),
              background: `${getBadgeColor(borrower.trust_badge)}1A`,
              border: `1px solid ${getBadgeColor(borrower.trust_badge)}`,
              borderRadius: 4,
              padding: "2px 6px",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {borrower.trust_badge}
          </span>
          <span style={{ fontSize: 11, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
            Rank #{borrower.rank}
          </span>
        </div>

        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#E2E8F0",
            fontFamily: "JetBrains Mono, monospace",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginBottom: 12,
          }}
        >
          {borrower.wallet}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
              CREDIT SCORE
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#E2E8F0" }}>{borrower.credit_score}</div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
              TRUST INDEX
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#34D399" }}>{borrower.trust_score}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
              RISK PROFILE
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: getRiskColor(borrower.risk_level) }}>
              {borrower.risk_level} RISK
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
              AVAILABLE LIMIT
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#00E5FF" }}>
              ${borrower.available_credit.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #111C2E",
          paddingTop: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 11,
        }}
      >
        <span style={{ color: "#64748B" }}>Passport:</span>
        <span style={{ color: borrower.passport_verified ? "#34D399" : "#FF4D6A", fontWeight: 700 }}>
          {borrower.passport_verified ? "ACTIVE VERIFIED" : "UNVERIFIED"}
        </span>
      </div>
    </div>
  );
}
