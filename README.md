# Credence AI — Decentralized Credit Infrastructure

AI-powered decentralized credit infrastructure layer for Web3, built on HashKey Chain. Credence AI translates off-chain and on-chain transactional history into secure, portable, EIP-712 oracle-signed Credit Passports (V2) that protocols can consume instantly.

## Architecture Overview
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

## Core Components
1. **Wallet Analyzer**: Collects on-chain wallet transactions and balances.
2. **Transparent Underwriting Engine**: Deterministic weighted model calculating risk and credit scores (Age 20%, Tx 25%, Repayment 30%, DeFi 15%, Risk 10%).
3. **Oracle Verification Registry**: Cryptographic verification of EIP-712 typed attestations signed by verified AI agents.
4. **Credit Passport V2**: Portable on-chain identity credentials.
5. **Loan Manager**: Oversees loan creation, activation, and coordinates with the Reputation and Settlement engines.
6. **Lending Pool**: Share-based lending registry with AccessControl and proportional interest accrual.
7. **Settlement Manager**: Secure payment settlement layer for native ETH and ERC20/HSP assets.
8. **Reputation Registry**: On-chain trust registry tracking streaks and repayment achievements.

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Hardhat 3

### Installation & System Validation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables in `.env`.
3. Validate the system:
   ```bash
   npm run validate-system
   ```

## Documentation Reference
- [ARCHITECTURE.md](./ARCHITECTURE.md): Detailed blueprints, layer diagrams, and design constraints.
- [SECURITY.md](./SECURITY.md): Threat mitigation, reentrancy reviews, and smart contract audit matrix.
- [DEPLOYMENT.md](./DEPLOYMENT.md): Deployment paths, Render/Vercel settings, and live contracts list registry.
- [API_REFERENCE.md](./API_REFERENCE.md): REST endpoint schema registers.
- [DEMO_GUIDE.md](./DEMO_GUIDE.md): Guided tours walks through the demo journeys.
