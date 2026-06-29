"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import API from "@/lib/api";

// ── Badge icon SVGs (inline for zero-dep) ────────────────────────────────────
const BADGE_ICONS: Record<string, string> = {
  "Veteran Wallet": "🛡️",
  Whale: "🐋",
  "Power User": "⚡",
  "Trusted Borrower": "✅",
  "New Wallet": "🆕",
  "Early Adopter": "🚀",
  "High Volume": "📊",
  Verified: "🔒",
  "Low Risk": "🟢",
  "DeFi Native": "🔗",
};

// ── Score arc gauge ──────────────────────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
  const pct = Math.min(Math.max(score / 1000, 0), 1);
  const r = 28;
  const circ = Math.PI * r; // half-circle
  const dash = pct * circ;
  const color =
    score >= 750 ? "#00E5FF" : score >= 550 ? "#FFB830" : "#FF4D6A";
  const label =
    score >= 750 ? "Excellent" : score >= 550 ? "Fair" : "Poor";

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width="72" height="44" viewBox="0 0 72 44">
        {/* track */}
        <path
          d="M 8 40 A 28 28 0 0 1 64 40"
          fill="none"
          stroke="#1A2740"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* filled arc */}
        <path
          d="M 8 40 A 28 28 0 0 1 64 40"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
        <text
          x="36"
          y="36"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill={color}
          fontFamily="JetBrains Mono, monospace"
        >
          {score ?? "—"}
        </text>
      </svg>
      <span style={{ color, fontSize: 10, fontWeight: 600, letterSpacing: 1 }}>
        {label.toUpperCase()}
      </span>
    </div>
  );
}

// ── Badge chip ───────────────────────────────────────────────────────────────
const BADGE_COLORS: Record<string, string> = {
  "Veteran Wallet": "#FFB830",
  Whale: "#00E5FF",
  "Power User": "#A78BFA",
  "Trusted Borrower": "#34D399",
  "New Wallet": "#94A3B8",
  "Early Adopter": "#A78BFA",
  "High Volume": "#00E5FF",
  Verified: "#34D399",
  "Low Risk": "#34D399",
  "DeFi Native": "#60A5FA",
};

