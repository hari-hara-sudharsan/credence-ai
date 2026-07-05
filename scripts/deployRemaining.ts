import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const { ethers } = await network.create();

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance));

  // 1. Deploy ReputationRegistry
  console.log("Deploying ReputationRegistry...");
  const ReputationRegistry = await ethers.deployContract("ReputationRegistry");
  await ReputationRegistry.waitForDeployment();
  const repAddress = await ReputationRegistry.getAddress();
  console.log("ReputationRegistry deployed to:", repAddress);

  // 2. Deploy SettlementManager
  console.log("Deploying SettlementManager...");
  const SettlementManager = await ethers.deployContract("SettlementManager");
  await SettlementManager.waitForDeployment();
  const settlementAddress = await SettlementManager.getAddress();
  console.log("SettlementManager deployed to:", settlementAddress);

  // 3. Deploy LendingPool
  console.log("Deploying LendingPool...");
  const LendingPool = await ethers.deployContract("LendingPool");
  await LendingPool.waitForDeployment();
  const poolAddress = await LendingPool.getAddress();
  console.log("LendingPool deployed to:", poolAddress);

  console.log("\nDeployment completed successfully!");
  console.log("Add these to your .env and PROOF.md:");
  console.log("REPUTATION_REGISTRY_ADDRESS=" + repAddress);
  console.log("SETTLEMENT_MANAGER_ADDRESS=" + settlementAddress);
  console.log("LENDING_POOL_ADDRESS=" + poolAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
