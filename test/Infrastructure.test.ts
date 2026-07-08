import { expect } from "chai";
import { credenceIndexer } from "../backend/indexer/hashkey_indexer";
import { eventProcessor } from "../backend/indexer/event_processor";
import { prisma } from "../backend/database/prisma";

describe("Infrastructure E2E Flow", function () {
  it("should process an event through Indexer to Database to API simulated flow", async function () {
    const testWallet = "0xinfra123456789012345678901234567890123";
    const initialIdentities = await prisma.financialIdentity.findMany();

    // 1. Simulate Contract Event
    await eventProcessor.processIdentityCreated(
      testWallet, 
      850, 
      177, 
      "0xhash_infra_test", 
      1, 
      100000
    );

    // 2. Check Database Update
    const postIdentities = await prisma.financialIdentity.findMany();
    expect(postIdentities.length).to.equal(initialIdentities.length + 1);

    // 3. Verify Database Exact Record
    const record = await prisma.financialIdentity.findUnique({ where: { wallet: testWallet } });
    expect(record).to.not.be.null;
    expect(record?.trustScore).to.equal(850);
    expect(record?.tier).to.equal("Premium");
  });
});
