import Credence from "../../packages/credence-sdk";

async function main() {
  const wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208";
  Credence.init("hackathon_demo_key", "http://127.0.0.1:8000");

  console.log("Querying DAO Governance profile parameters...");
  const profile = await Credence.getProtocolProfile(wallet);
  
  const dao = profile.profiles.dao;

  console.log("\n--- DAO Governance Integration ---");
  console.log(`DAO Voting Score: ${dao.score}`);
  console.log(`Participation Rate: ${dao.participationRate}%`);
  console.log(`Governance Standing: ${dao.standing}`);
  
  if (dao.standing === "EXCELLENT" || dao.standing === "GOOD") {
    console.log("Status: GRANTED admin delegation credentials and proposal creation rights!");
  } else {
    console.log("Status: Proposal creation locked (Requires GOOD or EXCELLENT standing).");
  }
}

main().catch(console.error);
