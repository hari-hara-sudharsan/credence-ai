const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  const provider = new ethers.JsonRpcProvider("https://mainnet.hsk.xyz");
  const wallet = new ethers.Wallet("fd433b318b82fcc679f0b4df058ddad07cd741cfa06fa8db7a804e11db311d4d", provider);
  
  console.log("Deploying from:", wallet.address);
  
  // Read artifacts from hardhat compilation
  const artifactPath = path.join(__dirname, "../contracts/artifacts/src/CreditPassportV2.sol/CreditPassportV2.json");
  
  if (!fs.existsSync(artifactPath)) {
      console.error("Artifact not found at", artifactPath);
      console.log("Please run `npx hardhat compile` first!");
      process.exit(1);
  }
  
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  console.log("Deploying CreditPassportV2...");
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  
  console.log("Deployed to:", await contract.getAddress());
}

main().catch(console.error);
