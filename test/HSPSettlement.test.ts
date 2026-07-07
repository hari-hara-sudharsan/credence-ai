import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("HSP Trust Settlement Contract Unit Tests", function () {
    async function deployContractsFixture() {
        const [admin, settlementRoleSigner, executorSigner, borrower, lender, unauthorized] = await ethers.getSigners();

        // 1. Deploy ReputationRegistry
        const ReputationRegistry = await ethers.getContractFactory("ReputationRegistry");
        const reputationRegistry = await ReputationRegistry.deploy();

        // 2. Deploy TrustReceiptRegistry
        const TrustReceiptRegistry = await ethers.getContractFactory("TrustReceiptRegistry");
        const trustReceiptRegistry = await TrustReceiptRegistry.deploy(admin.address);

        // 3. Deploy FinancialIdentityRegistry
        const FinancialIdentityRegistry = await ethers.getContractFactory("FinancialIdentityRegistry");
        const financialIdentityRegistry = await FinancialIdentityRegistry.deploy(admin.address);

        // 4. Deploy SettlementManager
        const SettlementManager = await ethers.getContractFactory("SettlementManager");
        const settlementManager = await SettlementManager.deploy();

        // Grant Roles on SettlementManager
        const SETTLEMENT_ROLE = await settlementManager.SETTLEMENT_ROLE();
        const SETTLEMENT_EXECUTOR_ROLE = await settlementManager.SETTLEMENT_EXECUTOR_ROLE();
        await settlementManager.grantRole(SETTLEMENT_ROLE, settlementRoleSigner.address);
        await settlementManager.grantRole(SETTLEMENT_EXECUTOR_ROLE, executorSigner.address);

        // Grant ORACLE_ROLE to ReputationRegistry on SettlementManager
        const SM_ORACLE_ROLE = await settlementManager.ORACLE_ROLE();
        await settlementManager.grantRole(SM_ORACLE_ROLE, admin.address);

        // Configure Registries on SettlementManager
        await settlementManager.setReputationRegistry(await reputationRegistry.getAddress());
        await settlementManager.setTrustReceiptRegistry(await trustReceiptRegistry.getAddress());

        // Grant RECEIPT_ISSUER_ROLE to SettlementManager on TrustReceiptRegistry
        const RECEIPT_ISSUER_ROLE = await trustReceiptRegistry.RECEIPT_ISSUER_ROLE();
        await trustReceiptRegistry.grantRole(RECEIPT_ISSUER_ROLE, await settlementManager.getAddress());

        // Grant ORACLE_ROLE to SettlementManager on ReputationRegistry
        const RR_ORACLE_ROLE = await reputationRegistry.ORACLE_ROLE();
        await reputationRegistry.grantRole(RR_ORACLE_ROLE, await settlementManager.getAddress());
        await reputationRegistry.grantRole(RR_ORACLE_ROLE, admin.address);

        // Configure FinancialIdentity on ReputationRegistry
        await reputationRegistry.setFinancialIdentityRegistry(await financialIdentityRegistry.getAddress());

        // Grant IDENTITY_UPDATER_ROLE to ReputationRegistry on FinancialIdentityRegistry
        const IDENTITY_UPDATER_ROLE = await financialIdentityRegistry.IDENTITY_UPDATER_ROLE();
        await financialIdentityRegistry.grantRole(IDENTITY_UPDATER_ROLE, await reputationRegistry.getAddress());

        return {
            admin, settlementRoleSigner, executorSigner, borrower, lender, unauthorized,
            reputationRegistry, trustReceiptRegistry, financialIdentityRegistry, settlementManager
        };
    }

    it("should allow SETTLEMENT_ROLE to create an HSP settlement", async function () {
        const { settlementRoleSigner, borrower, lender, settlementManager } = await networkHelpers.loadFixture(deployContractsFixture);

        const tx = await settlementManager.connect(settlementRoleSigner).createHSPSettlement(
            101n,
            borrower.address,
            lender.address,
            ethers.parseEther("500")
        );

        // Verify event emit
        await expect(tx).to.emit(settlementManager, "HSPSettlementCreated")
            .withArgs(1n, borrower.address, ethers.parseEther("500"));

        const history = await settlementManager.getSettlementHistory(borrower.address);
        expect(history.length).to.equal(1);
        expect(history[0].loanId).to.equal(101n);
        expect(history[0].borrower).to.equal(borrower.address);
        expect(history[0].lender).to.equal(lender.address);
        expect(history[0].amount).to.equal(ethers.parseEther("500"));
        expect(history[0].verified).to.be.false;
    });

    it("should allow SETTLEMENT_EXECUTOR_ROLE to execute settlement and update trust/reputation/receipts", async function () {
        const { settlementRoleSigner, executorSigner, borrower, lender, settlementManager, reputationRegistry, trustReceiptRegistry, financialIdentityRegistry } = await networkHelpers.loadFixture(deployContractsFixture);

        await settlementManager.connect(settlementRoleSigner).createHSPSettlement(
            102n,
            borrower.address,
            lender.address,
            ethers.parseEther("500")
        );

        const proofHash = ethers.keccak256(ethers.toUtf8Bytes("hsp_settlement_proof_data"));

        const tx = await settlementManager.connect(executorSigner).executeHSPSettlement(1n, proofHash);

        await expect(tx).to.emit(settlementManager, "HSPSettlementVerified")
            .withArgs(1n, proofHash);

        // Verify verified status
        const [verified, hspProofHash, timestamp] = await settlementManager.verifyHSPProof(1n);
        expect(verified).to.be.true;
        expect(hspProofHash).to.equal(proofHash);
        expect(timestamp).to.be.gt(0n);

        // Verify trust receipt issued
        const receipts = await trustReceiptRegistry.getEntityReceipts(borrower.address);
        expect(receipts.length).to.equal(1);
        expect(receipts[0].actionType).to.equal("HSP_SETTLEMENT");
        expect(receipts[0].trustImpact).to.equal(25n);

        // Verify reputation registry updated (base score is 300, boost +25)
        const score = await reputationRegistry.getScore(borrower.address);
        expect(score).to.equal(325n);

        // Verify financial identity updated
        const identity = await financialIdentityRegistry.getIdentity(borrower.address);
        expect(identity.trustScore).to.equal(325n);
        expect(identity.settlementCount).to.equal(1n);
        expect(identity.successfulSettlements).to.equal(1n);
        expect(identity.reliabilityScore).to.equal(1000n); // 100% reliability (scaled to 1000)
    });

    it("should reject unauthorized signers from executing settlements", async function () {
        const { settlementRoleSigner, unauthorized, borrower, lender, settlementManager } = await networkHelpers.loadFixture(deployContractsFixture);

        await settlementManager.connect(settlementRoleSigner).createHSPSettlement(
            103n,
            borrower.address,
            lender.address,
            ethers.parseEther("500")
        );

        const proofHash = ethers.keccak256(ethers.toUtf8Bytes("hsp_settlement_proof_data"));

        await expect(
            settlementManager.connect(unauthorized).executeHSPSettlement(1n, proofHash)
        ).to.revert(ethers);
    });

    it("should reject double execution and block replay attempts", async function () {
        const { settlementRoleSigner, executorSigner, borrower, lender, settlementManager } = await networkHelpers.loadFixture(deployContractsFixture);

        await settlementManager.connect(settlementRoleSigner).createHSPSettlement(
            104n,
            borrower.address,
            lender.address,
            ethers.parseEther("500")
        );

        const proofHash = ethers.keccak256(ethers.toUtf8Bytes("hsp_settlement_proof_data"));

        await settlementManager.connect(executorSigner).executeHSPSettlement(1n, proofHash);

        // Attempting to execute again should revert
        await expect(
            settlementManager.connect(executorSigner).executeHSPSettlement(1n, proofHash)
        ).to.revert(ethers);
    });
});
