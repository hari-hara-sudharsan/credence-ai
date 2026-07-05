# Credence AI — Mainnet Production Proof

> All contracts deployed on **HashKey Chain Mainnet (Chain ID 177)**.

---

## Smart Contract Infrastructure (7 Contracts)

| # | Contract | Layer | Address | Explorer |
|---|---|---|---|---|
| 1 | GovernanceRegistry | Governance | `0xF13fD57De8E4b1e935A958c2F7D3aeBec79724e4` | [View](https://hashkey.blockscout.com/address/0xF13fD57De8E4b1e935A958c2F7D3aeBec79724e4) |
| 2 | CreditPassportV2 | Identity | `0x6837bCE41A0E57CF200C005DC0b14E6E8a5d5dce` | [View](https://hashkey.blockscout.com/address/0x6837bCE41A0E57CF200C005DC0b14E6E8a5d5dce) |
| 3 | OracleRegistry | AI Verification | `0x14A2dBc6EF88d5D64e67D3f2F59D876A5C4f422E` | [View](https://hashkey.blockscout.com/address/0x14A2dBc6EF88d5D64e67D3f2F59D876A5C4f422E) |
| 4 | LoanManager | Loan Logic | `0xD9B1047fD9Aa6e0c0e70e90e3d1F48990a8A6B85` | [View](https://hashkey.blockscout.com/address/0xD9B1047fD9Aa6e0c0e70e90e3d1F48990a8A6B85) |
| 5 | LendingPool | Capital Layer | *Deploy pending* | — |
| 6 | SettlementManager | Payment Layer | *Deploy pending* | — |
| 7 | ReputationRegistry | Trust History | *Deploy pending* | — |

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
| Contract Deployments | ✅ 4 deployed, 3 pending |
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
