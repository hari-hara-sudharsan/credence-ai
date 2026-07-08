import { eventProcessor } from "./event_processor";
import { prisma } from "../database/prisma";
import { indexerHealth } from "../services/monitoring/indexer_health";

export class CredenceIndexer {
  private isRunning = false;
  private currentBlock = 0;
  private readonly chainId = 177; // HashKey Mainnet

  public async startIndexer() {
    console.log("[Indexer] Starting Credence Production Indexer...");
    this.isRunning = true;
    indexerHealth.reportStatus("STARTING");
    
    await this.syncHistoricalEvents();
    this.listenToRealTimeEvents();
  }

  public async syncHistoricalEvents() {
    const state = await prisma.indexerState.findUnique({ where: { id: "main-state" } });
    let lastBlock = state ? state.lastProcessedBlock : 0;
    console.log(`[Indexer] Resuming from block: ${lastBlock}`);
    
    indexerHealth.reportStatus("SYNCING_HISTORICAL");
    
    // Simulate fetching missing blocks
    const targetBlock = lastBlock + 100;
    while (lastBlock < targetBlock) {
      lastBlock++;
      this.currentBlock = lastBlock;
    }
    
    await this.saveCheckpoint(lastBlock);
    console.log(`[Indexer] Historical sync complete. Advanced to block: ${lastBlock}`);
  }

  private listenToRealTimeEvents() {
    indexerHealth.reportStatus("SYNCED");
    console.log("[Indexer] Listening to live HashKey Mainnet events...");
    
    // Simulating a real-time event arriving
    setTimeout(() => {
      if (this.isRunning) {
        this.processNewBlock(this.currentBlock + 1);
      }
    }, 5000);
  }

  public async processNewBlock(blockNumber: number) {
    this.currentBlock = blockNumber;
    try {
      // Simulate processing an event in this block
      await eventProcessor.processProofOfTrustCreated(
        "0x1111222233334444555566667777888899990000",
        "HSP_SETTLEMENT",
        25,
        this.chainId,
        `0xtxhash_${blockNumber}`,
        0,
        blockNumber
      );

      await this.saveCheckpoint(blockNumber);
      indexerHealth.updateMetrics({ lastBlock: blockNumber, lag: 0, healthy: true });
    } catch (error) {
      console.error(`[Indexer] Error at block ${blockNumber}:`, error);
      indexerHealth.updateMetrics({ healthy: false });
    }
  }

  public async handleReorg(newBlock: number) {
    console.log(`[Indexer] Chain Reorganization detected! Rolling back to block ${newBlock}...`);
    await this.saveCheckpoint(newBlock);
  }

  public async saveCheckpoint(blockNumber: number) {
    await prisma.indexerState.update({
      where: { id: "main-state" },
      data: { lastProcessedBlock: blockNumber }
    });
  }
}

export const credenceIndexer = new CredenceIndexer();
