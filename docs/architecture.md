# System Architecture & Flow Model

This document explains the unified technical structure of the Credence AI protocol.

---

## Technical Stack Layers

```
            Connected Applications (Lending, PayFi, RWA)
                                 │
                                 ▼
                     Credence Developer SDK / API
                                 │
                                 ▼
            AI Trust Intelligence (Transparent FICO Scoring)
                                 │
                                 ▼
              Defense Oracle Verification (Replay & Sybil checks)
                                 │
                                 ▼
              Smart Contracts (Identity, Passport, Defense)
                                 │
                                 ▼
             HashKey Chain EVM Mainnet (Cancun Hardfork)
```

## Step-by-Step Transaction Flow

1. **Identity Setup**: Borrower links wallet, generates Credit Passport NFT, and initiates a credit request.
2. **AI Assessment**: Wallet analyzer checks Blockscout history, calculating predictive risk scores and defaults.
3. **Defense Verification**: Trust defense checks for Sybil patterns, counterparty loop wash-trading, and farming behavior.
4. **Oracle Attestation**: Multi-oracle consensus signs the decision payload using EIP-712 structured formats.
5. **On-Chain Settlement**: Repayments execute via `SettlementManager` on HashKey Chain, updating the dynamic weighted reputation registry.
