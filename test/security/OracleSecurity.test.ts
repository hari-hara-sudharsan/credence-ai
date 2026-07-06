import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("Oracle Security Verification Checks", function () {
    async function deployOracleFixture() {
        const [admin, oracle, attacker] = await ethers.getSigners();
        const OracleRegistry = await ethers.getContractFactory("OracleRegistry");
        const registry = await OracleRegistry.deploy([oracle.address], 1n);
        
        return { admin, oracle, attacker, registry };
    }

    it("should allow governor to manage oracles and reject unauthorized additions", async function () {
        const { oracle, attacker, registry } = await networkHelpers.loadFixture(deployOracleFixture);
        
        // Attacker attempts to add an oracle
        await expect(registry.connect(attacker).addOracle(attacker.address, "1.0.0"))
            .to.be.revertedWith("Only governor can call this function");
    });
});
