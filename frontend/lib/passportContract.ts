export const CONTRACT_ADDRESS =
  "0xD6b040736e948621c5b6E0a494473c47a6113eA8";

export const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "passportHash",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "attestationHash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "metadataURI",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "expiresAt",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "entityType",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "trustScore",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "financialTier",
        "type": "string"
      }
    ],
    "name": "mintPassport",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];