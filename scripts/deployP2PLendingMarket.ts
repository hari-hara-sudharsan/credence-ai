import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const { ethers } = await network.create();

  const [deployer] = await ethers.getSigners();
  console.log("Deploying P2PLendingMarket with the account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance));

  console.log("Deploying P2PLendingMarket...");
  const P2PLendingMarket = await ethers.getContractFactory("P2PLendingMarket");
  const market = await P2PLendingMarket.deploy();
  await market.waitForDeployment();
  const marketAddress = await market.getAddress();
  console.log("P2PLendingMarket deployed to:", marketAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
