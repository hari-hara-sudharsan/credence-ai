export const CONTRACT_ADDRESS =
  "0xbD3ff87D460def7cBB00b091cF994AC4B9c61E14";

export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "bytes32", name: "passportHash", type: "bytes32" },
      { internalType: "bytes32", name: "attestationHash", type: "bytes32" },
      { internalType: "address", name: "wallet", type: "address" },
      { internalType: "string", name: "metadataURI", type: "string" },
      { internalType: "uint256", name: "expiresAt", type: "uint256" },
      { internalType: "string", name: "entityType", type: "string" },
      { internalType: "uint256", name: "trustScore", type: "uint256" },
      { internalType: "string", name: "financialTier", type: "string" },
    ],
    name: "mintPassport",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];