import { network } from "hardhat";

async function main() {
  const { ethers } = await network.create();

  console.log("Deploying LoanManager...");
  const loanManager = await ethers.deployContract("LoanManager");

  await loanManager.waitForDeployment();

  console.log("LoanManager deployed to:", await loanManager.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
