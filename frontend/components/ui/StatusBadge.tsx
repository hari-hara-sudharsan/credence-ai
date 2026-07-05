"use client";

interface Props {
  type: "success" | "warning" | "error" | "info";
  label: string;
}

export default function StatusBadge({ type, label }: Props) {
  let color = "#34D399";
  if (type === "warning") color = "#FFB830";
  if (type === "error") color = "#FF4D6A";
  if (type === "info") color = "#00E5FF";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: `${color}14`,
        border: `1px solid ${color}44`,
        borderRadius: 6,
        padding: "4px 10px",
        fontSize: 10,
        fontWeight: 750,
        color,
        letterSpacing: 0.5,
        fontFamily: "JetBrains Mono, monospace",
        textTransform: "uppercase",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 6px ${color}`,
        }}
      />
      {label}
    </span>
  );
}
