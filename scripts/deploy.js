import { network } from "hardhat";

async function main() {

    const { ethers } = await network.create();

    const registry = await ethers.deployContract("CreditRegistry");

    await registry.waitForDeployment();

    console.log(
        "CreditRegistry deployed:",
        await registry.getAddress()
    );
}

main().catch((error) => {

    console.error(error);

    process.exitCode = 1;
});