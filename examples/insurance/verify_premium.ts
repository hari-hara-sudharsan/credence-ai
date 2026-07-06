import Credence from "../../packages/credence-sdk";

async function main() {
  const wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208";
  Credence.init("hackathon_demo_key", "http://127.0.0.1:8000");

  console.log("Evaluating risk profile for dynamic premium calculations...");
  const trust = await Credence.verifyTrust(wallet);
  
  // Dynamic calculation: premium is discounted for low default probabilities
  let basePremium = 500; // 500 HSK
  let discount = 0;
  
  if (trust.defaultRisk < 5.0) {
    discount = 30; // 30% discount
  } else if (trust.defaultRisk < 15.0) {
    discount = 15; // 15% discount
  }

  const finalPremium = basePremium * (1 - discount / 100);

  console.log("\n--- Insurance Integration Premium Quote ---");
  console.log(`Default Risk: ${trust.defaultRisk}%`);
  console.log(`Risk Trend: ${trust.riskTrend}`);
  console.log(`Eligible Premium Discount: ${discount}%`);
  console.log(`Adjusted Premium Cost: ${finalPremium} HSK`);
}

main().catch(console.error);
