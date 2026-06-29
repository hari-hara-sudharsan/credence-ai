"use client";

interface Props {
  report: string;
}

// Section metadata for icons and colors
const SECTION_META: Record<string, { icon: string; color: string }> = {
  "Institutional Credit Report": { icon: "🏦", color: "#00E5FF" },
  "Wallet Overview": { icon: "👛", color: "#00E5FF" },
  "Risk Assessment": { icon: "⚠️", color: "#FFB830" },
  Strengths: { icon: "🟢", color: "#34D399" },
  Weaknesses: { icon: "🔴", color: "#FF4D6A" },
  "Lending Recommendation": { icon: "📝", color: "#A78BFA" },
};

function FormattedReport({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  const sections: { title: string; body: string }[] = [];

  for (let i = 0; i < parts.length; i++) {
    const chunk = parts[i].trim();
    if (!chunk) continue;

    if (i % 2 === 1) {
      sections.push({ title: chunk, body: "" });
    } else {
      if (sections.length > 0) {
        sections[sections.length - 1].body += chunk;
      } else {
        sections.push({ title: "", body: chunk });
      }
    }
  }

  // Fallback: if no sections parsed, just show raw text
  if (sections.length === 0) {
    return (
      <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.8, margin: 0 }}>
        {text}
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {sections.map((section, idx) => {
        const meta = SECTION_META[section.title] ?? { icon: "◎", color: "#94A3B8" };
        const body = section.body.replace(/^\n+/, "").replace(/\n+$/, "");
        if (!section.title && !body) return null;

        return (
          <div
            key={idx}
            style={{
              padding: "14px 0",
              borderBottom:
                idx < sections.length - 1
                  ? "1px solid #111C2E"
                  : "none",
            }}
          >
            {section.title && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 15 }}>{meta.icon}</span>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 700,
                    color: meta.color,
                    fontFamily: "Inter, sans-serif",
                    letterSpacing: 0.3,
                  }}
                >
                  {section.title}
                </h3>
              </div>
            )}
            {body && (
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#94A3B8",
                  lineHeight: 1.8,
                  fontFamily: "Inter, sans-serif",
                  paddingLeft: section.title ? 27 : 0,
                }}
              >
                {body}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ReportCard({ report }: Props) {
  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Top accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background:
            "linear-gradient(90deg, transparent, #A78BFA, transparent)",
        }}
      />

      {/* Header */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #111C2E",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            width: 3,
            height: 18,
            borderRadius: 2,
            background: "#A78BFA",
            flexShrink: 0,
          }}
        />
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#4A6080",
              letterSpacing: 1.5,
              fontFamily: "JetBrains Mono, monospace",
              marginBottom: 2,
            }}
          >
            GENERATED ANALYSIS
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 700,
              color: "#E2E8F0",
              fontFamily: "Inter, sans-serif",
            }}
          >
            AI Credit Report
          </h2>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: 24,
          maxHeight: 400,
          overflowY: "auto",
        }}
      >
        <FormattedReport text={report} />
      </div>
    </div>
  );
}