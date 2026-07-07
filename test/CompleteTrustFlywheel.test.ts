import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("Complete Trust Flywheel Integration Tests", function () {
    async function deployContractsFixture() {
        const [admin, oracle, borrower, lender, lendingApp, payfiApp] = await ethers.getSigners();

        // 1. Deploy ReputationRegistry
        const ReputationRegistry = await ethers.getContractFactory("ReputationRegistry");
        const reputationRegistry = await ReputationRegistry.deploy();

        // 2. Deploy TrustMarketplace
        const TrustMarketplace = await ethers.getContractFactory("TrustMarketplace");
        const trustMarketplace = await TrustMarketplace.deploy(admin.address);

        // 3. Deploy FinancialIdentityRegistry
        const FinancialIdentityRegistry = await ethers.getContractFactory("FinancialIdentityRegistry");
        const financialIdentityRegistry = await FinancialIdentityRegistry.deploy(admin.address);

        // 4. Deploy SettlementManager
        const SettlementManager = await ethers.getContractFactory("SettlementManager");
        const settlementManager = await SettlementManager.deploy();

        // Configure Downstream registries
        await settlementManager.setReputationRegistry(await reputationRegistry.getAddress());
        await settlementManager.setTrustReceiptRegistry(ethers.ZeroAddress); // mock

        const RR_ORACLE_ROLE = await reputationRegistry.ORACLE_ROLE();
        await reputationRegistry.grantRole(RR_ORACLE_ROLE, await settlementManager.getAddress());
        await reputationRegistry.grantRole(RR_ORACLE_ROLE, admin.address);
        await reputationRegistry.setFinancialIdentityRegistry(await financialIdentityRegistry.getAddress());

        const IDENTITY_UPDATER_ROLE = await financialIdentityRegistry.IDENTITY_UPDATER_ROLE();
        await financialIdentityRegistry.grantRole(IDENTITY_UPDATER_ROLE, await reputationRegistry.getAddress());

        const SETTLEMENT_ROLE = await settlementManager.SETTLEMENT_ROLE();
        const SETTLEMENT_EXECUTOR_ROLE = await settlementManager.SETTLEMENT_EXECUTOR_ROLE();
        await settlementManager.grantRole(SETTLEMENT_ROLE, admin.address);
        await settlementManager.grantRole(SETTLEMENT_EXECUTOR_ROLE, admin.address);

        // Register apps in trust marketplace
        const VERIFIER_ROLE = await trustMarketplace.VERIFIER_ROLE();
        await trustMarketplace.connect(admin).grantRole(VERIFIER_ROLE, admin.address);
        await trustMarketplace.connect(admin).registerConsumerProtocol(lendingApp.address, "LENDING");
        await trustMarketplace.connect(admin).registerConsumerProtocol(payfiApp.address, "PAYFI");

        return {
            admin, oracle, borrower, lender, lendingApp, payfiApp,
            reputationRegistry, trustMarketplace, financialIdentityRegistry, settlementManager
        };
    }

    it("should process the entire trust flywheel lifecycle: Settle -> Weighted Score Increase -> Apps updated", async function () {
        const { admin, borrower, lender, lendingApp, payfiApp, reputationRegistry, trustMarketplace, financialIdentityRegistry, settlementManager } = await networkHelpers.loadFixture(deployContractsFixture);

        // 1. Check baseline
        const initialScore = await reputationRegistry.getScore(borrower.address);
        expect(initialScore).to.equal(300n);

        // 2. Perform repayment settlement via HSP Proof verification
        const loanId = 999n;
        const amount = ethers.parseEther("1000");
        await settlementManager.connect(admin).createHSPSettlement(loanId, borrower.address, lender.address, amount);
        const proofHash = ethers.keccak256(ethers.toUtf8Bytes("flywheel_hsp_settlement_proof"));
        await settlementManager.connect(admin).executeHSPSettlement(1n, proofHash);

        // 3. Score Boost is recorded in the weighted system
        const finalScore = await reputationRegistry.getScore(borrower.address);
        expect(finalScore).to.equal(325n);

        const weightedScore = await reputationRegistry.getWeightedScore(borrower.address);
        // Expect weighted score to grow from 300 base to larger value (> 300)
        expect(weightedScore).to.be.greaterThan(300n);

        // 4. Multiple consumer applications query and receive new decisions
        await expect(trustMarketplace.connect(lendingApp).requestTrustDecision(borrower.address, "LENDING"))
            .to.emit(trustMarketplace, "TrustConsumed");

        await expect(trustMarketplace.connect(payfiApp).requestTrustDecision(borrower.address, "PAYFI"))
            .to.emit(trustMarketplace, "TrustConsumed");
    });
});
