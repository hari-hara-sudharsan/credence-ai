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
You are a professional DeFi credit analyst.

Wallet Address:
{wallet}

Credit Score:
{profile.credit_score}

Rating:
{profile.rating}

Probability Of Default:
{profile.probability_of_default}

Wallet Features:

{features}

Generate a professional institutional credit report.

Include:

1. Wallet overview
2. Risk assessment
3. Strengths
4. Weaknesses
5. Lending recommendation

Keep the report under 300 words.
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