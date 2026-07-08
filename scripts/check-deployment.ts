import * as fs from "fs";
import * as path from "path";

const configPath = path.join(__dirname, "../src/config/contracts.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const mainnet = config["hashkey-mainnet"].contracts;

console.log("Validating deployment on HashKey Mainnet (Chain ID 177)...\n");

let allPassed = true;

for (const [name, data] of Object.entries(mainnet)) {
  const c = data as any;
  let status = "ONLINE ✓";
  
  if (!c.address || !c.address.startsWith("0x")) {
    status = "MISSING ADDRESS ❌";
    allPassed = false;
  }
  if (!c.verified) {
    status = "UNVERIFIED ❌";
    allPassed = false;
  }
  if (!c.explorer) {
    status = "NO EXPLORER ❌";
    allPassed = false;
  }
  
  console.log(`${name.padEnd(30)} ${status}`);
}

console.log("");
if (allPassed) {
  console.log("Deployment validation passed. All contracts are verified and online.");
  process.exit(0);
} else {
  console.error("Deployment validation failed.");
  process.exit(1);
}
