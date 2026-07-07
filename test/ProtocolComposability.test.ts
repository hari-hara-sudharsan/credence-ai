import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("ProtocolComposability Contract Integration Tests", function () {
    async function deployContractsFixture() {
        const [admin, oracle, borrower, lendingApp, payfiApp, unauthorized] = await ethers.getSigners();

        // 1. Deploy ReputationRegistry
        const ReputationRegistry = await ethers.getContractFactory("ReputationRegistry");
        const reputationRegistry = await ReputationRegistry.deploy();

        // 2. Deploy TrustMarketplace
        const TrustMarketplace = await ethers.getContractFactory("TrustMarketplace");
        const trustMarketplace = await TrustMarketplace.deploy(admin.address);

        // Configure registries on TrustMarketplace
        const VERIFIER_ROLE = await trustMarketplace.VERIFIER_ROLE();
        await trustMarketplace.grantRole(VERIFIER_ROLE, oracle.address);

        return {
            admin, oracle, borrower, lendingApp, payfiApp, unauthorized,
            reputationRegistry, trustMarketplace
        };
    }

    it("should allow verifier to register consumer protocols", async function () {
        const { oracle, lendingApp, payfiApp, trustMarketplace } = await networkHelpers.loadFixture(deployContractsFixture);

        // Register Lending app
        await expect(trustMarketplace.connect(oracle).registerConsumerProtocol(lendingApp.address, "LENDING"))
            .to.emit(trustMarketplace, "ProtocolIntegrated")
            .withArgs(lendingApp.address, "LENDING");

        // Register PayFi app
        await expect(trustMarketplace.connect(oracle).registerConsumerProtocol(payfiApp.address, "PAYFI"))
            .to.emit(trustMarketplace, "ProtocolIntegrated")
            .withArgs(payfiApp.address, "PAYFI");

        const lendingStats = await trustMarketplace.getProtocolStats(lendingApp.address);
        expect(lendingStats.category).to.equal("LENDING");
        expect(lendingStats.active).to.be.true;
    });

    it("should reject unauthorized callers from requesting decisions or registering protocols", async function () {
        const { oracle, unauthorized, borrower, trustMarketplace } = await networkHelpers.loadFixture(deployContractsFixture);

        // Registration by unauthorized fails
        await expect(
            trustMarketplace.connect(unauthorized).registerConsumerProtocol(unauthorized.address, "LENDING")
        ).to.revert(ethers);

        // Requesting decision without being registered fails
        await expect(
            trustMarketplace.connect(unauthorized).requestTrustDecision(borrower.address, "LENDING")
        ).to.be.revertedWith("Caller must be active consumer protocol");
    });

    it("should allow registered protocols to request trust decisions and record usage", async function () {
        const { oracle, lendingApp, borrower, trustMarketplace } = await networkHelpers.loadFixture(deployContractsFixture);

        // Register Lending App
        await trustMarketplace.connect(oracle).registerConsumerProtocol(lendingApp.address, "LENDING");

        // Request decision
        const tx = await trustMarketplace.connect(lendingApp).requestTrustDecision(borrower.address, "LENDING");
        await expect(tx).to.emit(trustMarketplace, "TrustConsumed");

        // Record usage
        await expect(trustMarketplace.connect(lendingApp).recordTrustUsage(borrower.address, "LOAN_CREATED"))
            .to.emit(trustMarketplace, "UsageRecorded")
            .withArgs(borrower.address, "LOAN_CREATED", 1n);
    });

    it("should successfully verify standard EIP-712 signatures signed by the Oracle verifier", async function () {
        const { oracle, lendingApp, borrower, trustMarketplace } = await networkHelpers.loadFixture(deployContractsFixture);

        // Setup EIP-712 separator match parameters
        const separator = await trustMarketplace.separator();
        const DECISION_TYPEHASH = await trustMarketplace.DECISION_TYPEHASH();

        const trustScore = 850n;
        const limit = 5000n;
        const timestamp = BigInt(Math.floor(Date.now() / 1000));

        const domain = {
            name: "Credence AI",
            version: "1",
            chainId: 177n,
            verifyingContract: await trustMarketplace.getAddress()
        };

        const types = {
            ProtocolDecision: [
                { name: "wallet", type: "address" },
                { name: "application", type: "string" },
                { name: "trustScore", type: "uint256" },
                { name: "limit", type: "uint256" },
                { name: "timestamp", type: "uint256" }
            ]
        };

        const value = {
            wallet: borrower.address,
            application: "LENDING",
            trustScore: trustScore,
            limit: limit,
            timestamp: timestamp
        };

        // Oracle signs the typed data
        const signature = await oracle.signTypedData(domain, types, value);

        // Verify decision on-chain
        const verified = await trustMarketplace.verifyProtocolDecision(
            borrower.address,
            "LENDING",
            trustScore,
            limit,
            timestamp,
            signature
        );

        expect(verified).to.be.true;
    });
});
