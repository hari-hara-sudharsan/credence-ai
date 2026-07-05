# Tasks - Sprint C1: Verifiable AI Underwriting (EIP-712)

- `[ ]` Create `backend/app/schemas/underwriting_attestation.py`
- `[ ]` Create `backend/app/services/signature_engine.py`
- `[ ]` Create `backend/app/api/attestations.py`
- `[ ]` Create `contracts/SignatureVerifier.sol`
- `[ ]` Create deployment script for `SignatureVerifier.sol`
- `[ ]` Modify `backend/main.py` to register route
- `[ ]` Create frontend components:
  - `[ ]` `frontend/components/AttestationCard.tsx`
  - `[ ]` `frontend/components/SignatureViewer.tsx`
  - `[ ]` `frontend/components/VerificationStatus.tsx`
- `[ ]` Create Next.js page at `frontend/app/attestations/page.tsx`
- `[ ]` Modify `frontend/components/Navbar.tsx` to add Verifiable AI link
- `[ ]` Verify implementation:
  - `[ ]` Compile contract via hardhat
  - `[ ]` Run end-to-end Python test script
  - `[ ]` Check Next.js production build
