export class ExplainabilityEngine {
  public explainScore(score: number, inputs: any): string[] {
    const explanations = [];
    
    if (inputs.repaymentHistory > 80) {
      explanations.push("+180 points: Successful repayments");
    }
    
    if (inputs.hspHistory > 75) {
      explanations.push("+90 points: Verified settlements");
    }

    if (inputs.walletAge < 30) {
      explanations.push("-30 points: Short wallet history");
    }
    
    return explanations.length > 0 ? explanations : ["Score derived from baseline network activity"];
  }

  public explainRisk(riskScore: number): string {
    if (riskScore < 5) return "Very Low Risk - Elite Borrower Profile";
    if (riskScore < 15) return "Low Risk - Standard Prime Borrower";
    if (riskScore < 30) return "Medium Risk - Elevated limits required";
    return "High Risk - Restricted Access";
  }

  public generateImprovementPlan(inputs: any): string[] {
    const plan = [];
    if (inputs.walletAge < 90) plan.push("Age your wallet via sustained on-chain activity over the next 60 days.");
    if (inputs.hspHistory < 50) plan.push("Complete more HSP Settlements to prove reliability.");
    return plan;
  }
}

export const explainabilityEngine = new ExplainabilityEngine();
