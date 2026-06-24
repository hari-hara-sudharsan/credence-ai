"use client";

import { useState } from "react";

import { useEffect } from "react";
import API from "@/lib/api";
import { useWallet } from "@/context/WalletContext";

export default function LenderPage() {

  const { wallet: connectedWallet } = useWallet();
  const [wallet, setWallet] = useState("");

  useEffect(() => {
    if (connectedWallet) setWallet(connectedWallet);
  }, [connectedWallet]);

  const [data, setData] =
    useState<any>(null);

  const analyze =
    async () => {

      const credit =
        await API.post(
          "/credit/score",
          { wallet }
        );

      const lending =
        await API.post(
          "/lending/decision",
          { wallet }
        );

      const report =
        await API.post(
          "/report",
          { wallet }
        );

      setData({
        credit:
          credit.data,

        lending:
          lending.data,

        report:
          report.data,
      });
    };

  return (

    <main className="max-w-6xl mx-auto p-8">

      <h1 className="text-5xl font-bold mb-8">

        Lender Dashboard

      </h1>

      <div className="flex gap-4 mb-8">

        <input
          className="border p-3 flex-1"
          placeholder="Borrower Wallet"
          value={wallet}
          onChange={(e) =>
            setWallet(
              e.target.value
            )
          }
        />

        <button
          className="border px-6"
          onClick={analyze}
        >

          Underwrite

        </button>

      </div>

      {data && (

        <div className="grid gap-6">

          <div className="border rounded-lg p-6">

            <h2 className="font-bold text-2xl">

              Credit Profile

            </h2>

            <div className="text-6xl mt-4">

              {
                data.credit
                  .credit_score
              }

            </div>

            <div className="text-xl mt-2">

              {
                data.credit
                  .rating
              }

            </div>

            <div className="mt-4">

              Default Probability:

              {" "}

              {
                data.credit
                  .probability_of_default
              }%

            </div>

          </div>

          <div className="border rounded-lg p-6">

            <h2 className="font-bold text-xl">

              Lending Terms

            </h2>

            <div className="mt-4">

              Eligible:

              {" "}

              {
                String(
                  data.lending
                    .eligible
                )
              }

            </div>

            <div>

              Interest Rate:

              {" "}

              {
                data.lending
                  .interest_rate
              }%

            </div>

            <div>

              Collateral Ratio:

              {" "}

              {
                data.lending
                  .collateral_ratio
              }%

            </div>

            <div>

              Risk Level:

              {" "}

              {
                data.lending
                  .risk_level
              }

            </div>

          </div>

          <div className="border rounded-lg p-6">

            <h2 className="font-bold text-xl mb-4">

              AI Underwriting Report

            </h2>

            <div className="whitespace-pre-wrap">

              {
                data.report
                  .report
              }

            </div>

          </div>

        </div>

      )}

    </main>

  );
}