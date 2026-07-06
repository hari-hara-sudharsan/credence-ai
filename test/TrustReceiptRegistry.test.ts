import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("TrustReceiptRegistry Contract Unit Tests", function () {
    async function deployContractsFixture() {
        const [admin, issuer, borrower, unauthorized] = await ethers.getSigners();

        // Deploy TrustReceiptRegistry
        const TrustReceiptRegistry = await ethers.getContractFactory("TrustReceiptRegistry");
        const trustReceiptRegistry = await TrustReceiptRegistry.deploy(admin.address);

        // Grant RECEIPT_ISSUER_ROLE to issuer signer
        const RECEIPT_ISSUER_ROLE = await trustReceiptRegistry.RECEIPT_ISSUER_ROLE();
        await trustReceiptRegistry.grantRole(RECEIPT_ISSUER_ROLE, issuer.address);

        return {
            admin, issuer, borrower, unauthorized,
            trustReceiptRegistry
        };
    }

    it("should allow receipt issuer to issue receipt and verify it", async function () {
        const { issuer, borrower, trustReceiptRegistry } = await networkHelpers.loadFixture(deployContractsFixture);

        const proofHash = ethers.keccak256(ethers.toUtf8Bytes("loan_repaid_proof_data"));
        
        // Issue receipt
        await trustReceiptRegistry.connect(issuer).issueReceipt(
            borrower.address,
            "LOAN_REPAID",
            80n,
            proofHash
        );

        // Verify receipt
        const [owner, action, proof, resIssuer, timestamp, validity] = await trustReceiptRegistry.verifyReceipt(1n);
        expect(owner).to.equal(borrower.address);
        expect(action).to.equal("LOAN_REPAID");
        expect(proof).to.equal(proofHash);
        expect(resIssuer).to.equal(issuer.address);
        expect(validity).to.be.true;
    });

    it("should reject unauthorized issuers from issuing receipts", async function () {
        const { unauthorized, borrower, trustReceiptRegistry } = await networkHelpers.loadFixture(deployContractsFixture);

        const proofHash = ethers.keccak256(ethers.toUtf8Bytes("unauthorized_proof_data"));
        
        await expect(
            trustReceiptRegistry.connect(unauthorized).issueReceipt(
                borrower.address,
                "LOAN_REPAID",
                80n,
                proofHash
            )
        ).to.revert(ethers);
    });

    it("should respect pause status on issuing receipts", async function () {
        const { admin, issuer, borrower, trustReceiptRegistry } = await networkHelpers.loadFixture(deployContractsFixture);

        const proofHash = ethers.keccak256(ethers.toUtf8Bytes("pause_proof_data"));
        
        // Pause registry
        await trustReceiptRegistry.connect(admin).pause();

        await expect(
            trustReceiptRegistry.connect(issuer).issueReceipt(
                borrower.address,
                "LOAN_REPAID",
                80n,
                proofHash
            )
        ).to.revert(ethers);

        // Unpause registry
        await trustReceiptRegistry.connect(admin).unpause();
        await trustReceiptRegistry.connect(issuer).issueReceipt(
            borrower.address,
            "LOAN_REPAID",
            80n,
            proofHash
        );

        const [, , , , , validity] = await trustReceiptRegistry.verifyReceipt(1n);
        expect(validity).to.be.true;
    });

    it("should allow admin to invalidate receipt", async function () {
        const { admin, issuer, borrower, trustReceiptRegistry } = await networkHelpers.loadFixture(deployContractsFixture);

        const proofHash = ethers.keccak256(ethers.toUtf8Bytes("invalidate_proof_data"));
        await trustReceiptRegistry.connect(issuer).issueReceipt(
            borrower.address,
            "LOAN_REPAID",
            80n,
            proofHash
        );

        // Invalidate receipt
        await trustReceiptRegistry.connect(admin).invalidateReceipt(1n);

        const [, , , , , validity] = await trustReceiptRegistry.verifyReceipt(1n);
        expect(validity).to.be.false;
    });

    it("should block non-admin from invalidating receipts", async function () {
        const { unauthorized, issuer, borrower, trustReceiptRegistry } = await networkHelpers.loadFixture(deployContractsFixture);

        const proofHash = ethers.keccak256(ethers.toUtf8Bytes("invalidate_unauth_data"));
        await trustReceiptRegistry.connect(issuer).issueReceipt(
            borrower.address,
            "LOAN_REPAID",
            80n,
            proofHash
        );

        await expect(
            trustReceiptRegistry.connect(unauthorized).invalidateReceipt(1n)
        ).to.revert(ethers);
    });

    it("should return correct receipt history for an entity", async function () {
        const { issuer, borrower, trustReceiptRegistry } = await networkHelpers.loadFixture(deployContractsFixture);

        const proofHash1 = ethers.keccak256(ethers.toUtf8Bytes("proof_1"));
        const proofHash2 = ethers.keccak256(ethers.toUtf8Bytes("proof_2"));

        await trustReceiptRegistry.connect(issuer).issueReceipt(borrower.address, "PASSPORT_CREATED", 50n, proofHash1);
        await trustReceiptRegistry.connect(issuer).issueReceipt(borrower.address, "LOAN_REPAID", 80n, proofHash2);

        const receipts = await trustReceiptRegistry.getEntityReceipts(borrower.address);
        expect(receipts.length).to.equal(2);
        expect(receipts[0].actionType).to.equal("PASSPORT_CREATED");
        expect(receipts[1].actionType).to.equal("LOAN_REPAID");
    });
});
