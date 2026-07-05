import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("Full Credit Lifecycle Integration", function () {
    async function deployContractsFixture() {
        const [admin, oracle, borrower, lender] = await ethers.getSigners();

        // 1. Deploy OracleRegistry
        const OracleRegistry = await ethers.getContractFactory("OracleRegistry");
        const oracleRegistry = await OracleRegistry.deploy([oracle.address], 1);

        // 2. Deploy LoanManager
        const LoanManager = await ethers.getContractFactory("LoanManager");
        const loanManager = await LoanManager.deploy();

        // 3. Deploy ReputationRegistry
        const ReputationRegistry = await ethers.getContractFactory("ReputationRegistry");
        const reputationRegistry = await ReputationRegistry.deploy();
        
        // Grant ORACLE_ROLE to LoanManager so it can record repayments
        const ORACLE_ROLE = await reputationRegistry.ORACLE_ROLE();
        await reputationRegistry.grantRole(ORACLE_ROLE, await loanManager.getAddress());

        // Connect LoanManager to ReputationRegistry
        await loanManager.setReputationRegistry(await reputationRegistry.getAddress());

        // 4. Deploy SettlementManager
        const SettlementManager = await ethers.getContractFactory("SettlementManager");
        const settlementManager = await SettlementManager.deploy();
        const SETTLEMENT_ROLE = await settlementManager.SETTLEMENT_ROLE();
        await settlementManager.grantRole(SETTLEMENT_ROLE, admin.address);

        return { 
            admin, oracle, borrower, lender, 
            oracleRegistry, loanManager, reputationRegistry, settlementManager 
        };
    }

    it("Completes full credit lifecycle", async function () {
        const { 
            admin, oracle, borrower, lender, 
            oracleRegistry, loanManager, reputationRegistry, settlementManager 
        } = await networkHelpers.loadFixture(deployContractsFixture);

        // ── 1. AI Underwriting & EIP-712 Signature ──
        const domain = {
            name: 'CredenceAI',
            version: '1',
            chainId: (await ethers.provider.getNetwork()).chainId,
            verifyingContract: await oracleRegistry.getAddress()
        };

        const types = {
            CreditAttestation: [
                { name: 'borrower', type: 'address' },
                { name: 'score', type: 'uint256' },
                { name: 'maxLoan', type: 'uint256' },
                { name: 'interestRate', type: 'uint256' },
                { name: 'expiry', type: 'uint256' },
                { name: 'nonce', type: 'uint256' }
            ]
        };

        const nonce = await oracleRegistry.getNonce(borrower.address);
        const expiry = Math.floor(Date.now() / 1000) + 3600; // +1 hour

        const attestation = {
            borrower: borrower.address,
            score: 750n,
            maxLoan: ethers.parseEther("5"),
            interestRate: 500n, // 5%
            expiry: BigInt(expiry),
            nonce: nonce
        };

        const signature = await oracle.signTypedData(domain, types, attestation);

        // Verify Attestation on-chain
        await oracleRegistry.verifyCreditAttestation(attestation, signature);
        const newNonce = await oracleRegistry.getNonce(borrower.address);
        expect(newNonce).to.equal(nonce + 1n);

        // ── 2. Loan Creation ──
        const loanAmount = ethers.parseEther("2");
        await loanManager.createLoan(
            "LOAN_1", 
            borrower.address, 
            loanAmount, 
            500n, 
            150n, 
            30n * 24n * 3600n, // 30 days
            ethers.ZeroHash, 
            "OFFER_1"
        );

        const loan = await loanManager.getLoan("LOAN_1");
        expect(loan[1]).to.equal(borrower.address);

        // ── 3. Settlement Execution ──
        const txCreate = await settlementManager.createSettlement(
            1n, 
            borrower.address, 
            lender.address, 
            loanAmount
        );
        const receipt = await txCreate.wait();
        
        // Find settlementId from event
        // Note: ethers V6 parsing is different, we can just assume 1n for the first
        const settlementId = 1n; 

        // Execute Settlement with ETH
        await settlementManager.executeSettlement(settlementId, { value: loanAmount });

        const [completed, ref, execTime] = await settlementManager.verifySettlement(settlementId);
        expect(completed).to.be.true;

        // Activate loan after settlement
        await loanManager.connect(borrower).activateLoan("LOAN_1");

        // ── 4. Repayment & Reputation Flywheel ──
        const repBefore = await reputationRegistry.getScore(borrower.address);
        
        // Repay Loan
        await loanManager.connect(borrower).repayLoan("LOAN_1");
        
        // Check reputation improved
        const repAfter = await reputationRegistry.getScore(borrower.address);
        expect(repAfter).to.be.greaterThan(repBefore);

        // Validate final reputation state
        const fullRep = await reputationRegistry.getReputation(borrower.address);
        expect(fullRep.totalRepayments).to.equal(1n);
        expect(fullRep.streakCount).to.equal(1n);
        expect(fullRep.totalAmountRepaid).to.equal(loanAmount);
    });
});
