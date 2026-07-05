import os

from groq import Groq

from dotenv import load_dotenv

load_dotenv()


class LLMCreditReport:

    def __init__(self):

        self.client = Groq(
            api_key=os.getenv(
                "GROQ_API_KEY"
            )
        )

    def generate(
        self,
        wallet: str,
        features: dict,
        profile
    ):

        prompt = f"""
You are an expert DeFi credit underwriter writing an institutional-grade Credit Underwriting Report for:
Wallet Address: {wallet}
Credit Score: {profile.credit_score}
Rating: {profile.rating}
Probability Of Default: {profile.probability_of_default}%

Wallet Metrics and Features:
{features}

Please write a highly detailed, professional, and well-crafted report. You must use the exact markdown headers below and write a custom, specific analysis for each:

**Wallet Overview**
Provide a concise summary of this wallet's profile. Describe its age, active duration, transaction count, and balance. Mention what kind of user this is based on their features.

**Risk Assessment**
Assess the security and default risks. Analyze the probability of default and Sybil risk score. Detail how the transaction behavior and age contribute to the overall risk.

**Strengths**
List the specific positive characteristics (e.g., solid longevity, active transacting, protocol diversity, asset stability). If there are no major strengths, explain why the wallet has failed to build positive indicators.

**Weaknesses**
Identify the vulnerabilities (e.g., high default probability, sybil characteristics, low transaction count, empty balance, short wallet age). Be specific about what metrics are concerning.

**Lending Recommendation**
State a clear recommendation on whether a lender should allocate capital to this borrower, explaining the interest rate and collateral ratio logic based on their risk profile.

Keep the report concise, professional, and within 300 words. Do not use generic placeholders.
"""

        completion = (
            self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3
            )
        )

        return (
            completion
            .choices[0]
            .message
            .content
        )