"use client";

import { ethers } from "ethers";
import { useState } from "react";

import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
} from "@/lib/passportContract";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function MintPassportButton({
  wallet,
  score,
  rating,
}: {
  wallet: string;
  score: number;
  rating: string;
}) {
  const [status, setStatus] = useState<"idle" | "minting" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | null>(null);

  const mint = async () => {
    if (!window.ethereum) return;

    setStatus("minting");

    try {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x85" }],
        });
      } catch (error: any) {
        if (error.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x85",
                chainName: "HashKey Chain Testnet",
                rpcUrls: ["https://testnet.hsk.xyz"],
                nativeCurrency: {
                  name: "HSK",
                  symbol: "HSK",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://testnet-explorer.hsk.xyz"],
              },
            ],
          });
        }
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      console.log("Chain ID:", network.chainId.toString());

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const metadata = JSON.stringify({
        wallet,
        score,
        rating,
        network: "HSK",
      });

      const tx = await contract.mintPassport(wallet, metadata);
      await tx.wait();

      setTxHash(tx.hash);
      setStatus("success");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  return (
    <div>
      <button
        onClick={mint}
        disabled={status === "minting"}
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 0.5,
          padding: "12px 24px",
          borderRadius: 8,
          border: "none",
          background:
            status === "minting"
              ? "#0D1B2E"
              : status === "success"
              ? "rgba(52, 211, 153, 0.12)"
              : "linear-gradient(135deg, #00C9E4, #0090C8)",
          color:
            status === "minting"
              ? "#2E4060"
              : status === "success"
              ? "#34D399"
              : "#fff",
          cursor: status === "minting" ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          boxShadow:
            status === "idle"
              ? "0 4px 20px rgba(0, 229, 255, 0.2)"
              : "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {status === "minting" && (
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              border: "2px solid #2E4060",
              borderTopColor: "#00E5FF",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
        )}
        {status === "success" && "✓ "}
        {status === "minting"
          ? "Minting…"
          : status === "success"
          ? "Passport Minted"
          : status === "error"
          ? "Retry Mint"
          : "Mint Credit Passport NFT"}
      </button>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Success state */}
      {status === "success" && txHash && (
        <div
          style={{
            marginTop: 12,
            background: "rgba(52, 211, 153, 0.06)",
            border: "1px solid rgba(52, 211, 153, 0.2)",
            borderRadius: 8,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 11,
              color: "#4A6080",
              wordBreak: "break-all",
            }}
          >
            {txHash}
          </div>
          <a
            href={`https://testnet-explorer.hsk.xyz/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#00E5FF",
              textDecoration: "none",
              whiteSpace: "nowrap",
              fontFamily: "Inter, sans-serif",
            }}
          >
            View →
          </a>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div
          style={{
            marginTop: 12,
            fontSize: 12,
            color: "#FF4D6A",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          Mint failed. Please try again.
        </div>
      )}
    </div>
  );
}