"use client";

import { createContext, useContext, useState } from "react";

type WalletContextType = {
  wallet: string;
  setWallet: (wallet: string) => void;
};

const WalletContext = createContext<WalletContextType>({
  wallet: "",
  setWallet: () => {}
});

export function WalletProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [wallet, setWallet] = useState("");

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
