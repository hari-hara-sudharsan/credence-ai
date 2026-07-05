"use client";

import { useState } from "react";

interface Props {
  attestations: any[];
  onRevoke: (hash: string) => Promise<void>;
  onSelectHash: (hash: string) => void;

}

export default function AttestationHistory({ attestations, onRevoke, onSelectHash }: Props) {
  const [revokingHash, setRevokingHash] = useState<string | null>(null);

  const handleRevoke = async (hash: string) => {
    if (confirm("Are you sure you want to revoke this attestation on-chain?")) {
      setRevokingHash(hash);
      await onRevoke(hash);
      setRevokingHash(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#4A6080",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        LATEST PUBLISHED ORACLE RECORDS
      </div>

      {attestations.length === 0 ? (
        <div style={{ textAlign: "center", color: "#4A6080", padding: "40px 0" }}>
          No published attestations found. Use the borrower pipeline to generate records.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #111C2E" }}>
                <th style={{ padding: "12px 8px", fontSize: 10, color: "#4A6080", fontFamily: "JetBrains Mono, monospace" }}>ATTESTATION ID</th>
                <th style={{ padding: "12px 8px", fontSize: 10, color: "#4A6080", fontFamily: "JetBrains Mono, monospace" }}>BORROWER WALLET</th>
                <th style={{ padding: "12px 8px", fontSize: 10, color: "#4A6080", fontFamily: "JetBrains Mono, monospace" }}>SCORE</th>
                <th style={{ padding: "12px 8px", fontSize: 10, color: "#4A6080", fontFamily: "JetBrains Mono, monospace" }}>ATTESTATION HASH</th>
                <th style={{ padding: "12px 8px", fontSize: 10, color: "#4A6080", fontFamily: "JetBrains Mono, monospace" }}>STATUS</th>
                <th style={{ padding: "12px 8px", fontSize: 10, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {attestations.map((att) => {
                const isRevoked = att.revoked === true;
                const isExpired = new Date(att.expires_at).getTime() < Date.now();
                
                let statusLabel = "🟢 ACTIVE";
                let statusColor = "#34D399";
                if (isRevoked) {
                  statusLabel = "🔴 REVOKED";
                  statusColor = "#FF4D6A";
                } else if (isExpired) {
                  statusLabel = "🟡 EXPIRED";
                  statusColor = "#FFB830";
                }

                return (
                  <tr
                    key={att.attestation_id}
                    style={{ borderBottom: "1px solid #111C2E", transition: "all 0.2s" }}
                  >
                    <td style={{ padding: "16px 8px", fontSize: 12, color: "#E2E8F0", fontFamily: "JetBrains Mono, monospace" }}>
                      {att.attestation_id}
                    </td>
                    <td
                      style={{ padding: "16px 8px", fontSize: 12, color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}
                      title={att.wallet}
                    >
                      {att.wallet.substring(0, 6)}...{att.wallet.substring(att.wallet.length - 4)}
                    </td>
                    <td style={{ padding: "16px 8px", fontSize: 12, fontWeight: 700, color: "#FFB830" }}>
                      {att.credit_score}
                    </td>
                    <td style={{ padding: "16px 8px", fontSize: 12, color: "#00E5FF", fontFamily: "JetBrains Mono, monospace" }}>
                      <span
                        onClick={() => onSelectHash(att.attestation_hash)}
                        style={{ cursor: "pointer", textDecoration: "underline" }}
                        title="Click to check in Verification Explorer"
                      >
                        {att.attestation_hash.substring(0, 10)}...{att.attestation_hash.substring(att.attestation_hash.length - 8)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(att.attestation_hash)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#4A6080",
                          cursor: "pointer",
                          marginLeft: 6,
                          fontSize: 10,
                        }}
                      >
                        📋
                      </button>
                    </td>
                    <td style={{ padding: "16px 8px", fontSize: 11, fontWeight: 700, color: statusColor, fontFamily: "JetBrains Mono, monospace" }}>
                      {statusLabel}
                    </td>
                    <td style={{ padding: "16px 8px", textAlign: "right" }}>
                      <button
                        onClick={() => handleRevoke(att.attestation_hash)}
                        disabled={isRevoked || revokingHash === att.attestation_hash}
                        style={{
                          background: isRevoked ? "transparent" : "rgba(255, 77, 106, 0.08)",
                          border: `1px solid ${isRevoked ? "rgba(255, 77, 106, 0.15)" : "#FF4D6A"}`,
                          borderRadius: 6,
                          color: isRevoked ? "#4A6080" : "#FF4D6A",
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "6px 12px",
                          cursor: isRevoked || revokingHash === att.attestation_hash ? "not-allowed" : "pointer",
                          fontFamily: "JetBrains Mono, monospace",
                          transition: "all 0.2s",
                        }}
                      >
                        {revokingHash === att.attestation_hash ? "REVOKING..." : "REVOKE"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
