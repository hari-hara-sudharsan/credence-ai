import { expect } from "chai";
import { network } from "hardhat";
import { ProofOfTrustEngine } from "../backend/services/trust/proof_of_trust_engine";

const { ethers, networkHelpers } = await network.create();

describe("ProofLifecycle Integration", function () {
  let engine: ProofOfTrustEngine;
  let registry: any;
  let admin: any, creator: any, oracle: any, user: any;

  beforeEach(async function () {
    [admin, creator, oracle, user] = await ethers.getSigners();
    
    const Registry = await ethers.getContractFactory("ProofOfTrustRegistry");
    registry = await Registry.deploy(admin.address);
    await registry.waitForDeployment();

    const CREATOR_ROLE = await registry.PROOF_CREATOR_ROLE();
    const ORACLE_ROLE = await registry.ORACLE_ROLE();
    
    await registry.grantRole(CREATOR_ROLE, creator.address);
    await registry.grantRole(ORACLE_ROLE, oracle.address);

    engine = new ProofOfTrustEngine();
  });

  it("should complete the full lifecycle from financial action to trusted protocol access", async function () {
    // 1. Financial Action -> HSP -> PoT Engine
    const action = {
      wallet: user.address,
      actionType: "HSP_SETTLEMENT",
      settlementId: "SET-8899",
      metadata: { amount: 5000 }
    };

    const proof = engine.createProof(action);
    expect(proof.trustImpact).to.equal(45);

    // 2. PoT Registry creation (Simulating backend calling blockchain)
    await registry.connect(creator).createTrustProof(
      proof.proofHash,
      proof.wallet,
      proof.actionType,
      proof.trustImpact
    );

    // 3. AI Analyzes Proof
    const analysis = engine.analyzeTrustProof(proof);
    expect(analysis.recommendation).to.equal("Accept trust increase");
    expect(analysis.risk).to.equal("LOW");

    // 4. Oracle verifies
    if (analysis.risk === "LOW") {
      engine.verifyProof(proof.proofHash);
      
      // On-chain oracle verification
      await registry.connect(oracle).verifyTrustProof(proof.proofHash, "0x9999");
    }

    // 5. Reputation/Passport displays it
    const onChainProofs = await registry.getWalletProofs(user.address);
    expect(onChainProofs[0].valid).to.equal(true);
    expect(onChainProofs[0].trustImpact).to.equal(45);

    // 6. Protocol Access
    const history = engine.getProofHistory(user.address);
    const hasTrustedProof = history.some(p => p.verified === true);
    
    expect(hasTrustedProof).to.be.true;
    // Access allowed!
  });
});
