"use client";

import { useWallet } from "@/context/WalletContext";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function WalletConnect() {
  const { wallet, setWallet } = useWallet();

  const connect = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    setWallet(accounts[0]);
  };

  return (
    <button
      onClick={connect}
      className="border border-indigo-500 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-medium transition"
    >
      {wallet
        ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
        : "Connect Wallet"}
    </button>
  );
}
