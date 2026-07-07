import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("Secure Trust Lifecycle Integration Tests", function () {
    async function deployContractsFixture() {
        const [admin, securityOracle, borrower, lender] = await ethers.getSigners();

        // 1. Deploy ReputationRegistry
        const ReputationRegistry = await ethers.getContractFactory("ReputationRegistry");
        const reputationRegistry = await ReputationRegistry.deploy();

        // 2. Deploy TrustDefenseRegistry
        const TrustDefenseRegistry = await ethers.getContractFactory("TrustDefenseRegistry");
        const trustDefenseRegistry = await TrustDefenseRegistry.deploy(admin.address);

        // 3. Deploy SettlementManager
        const SettlementManager = await ethers.getContractFactory("SettlementManager");
        const settlementManager = await SettlementManager.deploy();

        // Configure Downstreams
        await settlementManager.setReputationRegistry(await reputationRegistry.getAddress());
        await settlementManager.setTrustReceiptRegistry(ethers.ZeroAddress);

        const RR_ORACLE_ROLE = await reputationRegistry.ORACLE_ROLE();
        await reputationRegistry.grantRole(RR_ORACLE_ROLE, await settlementManager.getAddress());
        await reputationRegistry.grantRole(RR_ORACLE_ROLE, admin.address);

        const SECURITY_ORACLE_ROLE = await trustDefenseRegistry.SECURITY_ORACLE_ROLE();
        await trustDefenseRegistry.connect(admin).grantRole(SECURITY_ORACLE_ROLE, securityOracle.address);

        const SETTLEMENT_ROLE = await settlementManager.SETTLEMENT_ROLE();
        const SETTLEMENT_EXECUTOR_ROLE = await settlementManager.SETTLEMENT_EXECUTOR_ROLE();
        await settlementManager.grantRole(SETTLEMENT_ROLE, admin.address);
        await settlementManager.grantRole(SETTLEMENT_EXECUTOR_ROLE, admin.address);

        return {
            admin, securityOracle, borrower, lender,
            reputationRegistry, trustDefenseRegistry, settlementManager
        };
    }

    it("should process the entire secure lifecycle: Settle -> Check Defense Safety -> Grant Boost", async function () {
        const { admin, securityOracle, borrower, lender, reputationRegistry, trustDefenseRegistry, settlementManager } = await networkHelpers.loadFixture(deployContractsFixture);

        // 1. Assert initial baseline status
        const initialScore = await reputationRegistry.getScore(borrower.address);
        expect(initialScore).to.equal(300n);

        // 2. Security Oracle clears the wallet safety profile
        const securityProof = ethers.keccak256(ethers.toUtf8Bytes("flywheel_security_pre_clearance"));
        await trustDefenseRegistry.connect(securityOracle).recordDefenseCheck(
            borrower.address,
            98n, // 98% authenticity
            5n,  // 5% risk score
            securityProof
        );

        // Assert safety check passes
        const isSafe = await trustDefenseRegistry.verifyTrustSafety(borrower.address);
        expect(isSafe).to.be.true;

        // 3. Perform repayment settlement via HSP Proof verification
        const loanId = 555n;
        const amount = ethers.parseEther("500");
        await settlementManager.connect(admin).createHSPSettlement(loanId, borrower.address, lender.address, amount);
        const proofHash = ethers.keccak256(ethers.toUtf8Bytes("flywheel_hsp_settlement_proof"));
        await settlementManager.connect(admin).executeHSPSettlement(1n, proofHash);

        // 4. Boost is successfully applied to reputation registry
        const finalScore = await reputationRegistry.getScore(borrower.address);
        expect(finalScore).to.equal(325n);
    });
});
