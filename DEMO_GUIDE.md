# Live Demo Guided Tour — Credence AI

The live demonstration dashboard can be accessed on the `/demo` path route after booting up both frontend and backend.

## Walkthrough Scenarios

### 1. Borrower Journey
1. **Connect Wallet**: Input your EVM wallet address.
2. **Collect Footprint**: Pulls transaction count and native token reserves.
3. **Generate Credit Score**: Computes your credit rating and default probability rate.
4. **Issue Passport V2**: Triggers EIP-712 signature generation.
5. **Get Offers**: Offers lists are generated based on adapted protocol metrics.
6. **AI Explanation & Checklist**: Read the personalized advice outlining score improvement tasks.

### 2. Protocol Eligibility Checks
- Third-party lending protocols query verification hash status.
- Evaluates custom rules parameters (e.g. credit score greater than 600).

### 3. Institutional Command Center
- Financial institutions import large-scale portfolios.
- Reviews segments distributions, alerts exposure alerts, and issues risk reports.

## Running System Tests
To execute E2E validation tests directly:
```bash
npm run validate-system
```
Ensure a local Cancun-hardfork EVM network node is running on port 8545.
