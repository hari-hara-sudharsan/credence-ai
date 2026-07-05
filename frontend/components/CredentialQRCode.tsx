"use client";

import { useState } from "react";

interface Props {
  wallet: string;
}

export default function CredentialQRCode({ wallet }: Props) {
  const [copied, setCopied] = useState(false);
  
  // Construct verification URL pointing to the backend passport details
  const verifyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/passport/v2/${wallet}/credential`
    : `/passport/v2/${wallet}/credential`;

  const handleCopy = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(verifyUrl)}&color=00e5ff&bgcolor=0a1425`;

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#4A6080",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
          alignSelf: "flex-start",
        }}
      >
        PORTABLE CREDENTIAL QR
      </div>

      {/* QR image container with custom styling */}
      <div
        style={{
          background: "#050B14",
          border: "1px solid #1D2E49",
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={qrImageUrl}
          alt="Credential Verification QR Code"
          style={{
            width: 160,
            height: 160,
            borderRadius: 6,
          }}
        />
      </div>

      <div
        style={{
          fontSize: 10,
          color: "#64748B",
          fontFamily: "JetBrains Mono, monospace",
          textAlign: "center",
          wordBreak: "break-all",
          maxWidth: 200,
          lineHeight: 1.4,
          marginBottom: 16,
        }}
      >
        Scan to view standards-compliant verifiable JSON credential.
      </div>

      <button
        onClick={handleCopy}
        style={{
          background: "rgba(0, 229, 255, 0.08)",
          border: "1px solid #00E5FF",
          borderRadius: 8,
          color: "#00E5FF",
          fontWeight: 600,
          fontSize: 12,
          padding: "8px 16px",
          width: "100%",
          cursor: "pointer",
          fontFamily: "JetBrains Mono, monospace",
          transition: "all 0.2s ease",
        }}
      >
        {copied ? "COPIED!" : "COPY VERIFY URL"}
      </button>
    </div>
  );
}
