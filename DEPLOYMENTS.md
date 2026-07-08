# Credence AI — Deployment Verification Report

## HashKey Chain Mainnet Infrastructure

This document provides independently verifiable deployment evidence for the Credence AI Trust Infrastructure.

Every contract listed here represents a live component of the Credence protocol.

---

# Network Information

Network:

HashKey Chain Mainnet

Purpose:

Production financial trust infrastructure

Core responsibilities:

- Financial identity
- AI verification
- Lending lifecycle
- Settlement execution
- Reputation history
- Trust graph
- Governance

---

# Deployment Summary

| Metric | Value |
|-|-|
| Network | HashKey Chain |
| Core Contracts | 7 |
| Total Solidity Files | 26 |
| Solidity LOC | 3500+ |
| Security Framework | OpenZeppelin |
| Verification | Block Explorer |
| Oracle Standard | EIP-712 |

---

# System Architecture

```
                    AI Engine

                        |

                        v

                OracleRegistry

                        |

                        v

              CreditPassportV2

                        |

              ReputationRegistry

                        |

                        v

LoanManager  <-----> LendingPool

                        |

                        v

              SettlementManager

                        |

                        v

             HashKey Settlement Layer
```

---

# 1. GovernanceRegistry

## Purpose

Protocol administration and permission management layer.

Controls:

- Protocol roles
- Trusted actors
- Contract permissions
- Upgrade governance

---

## Deployment

Contract:

GovernanceRegistry


Address:

```
0x98297dF9f8ffC79bc8e6BA3Ec606136adacb6f81
```

Explorer:

[View on Blockscout](https://hashkey.blockscout.com/address/0x98297dF9f8ffC79bc8e6BA3Ec606136adacb6f81)


---

## Security

Implemented:

- AccessControl
- Admin roles
- Permission boundaries

---

# 2. CreditPassportV2

## Purpose

Portable financial identity layer.

The Credit Passport stores reusable trust reputation that can be consumed by multiple HashKey applications.

---

## Responsibilities

- Create financial identities
- Store trust state
- Maintain credit history
- Enable protocol composability

---

## Deployment

Contract:

CreditPassportV2


Address:

```
0xD6b040736e948621c5b6E0a494473c47a6113eA8
```

Explorer:

[View on Blockscout](https://hashkey.blockscout.com/address/0xD6b040736e948621c5b6E0a494473c47a6113eA8)


---

## Main Functions

```solidity
updateScore()

getPassportData()
```

---

# 3. OracleRegistry

## Purpose

Bridge between AI intelligence and blockchain verification.

AI cannot directly update contracts.

OracleRegistry verifies every AI decision.

---

# Verification Flow


```
AI Decision

↓

Hash Generated

↓

Oracle Signature

↓

EIP712 Verification

↓

Contract Execution
```


---

## Deployment


Address:


```
0x2Dd78Fd9B8F40659Af32eF98555B8b31bC97A351
```


Explorer:


[View on Blockscout](https://hashkey.blockscout.com/address/0x2Dd78Fd9B8F40659Af32eF98555B8b31bC97A351)


---

# Security


Implemented:


- EIP-712
- Nonce validation
- Expiry validation
- Replay prevention
- Authorized signer checks


---

# 4. LoanManager


## Purpose


Controls the complete credit lifecycle.


Responsibilities:


- Loan creation
- Approval validation
- Repayment tracking
- Trust updates


---


## Deployment


Address:


```
0x2988f0bE02e1a679430aEb4A6B9B10429F1e8e80
```


Explorer:


[View on Blockscout](https://hashkey.blockscout.com/address/0x2988f0bE02e1a679430aEb4A6B9B10429F1e8e80)


---

# Lifecycle


```
Credit Check

↓

Loan Approval

↓

Settlement

↓

Repayment

↓

Reputation Increase
```


---

# 5. LendingPool


## Purpose


Capital infrastructure layer.


Allows:


- Liquidity deposits
- Borrowing
- Repayments
- Yield generation


---

## Deployment


Address:


```
0x928BA9D30669c41695422a68a1C307a6529F0050
```


Explorer:


[View on Blockscout](https://hashkey.blockscout.com/address/0x928BA9D30669c41695422a68a1C307a6529F0050)


---

# Security


Implemented:


- ReentrancyGuard
- SafeERC20
- AccessControl
- Pausable


---

# 6. SettlementManager


## Purpose


HashKey settlement execution infrastructure.


SettlementManager converts successful financial actions into permanent trust events.


---

# Settlement Flow


```
Loan Approved

↓

Settlement Created

↓

Funds Executed

↓

Receipt Generated

↓

Reputation Updated
```


---

## Deployment


Address:


```
0x4f3eEE789936a0eca627484bf680464f2F37b9FB
```


Explorer:


[View on Blockscout](https://hashkey.blockscout.com/address/0x4f3eEE789936a0eca627484bf680464f2F37b9FB)


---

## Important Functions


```solidity
executeSettlement()

escrowFunds()
```


---

# 7. ReputationRegistry


## Purpose


Permanent trust memory system.


Tracks:


- Successful repayments
- Defaults
- Trust improvements
- Historical behavior


---

## Deployment


Address:


```
0x110e9fB1ABEc92521E4511d5f45B4917B4c941Ab
```


Explorer:


[View on Blockscout](https://hashkey.blockscout.com/address/0x110e9fB1ABEc92521E4511d5f45B4917B4c941Ab)


---

# Reputation Update Flow


```
Verified Event

↓

Oracle Approval

↓

Score Update

↓

Future Credit Improved
```


---

# Contract Security Summary


| Protection | Status |
|-|-|
| Access Control | ENABLED |
| Reentrancy Protection | ENABLED |
| Safe Transfers | ENABLED |
| Emergency Pause | ENABLED |
| Signature Verification | ENABLED |
| Replay Protection | ENABLED |
| Expiry Validation | ENABLED |


---

# Deployment Verification Checklist


| Requirement | Status |
|-|-|
| HashKey Mainnet Deployment | COMPLETE |
| Seven Core Contracts | COMPLETE |
| Contract Separation | COMPLETE |
| Security Libraries | COMPLETE |
| Oracle Verification | COMPLETE |
| Settlement Layer | COMPLETE |
| Reputation Layer | COMPLETE |


---

# Final Statement


Credence AI is not represented by a single contract.


It is a complete financial trust infrastructure composed of:


Identity

+

AI Verification

+

Settlement

+

Reputation

+

Capital


deployed together as the programmable trust layer for HashKey Chain.
