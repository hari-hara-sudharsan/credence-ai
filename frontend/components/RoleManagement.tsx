"use client";

interface RoleItem {
  actor: string;
  role: string;
}

interface Props {
  roles: RoleItem[];
}

export default function RoleManagement({ roles }: Props) {
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
          fontSize: 10,
          fontWeight: 800,
          color: "#4A6080",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        RBAC ROLE DELEGATIONS
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {roles.map((r, i) => (
          <div
            key={i}
            style={{
              background: "#050B14",
              border: "1px solid #111C2E",
              borderRadius: 8,
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 13, color: "#E2E8F0", fontFamily: "JetBrains Mono, monospace" }}>
              {r.actor}
            </span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: "#00E5FF",
                background: "rgba(0, 229, 255, 0.05)",
                border: "1px solid #00E5FF",
                borderRadius: 4,
                padding: "2px 6px",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {r.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
