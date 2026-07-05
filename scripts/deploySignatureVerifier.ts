import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const { ethers } = await network.create();

  const loanManagerAddress = process.env.LOAN_MANAGER_ADDRESS || "0x2988f0bE02e1a679430aEb4A6B9B10429F1e8e80";
  console.log("Deploying SignatureVerifier with verifyingContract:", loanManagerAddress);

  const verifier = await ethers.deployContract("SignatureVerifier", [loanManagerAddress]);

  await verifier.waitForDeployment();

  console.log("SignatureVerifier deployed to:", await verifier.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
