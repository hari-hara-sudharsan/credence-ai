from fastapi import APIRouter, HTTPException
from app.services.audit_report_generator import AuditReportGenerator

router = APIRouter(
    prefix="/submission",
    tags=["Submission & Documentation"]
)

@router.get("/summary")
def get_submission_summary():
    """
    Returns dynamic Judge / Investor summary.
    """
    return {
        "project": "Credence AI",
        "mission": "AI-powered decentralized credit infrastructure for HashKey Chain",
        "core_layers": [
            "Credit Identity Generation",
            "Oracle Verification Network",
            "Risk Intelligence Engine",
            "Protocol Integration adapters",
            "Institutional dashboard Platform"
        ],
        "differentiators": [
            "Portable Credit Passport (V2)",
            "EIP-712 AI Attestations",
            "Programmable Credit Policies",
            "Cross-Protocol Trust Graph"
        ]
    }

@router.get("/audit-report")
def get_audit_report():
    try:
        gen = AuditReportGenerator()
        return gen.generate_submission_report()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/endpoints")
def get_api_endpoints_documentation():
    return {
        "categories": [
            {
                "name": "Credit APIs",
                "endpoints": [
                    {"path": "/wallet-analyzer", "method": "POST", "purpose": "Scans wallet history balance, age, and transactions count."},
                    {"path": "/credit-score", "method": "POST", "purpose": "Calculates composite credit scores and defaults probabilities."}
                ]
            },
            {
                "name": "Oracle APIs",
                "endpoints": [
                    {"path": "/verify-wallet", "method": "POST", "purpose": "Publishes cryptographic credit proofs on-chain."}
                ]
            },
            {
                "name": "Passport APIs",
                "endpoints": [
                    {"path": "/passport-v2", "method": "GET", "purpose": "Fetches metadata for wallet passports."}
                ]
            },
            {
                "name": "Policy APIs",
                "endpoints": [
                    {"path": "/policy/evaluate", "method": "POST", "purpose": "Evaluates wallet credentials matching custom rules rules."}
                ]
            },
            {
                "name": "Developer APIs",
                "endpoints": [
                    {"path": "/developer/api-keys", "method": "GET", "purpose": "Lists registered API keys with rate-limits."}
                ]
            }
        ]
    }
