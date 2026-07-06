import Credence from "../../packages/credence-sdk";

async function main() {
  const wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208";
  Credence.init("hackathon_demo_key", "http://127.0.0.1:8000");

  console.log("Querying RWA Multi-protocol Trust Standing...");
  const profile = await Credence.getProtocolProfile(wallet);
  
  const rwa = profile.profiles.rwa;

  console.log("\n--- Real World Asset (RWA) Integration ---");
  console.log(`RWA Eligibility Verified: ${rwa.verified}`);
  console.log(`Maximum Tokenized Allocation Limit: ${rwa.limit} HSK`);
  
  if (rwa.verified) {
    console.log("Decision: APPROVED. Initializing tokenized asset transfer protocol.");
  } else {
    console.log("Decision: REJECTED. Underwriting guidelines not met.");
  }
}

main().catch(console.error);
