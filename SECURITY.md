# Credence AI — Security Architecture

## Attack Protection Matrix

| Attack Vector | Protection | Implementation |
|---|---|---|
| **Replay Attack** | ✅ Protected | Nonce tracking per borrower + `usedAttestations` mapping |
| **Reentrancy** | ✅ Protected | `ReentrancyGuard` on all state-changing functions |
| **Unauthorized Access** | ✅ Protected | `AccessControl` with role-based permissions |
| **Expired Signature** | ✅ Protected | `block.timestamp < expiry` check on all attestations |
| **Oracle Abuse** | ✅ Protected | Multi-oracle consensus + threshold validation |
| **Emergency Halt** | ✅ Protected | `Pausable` on all new contracts |
| **Integer Overflow** | ✅ Protected | Solidity 0.8.28 built-in overflow checks |
| **ERC20 Return Value** | ✅ Protected | `SafeERC20` wrapper for all token transfers |

---

## EIP-712 Credit Attestation Flow

```
AI Credit Engine generates score
        ↓
Oracle signs EIP-712 typed data
        ↓
OracleRegistry.verifyCreditAttestation()
        ↓
Checks: signer ✓ | expiry ✓ | nonce ✓ | not-reused ✓
        ↓
LoanManager trusts verified result
```

**Why this matters:**
- Backend alone CANNOT approve money movement
- Every credit decision requires a cryptographic oracle signature
- Signatures are single-use (replay protection via nonce + used-hash tracking)

---

## Access Control Roles

| Role | Contract | Permissions |
|---|---|---|
| `DEFAULT_ADMIN_ROLE` | All | Grant/revoke roles, pause/unpause |
| `ORACLE_ROLE` | ReputationRegistry | Record repayments and defaults |
| `POOL_ROLE` | LendingPool | Allocate loans, record repayments |
| `SETTLEMENT_ROLE` | SettlementManager | Create and execute settlements |
| `governor` | OracleRegistry | Register oracles, set threshold |

---

## Contract Security Features

### LendingPool.sol
- `AccessControl` — only POOL_ROLE can allocate loans
- `Pausable` — emergency halt on all operations
- `ReentrancyGuard` — prevents reentrancy on deposit/withdraw/allocate
- Share-based accounting prevents rounding exploits

### SettlementManager.sol
- `AccessControl` — only SETTLEMENT_ROLE can create/execute
- `SafeERC20` — safe token transfers for ERC20 mode
- Double-execute prevention (state machine: CREATED → EXECUTED)
- Excess ETH refund on native settlements
- `Pausable` + `ReentrancyGuard`

### ReputationRegistry.sol
- `AccessControl` — only ORACLE_ROLE can update scores
- Score bounded: 0 ≤ score ≤ 1000 (no overflow)
- Streak reset on default (prevents gaming)
- `Pausable` + `ReentrancyGuard`

### OracleRegistry.sol
- Multi-oracle consensus (threshold signatures)
- EIP-712 typed data verification
- Nonce-based replay protection
- Expiry checking on all attestations
- Duplicate signer detection in consensus

---

## Testing Evidence

```
68 passing Solidity tests covering:
- ReputationRegistry:  16 tests (scoring, access control, pausable, events)
- SettlementManager:   17 tests (lifecycle, access control, refunds, events)
- LendingPool:         16 tests (shares, interest, access control, pausable)
- P2PLendingMarket:    18 tests (full lifecycle)
- Counter:              1 test + 256 fuzz runs
```
