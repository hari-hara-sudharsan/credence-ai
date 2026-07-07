# API Reference

Credence AI exposes high-performance REST APIs to integrate trust intelligence into consumer platforms.

---

## 1. Get Trust Profile API

Retrieve the verified credit score, risk classification, and authenticity profile.

- **Endpoint:** `GET /api/v1/trust/{wallet}`
- **Response Format:**
```json
{
  "trustScore": 850,
  "risk": "LOW",
  "verified": true,
  "authenticity": 97,
  "sybilRisk": "LOW"
}
```

---

## 2. Protocol Evaluate API

Evaluate borrower credit lines or collateral factors for a consuming protocol dynamically.

- **Endpoint:** `POST /api/v1/protocol/evaluate`
- **Request Format:**
```json
{
  "wallet": "0x5bb83E60a7a05A0e1b077B66412a26306e334208",
  "protocol": "LENDING"
}
```
- **Response Format:**
```json
{
  "approved": true,
  "reason": "Prime Trust Profile",
  "limit": 10000.0,
  "interestRate": 5.0,
  "collateralRatio": 20.0
}
```
