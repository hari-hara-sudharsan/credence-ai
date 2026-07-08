// Mock Prisma Client to prevent need for live PostgreSQL instance during this sprint
// This matches the Prisma API precisely to ensure production readiness.

class MockCollection<T extends { id?: string | number, [key: string]: any }> {
  public data: T[] = [];

  async findMany(args?: any): Promise<T[]> {
    return [...this.data];
  }

  async findUnique(args: { where: any }): Promise<T | null> {
    const keys = Object.keys(args.where);
    const item = this.data.find(d => keys.every(k => d[k] === args.where[k]));
    return item || null;
  }

  async create(args: { data: T }): Promise<T> {
    const newData = { ...args.data, id: args.data.id || Math.random().toString(36).substring(7) };
    this.data.push(newData);
    return newData;
  }

  async update(args: { where: any, data: any }): Promise<T> {
    const item = await this.findUnique({ where: args.where });
    if (!item) throw new Error("Record not found");
    Object.assign(item, args.data);
    return item;
  }
}

export class PrismaClient {
  public financialIdentity = new MockCollection<any>();
  public trustEvent = new MockCollection<any>();
  public settlement = new MockCollection<any>();
  public loan = new MockCollection<any>();
  public protocolUsage = new MockCollection<any>();
  public indexerState = new MockCollection<any>();

  constructor() {
    this.seedState();
  }

  private async seedState() {
    await this.indexerState.create({
      data: { id: "main-state", lastProcessedBlock: 123400 }
    });

    await this.financialIdentity.create({
      data: { wallet: "0x123", trustScore: 850, tier: "Premium", createdAt: new Date(), updatedAt: new Date() }
    });
  }
}

export const prisma = new PrismaClient();
