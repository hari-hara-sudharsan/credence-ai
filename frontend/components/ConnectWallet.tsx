"use client";

import { useState } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function ConnectWallet({
  onConnect,
}: {
  onConnect: (wallet: string) => void;
}) {

  const [wallet, setWallet] =
    useState("");

  const connect =
    async () => {

      if (!window.ethereum) {
        alert("Install MetaMask");
        return;
      }

      const accounts =
        await window.ethereum.request({
          method:
            "eth_requestAccounts",
        });

      setWallet(accounts[0]);

      onConnect(accounts[0]);
    };

  return (
    <div>

      <button
        onClick={connect}
        className="border px-4 py-2"
      >
        Connect Wallet
      </button>

      {wallet && (
        <p className="mt-2">
          {wallet}
        </p>
      )}

    </div>
  );
}