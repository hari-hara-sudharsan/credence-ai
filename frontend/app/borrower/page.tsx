"use client";

import { useState } from "react";

import API from "@/lib/api";
import { useWallet } from "@/context/WalletContext";

export default function BorrowerPage() {

  const { wallet } = useWallet();

  const [data, setData] =
    useState<any>(null);

  const analyze =
    async () => {

      const insight =
        await API.post(
          "/insights",
          { wallet }
        );

      const lending =
        await API.post(
          "/lending/decision",
          { wallet }
        );

      setData({
        insight:
          insight.data,

        lending:
          lending.data,
      });
    };

  return (

    <main className="max-w-6xl mx-auto p-8">

      <h1 className="text-5xl font-bold mb-8">

        Borrower Dashboard

      </h1>

      <div className="flex gap-4 mb-8">

        <button
          className="border px-6"
          onClick={analyze}
        >

          Analyze

        </button>

      </div>

      {data && (

        <div className="space-y-6">

          <div className="border rounded-lg p-6">

            <h2 className="font-bold text-2xl">

              Credit Score

            </h2>

            <div className="text-6xl mt-4">

              {
                data.insight
                  .credit_score
              }

            </div>

            <div className="text-xl mt-2">

              {
                data.insight
                  .rating
              }

            </div>

          </div>

          <div className="border rounded-lg p-6">

            <h2 className="font-bold text-xl mb-4">

              Improvement Plan

            </h2>

            <ul className="space-y-2">

              {data.insight
                .recommendations
                .map(
                  (
                    rec: string,
                    index: number
                  ) => (

                    <li
                      key={index}
                    >

                      ✓ {rec}

                    </li>

                  )
                )}

            </ul>

          </div>

          <div className="border rounded-lg p-6">

            <h2 className="font-bold text-xl">

              Lending Status

            </h2>

            <p className="mt-4">

              Eligible:

              {" "}

              {
                String(
                  data.lending
                    .eligible
                )
              }

            </p>

            <p>

              Interest Rate:

              {" "}

              {
                data.lending
                  .interest_rate
              }%

            </p>

            <p>

              Collateral Ratio:

              {" "}

              {
                data.lending
                  .collateral_ratio
              }%

            </p>

          </div>

        </div>

      )}

    </main>
  );
}