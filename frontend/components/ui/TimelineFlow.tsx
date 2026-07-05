"use client";

interface Step {
  label: string;
  active: boolean;
  completed: boolean;
}

interface Props {
  steps: Step[];
}

export default function TimelineFlow({ steps }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        position: "relative",
        padding: "10px 0",
      }}
    >
      {/* Background connection line */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: 0,
          right: 0,
          height: 2,
          background: "#111C2E",
          zIndex: 1,
        }}
      />

      {steps.map((step, idx) => {
        let circleColor = "#0A1425";
        let borderColor = "#111C2E";
        let textColor = "#4A6080";

        if (step.completed) {
          circleColor = "#34D399";
          borderColor = "#34D399";
          textColor = "#34D399";
        } else if (step.active) {
          circleColor = "#0A1425";
          borderColor = "#00E5FF";
          textColor = "#E2E8F0";
        }

        return (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 5,
              position: "relative",
              flex: 1,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: circleColor,
                border: `2.5px solid ${borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 800,
                color: step.completed ? "#040C1A" : textColor,
                boxShadow: step.active ? "0 0 10px rgba(0,229,255,0.4)" : "none",
                transition: "all 0.3s ease",
              }}
            >
              {step.completed ? "✓" : idx + 1}
            </div>
            <span
              style={{
                marginTop: 8,
                fontSize: 11,
                fontWeight: step.active ? 700 : 500,
                color: textColor,
                fontFamily: "Inter, sans-serif",
                textAlign: "center",
              }}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
