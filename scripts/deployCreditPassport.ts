import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const { ethers } = await network.create();

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance));

  console.log("Deploying CreditPassportV2...");
  const CreditPassport = await ethers.deployContract("CreditPassportV2");
  await CreditPassport.waitForDeployment();
  const address = await CreditPassport.getAddress();
  console.log("CreditPassportV2 deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
