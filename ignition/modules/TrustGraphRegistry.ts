import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TrustGraphRegistryModule", (m) => {
  const adminAddress = "0x5bb83E60a7a05A0e1b077B66412a26306e334208";
  const trustGraphRegistry = m.contract("TrustGraphRegistry", [adminAddress]);

  return { trustGraphRegistry };
});
