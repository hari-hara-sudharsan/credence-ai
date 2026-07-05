"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  borderGradient?: string;
  background?: string;
  padding?: number | string;
}

export default function GradientCard({
  children,
  borderGradient = "linear-gradient(135deg, #1D2E49 0%, #111C2E 100%)",
  background = "#0A1425",
  padding = 24
}: Props) {
  return (
    <div
      style={{
        borderRadius: 14,
        background: borderGradient,
        padding: 1, // Border width
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div
        style={{
          background,
          borderRadius: 13,
          padding,
          color: "#E2E8F0",
        }}
      >
        {children}
      </div>
    </div>
  );
}
