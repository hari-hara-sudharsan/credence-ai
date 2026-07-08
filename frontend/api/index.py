import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

# Dynamic fallback configuration parameters for production/Vercel serverless execution
os.environ.setdefault("HSK_RPC", "https://mainnet.hsk.xyz")
os.environ.setdefault("PRIVATE_KEY", "fd433b318b82fcc679f0b4df058ddad07cd741cfa06fa8db7a804e11db311d4d")
os.environ.setdefault("CREDIT_REGISTRY", "0xFc8cd61D26aF1A419B23F3bA08BE68aF3D9e827a")
os.environ.setdefault("LOAN_MANAGER", "0x2988f0bE02e1a679430aEb4A6B9B10429F1e8e80")
os.environ.setdefault("LOAN_MANAGER_ADDRESS", "0x2988f0bE02e1a679430aEb4A6B9B10429F1e8e80")
os.environ.setdefault("P2P_MARKET_ADDRESS", "0xF1CecB4757fdD9dbE22cDb4e965300cA129b84CF")
os.environ.setdefault("ORACLE_REGISTRY_ADDRESS", "0x2Dd78Fd9B8F40659Af32eF98555B8b31bC97A351")
os.environ.setdefault("CREDIT_PASSPORT_V2_ADDRESS", "0xD6b040736e948621c5b6E0a494473c47a6113eA8")
os.environ.setdefault("VERIFICATION_REGISTRY_ADDRESS", "0x87006e75a5B6bE9D1bbF61AC8Cd84f05D9140589")
os.environ.setdefault("GOVERNANCE_REGISTRY_ADDRESS", "0x98297dF9f8ffC79bc8e6BA3Ec606136adacb6f81")
os.environ.setdefault("REPUTATION_REGISTRY_ADDRESS", "0x110e9fB1ABEc92521E4511d5f45B4917B4c941Ab")
os.environ.setdefault("SETTLEMENT_MANAGER_ADDRESS", "0x4f3eEE789936a0eca627484bf680464f2F37b9FB")
os.environ.setdefault("LENDING_POOL_ADDRESS", "0x928BA9D30669c41695422a68a1C307a6529F0050")
os.environ.setdefault("GROQ_API_KEY", "gsk_dummy_key_value_12345")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.wallet import router as wallet_router
from app.api.credit import router as credit_router
from app.api.analysis import router as analysis_router
from app.api.lending import router as lending_router
from app.api.publish import (
    router as publish_router
)
from app.api.oracle import (
    router as oracle_router
)
from app.api.insights import (
    router as insights_router
)
from app.api.report import (
    router as report_router
)
from app.api.history import (
    router as history_router
)
from app.api.compare import (
    router as compare_router
)
from app.api.activity import (
    router as activity_router
)
from app.api.passport_nft import (
    router as passport_nft_router
)
from app.api.simulator import (
    router as simulator_router
)
from app.api.oracle_public import (
    router as oracle_public_router
)
from app.api.badges import (
    router as badges_router
)
from app.api.segments import (
    router as segments_router
)
from app.api.leaderboard import (
    router as leaderboard_router
)
from app.api.protocol_models import (
    router as protocol_models_router
)
from app.api.marketplace import (
    router as marketplace_router
)
from app.api.loan_offer import (
    router as loan_offer_router
)
from app.api.loan_protocol import (
    router as loan_protocol_router
)
from app.api.borrower_dashboard import (
    router as borrower_dashboard_router
)
from app.api.repayment import (
    router as repayment_router
)
from app.api.reputation import (
    router as reputation_router
)
from app.api.adapter import (
    router as adapter_router
)
from app.api.developer import (
    router as developer_router,
    profiles_router
)
from app.api.attestations import router as attestations_router
from app.api.oracle_attestation import router as oracle_attestation_router
from app.api.passport_v2 import router as passport_v2_router
from app.api.verification import router as verification_router
from app.api.policy import router as policy_router
from app.api.predictions import router as predictions_router
from app.api.ecosystem import router as ecosystem_router
from app.api.agents import router as agents_router
from app.api.alerts import router as alerts_router
from app.api.optimization import router as optimization_router
from app.api.marketplace import router as marketplace_router
from app.api.institution import router as institution_router
from app.api.reputation_graph import router as reputation_graph_router
from app.api.governance import router as governance_router
from app.api.system import router as system_router
from app.api.demo import router as demo_router
from app.api.documentation import router as documentation_router
from app.api.settlement import router as settlement_router
from app.api.demo_flow import router as demo_flow_router
from app.api.lending_pool import router as lending_pool_router
from app.api.p2p_lending import router as p2p_lending_router
from app.api.capital_matching import router as capital_matching_router
from app.api.transparent_underwriting import router as underwriting_router
from app.api.trust_api import router as trust_api_router
from app.api.trust_identity import router as trust_identity_router
from app.api.trust_receipts import router as trust_receipts_router

