# HashKey Chain Mainnet Contract Verification Package

All core contracts of the Credence AI protocol have been deployed to the **HashKey Chain Mainnet (Chain ID 177)**.

---

## Deployed Contracts Registry

| # | Contract | Address | Explorer Link | Security Features |
|---|---|---|---|---|
| 1 | **GovernanceRegistry** | `0x98297dF9f8ffC79bc8e6BA3Ec606136adacb6f81` | [Verify](https://hashkey.blockscout.com/address/0x98297dF9f8ffC79bc8e6BA3Ec606136adacb6f81) | RBAC, Governance control |
| 2 | **CreditPassportV2** | `0xD6b040736e948621c5b6E0a494473c47a6113eA8` | [Verify](https://hashkey.blockscout.com/address/0xD6b040736e948621c5b6E0a494473c47a6113eA8) | ERC721, Metadata URI registry |
| 3 | **OracleRegistry** | `0x2Dd78Fd9B8F40659Af32eF98555B8b31bC97A351` | [Verify](https://hashkey.blockscout.com/address/0x2Dd78Fd9B8F40659Af32eF98555B8b31bC97A351) | Multi-Oracle consensus, EIP-712 |
| 4 | **LoanManager** | `0x2988f0bE02e1a679430aEb4A6B9B10429F1e8e80` | [Verify](https://hashkey.blockscout.com/address/0x2988f0bE02e1a679430aEb4A6B9B10429F1e8e80) | State machine bounds, safe math |
| 5 | **LendingPool** | `0x928BA9D30669c41695422a68a1C307a6529F0050` | [Verify](https://hashkey.blockscout.com/address/0x928BA9D30669c41695422a68a1C307a6529F0050) | ReentrancyGuard, Pausable |
| 6 | **SettlementManager** | `0x4f3eEE789936a0eca627484bf680464f2F37b9FB` | [Verify](https://hashkey.blockscout.com/address/0x4f3eEE789936a0eca627484bf680464f2F37b9FB) | Double-execute protection, refunds |
| 7 | **ReputationRegistry** | `0x110e9fB1ABEc92521E4511d5f45B4917B4c941Ab` | [Verify](https://hashkey.blockscout.com/address/0x110e9fB1ABEc92521E4511d5f45B4917B4c941Ab) | Weighted scoring, streak tracking |
| 8 | **TrustReceiptRegistry** | `0x8fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60` | [Verify](https://hashkey.blockscout.com/address/0x8fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60) | Uniqueness checks, history query |
| 9 | **TrustMarketplace** | `0x5bb83E60a7a05A0e1b077B66412a26306e334208` | [Verify](https://hashkey.blockscout.com/address/0x5bb83e60a7a05A0e1b077B66412a26306e334208) | EIP-712, categories registration |
| 10 | **TrustEvolution** | Deployed | [Verify](https://hashkey.blockscout.com) | History timelines recording |
| 11 | **TrustDefenseRegistry** | Deployed | [Verify](https://hashkey.blockscout.com) | Sybil and authenticity locks |

---

## Security Verification Keys
- **Deployer Wallet Address:** `0x5bb83E60a7a05A0e1b077B66412a26306e334208`
- **Verification Signer Public Key:** `0xF1CecB4757fdD9dbE22cDb4e965300cA129b84CF`
