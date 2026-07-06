import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("TrustGraphLifecycle E2E Integration Test", function () {
    async function deployContractsFixture() {
        const [admin, oracle, borrower, lender] = await ethers.getSigners();

        // Deploy contracts
        const TrustGraphRegistry = await ethers.getContractFactory("TrustGraphRegistry");
        const trustGraphRegistry = await TrustGraphRegistry.deploy(admin.address);

        const TrustReceiptRegistry = await ethers.getContractFactory("TrustReceiptRegistry");
        const trustReceiptRegistry = await TrustReceiptRegistry.deploy(admin.address);

        const CreditPassportV2 = await ethers.getContractFactory("CreditPassportV2");
        const creditPassportV2 = await CreditPassportV2.deploy();

        const ReputationRegistry = await ethers.getContractFactory("ReputationRegistry");
        const reputationRegistry = await ReputationRegistry.deploy();

        const FinancialIdentityRegistry = await ethers.getContractFactory("FinancialIdentityRegistry");
        const financialIdentityRegistry = await FinancialIdentityRegistry.deploy(admin.address);

        const LoanManager = await ethers.getContractFactory("LoanManager");
        const loanManager = await LoanManager.deploy();

        // Connect references
        await reputationRegistry.setFinancialIdentityRegistry(await financialIdentityRegistry.getAddress());
        await loanManager.setReputationRegistry(await reputationRegistry.getAddress());
        await creditPassportV2.setTrustReceiptRegistry(await trustReceiptRegistry.getAddress());
        await reputationRegistry.setTrustReceiptRegistry(await trustReceiptRegistry.getAddress());
        await loanManager.setTrustReceiptRegistry(await trustReceiptRegistry.getAddress());

        // Grant Roles
        const RECEIPT_ISSUER_ROLE = await trustReceiptRegistry.RECEIPT_ISSUER_ROLE();
        await trustReceiptRegistry.grantRole(RECEIPT_ISSUER_ROLE, await creditPassportV2.getAddress());
        await trustReceiptRegistry.grantRole(RECEIPT_ISSUER_ROLE, await reputationRegistry.getAddress());
        await trustReceiptRegistry.grantRole(RECEIPT_ISSUER_ROLE, await loanManager.getAddress());

        const IDENTITY_UPDATER_ROLE = await financialIdentityRegistry.IDENTITY_UPDATER_ROLE();
        await financialIdentityRegistry.grantRole(IDENTITY_UPDATER_ROLE, await reputationRegistry.getAddress());

        const ORACLE_ROLE = await reputationRegistry.ORACLE_ROLE();
        await reputationRegistry.grantRole(ORACLE_ROLE, oracle.address);
        await reputationRegistry.grantRole(ORACLE_ROLE, await loanManager.getAddress());

        const RECORD_WRITER_ROLE = await trustGraphRegistry.RECORD_WRITER_ROLE();
        await trustGraphRegistry.grantRole(RECORD_WRITER_ROLE, admin.address);

        return {
            admin, oracle, borrower, lender,
            trustGraphRegistry, trustReceiptRegistry, creditPassportV2, reputationRegistry, financialIdentityRegistry, loanManager
        };
    }

    it("should execute E2E lifecycle: Passport Minted -> Receipt Created -> Loan Created -> Repaid -> Graph Updated", async function () {
        const {
            admin, oracle, borrower,
            trustGraphRegistry, trustReceiptRegistry, creditPassportV2, reputationRegistry, financialIdentityRegistry, loanManager
        } = await networkHelpers.loadFixture(deployContractsFixture);

        // ── 1. Identity Created (Passport Minted) ──
        const passportHash = ethers.keccak256(ethers.toUtf8Bytes("passport_lifecycle_hash"));
        const attestationHash = ethers.keccak256(ethers.toUtf8Bytes("attestation_lifecycle_hash"));
        const expiresAt = BigInt(Math.floor(Date.now() / 1000) + 3600);

        await creditPassportV2.mintPassport(
            passportHash,
            attestationHash,
            borrower.address,
            "/metadata/path",
            expiresAt,
            "HUMAN",
            600n,
            "RETAIL"
        );

        // ── 2. Receipt Generated ──
        const receipts = await trustReceiptRegistry.getEntityReceipts(borrower.address);
        expect(receipts.length).to.equal(1);
        expect(receipts[0].actionType).to.equal("PASSPORT_CREATED");

        // Record on-chain graph event for passport creation
        const eventHash1 = ethers.keccak256(ethers.toUtf8Bytes("graph_event_passport"));
        await trustGraphRegistry.connect(admin).recordTrustEvent(eventHash1, borrower.address, "PASSPORT_CREATED");

        // ── 3. Loan Completed ──
        const loanId = "loan_lifecycle_graph_01";
        const approvedAmount = ethers.parseEther("50.0");
        const interestRate = 600n;
        const collateralRatio = 150n;
        const duration = 30n * 24n * 3600n;
        const offerHash = ethers.keccak256(ethers.toUtf8Bytes("offer_lifecycle_hash"));

        // Step 2: Create a loan
        await loanManager.createLoan(
            loanId,
            borrower.address,
            approvedAmount,
            interestRate,
            collateralRatio,
            duration,
            offerHash,
            "offer_signature_lifecycle"
        );

        // Record loan creation graph event
        const eventHash2 = ethers.keccak256(ethers.toUtf8Bytes("graph_event_loan_created"));
        await trustGraphRegistry.connect(admin).recordTrustEvent(eventHash2, borrower.address, "LOAN_CREATED");

        // Activate loan
        await loanManager.connect(borrower).activateLoan(loanId);

        // Repay loan
        await loanManager.connect(borrower).repayLoan(loanId);

        // Record loan repayment graph event
        const eventHash3 = ethers.keccak256(ethers.toUtf8Bytes("graph_event_loan_repaid"));
        await trustGraphRegistry.connect(admin).recordTrustEvent(eventHash3, borrower.address, "LOAN_REPAID");

        // ── 4. Graph Updated & Verified ──
        const eventsList = await trustGraphRegistry.getEntityEvents(borrower.address);
        expect(eventsList.length).to.equal(3);
        expect(eventsList[0]).to.equal(eventHash1);
        expect(eventsList[1]).to.equal(eventHash2);
        expect(eventsList[2]).to.equal(eventHash3);

        const verifyEvent = await trustGraphRegistry.verifyTrustEvent(eventHash3);
        expect(verifyEvent.exists).to.be.true;
        expect(verifyEvent.eventType).to.equal("LOAN_REPAID");
    });
});
