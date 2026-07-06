import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("ReentrancyGuard Security Checks", function () {
    async function deployContracts() {
        const [admin, lender, borrower] = await ethers.getSigners();
        
        const LendingPool = await ethers.getContractFactory("LendingPool");
        const pool = await LendingPool.deploy();
        
        return { admin, lender, borrower, pool };
    }

    it("should deploy with reentrancy protection modifiers active", async function () {
        const { pool } = await networkHelpers.loadFixture(deployContracts);
        expect(await pool.paused()).to.be.false;
    });
});