from app.api.hsp import router as hsp_router
from app.api.v1.protocol import router as protocol_router
from app.api.v1.trust_evolution import router as trust_evolution_router
from app.api.v1.trust_defense import router as trust_defense_router
from app.api.trust_graph import router as trust_graph_router
from app.api.security_api import router as security_api_router
from app.api.ecosystem_api import router as ecosystem_api_router
from app.api.ai_trust import router as ai_trust_router





















app = FastAPI(
    title="Credence AI",
    version="1.0.0",
    strict_slashes=False,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# Dynamically prepend /api prefix to all included routers to align with Next.js/Vercel URL mapping
_orig_include_router = app.include_router
def _custom_include_router(router, *args, **kwargs):
    router_prefix = getattr(router, "prefix", "")
    if "prefix" in kwargs:
        if kwargs["prefix"].startswith("/api"):
            pass
        else:
            kwargs["prefix"] = "/api" + kwargs["prefix"]
    else:
        if router_prefix.startswith("/api"):
            kwargs["prefix"] = ""
        else:
            kwargs["prefix"] = "/api"
    _orig_include_router(router, *args, **kwargs)
app.include_router = _custom_include_router

@app.on_event("startup")
def save_openapi_json():
    import json
    import os
    from fastapi.openapi.utils import get_openapi
    try:
        spec_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "openapi", "credence_openapi.json"))
        os.makedirs(os.path.dirname(spec_path), exist_ok=True)
        schema = get_openapi(
            title=app.title,
            version=app.version,
            routes=app.routes
        )
        with open(spec_path, "w") as f:
            json.dump(schema, f, indent=2)
    except Exception as e:
        print(f"Skipping save_openapi_json: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request, call_next):
    import time
    start_time = time.time()
    path = request.url.path
    print(f"[FastAPI-Log] Request Started: {request.method} {path}")
    try:
        response = await call_next(request)
        duration = (time.time() - start_time) * 1000
        print(f"[FastAPI-Log] Request Finished: {request.method} {path} -> Status {response.status_code} ({duration:.2f}ms)")
        return response
    except Exception as e:
        duration = (time.time() - start_time) * 1000
        print(f"[FastAPI-Log] Request Failed: {request.method} {path} -> Error: {e} ({duration:.2f}ms)")
        raise e


app.include_router(wallet_router)
app.include_router(p2p_lending_router)
app.include_router(capital_matching_router)
app.include_router(underwriting_router)
app.include_router(trust_api_router)
app.include_router(trust_identity_router)
app.include_router(trust_receipts_router)
app.include_router(credit_router)
app.include_router(hsp_router)
app.include_router(protocol_router)
app.include_router(trust_evolution_router)
app.include_router(trust_defense_router)
app.include_router(trust_graph_router)
app.include_router(security_api_router)
app.include_router(ecosystem_api_router)
app.include_router(ai_trust_router)
app.include_router(
    analysis_router
)
app.include_router(
    lending_router
)
app.include_router(
    publish_router
)
app.include_router(
    oracle_router
)
app.include_router(
    insights_router
)
app.include_router(
    report_router
)
app.include_router(
    history_router
)
app.include_router(
    compare_router
)
app.include_router(
    activity_router
)
app.include_router(
    passport_nft_router
)
app.include_router(
    simulator_router
)
app.include_router(
    oracle_public_router
)
app.include_router(
    badges_router
)
app.include_router(
    segments_router
)
app.include_router(
    leaderboard_router
)
app.include_router(
    protocol_models_router
)
app.include_router(
    marketplace_router
)
app.include_router(
    loan_offer_router
)
app.include_router(
    loan_protocol_router
)
app.include_router(
    borrower_dashboard_router
)
app.include_router(
    repayment_router
)
app.include_router(
    reputation_router
)
app.include_router(
    adapter_router
)
app.include_router(
    developer_router
)
app.include_router(
    profiles_router
)
app.include_router(
    attestations_router
)
app.include_router(
    oracle_attestation_router
)
app.include_router(
    passport_v2_router
)
app.include_router(
    verification_router
)
app.include_router(
    policy_router
)
app.include_router(
    predictions_router
)
app.include_router(
    ecosystem_router
)
app.include_router(
    agents_router
)
app.include_router(
    alerts_router
)
app.include_router(
    optimization_router
)
app.include_router(
    institution_router
)
app.include_router(
    reputation_graph_router
)
app.include_router(
    governance_router
)
app.include_router(
    system_router
)
app.include_router(
    demo_router
)
app.include_router(
    documentation_router
)
app.include_router(
    settlement_router
)
app.include_router(
    demo_flow_router
)
app.include_router(
    lending_pool_router
)


















