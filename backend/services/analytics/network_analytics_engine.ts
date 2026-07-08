import { db } from "../../database/network_db";

export class NetworkAnalyticsEngine {
  public calculateTotalIdentities(): number {
    return db.financial_identities.length;
  }

  public calculateTrustEvents(): number {
    return db.trust_events.length;
  }

  public calculateSettlementVolume(): number {
    return db.settlements.reduce((sum, s) => sum + s.amount, 0);
  }

  public calculateProtocolUsage(): Record<string, number> {
    const usage: Record<string, number> = {};
    for (const p of db.protocol_usage) {
      usage[p.protocol] = (usage[p.protocol] || 0) + 1;
    }
    return usage;
  }

  public calculateRiskPrevented(): string {
    // Arbitrary metric simulating prevented defaults based on identities & trust events
    const defaultsPrevented = Math.floor(this.calculateTrustEvents() * 0.05);
    const savings = defaultsPrevented * 1200; // avg $1200 saved per prevented default
    return `$${(savings / 1000000).toFixed(1)}M`;
  }

  public generateNetworkReport(): any {
    return {
      identities: this.calculateTotalIdentities(),
      trustProofs: this.calculateTrustEvents(),
      settlements: db.settlements.length,
      volume: this.calculateSettlementVolume(),
      protocols: this.calculateProtocolUsage(),
      riskPrevented: this.calculateRiskPrevented()
    };
  }

  public getRecentActivity(limit = 10) {
    return db.trust_events
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  public getLeaderboard(limit = 10) {
    return db.financial_identities
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((user, idx) => ({
        rank: idx + 1,
        wallet: `${user.wallet.slice(0, 6)}...${user.wallet.slice(-4)}`,
        score: user.score
      }));
  }
}

export const analyticsEngine = new NetworkAnalyticsEngine();
