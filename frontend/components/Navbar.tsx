"use client";

import Link from "next/link";
import WalletConnect from "@/components/WalletConnect";

export default function Navbar() {
  return (
    <nav className="border-b">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <div className="font-bold text-xl">
          Credence AI
        </div>

        <div className="flex gap-6">

          <Link href="/">
            Dashboard
          </Link>

          <Link href="/compare">
            Compare
          </Link>

          <Link href="/borrower">
            Borrower
          </Link>

          <Link href="/lender">
            Lender
          </Link>

          <Link href="/simulator">
            Simulator
          </Link>

          <Link href="/protocol-demo">
            Protocol Demo
          </Link>

          <Link href="/leaderboard">
            Leaderboard
          </Link>

          <Link href="/protocol-models">
            Protocol Models
          </Link>

          <Link href="/marketplace">
            Marketplace
          </Link>

          <Link href="/about">
            About
          </Link>

          <WalletConnect />

        </div>

      </div>

    </nav>
  );
}