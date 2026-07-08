import { ethers } from "ethers";

export interface AIDecisionPassport {
  id: string;
  wallet: string;
  decision: string;
  confidence: number;
  inputs: {
    walletAge: number;
    hspHistory: number;
    repaymentHistory: number;
    riskScore: number;
  };
  recommendation: {
    loanLimit: number;
    interest: number;
  };
  reasoning: string[];
  hash: string;
  timestamp: number;
}

export class AIDecisionPassportEngine {
  private decisionHistory: Map<string, AIDecisionPassport[]> = new Map();

  public createDecisionPassport(wallet: string, decision: string, inputs: any, recommendation: any, reasoning: string[]): AIDecisionPassport {
    const id = `AI-${Math.floor(Math.random() * 100000)}`;
    const confidence = this.calculateConfidence(inputs);
    
    const passport: AIDecisionPassport = {
      id,
      wallet,
      decision,
      confidence,
      inputs,
      recommendation,
      reasoning,
      hash: "",
      timestamp: Date.now()
    };

    passport.hash = this.generateDecisionHash(passport);
    
    const userHistory = this.decisionHistory.get(wallet) || [];
    userHistory.push(passport);
    this.decisionHistory.set(wallet, userHistory);

    return passport;
  }

  public generateDecisionHash(passport: Omit<AIDecisionPassport, "hash">): string {
    const payload = JSON.stringify({
      id: passport.id,
      wallet: passport.wallet,
      decision: passport.decision,
      confidence: passport.confidence,
      recommendation: passport.recommendation
    });
    return ethers.keccak256(ethers.toUtf8Bytes(payload));
  }

  public calculateConfidence(inputs: any): number {
    let confidence = 50; // Base
    if (inputs.hspHistory > 80) confidence += 20;
    if (inputs.repaymentHistory > 80) confidence += 20;
    if (inputs.riskScore < 10) confidence += 4;
    return Math.min(confidence, 99);
  }

  public getDecisionHistory(wallet: string): AIDecisionPassport[] {
    return this.decisionHistory.get(wallet) || [];
  }

  public verifyDecisionIntegrity(passport: AIDecisionPassport): boolean {
    const recalculatedHash = this.generateDecisionHash(passport);
    return recalculatedHash === passport.hash;
  }
}

export const aiDecisionEngine = new AIDecisionPassportEngine();
