"use client";

import { ethers }
from "ethers";

import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
} from "@/lib/passportContract";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function MintPassportButton({
  wallet,
  score,
  rating,
}: {
  wallet: string;
  score: number;
  rating: string;
}) {

  const mint =
    async () => {

      if (!window.ethereum)
        return;

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: "0x85"
            }
          ]
        });
      } catch (error: any) {
        if (error.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x85",
                chainName:
                  "HashKey Chain Testnet",
                rpcUrls: [
                  "https://testnet.hsk.xyz"
                ],
                nativeCurrency: {
                  name: "HSK",
                  symbol: "HSK",
                  decimals: 18
                },
                blockExplorerUrls: [
                  "https://hashkey-testnet.blockscout.com"
                ]
              }
            ]
          });
        }
      }

      const provider =
        new ethers.BrowserProvider(
          window.ethereum
        );

      const signer =
        await provider.getSigner();

      const network =
        await provider.getNetwork();

      console.log(
        "Chain ID:",
        network.chainId.toString()
      );

      const contract =
        new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );

      const metadata =
        JSON.stringify({
          wallet,
          score,
          rating,
          network: "HSK",
        });


      const tx =
        await contract.mintPassport(
          wallet,
          metadata
        );

      await tx.wait();

      alert(
        `NFT Minted\n\n${tx.hash}`
      );
    };

  return (

    <button
      onClick={mint}
      className="border px-6 py-3"
    >

      Mint Credit Passport NFT

    </button>

  );
}