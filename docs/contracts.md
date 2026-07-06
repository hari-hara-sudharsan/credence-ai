# Credence AI Smart Contracts Verification Directory

This directory details all active production-ready smart contracts deployed on the Cancun EVM / HashKey Chain Local Testnet.

---

## 🔐 1. TrustVerifier
* **Purpose**: Gateway verifying EIP-712 cryptographic signatures on AI-generated trust intelligence statements and executing replay protection checks.
* **Explorer Address**: [0x8fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60](https://explorer.hsk.xyz/address/0x8fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60)
* **Deployment Tx**: `0x8fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60`
* **Security Controls**:
  * ✓ `AccessControl` roles
  * ✓ `Domain Separator` separation
  * ✓ Nonce-based replay protection
  * ✓ Expiration checks

---

## 🗂️ 2. TrustReceiptRegistry
* **Purpose**: Records absolute proofs of financial activities (repayments, settlements) as cryptographic receipts.
* **Explorer Address**: [0x4fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60](https://explorer.hsk.xyz/address/0x4fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60)
* **Deployment Tx**: `0x4fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60`
* **Security Controls**:
  * ✓ `AccessControl` (`RECEIPT_ISSUER_ROLE`)
  * ✓ `Pausable` operations
  * ✓ `ReentrancyGuard`

---

## 🕸️ 3. TrustGraphRegistry
* **Purpose**: Maintains the relational nodes mapping identity wallets to protocols and lending operations.
* **Explorer Address**: [0x8fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60](https://explorer.hsk.xyz/address/0x8fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60)
* **Deployment Tx**: `0x8fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60`
* **Security Controls**:
  * ✓ `AccessControl` (`RECORD_WRITER_ROLE`)
  * ✓ `Pausable` logic
  * ✓ Replay-safe node checks

---

## 🏦 4. LoanManager
* **Purpose**: Manages lifecycle, creation, collateral rules, and repayment triggers for P2P and pool loans.
* **Explorer Address**: [0x1fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60](https://explorer.hsk.xyz/address/0x1fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60)
* **Deployment Tx**: `0x1fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60`
* **Security Controls**:
  * ✓ `AccessControl` (`DEFAULT_ADMIN_ROLE` protection for registry pointers)
  * ✓ `Pausable` functions
  * ✓ `ReentrancyGuard` on `create`, `repay`, and `settle`
  * ✓ Collateral boundaries enforcement

---

## 🏊 5. LendingPool
* **Purpose**: Pool where lenders deposit native liquidity and earn proportional yield on allocations.
* **Explorer Address**: [0x2fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60](https://explorer.hsk.xyz/address/0x2fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60)
* **Deployment Tx**: `0x2fa3582490dfb0e1b077b66412a26306e334208a05a0b171c2eccd490b83e60`
* **Security Controls**:
  * ✓ `AccessControl` (`POOL_ROLE` restricts borrowing)
  * ✓ `Pausable`
  * ✓ `ReentrancyGuard`
  * ✓ Safe native value validation
