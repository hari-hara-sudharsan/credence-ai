"use client";

import { useState } from "react";
import API from "@/lib/api";

export default function ProtocolDemo() {

  const [wallet, setWallet] =
    useState("");

  const [data, setData] =
    useState<any>(null);

  const check =
    async () => {

      const res =
        await API.get(
          `/oracle/score/${wallet}`
        );

      setData(
        res.data
      );
    };

  return (

    <main className="max-w-6xl mx-auto p-8">

      <h1 className="text-5xl font-bold mb-8">

        Protocol Integration Demo

      </h1>

      <p className="mb-6">

        Simulates how an HSK
        lending protocol uses
        Credence Oracle.

      </p>

      <div className="flex gap-4">

        <input
          value={wallet}
          onChange={(e) =>
            setWallet(
              e.target.value
            )
          }
          className="border p-3 flex-1"
          placeholder="Wallet"
        />

        <button
          onClick={check}
          className="border px-6"
        >
          Query Oracle
        </button>

      </div>

      {data && (

        <div className="mt-8 border p-6 rounded">

          <h2 className="text-3xl font-bold">

            Oracle Response

          </h2>

          <pre className="mt-4">

            {JSON.stringify(
              data,
              null,
              2
            )}

          </pre>

        </div>

      )}

    </main>
  );
}
