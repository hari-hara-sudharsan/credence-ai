"use client";

import { useState } from "react";

import { useRouter }
from "next/navigation";

export default function PassportSearch() {

  const router =
    useRouter();

  const [wallet, setWallet] =
    useState("");

  return (

    <div className="flex gap-4">

      <input
        className="border p-2 flex-1"
        placeholder="Wallet Address"
        value={wallet}
        onChange={(e) =>
          setWallet(
            e.target.value
          )
        }
      />

      <button
        className="border px-4"
        onClick={() =>
          router.push(
            `/passport/${wallet}`
          )
        }
      >

        Open Passport

      </button>

    </div>
  );
}