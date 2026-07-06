import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("TrustMarketplace Contract Unit Tests", function () {
    async function deployFixture() {
        const [admin, protocolWallet, entityWallet] = await ethers.getSigners();
        const TrustMarketplace = await ethers.getContractFactory("TrustMarketplace");
        const marketplace = await TrustMarketplace.deploy(admin.address);
        return { admin, protocolWallet, entityWallet, marketplace };
    }

    it("should allow a protocol to register and admin to verify it", async function () {
        const { admin, protocolWallet, marketplace } = await networkHelpers.loadFixture(deployFixture);
        
        // Register protocol
        await marketplace.connect(protocolWallet).registerProtocol("LENDING");
        const p1 = await marketplace.protocols(protocolWallet.address);
        expect(p1.protocolAddress).to.equal(protocolWallet.address);
        expect(p1.category).to.equal("LENDING");
        expect(p1.verified).to.be.false;

        // Verify protocol
        await marketplace.connect(admin).verifyProtocol(protocolWallet.address, true);
        const p2 = await marketplace.protocols(protocolWallet.address);
        expect(p2.verified).to.be.true;
    });

    it("should allow verified protocols to request trust and record usage", async function () {
        const { admin, protocolWallet, entityWallet, marketplace } = await networkHelpers.loadFixture(deployFixture);
        
        await marketplace.connect(protocolWallet).registerProtocol("INSURANCE");
        await marketplace.connect(admin).verifyProtocol(protocolWallet.address, true);

        const attestationHash = ethers.keccak256(ethers.toUtf8Bytes("att_test_hash"));
        
        // Request trust
        await expect(marketplace.connect(protocolWallet).requestTrustVerification(entityWallet.address, attestationHash))
            .to.emit(marketplace, "TrustRequested")
            .withArgs(protocolWallet.address, entityWallet.address, attestationHash);

        // Record usage
        await expect(marketplace.connect(protocolWallet).recordUsage(entityWallet.address, "LOAN_REQUEST"))
            .to.emit(marketplace, "UsageRecorded")
            .withArgs(entityWallet.address, "LOAN_REQUEST", 1n);

        const usageCount = await marketplace.usageRecords(entityWallet.address, "LOAN_REQUEST");
        expect(usageCount).to.equal(1n);
    });

    it("should reject unauthorized or unverified protocols from requesting trust", async function () {
        const { protocolWallet, entityWallet, marketplace } = await networkHelpers.loadFixture(deployFixture);
        const attestationHash = ethers.keccak256(ethers.toUtf8Bytes("att_test_hash"));

        // Non-registered caller
        await expect(marketplace.connect(protocolWallet).requestTrustVerification(entityWallet.address, attestationHash))
            .to.be.revertedWith("Caller must be registered protocol");

        // Registered but unverified caller
        await marketplace.connect(protocolWallet).registerProtocol("DAO");
        await expect(marketplace.connect(protocolWallet).requestTrustVerification(entityWallet.address, attestationHash))
            .to.be.revertedWith("Caller must be verified protocol");
    });

    it("should respect pause protection", async function () {
        const { admin, protocolWallet, marketplace } = await networkHelpers.loadFixture(deployFixture);

        await marketplace.connect(admin).pause();

        await expect(marketplace.connect(protocolWallet).registerProtocol("RWA"))
            .to.be.revertedWithCustomError(marketplace, "EnforcedPause");
    });
});
