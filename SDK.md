# Credence AI — Developer SDK Integration

## One Trust Layer For Every HashKey Application

Credence allows any financial application to consume programmable trust.

Developers no longer need to build:

- Credit systems
- Risk engines
- Reputation databases
- Trust models

They integrate Credence once.

---

# Developer Vision

Before Credence:

```
Every Protocol

↓

Build Credit System

↓

Collect History

↓

Calculate Risk

↓

Start From Zero
```

Result:

Fragmented trust.

---

After Credence:

```
Every Protocol

↓

Credence.verify(wallet)

↓

Instant Financial Trust
```

Result:

Shared financial intelligence.

---

# Installation


```bash
npm install @credence/sdk
```


---

# Quick Start


Create a Credence client:


```javascript
import { Credence } from "@credence/sdk";


const credence = new Credence({
    network:"hashkey-mainnet"
});
```


---

# Verify A Wallet


```javascript
const profile =
await credence.verify(
 "0x5bb83E60a7a05A0e1b077B66412a26306e334208"
);


console.log(profile);
```


Response:


```json
{
 "wallet":
 "0x5bb83E60a7a05A0e1b077B66412a26306e334208",

 "trustScore":820,

 "tier":"PRIME",

 "risk":"LOW",

 "creditLimit":5000,

 "defaultProbability":"2.4%"
}
```


---

# Build With Trust


Example:


```javascript
if(profile.trustScore >= 800){

    enablePremiumAccess();

}
```


A single trust profile can power unlimited applications.

---

# Available SDK Modules


```
@credence/sdk
```


Includes:


- Identity Client
- Credit Client
- Reputation Client
- Risk Client
- Settlement Client
- Passport Client


---

# Credit Passport API


Retrieve portable financial identity.


```javascript
const passport =
await credence.passport.get(wallet);
```


Response:


```json
{
 "identity":"ACTIVE",

 "score":820,

 "history":"VERIFIED",

 "settlements":42,

 "status":"TRUSTED"
}
```


---

# Reputation API


Read financial history.


```javascript
const reputation =
await credence.reputation.get(wallet);
```


Returns:


```json
{
 "successfulRepayments":18,

 "defaults":0,

 "trustTrend":"INCREASING"
}
```


---

# Risk API


Get AI-powered risk intelligence.


```javascript
const risk =
await credence.risk.analyze(wallet);
```


Output:


```json
{
 "riskLevel":"LOW",

 "confidence":96,

 "recommendation":"APPROVE"
}
```


---

# Settlement API


Create settlement-powered trust events.


```javascript
const settlement =
await credence.settlement.create({

 borrower:wallet,

 amount:5000

});
```


Flow:


```
Settlement

↓

Verification

↓

Trust Receipt

↓

Reputation Update
```


---

# Integration Example 1 — Lending


Traditional lending:


```javascript
requireCollateral(150);
```


Credence lending:


```javascript
const trust =
await credence.verify(wallet);


if(trust.score > 800){

 reduceCollateral();

}
```


---

# Integration Example 2 — PayFi


```javascript
const trust =
await credence.verify(wallet);


if(trust.risk === "LOW"){

 increasePaymentLimit();

}
```


---

# Integration Example 3 — RWA Finance


```javascript
const profile =
await credence.passport.get(wallet);


if(profile.score >= 750){

 approveFinancing();

}
```


---

# Integration Example 4 — AI Agents


```javascript
const trust =
await credence.verify(agentWallet);


if(trust.tier === "PRIME"){

 allowAutonomousExecution();

}
```


---

# API Endpoints


## Trust Profile


```http
GET /api/trust/{wallet}
```


Returns complete financial identity.


---

# Credit Analysis


```http
GET /api/credit/{wallet}
```


Returns:


```json
{
 "score":820,
 "loanAccess":true
}
```


---

# Trust Graph


```http
GET /api/graph/{wallet}
```


Returns:


```json
{
 "connections":128,

 "networkTrust":88
}
```


---

# Architecture


```
External Application


        |
        v


Credence SDK

        |
        v


Trust APIs

        |
        v


Smart Contracts

        |
        v


HashKey Chain
```


---

# Security Model


SDK never bypasses contracts.


Every important update requires:


```
Request

↓

Oracle Verification

↓

Smart Contract Validation

↓

Execution
```


---

# Developer Benefits


## Without Credence


6 months building:


- Risk engine
- Reputation
- Identity
- Scoring
- Security


---

## With Credence


5 minutes:


```javascript
await Credence.verify(wallet)
```


---

# Why This Matters


Financial applications should compete on user experience.

They should not rebuild trust infrastructure.

Credence becomes the shared trust primitive.

---

# Final Developer Statement


Every financial protocol asks:


"Can this wallet be trusted?"


Credence provides the answer.


One SDK.

One identity.

Every financial application.
