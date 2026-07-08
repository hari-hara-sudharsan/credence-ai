export const CONTRACT_ADDRESS =
  "0xbD3ff87D460def7cBB00b091cF994AC4B9c61E14";

export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "string", name: "tokenURI", type: "string" },
      { internalType: "uint256", name: "creditScore", type: "uint256" },
      { internalType: "string", name: "rating", type: "string" },
      { internalType: "uint256", name: "identityId", type: "uint256" },
      { internalType: "uint256", name: "txVolume", type: "uint256" },
      { internalType: "uint256", name: "loanCount", type: "uint256" },
      { internalType: "uint256", name: "repaymentRate", type: "uint256" },
    ],
    name: "mintPassport",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];