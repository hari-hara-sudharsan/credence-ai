const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  const provider = new ethers.JsonRpcProvider("https://mainnet.hsk.xyz");
  const wallet = new ethers.Wallet("fd433b318b82fcc679f0b4df058ddad07cd741cfa06fa8db7a804e11db311d4d", provider);
  
  console.log("Deploying from:", wallet.address);
  
  const artifactPath = path.join(__dirname, "../artifacts/contracts/src/CreditPassportV2.sol/CreditPassportV2.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice ? (feeData.gasPrice * 120n / 100n) : ethers.parseUnits("1.5", "gwei");
  const nonce = await provider.getTransactionCount(wallet.address, "latest");
  
  console.log("Nonce:", nonce, "GasPrice:", ethers.formatUnits(gasPrice, "gwei"), "gwei");

  console.log("Deploying CreditPassportV2...");
  const contract = await factory.deploy({ gasPrice, nonce });
  await contract.waitForDeployment();
  
  console.log("Deployed to:", await contract.getAddress());
}

main().catch(console.error);
