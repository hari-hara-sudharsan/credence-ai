# Architecture Blueprint — Credence AI

Credence AI is structured as a decoupled layers stack that translates multi-chain footprints into portable trust scores on-chain.

```
       [Wallet Activity]
               ↓
    [AI Risk Intelligence]  <-- Wallet Analyzer, CreditEngine, PredictiveRiskEngine
               ↓
    [Oracle Attestation]    <-- EIP-712 Signature Issuer
               ↓
    [Credit Passport V2]    <-- Smart Contract Registry (HashKey Chain)
               ↓
    [Protocol integrations] <-- Adapters (Lending, Insurance, RWA, DAO)
               ↓
    [Institution Center]    <-- Dashboard Platform
```

## System Layers

### 1. Data Aggregation & Analysis
- **WalletAnalyzer**: Collects live ERC-20 balances, transaction velocities, age metric indexes, and interaction count states.

### 2. Risk Modeling & Prediction
- **CreditEngine**: Calculates credit scores dynamically (300-850 scale) using weighted models.
- **PredictiveRiskEngine**: Models multi-horizon defaults probability rates using Markov chain simulators.

### 3. Oracle Verification (EIP-712)
- **Universal Verification Network**: Converts data profiles into cryptographically signed EIP-712 structured messages. Signatures include:
  - `walletAddress`, `creditScore`, `riskLevel`, `timestamp`, `nonce`.

### 4. Smart Contract Registries
- **CreditPassportV2**: ERC-721/ERC-1155 identity passport tracking active verified scores.
- **GovernanceRegistry**: Manages RBAC authority roles, oracle endpoints validation registries, and parameters rules.
- **LoanManager**: Manages test borrow allocations, loan state progressions, and repayments.

### 5. Adapters
- **LendingAdapter / InsuranceAdapter / RwaAdapter**: Translates generalized profiles into domain-specific parameters (e.g. Max LTV, Coverage premiums, delegate voting weights).
