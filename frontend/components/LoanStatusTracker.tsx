"use client";

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: string }> = {
  REQUESTED: { color: "#60A5FA", label: "Requested", icon: "📋" },
  FUNDED: { color: "#F59E0B", label: "Funded", icon: "💰" },
  ACTIVE: { color: "#34D399", label: "Active", icon: "⚡" },
  REPAID: { color: "#8B5CF6", label: "Repaid", icon: "✅" },
  DEFAULTED: { color: "#EF4444", label: "Defaulted", icon: "❌" },
};

const STEPS = ["REQUESTED", "FUNDED", "ACTIVE", "REPAID"];

interface Props {
  currentStatus: string;
}

export default function LoanStatusTracker({ currentStatus }: Props) {
  const currentIndex = STEPS.indexOf(currentStatus);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, width: "100%" }}>
      {STEPS.map((step, i) => {
        const config = STATUS_CONFIG[step];
        const isActive = i <= currentIndex;
        const isCurrent = step === currentStatus;

        return (
          <div key={step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            {/* Node */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: isActive ? `${config.color}20` : "rgba(100,116,139,0.1)",
                border: `2px solid ${isActive ? config.color : "rgba(100,116,139,0.2)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                flexShrink: 0,
                transition: "all 0.3s ease",
                boxShadow: isCurrent ? `0 0 12px ${config.color}40` : "none",
              }}
            >
              {isActive ? config.icon : "○"}
            </div>

            {/* Connector Line */}
            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: i < currentIndex
                    ? `linear-gradient(90deg, ${STATUS_CONFIG[STEPS[i]].color}, ${STATUS_CONFIG[STEPS[i + 1]].color})`
                    : "rgba(100,116,139,0.15)",
                  transition: "all 0.3s ease",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
