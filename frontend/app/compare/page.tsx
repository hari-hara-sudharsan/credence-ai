"use client";

import { useState } from "react";

import API from "@/lib/api";

export default function ComparePage() {

  const [walletA, setWalletA] =
    useState("");

  const [walletB, setWalletB] =
    useState("");

  const [result, setResult] =
    useState<any>(null);

  const compare =
    async () => {

      const res =
        await API.post(
          "/compare/",
          {
            wallet_a:
              walletA,

            wallet_b:
              walletB,
          }
        );

      setResult(
        res.data
      );
    };

  return (

    <main className="max-w-6xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">

        Wallet Comparison

      </h1>

      <div className="flex gap-4">

        <input
          className="border p-2 flex-1"
          placeholder="Wallet A"
          value={walletA}
          onChange={(e) =>
            setWalletA(
              e.target.value
            )
          }
        />

        <input
          className="border p-2 flex-1"
          placeholder="Wallet B"
          value={walletB}
          onChange={(e) =>
            setWalletB(
              e.target.value
            )
          }
        />

        <button
          className="border px-4"
          onClick={compare}
        >
          Compare
        </button>

      </div>

      {result && (

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <pre className="border p-4">

            {JSON.stringify(
              result.wallet_a,
              null,
              2
            )}

          </pre>

          <pre className="border p-4">

            {JSON.stringify(
              result.wallet_b,
              null,
              2
            )}

          </pre>

        </div>

      )}

    </main>
  );
}