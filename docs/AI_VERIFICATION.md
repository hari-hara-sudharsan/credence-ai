# AI Verification Infrastructure

Credence AI implements a strict separation of concerns between intelligence and enforcement.

## The Chain of Trust

**1. AI Analyzes (Off-chain)**
- Python-based Explainability Engine processes real-world financial data.
- Generates risk models and scores.

**2. AI Explains (Off-chain)**
- Outputs an auditable AI Decision Passport detailing WHY, HOW, RISK, and CONFIDENCE.
- Output Hash: 0x8f2a...3c1b

**3. Oracle Recommends (Off-chain -> On-chain)**
- Authorized Node signs the decision.
- Signer: Oracle Node

**4. Blockchain Verifies & Stores (On-chain)**
- Smart contracts verify the ECDSA signature.
- CreditPassportV2 updates state.

**5. Blockchain Executes (On-chain)**
- Subsequent operations (e.g., lending) use the verified state as ground truth.
