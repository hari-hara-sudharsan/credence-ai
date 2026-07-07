import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("Integrated HSP Economic Trust Lifecycle Tests", function () {
    async function deployContractsFixture() {
        const [admin, settlementRoleSigner, executorSigner, borrower, lender] = await ethers.getSigners();

        // 1. Deploy registries
        const ReputationRegistry = await ethers.getContractFactory("ReputationRegistry");
        const reputationRegistry = await ReputationRegistry.deploy();

        const TrustReceiptRegistry = await ethers.getContractFactory("TrustReceiptRegistry");
        const trustReceiptRegistry = await TrustReceiptRegistry.deploy(admin.address);

        const FinancialIdentityRegistry = await ethers.getContractFactory("FinancialIdentityRegistry");
        const financialIdentityRegistry = await FinancialIdentityRegistry.deploy(admin.address);

        const SettlementManager = await ethers.getContractFactory("SettlementManager");
        const settlementManager = await SettlementManager.deploy();

        // 2. Setup access control roles
        const SETTLEMENT_ROLE = await settlementManager.SETTLEMENT_ROLE();
        const SETTLEMENT_EXECUTOR_ROLE = await settlementManager.SETTLEMENT_EXECUTOR_ROLE();
        const SM_ORACLE_ROLE = await settlementManager.ORACLE_ROLE();
        await settlementManager.grantRole(SETTLEMENT_ROLE, settlementRoleSigner.address);
        await settlementManager.grantRole(SETTLEMENT_EXECUTOR_ROLE, executorSigner.address);
        await settlementManager.grantRole(SM_ORACLE_ROLE, admin.address);

        // Configure registries on SettlementManager
        await settlementManager.setReputationRegistry(await reputationRegistry.getAddress());
        await settlementManager.setTrustReceiptRegistry(await trustReceiptRegistry.getAddress());

        // Grant receipt issue access to SettlementManager
        const RECEIPT_ISSUER_ROLE = await trustReceiptRegistry.RECEIPT_ISSUER_ROLE();
        await trustReceiptRegistry.grantRole(RECEIPT_ISSUER_ROLE, await settlementManager.getAddress());

        // Grant oracle role to SettlementManager on ReputationRegistry
        const RR_ORACLE_ROLE = await reputationRegistry.ORACLE_ROLE();
        await reputationRegistry.grantRole(RR_ORACLE_ROLE, await settlementManager.getAddress());
        await reputationRegistry.grantRole(RR_ORACLE_ROLE, admin.address);

        // Configure FinancialIdentity on ReputationRegistry
        await reputationRegistry.setFinancialIdentityRegistry(await financialIdentityRegistry.getAddress());

        // Grant identity update access to ReputationRegistry
        const IDENTITY_UPDATER_ROLE = await financialIdentityRegistry.IDENTITY_UPDATER_ROLE();
        await financialIdentityRegistry.grantRole(IDENTITY_UPDATER_ROLE, await reputationRegistry.getAddress());

        return {
            admin, settlementRoleSigner, executorSigner, borrower, lender,
            reputationRegistry, trustReceiptRegistry, financialIdentityRegistry, settlementManager
        };
    }

    it("should process E2E pipeline: Wallet -> HSP Settlement -> Receipt -> Reputation Boost -> Identity Update", async function () {
        const { settlementRoleSigner, executorSigner, borrower, lender, reputationRegistry, trustReceiptRegistry, financialIdentityRegistry, settlementManager } = await networkHelpers.loadFixture(deployContractsFixture);

        // 1. Initial State Check: Wallet is registered with baseline values
        const initialIdentity = await financialIdentityRegistry.getIdentity(borrower.address);
        expect(initialIdentity.createdAt).to.equal(0n); // Unregistered initially

        // 2. HSP Settlement creation
        const loanId = 202n;
        const amount = ethers.parseEther("1000");
        await settlementManager.connect(settlementRoleSigner).createHSPSettlement(
            loanId,
            borrower.address,
            lender.address,
            amount
        );

        // 3. Execution of settlement triggers downstream updates
        const proofHash = ethers.keccak256(ethers.toUtf8Bytes("disbursement_proof_hsp_202"));
        await settlementManager.connect(executorSigner).executeHSPSettlement(1n, proofHash);

        // 4. Verify Trust Receipt generated
        const receipts = await trustReceiptRegistry.getEntityReceipts(borrower.address);
        expect(receipts.length).to.equal(1);
        expect(receipts[0].actionType).to.equal("HSP_SETTLEMENT");
        expect(receipts[0].trustImpact).to.equal(25n);
        expect(receipts[0].proofHash).to.equal(proofHash);

        // 5. Verify Reputation registry update
        const reputationScore = await reputationRegistry.getScore(borrower.address);
        expect(reputationScore).to.equal(325n); // 300 base + 25 boost

        // 6. Verify Financial Identity update
        const identity = await financialIdentityRegistry.getIdentity(borrower.address);
        expect(identity.trustScore).to.equal(325n);
        expect(identity.settlementCount).to.equal(1n);
        expect(identity.successfulSettlements).to.equal(1n);
        expect(identity.lastSettlement).to.be.gt(0n);
        expect(identity.reliabilityScore).to.equal(1000n); // 100% reliability
    });
});
