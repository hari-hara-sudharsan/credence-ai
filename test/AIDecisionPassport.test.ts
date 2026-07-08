import { expect } from "chai";
import { aiDecisionEngine } from "../backend/services/ai/ai_decision_passport_engine.js";

describe("AI Decision Passport Verification", function () {
  const testWallet = "0x9999999999999999999999999999999999999999";
  let passport: any;

  before(function () {
    const inputs = { walletAge: 90, hspHistory: 95, repaymentHistory: 88, riskScore: 5 };
    const rec = { loanLimit: 5000, interest: 5 };
    const reasoning = ["Strong repayment behavior"];
    
    passport = aiDecisionEngine.createDecisionPassport(
      testWallet,
      "APPROVE_LOAN",
      inputs,
      rec,
      reasoning
    );
  });

  it("should generate a consistent keccak256 hash", function () {
    expect(passport.hash).to.be.a("string");
    expect(passport.hash.startsWith("0x")).to.be.true;
    
    // Hash consistency check
    const isValid = aiDecisionEngine.verifyDecisionIntegrity(passport);
    expect(isValid).to.be.true;
  });

  it("should reject tampered recommendation amounts", function () {
    const tampered = { ...passport, recommendation: { loanLimit: 1000000, interest: 1 } };
    const isValid = aiDecisionEngine.verifyDecisionIntegrity(tampered);
    expect(isValid).to.be.false;
  });

  it("should store history for wallet", function () {
    const history = aiDecisionEngine.getDecisionHistory(testWallet);
    expect(history.length).to.be.greaterThan(0);
    expect(history[0].id).to.equal(passport.id);
  });
});
