import Credence from "../../packages/credence-sdk";

async function main() {
  const wallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208";
  Credence.init("hackathon_demo_key", "http://127.0.0.1:8000");

  console.log("Querying Payment/PayFi profile parameters...");
  const profile = await Credence.getProtocolProfile(wallet);
  
  const payment = profile.profiles.payment;

  console.log("\n--- PayFi Integration Dashboard ---");
  console.log(`Payment Reliability Score: ${payment.score}`);
  console.log(`Liquidity Risk Tier: ${payment.risk}`);
  console.log(`Transaction Frequency: ${payment.frequency}`);
  
  if (payment.risk === "LOW" && payment.frequency === "HIGH") {
    console.log("Status: PRE-APPROVED for zero-fee instant merchant checkout lines!");
  } else {
    console.log("Status: Standard processing terms apply.");
  }
}

main().catch(console.error);
