export interface TrustEvent {
  id: string;
  wallet: string;
  eventType: string;
  txHash: string;
  timestamp: number;
  trustImpact: number;
}

export interface FinancialIdentity {
  wallet: string;
  score: number;
  tier: string;
  createdAt: number;
}

export interface Settlement {
  settlementId: string;
  amount: number;
  hspTx: string;
  status: string;
}

export interface ProtocolUsage {
  protocol: string;
  wallet: string;
  decision: string;
  timestamp: number;
}

class NetworkDatabase {
  public trust_events: TrustEvent[] = [];
  public financial_identities: FinancialIdentity[] = [];
  public settlements: Settlement[] = [];
  public protocol_usage: ProtocolUsage[] = [];

  constructor() {
    this.seedMockData();
  }

  private seedMockData() {
    // Generate realistic base data to start so network dashboard is populated
    for (let i = 0; i < 1284; i++) {
      this.financial_identities.push({
        wallet: `0x${Math.random().toString(16).slice(2, 42)}`,
        score: Math.floor(Math.random() * 800) + 200,
        tier: "Standard",
        createdAt: Date.now() - Math.random() * 10000000000
      });
    }

    for (let i = 0; i < 9421; i++) {
      this.trust_events.push({
        id: `EVT-${i}`,
        wallet: `0x${Math.random().toString(16).slice(2, 42)}`,
        eventType: i % 3 === 0 ? "HSP Settlement" : "Loan Repaid",
        txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
        timestamp: Date.now() - Math.random() * 10000000,
        trustImpact: Math.floor(Math.random() * 50)
      });
    }

    for (let i = 0; i < 3892; i++) {
      this.settlements.push({
        settlementId: `SET-${i}`,
        amount: Math.floor(Math.random() * 5000) + 100,
        hspTx: `0x${Math.random().toString(16).slice(2, 66)}`,
        status: "COMPLETED"
      });
    }

    for (let i = 0; i < 400; i++) this.protocol_usage.push({ protocol: "lending", wallet: "0x123", decision: "APPROVED", timestamp: Date.now() });
    for (let i = 0; i < 250; i++) this.protocol_usage.push({ protocol: "payfi", wallet: "0x123", decision: "APPROVED", timestamp: Date.now() });
    for (let i = 0; i < 100; i++) this.protocol_usage.push({ protocol: "rwa", wallet: "0x123", decision: "APPROVED", timestamp: Date.now() });
  }
}

export const db = new NetworkDatabase();
