import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("TrustGraphRegistry Smart Contract Unit Tests", function () {
    async function deployFixture() {
        const [admin, writer, entity] = await ethers.getSigners();
        const TrustGraphRegistry = await ethers.getContractFactory("TrustGraphRegistry");
        const registry = await TrustGraphRegistry.deploy(admin.address);
        
        // Grant WRITER role
        const RECORD_WRITER_ROLE = await registry.RECORD_WRITER_ROLE();
        await registry.connect(admin).grantRole(RECORD_WRITER_ROLE, writer.address);

        return { admin, writer, entity, registry };
    }

    it("should allow a writer to record a trust event and entity to retrieve it", async function () {
        const { writer, entity, registry } = await networkHelpers.loadFixture(deployFixture);
        const eventHash = ethers.keccak256(ethers.toUtf8Bytes("event_test_1"));

        await expect(registry.connect(writer).recordTrustEvent(eventHash, entity.address, "LOAN_REPAID"))
            .to.emit(registry, "TrustEventRecorded")
            .withArgs(entity.address, eventHash, "LOAN_REPAID")
            .to.emit(registry, "TrustGraphUpdated")
            .withArgs(entity.address, eventHash);

        const verify = await registry.verifyTrustEvent(eventHash);
        expect(verify.exists).to.be.true;
        expect(verify.entity).to.equal(entity.address);
        expect(verify.eventType).to.equal("LOAN_REPAID");

        const list = await registry.getEntityEvents(entity.address);
        expect(list.length).to.equal(1);
        expect(list[0]).to.equal(eventHash);
    });

    it("should block duplicate events (replay protection)", async function () {
        const { writer, entity, registry } = await networkHelpers.loadFixture(deployFixture);
        const eventHash = ethers.keccak256(ethers.toUtf8Bytes("event_test_duplicate"));

        await registry.connect(writer).recordTrustEvent(eventHash, entity.address, "HSP_SETTLED");
        
        await expect(registry.connect(writer).recordTrustEvent(eventHash, entity.address, "HSP_SETTLED"))
            .to.be.revertedWith("Event already recorded");
    });

    it("should reject unauthorized callers from writing records", async function () {
        const { entity, registry } = await networkHelpers.loadFixture(deployFixture);
        const eventHash = ethers.keccak256(ethers.toUtf8Bytes("event_unauthorized"));

        await expect(registry.connect(entity).recordTrustEvent(eventHash, entity.address, "LOAN_CREATED"))
            .to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");
    });

    it("should respect pause protection", async function () {
        const { admin, writer, entity, registry } = await networkHelpers.loadFixture(deployFixture);
        const eventHash = ethers.keccak256(ethers.toUtf8Bytes("event_paused"));

        await registry.connect(admin).pause();

        await expect(registry.connect(writer).recordTrustEvent(eventHash, entity.address, "LOAN_CREATED"))
            .to.be.revertedWithCustomError(registry, "EnforcedPause");
    });
});
