"use client";

import { useState } from "react";
import API from "@/lib/api";

export default function SimulatorPage() {

  const [score, setScore] =
    useState(487);

  const [txs, setTxs] =
    useState(50);

  const [protocols, setProtocols] =
    useState(3);

  const [staking, setStaking] =
    useState(true);

  const [result, setResult] =
    useState<any>(null);

  const simulate =
    async () => {

      const res =
        await API.post(
          "/simulator",
          {
            current_score: score,
            extra_transactions: txs,
            extra_protocols: protocols,
            staking_enabled: staking,
          }
        );

      setResult(
        res.data
      );
    };

  return (

    <main className="max-w-5xl mx-auto p-8">

      <h1 className="text-5xl font-bold mb-8">

        Credit Improvement Simulator

      </h1>

      <div className="space-y-4">

        <input
          type="number"
          value={score}
          onChange={(e) =>
            setScore(
              Number(
                e.target.value
              )
            )
          }
          className="border p-2 w-full"
        />

        <input
          type="number"
          value={txs}
          onChange={(e) =>
            setTxs(
              Number(
                e.target.value
              )
            )
          }
          className="border p-2 w-full"
        />

        <input
          type="number"
          value={protocols}
          onChange={(e) =>
            setProtocols(
              Number(
                e.target.value
              )
            )
          }
          className="border p-2 w-full"
        />

        <label>

          <input
            type="checkbox"
            checked={staking}
            onChange={(e) =>
              setStaking(
                e.target.checked
              )
            }
          />

          Enable Staking

        </label>

        <button
          onClick={simulate}
          className="border px-6 py-2"
        >

          Simulate

        </button>

      </div>

      {result && (

        <div className="mt-8 border p-6 rounded-lg">

          <h2 className="text-3xl font-bold">

            Projected Score

          </h2>

          <div className="text-6xl mt-4">

            {
              result.projected_score
            }

          </div>

          <div className="mt-4">

            Rating:

            {" "}

            {
              result.projected_rating
            }

          </div>

          <div>

            Increase:

            +{
              result.score_increase
            }

          </div>

        </div>

      )}

    </main>
  );
}