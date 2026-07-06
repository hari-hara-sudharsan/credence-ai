import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("EcosystemFlow E2E Integration Test", function () {
    async function deployFixture() {
        const [admin, oracle, borrower, protocol] = await ethers.getSigners();

        // Deploy contracts
        const OracleRegistry = await ethers.getContractFactory("OracleRegistry");
        const oracleRegistry = await OracleRegistry.deploy([oracle.address], 1);

        const TrustReceiptRegistry = await ethers.getContractFactory("TrustReceiptRegistry");
        const trustReceiptRegistry = await TrustReceiptRegistry.deploy(admin.address);

        const CreditPassportV2 = await ethers.getContractFactory("CreditPassportV2");
        const creditPassportV2 = await CreditPassportV2.deploy();

        const TrustMarketplace = await ethers.getContractFactory("TrustMarketplace");
        const trustMarketplace = await TrustMarketplace.deploy(admin.address);

        // Connections
        await creditPassportV2.setTrustReceiptRegistry(await trustReceiptRegistry.getAddress());
        const RECEIPT_ISSUER_ROLE = await trustReceiptRegistry.RECEIPT_ISSUER_ROLE();
        await trustReceiptRegistry.grantRole(RECEIPT_ISSUER_ROLE, await creditPassportV2.getAddress());

        return { admin, oracle, borrower, protocol, oracleRegistry, trustReceiptRegistry, creditPassportV2, trustMarketplace };
    }

    it("should execute complete ecosystem access flow with Oracle consensus attestation", async function () {
        const { 
            admin, oracle, borrower, protocol, 
            oracleRegistry, trustReceiptRegistry, creditPassportV2, trustMarketplace 
        } = await networkHelpers.loadFixture(deployFixture);

        // ── 1. Wallet Identity Created (Mint Passport) ──
        const passportHash = ethers.keccak256(ethers.toUtf8Bytes("passport_hash_omega4"));
        const attestationHash = ethers.keccak256(ethers.toUtf8Bytes("attestation_hash_omega4"));
        const expiresAt = BigInt(Math.floor(Date.now() / 1000) + 3600);

        await creditPassportV2.mintPassport(
            passportHash,
            attestationHash,
            borrower.address,
            "/passport/metadata",
            expiresAt,
            "HUMAN",
            750n,
            "PRIME"
        );

        // ── 2. Trust Receipts Verified ──
        const receipts = await trustReceiptRegistry.getEntityReceipts(borrower.address);
        expect(receipts.length).to.equal(1);
        expect(receipts[0].actionType).to.equal("PASSPORT_CREATED");

        // ── 3. AI Prediction & Report Hash ──
        const report = {
            identity: "Prime",
            trustScore: 750,
            defaultPrediction: 2.1,
            recommendation: "Qualifies for instant ecosystem access",
            confidence: 95
        };
        const reportStr = JSON.stringify(report);
        const reportHash = ethers.solidityPackedKeccak256(["string"], [reportStr]);

        // ── 4. Oracle Consensus Signing ──
        const message = ethers.getBytes(reportHash);
        const signature = await oracle.signMessage(message);

        // Publish to OracleRegistry
        const offerHash = ethers.keccak256(ethers.toUtf8Bytes("offer_hash_omega4"));
        await oracleRegistry.publishAttestation(
            reportHash,
            offerHash,
            borrower.address,
            expiresAt,
            [signature]
        );

        // ── 5. Protocol Registration & Verification ──
        await trustMarketplace.connect(protocol).registerProtocol("LENDING");
        await trustMarketplace.connect(admin).verifyProtocol(protocol.address, true);

        // ── 6. Request Trust Verification & Deliver Access ──
        await expect(trustMarketplace.connect(protocol).requestTrustVerification(borrower.address, reportHash))
            .to.emit(trustMarketplace, "TrustRequested")
            .withArgs(protocol.address, borrower.address, reportHash)
            .to.emit(trustMarketplace, "TrustDelivered")
            .withArgs(protocol.address, borrower.address, reportHash, true);

        // Record integration usage statistics on-chain
        await expect(trustMarketplace.connect(protocol).recordUsage(borrower.address, "VERIFY_TRUST"))
            .to.emit(trustMarketplace, "UsageRecorded")
            .withArgs(borrower.address, "VERIFY_TRUST", 1n);
    });
});
