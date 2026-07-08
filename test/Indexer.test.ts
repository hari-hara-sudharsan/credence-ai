import { expect } from "chai";
import { eventProcessor } from "../backend/indexer/event_processor";
import { prisma } from "../backend/database/prisma";
import { credenceIndexer } from "../backend/indexer/hashkey_indexer";

describe("Production Indexer", function () {
  const testWallet = "0x9999999999999999999999999999999999999999";
  
  it("should process new identities without duplicating", async function () {
    const initialIdentities = await prisma.financialIdentity.findMany();
    const initialCount = initialIdentities.length;
    
    // First time
    await eventProcessor.processIdentityCreated(testWallet, 750, 177, "0xabc123", 0, 123);
    const midIdentities = await prisma.financialIdentity.findMany();
    expect(midIdentities.length).to.equal(initialCount + 1);
    
    // Second time with same txHash/eventId -> shouldn't duplicate
    await eventProcessor.processIdentityCreated(testWallet, 750, 177, "0xabc123", 0, 123);
    const endIdentities = await prisma.financialIdentity.findMany();
    expect(endIdentities.length).to.equal(initialCount + 1);
  });

  it("should process new trust proofs", async function () {
    const initialEvents = await prisma.trustEvent.findMany();
    const initialCount = initialEvents.length;
    
    await eventProcessor.processProofOfTrustCreated(testWallet, "Protocol Verify", 10, 177, "0xdef456", 0, 124);
    const endEvents = await prisma.trustEvent.findMany();
    expect(endEvents.length).to.equal(initialCount + 1);
  });

  it("should save checkpoint successfully on restart", async function () {
    await credenceIndexer.saveCheckpoint(555666);
    const state = await prisma.indexerState.findUnique({ where: { id: "main-state" } });
    expect(state?.lastProcessedBlock).to.equal(555666);
  });
});
