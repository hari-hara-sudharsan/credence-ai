# Credence AI Production Pipeline Architecture

Credence transitions from a standalone smart contract protocol into a full-stack financial infrastructure platform running seamlessly on the HashKey Chain.

## System Diagram

```mermaid
graph TD
    subgraph HashKey Mainnet
        FIR[FinancialIdentityRegistry]
        POT[ProofOfTrustRegistry]
        LM[LendingMarket]
    end

    subgraph Credence Backend Engine
        IX[Credence Indexer]
        EP[Event Processor]
        DB[(PostgreSQL + Prisma)]
        API[API & SSE Router]
    end

    subgraph Client Applications
        DA[Trust Dashboard]
        SDK[Credence TypeScript SDK]
    end

    FIR -- IdentityCreated Event --> IX
    POT -- TrustProofCreated Event --> IX
    LM -- HSPSettlementCompleted --> IX

    IX -->|Deduplicated Payload| EP
    EP -->|Prisma ORM Update| DB
    EP -.->|Real-Time WebSockets| API

    API -->|SSE Stream| DA
    API -- Fast Query --> SDK
    DB -.->|Read Replica| API
```

## Prisma Database Schema

The foundational PostgreSQL schema guarantees relational integrity:
- **FinancialIdentity:** Immutable record of verified users and trust tiers.
- **TrustEvent:** Atomic trust actions (payments, verifications) used to compute dynamic scores.
- **Settlement:** HSP records providing real value to the reputation graph.
- **IndexerState:** Ensures perfect block synchronization and rollback capabilities during chain reorganizations.

## High Availability & Scaling Plan
- **Horizontal Scaling:** API instances sit behind a load balancer and read directly from PostgreSQL read replicas.
- **Deduplication:** A unique `EventID` (`chainId-txHash-logIndex`) is enforced at the database layer.
- **Real-Time:** WebSockets (SSE) push updates strictly to subscribed wallets, saving client query bandwidth.
