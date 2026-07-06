import Credence from "../../packages/credence-sdk";

async function main() {
  const wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208";
  
  // Initialize with standard key and dev server
  Credence.init("hackathon_demo_key", "http://127.0.0.1:8000");

  console.log("Querying Lending Access Decision for:", wallet);
  const decision = await Credence.requestDecision({
    wallet,
    protocol: "LENDING"
  });

  console.log("\n--- Lending Integration Decision ---");
  console.log(`Approved: ${decision.approved}`);
  console.log(`Tier: ${decision.tier}`);
  console.log(`Reason: ${decision.reason}`);
  console.log(`Compatibility Fit: ${decision.fitScore}%`);
}

main().catch(console.error);
