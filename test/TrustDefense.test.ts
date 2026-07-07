import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("TrustDefenseRegistry Smart Contract Unit Tests", function () {
    async function deployContractsFixture() {
        const [admin, securityOracle, normalUser, sybilUser, unauthorized] = await ethers.getSigners();

        // Deploy TrustDefenseRegistry
        const TrustDefenseRegistry = await ethers.getContractFactory("TrustDefenseRegistry");
        const trustDefenseRegistry = await TrustDefenseRegistry.deploy(admin.address);

        const SECURITY_ORACLE_ROLE = await trustDefenseRegistry.SECURITY_ORACLE_ROLE();
        await trustDefenseRegistry.connect(admin).grantRole(SECURITY_ORACLE_ROLE, securityOracle.address);

        return {
            admin, securityOracle, normalUser, sybilUser, unauthorized,
            trustDefenseRegistry
        };
    }

    it("should allow security oracle to record checks and verify safety for normal users", async function () {
        const { securityOracle, normalUser, trustDefenseRegistry } = await networkHelpers.loadFixture(deployContractsFixture);

        const proofHash = ethers.keccak256(ethers.toUtf8Bytes("normal_user_clearance"));
        await expect(trustDefenseRegistry.connect(securityOracle).recordDefenseCheck(
            normalUser.address,
            95n, // 95% authenticity
            10n, // 10% risk
            proofHash
        )).to.emit(trustDefenseRegistry, "DefenseCheckCompleted")
          .withArgs(normalUser.address, 95n, 10n);

        const isSafe = await trustDefenseRegistry.verifyTrustSafety(normalUser.address);
        expect(isSafe).to.be.true;
    });

    it("should flag event alerts when high risk scores are registered", async function () {
        const { securityOracle, sybilUser, trustDefenseRegistry } = await networkHelpers.loadFixture(deployContractsFixture);

        const proofHash = ethers.keccak256(ethers.toUtf8Bytes("sybil_farming_attempt"));
        await expect(trustDefenseRegistry.connect(securityOracle).recordDefenseCheck(
            sybilUser.address,
            30n, // 30% authenticity
            85n, // 85% risk
            proofHash
        )).to.emit(trustDefenseRegistry, "RiskDetected")
          .withArgs(sybilUser.address, "SUSPICIOUS_ACTIVITY", 85n);

        const isSafe = await trustDefenseRegistry.verifyTrustSafety(sybilUser.address);
        expect(isSafe).to.be.false;
    });

    it("should reject updates from unauthorized actors", async function () {
        const { unauthorized, normalUser, trustDefenseRegistry } = await networkHelpers.loadFixture(deployContractsFixture);

        const proofHash = ethers.keccak256(ethers.toUtf8Bytes("hacker_attack_proof"));
        await expect(
            trustDefenseRegistry.connect(unauthorized).recordDefenseCheck(normalUser.address, 100n, 0n, proofHash)
        ).to.revert(ethers);
    });
});
