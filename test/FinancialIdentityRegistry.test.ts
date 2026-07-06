import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("FinancialIdentityRegistry Contract Integration", function () {
    async function deployContractsFixture() {
        const [admin, oracle, borrower, updater, unauthorized] = await ethers.getSigners();

        // 1. Deploy ReputationRegistry
        const ReputationRegistry = await ethers.getContractFactory("ReputationRegistry");
        const reputationRegistry = await ReputationRegistry.deploy();

        // 2. Deploy FinancialIdentityRegistry
        const FinancialIdentityRegistry = await ethers.getContractFactory("FinancialIdentityRegistry");
        const financialIdentityRegistry = await FinancialIdentityRegistry.deploy(admin.address);

        // Connect ReputationRegistry to FinancialIdentityRegistry
        const IDENTITY_UPDATER_ROLE = await financialIdentityRegistry.IDENTITY_UPDATER_ROLE();
        await financialIdentityRegistry.grantRole(IDENTITY_UPDATER_ROLE, await reputationRegistry.getAddress());
        await reputationRegistry.setFinancialIdentityRegistry(await financialIdentityRegistry.getAddress());

        return {
            admin, oracle, borrower, updater, unauthorized,
            reputationRegistry, financialIdentityRegistry
        };
    }

    it("should allow identity updater role to register and update identity", async function () {
        const { admin, borrower, financialIdentityRegistry } = await networkHelpers.loadFixture(deployContractsFixture);

        // Register identity
        await financialIdentityRegistry.registerIdentity(borrower.address, 900n, 850n, 910n);
        const identity = await financialIdentityRegistry.getIdentity(borrower.address);
        
        expect(identity.wallet).to.equal(borrower.address);
        expect(identity.trustScore).to.equal(900n);
        expect(identity.creditScore).to.equal(850n);
        expect(identity.reliabilityScore).to.equal(910n);

        // Update identity
        await financialIdentityRegistry.updateIdentity(borrower.address, 920n, 870n, 930n);
        const updated = await financialIdentityRegistry.getIdentity(borrower.address);
        expect(updated.trustScore).to.equal(920n);
    });

    it("should automatically register on updateIdentity if not registered yet", async function () {
        const { borrower, financialIdentityRegistry } = await networkHelpers.loadFixture(deployContractsFixture);

        // Update unregistered identity
        await financialIdentityRegistry.updateIdentity(borrower.address, 600n, 650n, 700n);
        const verified = await financialIdentityRegistry.verifyIdentity(borrower.address);
        expect(verified).to.be.true;

        const identity = await financialIdentityRegistry.getIdentity(borrower.address);
        expect(identity.trustScore).to.equal(600n);
    });

    it("should block unauthorized updates", async function () {
        const { borrower, unauthorized, financialIdentityRegistry } = await networkHelpers.loadFixture(deployContractsFixture);

        // Call updateIdentity with unauthorized user
        await expect(
            financialIdentityRegistry.connect(unauthorized).updateIdentity(borrower.address, 920n, 870n, 930n)
        ).to.revert(ethers);
    });

    it("should trigger identity update when reputation records repayment", async function () {
        const { borrower, reputationRegistry, financialIdentityRegistry } = await networkHelpers.loadFixture(deployContractsFixture);

        // Record a repayment on reputation registry
        await reputationRegistry.recordRepayment(borrower.address, ethers.parseEther("1.0"));

        const verified = await financialIdentityRegistry.verifyIdentity(borrower.address);
        expect(verified).to.be.true;

        const identity = await financialIdentityRegistry.getIdentity(borrower.address);
        // Reputation score calculation: BASE_SCORE (300) + REPAYMENT_BOOST (15) + streak bonus (5) = 320
        expect(identity.creditScore).to.equal(320n);
        expect(identity.trustScore).to.equal(320n);
        expect(identity.reliabilityScore).to.equal(1000n); // 100% repayment rate
    });

    it("should increase identity score upon multiple repayments", async function () {
        const { borrower, reputationRegistry, financialIdentityRegistry } = await networkHelpers.loadFixture(deployContractsFixture);

        // First repayment
        await reputationRegistry.recordRepayment(borrower.address, ethers.parseEther("1.0"));
        const identity1 = await financialIdentityRegistry.getIdentity(borrower.address);

        // Second repayment
        await reputationRegistry.recordRepayment(borrower.address, ethers.parseEther("2.0"));
        const identity2 = await financialIdentityRegistry.getIdentity(borrower.address);

        expect(identity2.creditScore).to.be.greaterThan(identity1.creditScore);
    });

    it("should respect emergency pause status on registration/updates", async function () {
        const { admin, borrower, financialIdentityRegistry } = await networkHelpers.loadFixture(deployContractsFixture);

        // Pause registry
        await financialIdentityRegistry.connect(admin).pause();

        await expect(
            financialIdentityRegistry.registerIdentity(borrower.address, 900n, 850n, 910n)
        ).to.revert(ethers);

        await expect(
            financialIdentityRegistry.updateIdentity(borrower.address, 900n, 850n, 910n)
        ).to.revert(ethers);

        // Unpause registry
        await financialIdentityRegistry.connect(admin).unpause();
        await financialIdentityRegistry.registerIdentity(borrower.address, 900n, 850n, 910n);
        
        const verified = await financialIdentityRegistry.verifyIdentity(borrower.address);
        expect(verified).to.be.true;
    });
});
