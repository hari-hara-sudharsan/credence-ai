import { network } from "hardhat";

async function main() {

    const { ethers } = await network.create();

    const passport = await ethers.deployContract("CreditPassportNFT");

    await passport.waitForDeployment();

    console.log(
        "CreditPassportNFT deployed:",
        await passport.getAddress()
    );
}

main().catch(
    (error) => {
        console.error(error);
        process.exitCode = 1;
    }
);