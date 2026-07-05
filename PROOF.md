# Credence AI — Mainnet Production Proof

> All contracts deployed on **HashKey Chain Mainnet (Chain ID 177)**.

---

## Smart Contract Infrastructure (7 Contracts)

| # | Contract | Layer | Address | Explorer |
|---|---|---|---|---|
| 1 | GovernanceRegistry | Governance | `0x98297dF9f8ffC79bc8e6BA3Ec606136adacb6f81` | [View](https://hashkey.blockscout.com/address/0x98297dF9f8ffC79bc8e6BA3Ec606136adacb6f81) |
| 2 | CreditPassportV2 | Identity | `0xD6b040736e948621c5b6E0a494473c47a6113eA8` | [View](https://hashkey.blockscout.com/address/0xD6b040736e948621c5b6E0a494473c47a6113eA8) |
| 3 | OracleRegistry | AI Verification | `0x2Dd78Fd9B8F40659Af32eF98555B8b31bC97A351` | [View](https://hashkey.blockscout.com/address/0x2Dd78Fd9B8F40659Af32eF98555B8b31bC97A351) |
| 4 | LoanManager | Loan Logic | `0x2988f0bE02e1a679430aEb4A6B9B10429F1e8e80` | [View](https://hashkey.blockscout.com/address/0x2988f0bE02e1a679430aEb4A6B9B10429F1e8e80) |
| 5 | LendingPool | Capital Layer | `0x928BA9D30669c41695422a68a1C307a6529F0050` | [View](https://hashkey.blockscout.com/address/0x928BA9D30669c41695422a68a1C307a6529F0050) |
| 6 | SettlementManager | Payment Layer | `0x4f3eEE789936a0eca627484bf680464f2F37b9FB` | [View](https://hashkey.blockscout.com/address/0x4f3eEE789936a0eca627484bf680464f2F37b9FB) |
| 7 | ReputationRegistry | Trust History | `0x110e9fB1ABEc92521E4511d5f45B4917B4c941Ab` | [View](https://hashkey.blockscout.com/address/0x110e9fB1ABEc92521E4511d5f45B4917B4c941Ab) |

---

## Deployment Wallet

- **Address:** `0x5bb83E60a7a05A0e1b077B66412a26306e334208`
- **Chain:** HashKey Chain Mainnet (177)
- **Explorer:** [View](https://hashkey.blockscout.com/address/0x5bb83E60a7a05A0e1b077B66412a26306e334208)

---

## Architecture

```
                 Credence AI
                     |
              OracleRegistry
          (AI trust verification)
                     |
              CreditPassportV2
           (portable identity)
                     |
              LoanManager
             (loan lifecycle)
          /                    \
 LendingPool             SettlementManager
(capital)                (payment execution)
          \                    /
             ReputationRegistry
          (credit history engine)
                     |
             GovernanceRegistry
```

---

## Security Evidence

| Protection | Status |
|---|---|
| EIP-712 Signed Attestations | ✅ Implemented |
| Replay Protection (Nonce) | ✅ Implemented |
| Access Control (Roles) | ✅ Implemented |
| Reentrancy Guard | ✅ Implemented |
| SafeERC20 | ✅ Implemented |
| Emergency Pause | ✅ Implemented |
| Multi-Oracle Consensus | ✅ Implemented |

---

## Test Results

```
68 passing Solidity tests
- LendingPool:         16 tests ✅
- SettlementManager:   17 tests ✅
- ReputationRegistry:  16 tests ✅
- P2PLendingMarket:    18 tests ✅
- Counter:              1 test + 256 fuzz runs ✅
```

---

## Real Transaction Evidence

| Action | Status |
|---|---|
| Contract Deployments | ✅ All 7 Contracts Deployed |
| Credit Passport Mint | ✅ Verified |
| Oracle Attestation | ✅ Verified |
| Loan Creation | ✅ Verified |
| P2P Loan Funding | ✅ Verified |
| Transparent Underwriting | ✅ API verified (real chain data) |

---

## Data Source Verification

All credit scores derived from **real on-chain data**:
- Source: HashKey Chain via Blockscout API
- Method: WalletAnalyzer → CreditEngine → CreditAnalyst chain
- Formula: Deterministic weighted scoring (wallet_age 20%, tx_history 25%, repayment 30%, defi 15%, risk 10%)
- Proof: Same wallet always produces same score
