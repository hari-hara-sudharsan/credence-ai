import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const connection = await network.create();
  const ethers = connection.ethers;

  const [deployer] = await ethers.getSigners();
  console.log("Deploying/configuring contracts with account:", deployer.address);

  const isMainnet = connection.networkName === "hsk";
  console.log("Target network name:", connection.networkName);
  console.log("Is mainnet?", isMainnet);

  let reputationRegistryAddress = process.env.REPUTATION_REGISTRY_ADDRESS || "0x110e9fB1ABEc92521E4511d5f45B4917B4c941Ab";
  let creditPassportV2Address = process.env.CREDIT_PASSPORT_V2_ADDRESS || "0xD6b040736e948621c5b6E0a494473c47a6113eA8";
  let loanManagerAddress = process.env.LOAN_MANAGER_ADDRESS || "0x2988f0bE02e1a679430aEb4A6B9B10429F1e8e80";

  if (!isMainnet) {
    console.log("Local network detected. Deploying mock dependencies first...");
    const RepReg = await ethers.getContractFactory("ReputationRegistry");
    const repReg = await RepReg.deploy();
    await repReg.waitForDeployment();
    reputationRegistryAddress = await repReg.getAddress();

    const Passport = await ethers.getContractFactory("CreditPassportV2");
    const passport = await Passport.deploy();
    await passport.waitForDeployment();
    creditPassportV2Address = await passport.getAddress();

    const LoanMan = await ethers.getContractFactory("LoanManager");
    const loanMan = await LoanMan.deploy();
    await loanMan.waitForDeployment();
    loanManagerAddress = await loanMan.getAddress();
  } else {
    console.log("Mainnet detected. Reusing existing contract instances:");
    console.log("ReputationRegistry:", reputationRegistryAddress);
    console.log("CreditPassportV2:", creditPassportV2Address);
    console.log("LoanManager:", loanManagerAddress);
  }

  // 1. Deploy the new SettlementManager (with Reputation linkage)
  console.log("Deploying upgraded SettlementManager...");
  const SettlementManager = await ethers.getContractFactory("SettlementManager");
  const settlementManager = await SettlementManager.deploy();
  await settlementManager.waitForDeployment();
  const settlementAddress = await settlementManager.getAddress();
  console.log("Upgraded SettlementManager deployed to:", settlementAddress);

  // 2. Attach to ReputationRegistry
  console.log("Attaching to ReputationRegistry at:", reputationRegistryAddress);
  const reputationRegistry = await ethers.getContractAt("ReputationRegistry", reputationRegistryAddress);

  // 3. Configure references
  console.log("Configuring SettlementManager references...");
  const tx1 = await settlementManager.setReputationRegistry(reputationRegistryAddress);
  await tx1.wait();
  console.log("SettlementManager reputation registry set.");

  const tx2 = await settlementManager.setCreditPassportV2(creditPassportV2Address);
  await tx2.wait();
  console.log("SettlementManager credit passport set.");

  // 4. Grant roles in ReputationRegistry
  console.log("Granting roles in ReputationRegistry...");
  const ORACLE_ROLE = await reputationRegistry.ORACLE_ROLE();
  
  console.log("Granting ORACLE_ROLE to LoanManager...");
  const tx3 = await reputationRegistry.grantRole(ORACLE_ROLE, loanManagerAddress);
  await tx3.wait();
  
  console.log("Granting ORACLE_ROLE to SettlementManager...");
  const tx4 = await reputationRegistry.grantRole(ORACLE_ROLE, settlementAddress);
  await tx4.wait();

  console.log("\nAll configurations finished successfully!");
  console.log("New SettlementManager address to use: " + settlementAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
