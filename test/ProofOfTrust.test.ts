import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("ProofOfTrustRegistry", function () {
  let registry: any;
  let admin: any, creator: any, oracle: any, user: any;
  let proofHash: string;

  beforeEach(async function () {
    [admin, creator, oracle, user] = await ethers.getSigners();
    
    const Registry = await ethers.getContractFactory("ProofOfTrustRegistry");
    registry = await Registry.deploy(admin.address);
    await registry.waitForDeployment();

    const CREATOR_ROLE = await registry.PROOF_CREATOR_ROLE();
    const ORACLE_ROLE = await registry.ORACLE_ROLE();
    
    await registry.grantRole(CREATOR_ROLE, creator.address);
    await registry.grantRole(ORACLE_ROLE, oracle.address);

    proofHash = ethers.keccak256(ethers.toUtf8Bytes("HSP_SETTLEMENT:1234"));
  });

  it("should create proof", async function () {
    await registry.connect(creator).createTrustProof(
      proofHash, 
      user.address, 
      "HSP_SETTLEMENT", 
      45
    );

    const proofs = await registry.getWalletProofs(user.address);
    expect(proofs.length).to.equal(1);
    expect(proofs[0].proofType).to.equal("HSP_SETTLEMENT");
    expect(proofs[0].valid).to.equal(false);
  });

  it("should verify proof", async function () {
    await registry.connect(creator).createTrustProof(proofHash, user.address, "HSP_SETTLEMENT", 45);
    
    // Mock signature
    await registry.connect(oracle).verifyTrustProof(proofHash, "0x1234");
    
    const proofs = await registry.getWalletProofs(user.address);
    expect(proofs[0].valid).to.equal(true);
  });

  it("should block invalid proof creation", async function () {
    await expect(
      registry.connect(user).createTrustProof(proofHash, user.address, "HSP", 45)
    ).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");
  });

  it("should prevent replay attacks", async function () {
    await registry.connect(creator).createTrustProof(proofHash, user.address, "HSP_SETTLEMENT", 45);
    
    await expect(
      registry.connect(creator).createTrustProof(proofHash, user.address, "HSP_SETTLEMENT", 45)
    ).to.be.revertedWith("Proof already exists");
  });
});
