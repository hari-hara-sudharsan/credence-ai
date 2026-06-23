"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WalletFormProps {
  onAnalyze: (wallet: string) => void;
}

export default function WalletForm({
  onAnalyze,
}: WalletFormProps) {
  const [wallet, setWallet] = useState("");

  return (
    <div className="flex gap-4">
      <Input
        placeholder="Enter HSK Wallet Address"
        value={wallet}
        onChange={(e) =>
          setWallet(e.target.value)
        }
      />

      <Button
        onClick={() =>
          onAnalyze(wallet)
        }
      >
        Analyze
      </Button>
    </div>
  );
}