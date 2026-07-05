import { execSync } from 'child_process';
import path from 'path';

function run() {
  console.log("================================");
  console.log("Credence AI System Validation");
  console.log("================================");

  let frontendPass = "PASS";
  let backendPass = "PASS";
  let contractsPass = "PASS";
  let oraclePass = "PASS";
  let aiPass = "PASS";

  // 1. Frontend check
  try {
    console.log("Validating Frontend Compilation...");
    execSync("npm run build", { cwd: path.resolve('frontend') });
  } catch (err) {
    console.error("Frontend build failed:", err.message);
    if (err.stdout) console.log("STDOUT:", err.stdout.toString());
    if (err.stderr) console.log("STDERR:", err.stderr.toString());
    frontendPass = "FAIL";
  }

  // 2. Contracts check
  try {
    console.log("Validating Smart Contracts Compile...");
    execSync("npx hardhat compile", { stdio: 'ignore' });
  } catch (err) {
    contractsPass = "FAIL";
  }

  // 3. Backend, Oracle & AI checks
  try {
    console.log("Validating E2E Backend Pipeline...");
    const pythonPath = path.resolve('backend', 'venv', 'Scripts', 'python.exe');
    const testScript = path.resolve('backend', 'tests', 'integration', 'test_complete_flow.py');
    execSync(`"${pythonPath}" "${testScript}"`, { stdio: 'ignore' });
  } catch (err) {
    backendPass = "FAIL";
    oraclePass = "FAIL";
    aiPass = "FAIL";
  }

  console.log("\n================================");
  console.log(`Frontend        ${frontendPass}`);
  console.log(`Backend         ${backendPass}`);
  console.log(`Contracts       ${contractsPass}`);
  console.log(`Oracle          ${oraclePass}`);
  console.log(`AI Services     ${aiPass}`);
  console.log("================================");

  if (
    frontendPass === "PASS" &&
    backendPass === "PASS" &&
    contractsPass === "PASS" &&
    oraclePass === "PASS" &&
    aiPass === "PASS"
  ) {
    console.log("READY FOR SUBMISSION");
  } else {
    console.log("VALIDATION FAILED - CHECK LOGS");
    process.exit(1);
  }
  console.log("================================");
}

run();
