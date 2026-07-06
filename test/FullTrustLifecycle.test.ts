import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("FullTrustLifecycle End-To-End Integration", function () {
    async function deployLifecycleFixture() {
        const [admin, oracle, borrower, unauthorized] = await ethers.getSigners();

        // 1. Deploy ReputationRegistry
        const ReputationRegistry = await ethers.getContractFactory("ReputationRegistry");
        const reputationRegistry = await ReputationRegistry.deploy();

        // 2. Deploy FinancialIdentityRegistry
        const FinancialIdentityRegistry = await ethers.getContractFactory("FinancialIdentityRegistry");
        const financialIdentityRegistry = await FinancialIdentityRegistry.deploy(admin.address);

        // 3. Deploy CreditPassportV2
        const CreditPassportV2 = await ethers.getContractFactory("CreditPassportV2");
        const creditPassportV2 = await CreditPassportV2.deploy();

        // 4. Deploy TrustReceiptRegistry
        const TrustReceiptRegistry = await ethers.getContractFactory("TrustReceiptRegistry");
        const trustReceiptRegistry = await TrustReceiptRegistry.deploy(admin.address);

        // 5. Deploy LoanManager
        const LoanManager = await ethers.getContractFactory("LoanManager");
        const loanManager = await LoanManager.deploy();

        // Connect everything up
        await reputationRegistry.setFinancialIdentityRegistry(await financialIdentityRegistry.getAddress());
        await loanManager.setReputationRegistry(await reputationRegistry.getAddress());

        // Configure TrustReceiptRegistry reference addresses
        await creditPassportV2.setTrustReceiptRegistry(await trustReceiptRegistry.getAddress());
        await reputationRegistry.setTrustReceiptRegistry(await trustReceiptRegistry.getAddress());
        await loanManager.setTrustReceiptRegistry(await trustReceiptRegistry.getAddress());

        // Grant RECEIPT_ISSUER_ROLE on TrustReceiptRegistry to other contracts
        const RECEIPT_ISSUER_ROLE = await trustReceiptRegistry.RECEIPT_ISSUER_ROLE();
        await trustReceiptRegistry.grantRole(RECEIPT_ISSUER_ROLE, await creditPassportV2.getAddress());
        await trustReceiptRegistry.grantRole(RECEIPT_ISSUER_ROLE, await reputationRegistry.getAddress());
        await trustReceiptRegistry.grantRole(RECEIPT_ISSUER_ROLE, await loanManager.getAddress());

        // Also grant IDENTITY_UPDATER_ROLE to reputationRegistry on FinancialIdentityRegistry
        const IDENTITY_UPDATER_ROLE = await financialIdentityRegistry.IDENTITY_UPDATER_ROLE();
        await financialIdentityRegistry.grantRole(IDENTITY_UPDATER_ROLE, await reputationRegistry.getAddress());

        // Setup ReputationRegistry ORACLE_ROLE
        const ORACLE_ROLE = await reputationRegistry.ORACLE_ROLE();
        await reputationRegistry.grantRole(ORACLE_ROLE, oracle.address);
        await reputationRegistry.grantRole(ORACLE_ROLE, await loanManager.getAddress());

        return {
            admin, oracle, borrower, unauthorized,
            reputationRegistry, financialIdentityRegistry, creditPassportV2, trustReceiptRegistry, loanManager
        };
    }

    it("should execute full trust lifecycle: Passport -> Borrow -> Repay -> Receipt -> Reputation -> Identity", async function () {
        const {
            oracle, borrower,
            reputationRegistry, financialIdentityRegistry, creditPassportV2, trustReceiptRegistry, loanManager
        } = await networkHelpers.loadFixture(deployLifecycleFixture);

        const passportHash = ethers.keccak256(ethers.toUtf8Bytes("passport_hash"));
        const attestationHash = ethers.keccak256(ethers.toUtf8Bytes("attestation_hash"));
        const metadataURI = "/passport/v2/metadata";
        const expiresAt = BigInt(Math.floor(Date.now() / 1000) + 3600);

        // Step 1: Mint Credit Passport (triggers PASSPORT_CREATED receipt)
        await creditPassportV2.mintPassport(
            passportHash,
            attestationHash,
            borrower.address,
            metadataURI,
            expiresAt,
            "HUMAN",
            800n,
            "PRIME"
        );

        // Verify PASSPORT_CREATED receipt is issued on-chain
        const receipts1 = await trustReceiptRegistry.getEntityReceipts(borrower.address);
        expect(receipts1.length).to.equal(1);
        expect(receipts1[0].actionType).to.equal("PASSPORT_CREATED");
        expect(receipts1[0].trustImpact).to.equal(50n);

        // Step 2: Create a loan offer
        const loanId = "loan_lifecycle_001";
        const approvedAmount = ethers.parseEther("100.0");
        const interestRate = 500n; // 5%
        const collateralRatio = 150n; // 150%
        const duration = 30n * 24n * 3600n; // 30 days
        const offerHash = ethers.keccak256(ethers.toUtf8Bytes("loan_offer_hash"));
        const offerId = "offer_001";

        await loanManager.createLoan(
            loanId,
            borrower.address,
            approvedAmount,
            interestRate,
            collateralRatio,
            duration,
            offerHash,
            offerId
        );

        // Step 3: Activate Loan
        await loanManager.connect(borrower).activateLoan(loanId);

        // Step 4: Repay Loan (triggers LOAN_REPAID receipt, Reputation boost, and Identity update)
        await loanManager.connect(borrower).repayLoan(loanId);

        // Verify LOAN_REPAID receipt is issued on-chain
        const receipts2 = await trustReceiptRegistry.getEntityReceipts(borrower.address);
        expect(receipts2.length).to.equal(2);
        expect(receipts2[1].actionType).to.equal("LOAN_REPAID");
        expect(receipts2[1].trustImpact).to.equal(80n);

        // Verify Reputation Registry score updated
        const reputation = await reputationRegistry.getReputation(borrower.address);
        expect(reputation.totalRepayments).to.equal(1n);
        expect(reputation.currentScore).to.equal(320n); // 300 base + 15 repayment + 5 streak

        // Verify Financial Identity Registry is updated with propagated scores
        const identity = await financialIdentityRegistry.getIdentity(borrower.address);
        expect(identity.trustScore).to.equal(320n);
        expect(identity.creditScore).to.equal(320n);
        expect(identity.reliabilityScore).to.equal(1000n);
    });
});
