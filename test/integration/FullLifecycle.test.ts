import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("E2E Complete User Lifecycle Integration Test", function () {
    async function deployE2EFixture() {
        const [admin, oracle, borrower, lender] = await ethers.getSigners();

        const FinancialIdentityRegistry = await ethers.getContractFactory("FinancialIdentityRegistry");
        const identityRegistry = await FinancialIdentityRegistry.deploy(admin.address);

        const TrustReceiptRegistry = await ethers.getContractFactory("TrustReceiptRegistry");
        const receiptRegistry = await TrustReceiptRegistry.deploy(admin.address);

        const CreditPassportV2 = await ethers.getContractFactory("CreditPassportV2");
        const passport = await CreditPassportV2.deploy();

        const ReputationRegistry = await ethers.getContractFactory("ReputationRegistry");
        const reputation = await ReputationRegistry.deploy();

        const LoanManager = await ethers.getContractFactory("LoanManager");
        const loanManager = await LoanManager.deploy();

        const SettlementManager = await ethers.getContractFactory("SettlementManager");
        const settlementManager = await SettlementManager.deploy();

        // Wire references
        await reputation.setFinancialIdentityRegistry(await identityRegistry.getAddress());
        await loanManager.setReputationRegistry(await reputation.getAddress());
        await passport.setTrustReceiptRegistry(await receiptRegistry.getAddress());
        await reputation.setTrustReceiptRegistry(await receiptRegistry.getAddress());
        await loanManager.setTrustReceiptRegistry(await receiptRegistry.getAddress());
        await settlementManager.setReputationRegistry(await reputation.getAddress());
        await settlementManager.setTrustReceiptRegistry(await receiptRegistry.getAddress());

        // Roles setup
        const RECEIPT_ISSUER_ROLE = await receiptRegistry.RECEIPT_ISSUER_ROLE();
        await receiptRegistry.grantRole(RECEIPT_ISSUER_ROLE, await passport.getAddress());
        await receiptRegistry.grantRole(RECEIPT_ISSUER_ROLE, await reputation.getAddress());
        await receiptRegistry.grantRole(RECEIPT_ISSUER_ROLE, await loanManager.getAddress());
        await receiptRegistry.grantRole(RECEIPT_ISSUER_ROLE, await settlementManager.getAddress());

        const IDENTITY_UPDATER_ROLE = await identityRegistry.IDENTITY_UPDATER_ROLE();
        await identityRegistry.grantRole(IDENTITY_UPDATER_ROLE, await reputation.getAddress());

        const ORACLE_ROLE = await reputation.ORACLE_ROLE();
        await reputation.grantRole(ORACLE_ROLE, oracle.address);
        await reputation.grantRole(ORACLE_ROLE, await loanManager.getAddress());
        await reputation.grantRole(ORACLE_ROLE, await settlementManager.getAddress());

        const SETTLEMENT_ROLE = await settlementManager.SETTLEMENT_ROLE();
        await settlementManager.grantRole(SETTLEMENT_ROLE, oracle.address);

        return {
            admin, oracle, borrower, lender,
            identityRegistry, receiptRegistry, passport, reputation, loanManager, settlementManager
        };
    }

    it("should execute complete flow: Wallet ➔ Identity ➔ Passport ➔ Loan Created ➔ Settled ➔ Repaid ➔ Score Boost", async function () {
        const {
            oracle, borrower,
            receiptRegistry, passport, reputation, loanManager, settlementManager
        } = await networkHelpers.loadFixture(deployE2EFixture);

        const passportHash = ethers.keccak256(ethers.toUtf8Bytes("passport_lifecycle_hash"));
        const attestationHash = ethers.keccak256(ethers.toUtf8Bytes("attestation_lifecycle_hash"));
        const expiresAt = BigInt(Math.floor(Date.now() / 1000) + 3600);

        // 1. Create Identity / Mint Passport
        await passport.mintPassport(
            passportHash,
            attestationHash,
            borrower.address,
            "/metadata/path",
            expiresAt,
            "HUMAN",
            600n,
            "RETAIL"
        );

        // Verify receipt created
        const receipts = await receiptRegistry.getEntityReceipts(borrower.address);
        expect(receipts.length).to.equal(1);
        expect(receipts[0].actionType).to.equal("PASSPORT_CREATED");

        // 2. Create Loan
        const loanId = "e2e_loan_lifecycle_001";
        const approvedAmount = ethers.parseEther("100.0");
        const interestRate = 500n;
        const collateralRatio = 150n;
        const duration = 30n * 24n * 3600n;
        const offerHash = ethers.keccak256(ethers.toUtf8Bytes("offer_lifecycle_hash"));

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

        // 3. Settlement Execution
        const numericLoanId = 1n;
        const sid = await settlementManager.connect(oracle).createSettlement.staticCall(
            numericLoanId,
            borrower.address,
            oracle.address,
            approvedAmount
        );
        await settlementManager.connect(oracle).createSettlement(
            numericLoanId,
            borrower.address,
            oracle.address,
            approvedAmount
        );

        // Execute Settlement (ETH native)
        await settlementManager.connect(oracle).executeSettlement(sid, { value: approvedAmount });

        // 4. Activate and Repay Loan
        await loanManager.connect(borrower).activateLoan(loanId);
        await loanManager.connect(borrower).repayLoan(loanId);

        // 5. Assert boosts and results
        const finalReceipts = await receiptRegistry.getEntityReceipts(borrower.address);
        // Receipts should include PASSPORT_CREATED, HSP_SETTLEMENT, LOAN_REPAID
        expect(finalReceipts.length).to.be.at.least(3);

        const rep = await reputation.getReputation(borrower.address);
        expect(rep.totalRepayments).to.equal(2n); // HSP_SETTLEMENT records a repayment + repayLoan records a repayment
    });
});
