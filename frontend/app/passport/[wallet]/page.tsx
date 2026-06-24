"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import API from "@/lib/api";
import CreditHistoryChart from "@/components/CreditHistoryChart";
import ConnectWallet from "@/components/ConnectWallet";
import MintPassportButton from "@/components/MintPassportButton";

interface PassportData {
  credit: any;
  report: any;
  lending: any;
  history: any[];
}

export default function PassportPage() {
  const params = useParams();
  const wallet = params?.wallet as string;

  const [data, setData] =
    useState<PassportData | null>(
      null
    );

  const [connectedWallet, setConnectedWallet] =
    useState("");

  useEffect(() => {

    const load =
      async () => {
        if (!wallet) return;

        const credit =
          await API.post(
            "/credit/score",
            { wallet }
          );

        const report =
          await API.post(
            "/report/",
            { wallet }
          );

        const lending =
          await API.post(
            "/lending/decision",
            { wallet }
          );

        const history =
          await API.get(
            `/history/${wallet}`
          );

        setData({
          credit: credit.data,
          report: report.data,
          lending: lending.data,
          history: history.data,
        });
      };

    load();

  }, [wallet]);

  if (!data) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-6">

        Credit Passport

      </h1>

      <div className="space-y-6">

        <div className="border rounded-lg p-6">

          <h2 className="font-bold">

            Wallet

          </h2>

          <p className="break-all">

            {wallet}

          </p>

        </div>

        <div className="border rounded-lg p-6">

          <h2 className="font-bold">

            Credit Score

          </h2>

          <p>

            {
              data.credit
                .credit_score
            }

          </p>

          <p>

            {
              data.credit
                .rating
            }

          </p>

        </div>

        <div className="border rounded-lg p-6">

          <h2 className="font-bold mb-4">

            Mint Passport

          </h2>

          <ConnectWallet
            onConnect={
              setConnectedWallet
            }
          />

          {connectedWallet && (

            <div className="mt-4">
              <MintPassportButton
                wallet={wallet}
                score={
                  data.credit.credit_score
                }
                rating={
                  data.credit.rating
                }
              />
            </div>

          )}

        </div>

        <div className="border rounded-lg p-6">

          <h2 className="font-bold">

            AI Report

          </h2>

          <div className="whitespace-pre-wrap">

            {
              data.report
                .report
            }

          </div>

        </div>

        <div className="border rounded-lg p-6">

          <h2 className="font-bold">

            Lending Decision

          </h2>

          <pre>

            {JSON.stringify(
              data.lending,
              null,
              2
            )}

          </pre>

        </div>

        <div className="border rounded-lg p-6">

          <h2 className="font-bold">

            Credit History

          </h2>

          <CreditHistoryChart
            history={
              data.history
            }
          />

        </div>

      </div>

    </main>
  );
}