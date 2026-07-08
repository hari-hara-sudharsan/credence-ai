export class IndexerHealthMonitor {
  private status: string = "OFFLINE";
  private lastBlock: number = 0;
  private lag: number = 0;
  private healthy: boolean = true;
  private startTime: number = Date.now();

  public reportStatus(status: string) {
    this.status = status;
  }

  public updateMetrics(metrics: { lastBlock?: number; lag?: number; healthy?: boolean }) {
    if (metrics.lastBlock !== undefined) this.lastBlock = metrics.lastBlock;
    if (metrics.lag !== undefined) this.lag = metrics.lag;
    if (metrics.healthy !== undefined) this.healthy = metrics.healthy;
  }

  public getHealthData() {
    return {
      status: this.status,
      lastBlock: this.lastBlock,
      lag: this.lag,
      healthy: this.healthy,
      uptimeSecs: Math.floor((Date.now() - this.startTime) / 1000)
    };
  }
}

export const indexerHealth = new IndexerHealthMonitor();
