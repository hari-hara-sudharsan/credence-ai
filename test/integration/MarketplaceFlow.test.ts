import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("Ecosystem Marketplace Flow Integration Test", function () {
    async function deployMarketplaceFixture() {
        const [admin, protocolOwner, entity] = await ethers.getSigners();
        
        const TrustMarketplace = await ethers.getContractFactory("TrustMarketplace");
        const marketplace = await TrustMarketplace.deploy(admin.address);

        return { admin, protocolOwner, entity, marketplace };
    }

    it("should allow registration, verification, verification requests, and usage recording", async function () {
        const { admin, protocolOwner, entity, marketplace } = await networkHelpers.loadFixture(deployMarketplaceFixture);

        // 1. Register
        await marketplace.connect(protocolOwner).registerProtocol("LENDING");
        
        const pBefore = await marketplace.protocols(protocolOwner.address);
        expect(pBefore.verified).to.be.false;

        // 2. Verify
        await marketplace.connect(admin).verifyProtocol(protocolOwner.address, true);
        const pAfter = await marketplace.protocols(protocolOwner.address);
        expect(pAfter.verified).to.be.true;

        // 3. Verify Trust Attestation Hash
        const dummyHash = ethers.keccak256(ethers.toUtf8Bytes("dummy_attestation"));
        await expect(marketplace.connect(protocolOwner).requestTrustVerification(entity.address, dummyHash))
            .to.emit(marketplace, "TrustRequested")
            .withArgs(protocolOwner.address, entity.address, dummyHash);

        // 4. Record Usage
        await expect(marketplace.connect(protocolOwner).recordUsage(entity.address, "VERIFY_CALL"))
            .to.emit(marketplace, "UsageRecorded")
            .withArgs(entity.address, "VERIFY_CALL", 1n);
    });
});
