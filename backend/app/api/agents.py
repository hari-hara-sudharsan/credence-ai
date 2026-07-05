from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.agent import AgentRequest, AgentResponse, AgentInsight
from app.services.ai_agent_engine import AIFinancialAgent
from app.services.agent_memory import AgentMemory
from app.services.predictive_engine import PredictiveRiskEngine
from app.services.verification_network import VerificationNetwork
from web3 import Web3

router = APIRouter(
    prefix="/agents",
    tags=["AI Financial Agent Layer"]
)

@router.post("/ask", response_model=AgentResponse)
def ask_agent(request: AgentRequest):
    """
    Queries one of the autonomous credit advisors (Borrower, Lender, or Protocol).
    """
    try:
        service = AIFinancialAgent()
        result = service.answer(request.wallet, request.agent_type, request.question)
        
        # Save to memory history
        memory = AgentMemory()
        memory.add_to_history(request.wallet, request.agent_type, request.question, result)
        
        return AgentResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent reasoning failed: {str(e)}")

@router.get("/history/{wallet}", response_model=List[dict])
def get_conversation_history(wallet: str):
    """
    Retrieves previous conversation logs for a wallet.
    """
    try:
        memory = AgentMemory()
        history = memory.get_history(wallet)
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load memory history: {str(e)}")

@router.get("/insights/{wallet}", response_model=List[AgentInsight])
def get_agent_insights(wallet: str):
    """
    Exposes personalized risk alerts, opportunities, and credit improvements.
    """
    try:
        checksum_wallet = Web3.to_checksum_address(wallet)
        vn = VerificationNetwork()
        verify_record = vn.get_verification_by_wallet(checksum_wallet)
        if not verify_record:
            verify_record = vn.verify_wallet(checksum_wallet)

        score = verify_record["credit_score"]
        
        predictive = PredictiveRiskEngine()
        forecast = predictive.forecast_credit(checksum_wallet)

        insights = []

        # Improvements insight
        if score < 600:
            insights.append(AgentInsight(
                type="IMPROVEMENT",
                title="Consolidate Repayments History",
                description="Repaying active outstanding loan balances before due date is the highest weight scoring improvement.",
                severity="HIGH"
            ))
        else:
            insights.append(AgentInsight(
                type="IMPROVEMENT",
                title="Expand DeFi Interaction Channels",
                description="Establish wallet footprint across additional adapters to optimize credit capacity ratings.",
                severity="LOW"
            ))

        # Alert risk insight
        if forecast["default_probability_now"] > 35.0:
            insights.append(AgentInsight(
                type="ALERT",
                title="Systemic Liquidity Warning",
                description=f"Your default probability forecast of {forecast['default_probability_now']}% creates high risk limits flags.",
                severity="HIGH"
            ))
        else:
            insights.append(AgentInsight(
                type="ALERT",
                title="Exposure Limits Normal",
                description="Leverage exposure bounds remain stable across all registered adapters.",
                severity="LOW"
            ))

        # Opportunity insights
        if score >= 680:
            insights.append(AgentInsight(
                type="OPPORTUNITY",
                title="Qualifies for Institutional Whitelisting",
                description="Your credit profile matches parameters for high LTV money market pools.",
                severity="LOW"
            ))
        else:
            insights.append(AgentInsight(
                type="OPPORTUNITY",
                title="Unlock Gold Trust Level",
                description="Increment your credit score to 650 to unlock premium gold adapter discounts.",
                severity="MEDIUM"
            ))

        return insights
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate insights: {str(e)}")
