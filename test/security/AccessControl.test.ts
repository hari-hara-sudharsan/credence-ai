import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("Ecosystem Access Control Security Tests", function () {
    async function deployFixture() {
        const [admin, writer, attacker] = await ethers.getSigners();
        const TrustGraphRegistry = await ethers.getContractFactory("TrustGraphRegistry");
        const registry = await TrustGraphRegistry.deploy(admin.address);
        return { admin, writer, attacker, registry };
    }

    it("should allow admin to grant and revoke roles", async function () {
        const { admin, writer, registry } = await networkHelpers.loadFixture(deployFixture);
        const RECORD_WRITER_ROLE = await registry.RECORD_WRITER_ROLE();

        await registry.connect(admin).grantRole(RECORD_WRITER_ROLE, writer.address);
        expect(await registry.hasRole(RECORD_WRITER_ROLE, writer.address)).to.be.true;

        await registry.connect(admin).revokeRole(RECORD_WRITER_ROLE, writer.address);
        expect(await registry.hasRole(RECORD_WRITER_ROLE, writer.address)).to.be.false;
    });

    it("should block non-admins from registering arbitrary protocol records in the marketplace", async function () {
        const [admin, attacker] = await ethers.getSigners();
        const TrustMarketplace = await ethers.getContractFactory("TrustMarketplace");
        const marketplace = await TrustMarketplace.deploy(admin.address);

        await expect(marketplace.connect(attacker).verifyProtocol(attacker.address, true))
            .to.be.revertedWithCustomError(marketplace, "AccessControlUnauthorizedAccount");
    });
});
