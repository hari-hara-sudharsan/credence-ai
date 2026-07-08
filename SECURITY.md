# Security Policy & Architecture

## Access Control Model
Credence relies on OpenZeppelin's `AccessControl` for strict role separation:
- `DEFAULT_ADMIN_ROLE`: Upgrades and emergency pauses. Managed via a Timelock multisig.
- `ORACLE_ROLE`: Can only submit `TrustProof` attestations.
- `LENDER_ROLE`: Can provision capital into the `LendingPool`.

## Oracle Trust Assumptions
The Oracle is an off-chain AI engine that scores users. 
**Assumption:** The Oracle's private key is kept strictly within a secure enclave (TEE). If compromised, the Oracle can submit false trust scores, but **cannot** move capital directly.

## AI Boundaries
The AI Trust Engine provides risk probabilities. It has **no** direct access to the Settlement Manager. Lenders configure their own risk tolerance thresholds which the smart contracts enforce, guaranteeing AI cannot override lender safety boundaries.

## Emergency Controls
All critical contracts implement OpenZeppelin's `Pausable`. The multisig can trigger `pause()` instantly across the ecosystem to halt new loans and proofs if a vulnerability is detected. Withdrawals remain open for users to retrieve capital.

## Financial Attack Prevention
- **Flash Loans:** Interest rate and credit score snapshots prevent flash loan manipulation of reputation points.
- **Sybil Attacks:** Diminishing returns on rapid trust actions prevent farming.
- **Reentrancy:** `ReentrancyGuard` applied on all external capital flow functions.

## Reporting a Vulnerability
Please email security@credence.ai. We offer a bug bounty up to $50,000 for critical smart contract vulnerabilities leading to loss of funds.
