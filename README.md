# Credence AI — Decentralized Credit Infrastructure

AI-powered decentralized credit infrastructure layer for Web3, built on HashKey Chain. Credence AI translates off-chain and on-chain transactional history into secure, portable, EIP-712 oracle-signed Credit Passports (V2) that protocols can consume instantly.

## Architecture Overview
```
           Wallet Activity
                 ↓
      AI Intelligence Core
                 ↓
     Oracle Attestation Signer
                 ↓
     GovernanceRegistry (Cancun)
                 ↓
        Credit Passport V2
                 ↓
       Cross-Protocol Adaptations
```

## Core Components
1. **Wallet Analyzer**: Collects token balances and tx records metrics.
2. **Credit & Risk Engines**: Determines composite credit score, rating tiers, and defaults forecasting probabilities.
3. **Universal Verification Network**: Coordinates EIP-712 structured attestations.
4. **Credit Passport V2**: Portable NFT and identity state mapping.
5. **Policy Engine**: Allows third-party money markets to evaluate custom lending conditions at the API gate.

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
