import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("TrustEvolution Contract Unit Tests", function () {
    async function deployContractsFixture() {
        const [admin, oracle, borrower, unauthorized] = await ethers.getSigners();

        // 1. Deploy ReputationRegistry
        const ReputationRegistry = await ethers.getContractFactory("ReputationRegistry");
        const reputationRegistry = await ReputationRegistry.deploy();

        // 2. Deploy TrustMarketplace
        const TrustMarketplace = await ethers.getContractFactory("TrustMarketplace");
        const trustMarketplace = await TrustMarketplace.deploy(admin.address);

        // 3. Deploy TrustEvolution
        const TrustEvolution = await ethers.getContractFactory("TrustEvolution");
        const trustEvolution = await TrustEvolution.deploy(admin.address);

        const EVOLUTION_RECORD_ROLE = await trustEvolution.EVOLUTION_RECORD_ROLE();
        await trustEvolution.connect(admin).grantRole(EVOLUTION_RECORD_ROLE, oracle.address);

        return {
            admin, oracle, borrower, unauthorized,
            reputationRegistry, trustMarketplace, trustEvolution
        };
    }

    it("should allow verified evolution recorder to record score changes", async function () {
        const { oracle, borrower, trustEvolution } = await networkHelpers.loadFixture(deployContractsFixture);

        await expect(trustEvolution.connect(oracle).recordEvolution(borrower.address, 620n, 820n, "Loan Repayment Completed"))
            .to.emit(trustEvolution, "TrustEvolved")
            .withArgs(borrower.address, 620n, 820n);

        const history = await trustEvolution.getEvolutionHistory(borrower.address);
        expect(history.length).to.equal(1);
        expect(history[0].previousScore).to.equal(620n);
        expect(history[0].newScore).to.equal(820n);
        expect(history[0].reason).to.equal("Loan Repayment Completed");
    });

    it("should reject unauthorized callers from recording evolution transition events", async function () {
        const { unauthorized, borrower, trustEvolution } = await networkHelpers.loadFixture(deployContractsFixture);

        await expect(
            trustEvolution.connect(unauthorized).recordEvolution(borrower.address, 620n, 820n, "Unauthorized Hack attempt")
        ).to.revert(ethers);
    });

    it("should successfully verify evolution records on-chain", async function () {
        const { oracle, borrower, trustEvolution } = await networkHelpers.loadFixture(deployContractsFixture);

        await trustEvolution.connect(oracle).recordEvolution(borrower.address, 620n, 820n, "Consistent streak verification");

        const [exists, prevScore, newScore, reason] = await trustEvolution.verifyEvolution(borrower.address, 0n);
        expect(exists).to.be.true;
        expect(prevScore).to.equal(620n);
        expect(newScore).to.equal(820n);
        expect(reason).to.equal("Consistent streak verification");
    });
});
