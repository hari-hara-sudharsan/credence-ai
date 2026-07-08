import { prisma } from "../database/prisma";
import { eventStream } from "../realtime/event_stream";

export class EventProcessor {
  private processedEventIds = new Set<string>();

  public async processIdentityCreated(wallet: string, trustScore: number, chainId: number, txHash: string, logIndex: number, blockNumber: number) {
    const eventId = `${chainId}-${txHash}-${logIndex}`;
    if (this.processedEventIds.has(eventId)) return;

    const tier = trustScore >= 700 ? "Premium" : "Standard";

    await prisma.financialIdentity.create({
      data: { wallet, trustScore, tier, createdAt: new Date(), updatedAt: new Date() }
    });

    this.processedEventIds.add(eventId);
    eventStream.broadcast("IDENTITY_CREATED", { wallet, trustScore });
  }

  public async processProofOfTrustCreated(wallet: string, proofType: string, trustImpact: number, chainId: number, txHash: string, logIndex: number, blockNumber: number) {
    const eventId = `${chainId}-${txHash}-${logIndex}`;
    if (this.processedEventIds.has(eventId)) return;

    await prisma.trustEvent.create({
      data: { wallet, eventType: proofType, txHash, blockNumber, trustImpact }
    });

    this.processedEventIds.add(eventId);
    eventStream.broadcast("TRUST_UPDATED", { wallet, impact: trustImpact, eventType: proofType });
  }

  public async processHSPSettlementCompleted(hspReference: string, amount: number, proofHash: string, chainId: number, txHash: string, logIndex: number) {
    const eventId = `${chainId}-${txHash}-${logIndex}`;
    if (this.processedEventIds.has(eventId)) return;

    await prisma.settlement.create({
      data: { hspReference, amount, status: "COMPLETED", proofHash }
    });

    this.processedEventIds.add(eventId);
    eventStream.broadcast("NEW_SETTLEMENT", { hspReference, amount });
  }
}

export const eventProcessor = new EventProcessor();
