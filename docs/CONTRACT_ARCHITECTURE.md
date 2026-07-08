# Credence AI Smart Contract Architecture

The Credence AI smart contract suite enforces financial trust, oracle attestations, and lifecycle security on the blockchain. The AI intelligence resides off-chain in Python, while execution and truth remain decentralized.

---

## 1. GovernanceRegistry.sol
**Purpose:** Core protocol governance and administrative control.
**Enforces:**
✓ Admin roles and hierarchical access
✓ Protocol pause/unpause mechanisms
✓ Global parameter updates
**Security:**
✓ Role-based AccessControl
✓ Parameter bounds checking
✓ Modifiers for administrative limits

## 2. CreditPassportV2.sol
**Purpose:** Portable, soulbound financial identity for users.
**Enforces:**
✓ Soulbound token mechanics (non-transferable)
✓ Real-time score updates
✓ Oracle-only modification privileges
**Security:**
✓ Strict AccessControl
✓ Comprehensive Event emission
✓ State Validation against invalid scores

## 3. OracleRegistry.sol
**Purpose:** Attestation layer connecting off-chain AI to on-chain enforcement.
**Enforces:**
✓ Whitelisted oracle node management
✓ Cryptographic signature verification
✓ Data freshness and validity
**Security:**
✓ ECDSA Signature Validation
✓ Replay Attack Protection
✓ Authorized Signer verification

## 4. LoanManager.sol
**Purpose:** Orchestrates the lifecycle of peer-to-peer and institutional loans.
**Enforces:**
✓ Loan creation and status transitions
✓ Interest rate and duration bounds
✓ Repayment tracking and defaults
**Security:**
✓ ReentrancyGuard
✓ State machine validation (Pending -> Active -> Repaid)
✓ Strict AccessControl for authorized callers

## 5. LendingPool.sol
**Purpose:** Liquidity aggregation and yield generation.
**Enforces:**
✓ Capital deposits and withdrawals
✓ Dynamic interest and yield distribution
✓ Pool solvency and utilization rates
**Security:**
✓ Reentrancy protection
✓ Precision math validation
✓ SafeERC20 asset transfers

## 6. SettlementManager.sol
**Purpose:** Abstracted HashKey Settlement execution flow.
**Enforces:**
✓ Escrow and fund release
✓ Multi-party settlement finality
✓ Native HSP execution design
**Security:**
✓ Atomic transaction execution
✓ Balance verification
✓ Reversion on partial failures

## 7. ReputationRegistry.sol
**Purpose:** Permanent on-chain tracking of trust impacts and behavior.
**Enforces:**
✓ Append-only trust event recording
✓ Oracle-attested impact scores
✓ Historical behavior tracking
**Security:**
✓ AccessControl for event writers
✓ Event integrity checks
✓ Sybil resistance mapping
