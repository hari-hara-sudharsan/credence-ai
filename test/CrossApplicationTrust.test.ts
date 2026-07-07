import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("Cross-Application Trust E2E Lifecycle Tests", function () {
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

    it("should process E2E flow: Wallet Settle -> Score Boost -> Both Consumer Profiles Improve", async function () {
        const { admin, borrower, lender, lendingApp, payfiApp, reputationRegistry, trustMarketplace, financialIdentityRegistry, settlementManager } = await networkHelpers.loadFixture(deployContractsFixture);

        // 1. Initial State: Borrower holds baseline score (300)
        const initialReputation = await reputationRegistry.getScore(borrower.address);
        expect(initialReputation).to.equal(300n);

        // 2. Perform a successful HSP Settlement
        const loanId = 505n;
        const amount = ethers.parseEther("500");
        await settlementManager.connect(admin).createHSPSettlement(loanId, borrower.address, lender.address, amount);
        
        const proofHash = ethers.keccak256(ethers.toUtf8Bytes("hsp_composability_repayment_proof"));
        await settlementManager.connect(admin).executeHSPSettlement(1n, proofHash);

        // 3. Score Boost is recorded
        const finalReputation = await reputationRegistry.getScore(borrower.address);
        expect(finalReputation).to.equal(325n); // 300 base + 25 boost from settlement

        // 4. Verify Lending consumes trust on-chain
        await expect(trustMarketplace.connect(lendingApp).requestTrustDecision(borrower.address, "LENDING"))
            .to.emit(trustMarketplace, "TrustConsumed");

        // 5. Verify PayFi consumes trust on-chain using the exact same identity
        await expect(trustMarketplace.connect(payfiApp).requestTrustDecision(borrower.address, "PAYFI"))
            .to.emit(trustMarketplace, "TrustConsumed");

        // 6. Confirm Financial Identity statistics are updated
        const identity = await financialIdentityRegistry.getIdentity(borrower.address);
        expect(identity.trustScore).to.equal(325n);
        expect(identity.settlementCount).to.equal(1n);
        expect(identity.successfulSettlements).to.equal(1n);
    });
});