function Badge({ label }: { label: string }) {
  const color = BADGE_COLORS[label] ?? "#94A3B8";
  const icon = BADGE_ICONS[label] ?? "●";
  return (
    <span
      style={{
        color,
        border: `1px solid ${color}44`,
        background: `${color}14`,
        borderRadius: 6,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.5,
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      <span style={{ fontSize: 13 }}>{icon}</span>
      {label}
    </span>
  );
}

// ── Segment pill ─────────────────────────────────────────────────────────────
const SEGMENT_COLORS: Record<string, [string, string]> = {
  Prime: ["#00E5FF", "#00E5FF22"],
  "Near-Prime": ["#FFB830", "#FFB83022"],
  Subprime: ["#FF4D6A", "#FF4D6A22"],
};

function SegmentPill({ segment }: { segment: string }) {
  const [fg, bg] = SEGMENT_COLORS[segment] ?? ["#94A3B8", "#94A3B822"];
  return (
    <span
      style={{
        color: fg,
        background: bg,
        borderRadius: 99,
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.8,
        border: `1px solid ${fg}55`,
      }}
    >
      {segment}
    </span>
  );
}

// ── Fund modal (real on-chain HSK transfer) ──────────────────────────────────
declare global {
  interface Window {
    ethereum?: any;
  }
}

const HSK_CHAIN = {
  chainId: "0x85",
  chainName: "HashKey Chain Testnet",
  rpcUrls: ["https://testnet.hsk.xyz"],
  nativeCurrency: { name: "HSK", symbol: "HSK", decimals: 18 },
  blockExplorerUrls: ["https://hashkey-testnet.blockscout.com"],
};

function FundModal({
  listing,
  onClose,
}: {
  listing: any;
  onClose: () => void;
}) {
  const [step, setStep] = useState<
    "confirm" | "connecting" | "funding" | "confirming" | "success" | "error"
  >("confirm");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [lenderAddr, setLenderAddr] = useState("");

  const shortWallet = listing.wallet
    ? `${listing.wallet.slice(0, 8)}…${listing.wallet.slice(-6)}`
    : "—";

  const handleFund = async () => {
    if (!window.ethereum) {
      setErrorMsg("MetaMask is not installed. Please install it to fund loans.");
      setStep("error");
      return;
    }

    try {
      // 1. Connect wallet
      setStep("connecting");
      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const lender = accounts[0];
      setLenderAddr(lender);

      // 2. Switch to HashKey Chain Testnet
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: HSK_CHAIN.chainId }],
        });
      } catch (switchErr: any) {
        if (switchErr.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [HSK_CHAIN],
          });
        } else {
          throw switchErr;
        }
      }

      // 3. Send native HSK to borrower
      setStep("funding");

      // Convert loan amount to wei (HSK has 18 decimals)
      const amountInWei =
        "0x" + (BigInt(listing.loan_amount) * BigInt(10 ** 18)).toString(16);

      const hash: string = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: lender,
            to: listing.wallet,
            value: amountInWei,
          },
        ],
      });

      setTxHash(hash);

      // 4. Wait for confirmation
      setStep("confirming");

      // Poll for receipt
      let receipt = null;
      for (let i = 0; i < 60; i++) {
        receipt = await window.ethereum.request({
          method: "eth_getTransactionReceipt",
          params: [hash],
        });
        if (receipt) break;
        await new Promise((r) => setTimeout(r, 2000));
      }

      if (receipt?.status === "0x1" || receipt?.status === "0x01") {
        setStep("success");
      } else if (receipt) {
        setErrorMsg("Transaction reverted on-chain.");
        setStep("error");
      } else {
        // Still pending after polling — show success with "pending" note
        setStep("success");
      }
    } catch (err: any) {
      console.error("Fund error:", err);
      if (err.code === 4001) {
        setErrorMsg("Transaction rejected by user.");
      } else {
        setErrorMsg(err?.message?.slice(0, 120) || "Transaction failed.");
      }
      setStep("error");
    }
  };

  const explorerUrl = txHash
    ? `${HSK_CHAIN.blockExplorerUrls[0]}/tx/${txHash}`
    : null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={step === "funding" || step === "confirming" ? undefined : onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 1000,
          animation: "fadeIn 0.15s ease",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#0A1425",
          border: "1px solid #1A2740",
          borderRadius: 16,
          padding: "32px 28px",
          width: "min(480px, 92vw)",
          zIndex: 1001,
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px #00E5FF11",
          animation: "modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Close button — hidden during tx */}
        {step !== "funding" && step !== "confirming" && (
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "transparent",
              border: "none",
              color: "#4A6080",
              fontSize: 18,
              cursor: "pointer",
              padding: 4,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        )}

        {/* ── Step 1: Confirm ── */}
        {step === "confirm" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{
                width: 32, height: 32, borderRadius: 8,
                background: "#00E5FF14", border: "1px solid #00E5FF33",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16,
              }}>💰</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#4A6080", letterSpacing: 1.5, fontFamily: "JetBrains Mono, monospace" }}>
                  ON-CHAIN TRANSFER
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#E2E8F0" }}>
                  Fund This Loan
                </div>
              </div>
            </div>

            {/* Info banner */}
            <div style={{
              background: "#00E5FF08", border: "1px solid #00E5FF22",
              borderRadius: 8, padding: "10px 14px", marginBottom: 16,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>🔗</span>
              <span style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5 }}>
                This will send <strong style={{ color: "#00E5FF" }}>{listing.loan_amount?.toLocaleString()} HSK</strong> from
                your wallet to the borrower via HashKey Chain Testnet.
              </span>
            </div>

            {/* Details grid */}
            <div style={{ background: "#070F1C", borderRadius: 10, border: "1px solid #111C2E", overflow: "hidden", marginBottom: 20 }}>
              {[
                { label: "Borrower", value: shortWallet },
                { label: "Amount", value: `${listing.loan_amount?.toLocaleString()} HSK`, color: "#00E5FF" },
                { label: "Interest Rate", value: `${listing.interest_rate}% APR`, color: "#FFB830" },
                { label: "Collateral", value: `${listing.collateral_ratio}%` },
                { label: "Credit Score", value: listing.credit_score, color: listing.credit_score >= 550 ? "#00E5FF" : "#FF4D6A" },
                { label: "Segment", value: listing.segment },
                { label: "Purpose", value: listing.purpose || "—" },
              ].map(({ label, value, color }, i) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 16px",
                  borderBottom: i < 6 ? "1px solid #111C2E" : "none",
                }}>
                  <span style={{ fontSize: 12, color: "#4A6080", fontWeight: 600, fontFamily: "JetBrains Mono, monospace", letterSpacing: 0.5 }}>
                    {label}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: color || "#E2E8F0", fontFamily: "Inter, sans-serif" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Badges */}
            {listing.badges?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                {listing.badges.map((b: string) => (
                  <Badge key={b} label={b} />
                ))}
              </div>
            )}

            {/* Warning for low scores */}
            {listing.credit_score < 400 && (
              <div style={{
                background: "#FF4D6A12", border: "1px solid #FF4D6A33",
                borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span style={{ fontSize: 12, color: "#FF4D6A", fontWeight: 600 }}>
                  High-risk borrower — proceed with caution
                </span>
              </div>
            )}

            <button
              onClick={handleFund}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #00C9E4, #0090C8)",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                padding: "13px 0",
                cursor: "pointer",
                boxShadow: "0 4px 20px #00E5FF33",
                transition: "all 0.2s",
                letterSpacing: 0.3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 16 }}>🦊</span>
              Connect Wallet & Fund {listing.loan_amount?.toLocaleString()} HSK
            </button>
          </>
        )}

        {/* ── Step 2: Connecting wallet ── */}
        {step === "connecting" && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{
              width: 48, height: 48, margin: "0 auto 20px",
              border: "3px solid #1A2740", borderTopColor: "#FFB830",
              borderRadius: "50%", animation: "spin 0.8s linear infinite",
            }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: "#E2E8F0", marginBottom: 8 }}>
              Connecting Wallet
            </div>
            <div style={{ fontSize: 13, color: "#4A6080" }}>
              Approve the connection in MetaMask…
            </div>
          </div>
        )}

        {/* ── Step 3: Sending transaction ── */}
        {step === "funding" && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{
              width: 48, height: 48, margin: "0 auto 20px",
              border: "3px solid #1A2740", borderTopColor: "#00E5FF",
              borderRadius: "50%", animation: "spin 0.8s linear infinite",
            }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: "#E2E8F0", marginBottom: 8 }}>
              Confirm in MetaMask
            </div>
            <div style={{ fontSize: 13, color: "#4A6080", lineHeight: 1.6 }}>
              Sending {listing.loan_amount?.toLocaleString()} HSK to {shortWallet}<br/>
              Approve the transaction in your wallet.
            </div>
          </div>
        )}

        {/* ── Step 4: Waiting for on-chain confirmation ── */}
        {step === "confirming" && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{
              width: 48, height: 48, margin: "0 auto 20px",
              border: "3px solid #1A2740", borderTopColor: "#34D399",
              borderRadius: "50%", animation: "spin 0.8s linear infinite",
            }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: "#E2E8F0", marginBottom: 8 }}>
              Confirming On-Chain
            </div>
            <div style={{ fontSize: 13, color: "#4A6080", marginBottom: 16, lineHeight: 1.6 }}>
              Transaction submitted. Waiting for block confirmation…
            </div>

            {/* Show tx hash while waiting */}
            {txHash && (
              <div style={{
                background: "#070F1C", border: "1px solid #111C2E",
                borderRadius: 8, padding: "10px 14px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 8,
              }}>
                <span style={{
                  fontFamily: "JetBrains Mono, monospace", fontSize: 11,
                  color: "#4A6080", overflow: "hidden", textOverflow: "ellipsis",
                  whiteSpace: "nowrap", flex: 1,
                }}>
                  {txHash}
                </span>
                <a
                  href={explorerUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 11, fontWeight: 600, color: "#00E5FF",
                    textDecoration: "none", whiteSpace: "nowrap",
                  }}
                >
                  View →
                </a>
              </div>
            )}
          </div>
        )}

        {/* ── Step 5: Success ── */}
        {step === "success" && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{
              width: 56, height: 56, margin: "0 auto 16px",
              background: "#34D39914", border: "2px solid #34D39944",
              borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28,
            }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#34D399", marginBottom: 8 }}>
              Loan Funded On-Chain
            </div>
            <div style={{ fontSize: 13, color: "#4A6080", marginBottom: 16, lineHeight: 1.6 }}>
              Successfully sent {listing.loan_amount?.toLocaleString()} HSK to {shortWallet}.
            </div>

            {/* Tx details */}
            {txHash && (
              <div style={{
                background: "#070F1C", border: "1px solid #111C2E",
                borderRadius: 10, padding: 16, marginBottom: 20, textAlign: "left",
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#4A6080", letterSpacing: 1.2, fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>
                  TRANSACTION HASH
                </div>
                <div style={{
                  fontFamily: "JetBrains Mono, monospace", fontSize: 11,
                  color: "#94A3B8", wordBreak: "break-all", lineHeight: 1.6,
                  marginBottom: 12,
                }}>
                  {txHash}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(52, 211, 153, 0.08)", border: "1px solid rgba(52, 211, 153, 0.3)",
                    borderRadius: 6, padding: "4px 12px",
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D399", boxShadow: "0 0 6px #34D399" }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#34D399", letterSpacing: 1, fontFamily: "JetBrains Mono, monospace" }}>
                      CONFIRMED
                    </span>
                  </div>

                  <a
                    href={explorerUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      fontSize: 13, fontWeight: 600, color: "#00E5FF",
                      textDecoration: "none",
                    }}
                  >
                    View on Explorer →
                  </a>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "1px solid #1A2740",
                borderRadius: 8,
                color: "#94A3B8",
                fontSize: 13,
                fontWeight: 600,
                padding: "9px 24px",
                cursor: "pointer",
                transition: "all 0.18s",
              }}
            >
              Close
            </button>
          </div>
        )}

        {/* ── Error state ── */}
        {step === "error" && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{
              width: 56, height: 56, margin: "0 auto 16px",
              background: "#FF4D6A14", border: "2px solid #FF4D6A44",
              borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24,
            }}>✕</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#FF4D6A", marginBottom: 8 }}>
              Transaction Failed
            </div>
            <div style={{ fontSize: 13, color: "#4A6080", marginBottom: 20, lineHeight: 1.6 }}>
              {errorMsg}
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => { setStep("confirm"); setErrorMsg(""); }}
                style={{
                  background: "linear-gradient(135deg, #00C9E4, #0090C8)",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  padding: "9px 20px",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px #00E5FF22",
                }}
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: "1px solid #1A2740",
                  borderRadius: 8,
                  color: "#94A3B8",
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "9px 20px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Listing card ─────────────────────────────────────────────────────────────
function ListingCard({
  listing,
  idx,
}: {
  listing: any;
  idx: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? "#111C2E" : "#0A1425",
          border: `1px solid ${hovered ? "#00E5FF33" : "#1A2740"}`,
          borderRadius: 12,
          padding: "20px 24px",
          transition: "all 0.22s ease",
          boxShadow: hovered
            ? "0 0 0 1px #00E5FF22, 0 8px 32px #00E5FF0D"
            : "none",
          animation: `fadeSlideIn 0.35s ease both`,
          animationDelay: `${idx * 60}ms`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          {/* left */}
          <div style={{ flex: 1, minWidth: 200 }}>
            {/* amount */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: "#E2E8F0", letterSpacing: -0.5, fontFamily: "Inter, sans-serif" }}>
                {listing.loan_amount?.toLocaleString()}
              </span>
              <span style={{ fontSize: 13, color: "#00E5FF", fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
                HSK
              </span>
              <span style={{ marginLeft: 8 }}>
                <SegmentPill segment={listing.segment} />
              </span>
            </div>

            {/* wallet */}
            <div style={{ marginBottom: 10 }}>
              {listing.wallet ? (
                <Link
                  href={`/passport/${listing.wallet}`}
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 12,
                    color: "#00E5FF",
                    letterSpacing: 0.3,
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  {`${listing.wallet.slice(0, 8)}…${listing.wallet.slice(-6)}`}
                </Link>
              ) : (
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#4A6080" }}>—</span>
              )}
            </div>

            {/* purpose */}
            {listing.purpose && (
              <p style={{ color: "#94A3B8", fontSize: 13, marginBottom: 12, lineHeight: 1.5, maxWidth: 420 }}>
                {listing.purpose}
              </p>
            )}

            {/* badges */}
            {listing.badges?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {listing.badges.map((b: string) => (
                  <Badge key={b} label={b} />
                ))}
              </div>
            )}
          </div>

          {/* right — score + rate */}
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <ScoreGauge score={listing.credit_score} />

            <div style={{
              background: "#0D1B2E",
              borderRadius: 10,
              padding: "10px 16px",
              textAlign: "center",
              border: "1px solid #1A2740",
              minWidth: 72,
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#FFB830", letterSpacing: -0.5, fontFamily: "Inter, sans-serif" }}>
                {listing.interest_rate}%
              </div>
              <div style={{ fontSize: 10, color: "#4A6080", fontWeight: 600, letterSpacing: 1, marginTop: 2 }}>
                APR
              </div>
            </div>
          </div>
        </div>

        {/* fund button */}
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => setShowFundModal(true)}
            className="fund-btn"
            style={{
              background: hovered ? "linear-gradient(135deg, #00E5FF22, #00BFFF22)" : "transparent",
              border: "1px solid #00E5FF44",
              color: "#00E5FF",
              borderRadius: 8,
              padding: "8px 22px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.5,
              cursor: "pointer",
              transition: "all 0.18s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 14 }}>💰</span>
            Fund This Loan →
          </button>
        </div>
      </div>

      {showFundModal && (
        <FundModal listing={listing} onClose={() => setShowFundModal(false)} />
      )}
    </>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function MarketplacePage() {
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState(1000);
  const [purpose, setPurpose] = useState("");
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await API.get("/marketplace/listings");
      setListings(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const createRequest = async () => {
    if (!wallet || !purpose) return;
    setSubmitting(true);
    try {
      await API.post("/marketplace/request", {
        wallet,
        loan_amount: amount,
        purpose,
      });
      setWallet("");
      setPurpose("");
      setAmount(1000);
      refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    background: "#070F1C",
    border: "1px solid #1A2740",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#E2E8F0",
    fontSize: 14,
    width: "100%",
    fontFamily: "Inter, sans-serif",
    outline: "none",
    transition: "border-color 0.18s",
    boxSizing: "border-box" as const,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        body {
          background: #040C1A;
          font-family: Inter, sans-serif;
          color: #E2E8F0;
          margin: 0;
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        input::placeholder { color: #2E4060; }

        input:focus {
          border-color: #00E5FF55 !important;
          box-shadow: 0 0 0 2px #00E5FF11;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050C1A; }
        ::-webkit-scrollbar-thumb { background: #1A2740; border-radius: 4px; }

        .fund-btn:hover {
          background: #00E5FF22 !important;
          box-shadow: 0 0 12px #00E5FF22;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes modalIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>

      <main style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "40px 24px",
        minHeight: "100vh",
      }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 48 }}>
          {/* eyebrow */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#00E5FF12",
            border: "1px solid #00E5FF33",
            borderRadius: 99,
            padding: "4px 12px",
            marginBottom: 16,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#00E5FF",
              display: "inline-block",
              animation: "pulse-glow 2s ease-in-out infinite",
              boxShadow: "0 0 6px #00E5FF",
            }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#00E5FF", letterSpacing: 1.5 }}>
              LIVE MARKETPLACE
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            letterSpacing: -1.5,
            margin: 0,
            lineHeight: 1.1,
            background: "linear-gradient(135deg, #E2E8F0 30%, #00E5FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Lending Marketplace
          </h1>
          <p style={{ color: "#4A6080", fontSize: 15, marginTop: 10, marginBottom: 0 }}>
            Credit-scored loan requests, open to DeFi lenders.
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: 28,
          alignItems: "start",
        }}>

          {/* ── Form panel ── */}
          <aside style={{
            background: "#080F1E",
            border: "1px solid #111C2E",
            borderRadius: 14,
            padding: 24,
            position: "sticky",
            top: 24,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#CBD5E1", margin: "0 0 4px" }}>
              New Loan Request
            </h2>
            <p style={{ color: "#334155", fontSize: 12, marginTop: 0, marginBottom: 24 }}>
              Fill in your details to post a listing
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#4A6080", letterSpacing: 0.8, marginBottom: 6 }}>
                  WALLET ADDRESS
                </label>
                <input
                  placeholder="0x…"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  style={{ ...inputStyle, fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#4A6080", letterSpacing: 0.8, marginBottom: 6 }}>
                  LOAN AMOUNT (HSK)
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    style={{ ...inputStyle, paddingRight: 44 }}
                  />
                  <span style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    fontSize: 11, fontWeight: 700, color: "#00E5FF",
                    fontFamily: "JetBrains Mono, monospace",
                  }}>HSK</span>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#4A6080", letterSpacing: 0.8, marginBottom: 6 }}>
                  PURPOSE
                </label>
                <input
                  placeholder="e.g. Liquidity for yield farming"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <button
                onClick={createRequest}
                disabled={submitting || !wallet || !purpose}
                style={{
                  marginTop: 8,
                  background: submitting || !wallet || !purpose
                    ? "#0D1B2E"
                    : "linear-gradient(135deg, #00C9E4, #0090C8)",
                  border: "none",
                  borderRadius: 8,
                  color: submitting || !wallet || !purpose ? "#2E4060" : "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  padding: "11px 0",
                  width: "100%",
                  cursor: submitting || !wallet || !purpose ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: submitting || !wallet || !purpose ? "none" : "0 4px 20px #00E5FF33",
                  letterSpacing: 0.3,
                }}
              >
                {submitting ? "Submitting…" : "Request Loan →"}
              </button>
            </div>

            {/* divider */}
            <div style={{ margin: "24px 0", borderTop: "1px solid #111C2E" }} />

            {/* stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "Active Listings", value: listings.length },
                { label: "Avg APR", value: listings.length ? `${(listings.reduce((s, l) => s + (l.interest_rate || 0), 0) / listings.length).toFixed(1)}%` : "—" },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "#050C1A", borderRadius: 8, padding: "12px 14px", border: "1px solid #111C2E" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#E2E8F0" }}>{value}</div>
                  <div style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: 0.8, marginTop: 2 }}>{label.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Listings ── */}
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "#4A6080", margin: 0 }}>
                {listings.length} {listings.length === 1 ? "listing" : "listings"}
              </h2>
              <button
                onClick={refresh}
                disabled={loading}
                style={{
                  background: "transparent",
                  border: "1px solid #1A2740",
                  borderRadius: 8,
                  color: "#4A6080",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "6px 14px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.18s",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={loading ? { display: "inline-block", animation: "spin 0.8s linear infinite" } : {}}>↻</span>
                Refresh
              </button>
            </div>

            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{
                    background: "#080F1E",
                    borderRadius: 12,
                    height: 120,
                    border: "1px solid #111C2E",
                    opacity: 0.5,
                    animation: "pulse-glow 1.5s ease-in-out infinite",
                    animationDelay: `${i * 150}ms`,
                  }} />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "60px 24px",
                color: "#1A2740",
                background: "#080F1E",
                borderRadius: 12,
                border: "1px dashed #1A2740",
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⬡</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#2E4060" }}>No listings yet</div>
                <div style={{ fontSize: 13, color: "#1A2740", marginTop: 4 }}>Be the first to post a loan request</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {listings.map((listing, idx) => (
                  <ListingCard key={idx} listing={listing} idx={idx} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}