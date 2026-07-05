class ProtocolModelEngine:
    @staticmethod
    def evaluate(credit_score):
        return {
            "aave": {
                "max_ltv": min(85, credit_score // 10),
                "interest": 8
            },
            "compound": {
                "max_ltv": min(75, credit_score // 12),
                "interest": 10
            },
            "institutional": {
                "max_ltv": min(65, credit_score // 14),
                "interest": 6
            },
            "conservative": {
                "max_ltv": min(50, credit_score // 18),
                "interest": 5
            }
        }
