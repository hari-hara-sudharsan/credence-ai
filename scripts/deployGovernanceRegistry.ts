import { network } from "hardhat";

async function main() {
  const { ethers } = await network.create();

  console.log("Deploying GovernanceRegistry...");
  const registry = await ethers.deployContract("GovernanceRegistry");

  await registry.waitForDeployment();

  console.log("GovernanceRegistry deployed to:", await registry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
