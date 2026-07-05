# REST API Directory Reference — Credence AI

Credence AI exposes structured JSON REST endpoints for wallet parsing and validation.

## Endpoint Overview

### 1. Credit APIs

#### `POST /wallet/analyze`
- **Purpose**: Computes token balances, velocities, and transactions count.
- **Request Body**:
  ```json
  {"wallet": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"}
  ```
- **Response**:
  ```json
  {"transaction_count": 50, "balance": 100.0, "wallet_age_days": 30}
  ```

#### `POST /credit/score`
- **Purpose**: Evaluates features and outputs the calculated score.
- **Request Body**: Same as above.
- **Response**:
  ```json
  {"credit_score": 585, "grade": "C", "probability_of_default": 0.48}
  ```

### 2. Oracle & Passport APIs

#### `GET /verify/{wallet}/proof`
- **Purpose**: Generates the machine-readable EIP-712 signature proof.
- **Response**:
  ```json
  {
    "oracle_signature": "0xb59159bb25...",
    "passport_hash": "0x13218233...",
    "trust_seal": "SILVER"
  }
  ```

#### `POST /policies/evaluate`
- **Purpose**: Runs custom policy checks.
- **Request Body**:
  ```json
  {"wallet": "0x...", "policy_id": "prime_borrower_check"}
  ```
- **Response**:
  ```json
  {"passed": true, "score": 100.0}
  ```

### 3. Submission APIs

#### `GET /submission/summary`
- **Purpose**: Returns the investor/judge technical overview.
- **Response**:
  ```json
  {
    "project": "Credence AI",
    "mission": "AI-powered decentralized credit infrastructure for HashKey Chain",
    "core_layers": [...],
    "differentiators": [...]
  }
  ```
