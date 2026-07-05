# Deployment Guide — Credence AI

Credence AI infrastructure can be deployed to production environments using Vercel, Render, and Hardhat toolsets.

## Frontend (Vercel)
- **Deployment Platform**: Vercel.
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Required Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: Backend URL endpoint prefix.
  - `NEXT_PUBLIC_DEFAULT_WALLET`: Test wallet address.

## Backend (Render)
- **Deployment Platform**: Render Web Services.
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Health Endpoint**: `GET /system/health`
- **Required Environment Variables**:
  - `HSK_RPC`: Cancun-compatible EVM node provider endpoint URL.
  - `ORACLE_PRIVATE_KEY`: Cryptographic key issuing EIP-712 signatures.

## Smart Contracts (HashKey Chain)
- **Network Name**: HashKey Chain (Cancun Hardfork).
- **Hardhat Commands**:
  - Compile: `npx hardhat compile`
  - Deploy: `npx hardhat ignition deploy ignition/modules/GovernanceRegistry.ts`

### Deployed Contract Registry
- **GovernanceRegistry**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **CreditPassportV2**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **OracleRegistry**: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`
- **LoanManager**: `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9`
