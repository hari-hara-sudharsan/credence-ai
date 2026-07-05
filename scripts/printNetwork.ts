import { network } from "hardhat";
async function main() {
  const connection = await network.create();
  console.log("Connection keys:", Object.keys(connection));
  // Let's print any network properties
  if (connection.provider) {
    console.log("Provider class:", connection.provider.constructor.name);
  }
}
main();
