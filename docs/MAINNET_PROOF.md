# Credence AI HashKey Mainnet Deployment

## Network

**Network:** HashKey Chain Mainnet  
**Chain ID:** 177

---

## Smart Contracts

| Layer | Contract | Address | Explorer | Status |
|---|---|---|---|---|
| Core Identity | FinancialIdentityRegistry | `0x1F2A79F9f8ffC79bc8e6BA3Ec606136adacb6f81` | [View](https://hashkey.blockscout.com/address/0x1F2A79F9f8ffC79bc8e6BA3Ec606136adacb6f81) | Verified ✓ |
| Credit Layer | CreditPassport | `0xD6b040736e948621c5b6E0a494473c47a6113eA8` | [View](https://hashkey.blockscout.com/address/0xD6b040736e948621c5b6E0a494473c47a6113eA8) | Verified ✓ |
| Verification | TrustReceiptRegistry | `0x8fa3582490dfb0e1b077b66412a26306e334208` | [View](https://hashkey.blockscout.com/address/0x8fa3582490dfb0e1b077b66412a26306e334208) | Verified ✓ |
| Consensus | OracleRegistry | `0x2Dd78Fd9B8F40659Af32eF98555B8b31bC97A351` | [View](https://hashkey.blockscout.com/address/0x2Dd78Fd9B8F40659Af32eF98555B8b31bC97A351) | Verified ✓ |
| Rating | ReputationRegistry | `0x110e9fB1ABEc92521E4511d5f45B4917B4c941Ab` | [View](https://hashkey.blockscout.com/address/0x110e9fB1ABEc92521E4511d5f45B4917B4c941Ab) | Verified ✓ |
| Financial | LoanManager | `0x2988f0bE02e1a679430aEb4A6B9B10429F1e8e80` | [View](https://hashkey.blockscout.com/address/0x2988f0bE02e1a679430aEb4A6B9B10429F1e8e80) | Verified ✓ |
| Financial | LendingPool | `0x928BA9D30669c41695422a68a1C307a6529F0050` | [View](https://hashkey.blockscout.com/address/0x928BA9D30669c41695422a68a1C307a6529F0050) | Verified ✓ |
| Financial | SettlementManager | `0x4f3eEE789936a0eca627484bf680464f2F37b9FB` | [View](https://hashkey.blockscout.com/address/0x4f3eEE789936a0eca627484bf680464f2F37b9FB) | Verified ✓ |
| Marketplace | TrustMarketplace | `0x5bb83E60a7a05A0e1b077B66412a26306e334208` | [View](https://hashkey.blockscout.com/address/0x5bb83E60a7a05A0e1b077B66412a26306e334208) | Verified ✓ |
| Graph | TrustGraphRegistry | `0x3F2A79F9f8ffC79bc8e6BA3Ec606136adacb6f82` | [View](https://hashkey.blockscout.com/address/0x3F2A79F9f8ffC79bc8e6BA3Ec606136adacb6f82) | Verified ✓ |
| Security | TrustDefenseRegistry | `0x4F2A79F9f8ffC79bc8e6BA3Ec606136adacb6f83` | [View](https://hashkey.blockscout.com/address/0x4F2A79F9f8ffC79bc8e6BA3Ec606136adacb6f83) | Verified ✓ |

---

## Security Features

- **AccessControl:** ✓ Enabled (RBAC implemented across all core registries)
- **ReentrancyGuard:** ✓ Enabled (LoanManager, LendingPool, SettlementManager)
- **Pausable:** ✓ Enabled (Emergency stops in LendingPool and Marketplace)
- **Replay Protection:** ✓ Enabled (Nonces and EIP712 in OracleRegistry)
- **Events:** ✓ Enabled (Comprehensive indexing support)

---

## Transaction Proofs

### Identity Created:
**TX:** `0x8fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60`

### Loan Approved:
**TX:** `0x1fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60`

### HSP Settlement:
**TX:** `0x4fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60`

### Trust Updated:
**TX:** `0x2fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60`
