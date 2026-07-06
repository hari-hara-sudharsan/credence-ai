import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("AITrustLifecycle End-To-End Integration", function () {
    async function deployContractsFixture() {
        const [admin, oracle, borrower, lender] = await ethers.getSigners();

        // 1. Deploy OracleRegistry
        const OracleRegistry = await ethers.getContractFactory("OracleRegistry");
        const oracleRegistry = await OracleRegistry.deploy([oracle.address], 1);

        // 2. Deploy TrustReceiptRegistry
        const TrustReceiptRegistry = await ethers.getContractFactory("TrustReceiptRegistry");
        const trustReceiptRegistry = await TrustReceiptRegistry.deploy(admin.address);

        // 3. Deploy CreditPassportV2
        const CreditPassportV2 = await ethers.getContractFactory("CreditPassportV2");
        const creditPassportV2 = await CreditPassportV2.deploy();

        // 4. Deploy ReputationRegistry
        const ReputationRegistry = await ethers.getContractFactory("ReputationRegistry");
        const reputationRegistry = await ReputationRegistry.deploy();

        // 5. Deploy FinancialIdentityRegistry
        const FinancialIdentityRegistry = await ethers.getContractFactory("FinancialIdentityRegistry");
        const financialIdentityRegistry = await FinancialIdentityRegistry.deploy(admin.address);

        // 6. Deploy LoanManager
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

        // Grant IDENTITY_UPDATER_ROLE to reputationRegistry on FinancialIdentityRegistry
        const IDENTITY_UPDATER_ROLE = await financialIdentityRegistry.IDENTITY_UPDATER_ROLE();
        await financialIdentityRegistry.grantRole(IDENTITY_UPDATER_ROLE, await reputationRegistry.getAddress());

        // Setup ReputationRegistry ORACLE_ROLE
        const ORACLE_ROLE = await reputationRegistry.ORACLE_ROLE();
        await reputationRegistry.grantRole(ORACLE_ROLE, oracle.address);
        await reputationRegistry.grantRole(ORACLE_ROLE, await loanManager.getAddress());

        return {
            admin, oracle, borrower, lender,
            oracleRegistry, trustReceiptRegistry, creditPassportV2, reputationRegistry, financialIdentityRegistry, loanManager
        };
    }

    it("should execute full trust lifecycle: Passport -> Receipts -> AI predicts -> Oracle Attestation -> Loan request", async function () {
        const {
            oracle, borrower,
            oracleRegistry, trustReceiptRegistry, creditPassportV2, reputationRegistry, financialIdentityRegistry, loanManager
        } = await networkHelpers.loadFixture(deployContractsFixture);

        // ── 1. Wallet Activity: Mint Passport ──
        const passportHash = ethers.keccak256(ethers.toUtf8Bytes("passport_hash_omega3"));
        const attestationHash = ethers.keccak256(ethers.toUtf8Bytes("attestation_hash_omega3"));
        const metadataURI = "/passport/v2/metadata";
        const expiresAt = BigInt(Math.floor(Date.now() / 1000) + 3600);

        await creditPassportV2.mintPassport(
            passportHash,
            attestationHash,
            borrower.address,
            metadataURI,
            expiresAt,
            "HUMAN",
            820n, // Prime trust score
            "PRIME"
        );

        // ── 2. Receipts Verified ──
        const receipts = await trustReceiptRegistry.getEntityReceipts(borrower.address);
        expect(receipts.length).to.equal(1);
        expect(receipts[0].actionType).to.equal("PASSPORT_CREATED");

        // ── 3. AI Predicts & Generates Trust report ──
        // (Simulate trust agent outputs)
        const trustIntelligenceReport = {
            identity: "Prime",
            trustScore: 820,
            defaultPrediction: 3.8,
            recommendation: "Increase credit access",
            confidence: 94
        };
        const reportStr = JSON.stringify(trustIntelligenceReport);
        const reportHash = ethers.solidityPackedKeccak256(["string"], [reportStr]);

        // ── 4. Oracle Signs Attestation ──
        // Calculate signature for multi-oracle consensus
        const message = ethers.getBytes(reportHash);
        const signature = await oracle.signMessage(message);

        // ── 5. Oracle Verification on-chain ──
        const offerHash = ethers.keccak256(ethers.toUtf8Bytes("offer_hash_omega3"));
        const expiry = BigInt(Math.floor(Date.now() / 1000) + 3600);

        await oracleRegistry.publishAttestation(
            reportHash,
            offerHash,
            borrower.address,
            expiry,
            [signature]
        );

        // Verify the attestation is registered on-chain
        const verifiedRecord = await oracleRegistry.records(reportHash);
        expect(verifiedRecord.wallet).to.equal(borrower.address);
        expect(verifiedRecord.offerHash).to.equal(offerHash);

        // ── 6. Loan terms adjusted ──
        const loanId = "loan_omega3_001";
        const approvedAmount = ethers.parseEther("100.0");
        const interestRate = 480n; // 4.8% (Risk-adjusted interest rate recommended by AI Agent)
        const collateralRatio = 150n;
        const duration = 30n * 24n * 3600n; // 30 days

        await loanManager.createLoan(
            loanId,
            borrower.address,
            approvedAmount,
            interestRate,
            collateralRatio,
            duration,
            offerHash,
            "offer_omega3"
        );

        const loanObj = await loanManager.loans(loanId);
        expect(loanObj.borrower).to.equal(borrower.address);
        expect(loanObj.approvedAmount).to.equal(approvedAmount);
        expect(loanObj.interestRate).to.equal(interestRate);
    });
});
