class CredenceSDK {
  private apiKey: string = "default_key";
  private baseUrl: string = "http://127.0.0.1:8000";

  /**
   * Initializes the SDK with api key and base URL.
   */
  public init(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    if (baseUrl) this.baseUrl = baseUrl;
  }

  private async request(method: string, path: string, payload?: any): Promise<any> {
    const url = `${this.baseUrl}/${path.replace(/^\//, "")}`;
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json"
    };

    const config: RequestInit = {
      method: method.toUpperCase(),
      headers
    };

    if (payload) {
      config.body = JSON.stringify(payload);
    }

    try {
      const res = await fetch(url, config);
      if (!res.ok) {
        throw new Error(`Credence SDK Request Failed: ${res.statusText}`);
      }
      return await res.json();
    } catch (err: any) {
      throw new Error(`Credence SDK Network Error: ${err.message}`);
    }
  }

  /**
   * Verifies the general trust / risk index of a wallet.
   */
  public async verifyTrust(wallet: string): Promise<any> {
    return this.request("GET", `/api/ai/risk/${wallet}`);
  }

  /**
   * Retrieves the multi-protocol context-specific profiles for the wallet.
   */
  public async getProtocolProfile(wallet: string): Promise<any> {
    return this.request("GET", `/api/v1/ecosystem/profile/${wallet}`);
  }

  /**
   * Requests access authorization for a specific protocol.
   */
  public async requestDecision(payload: { wallet: string; protocol: string }): Promise<any> {
    return this.request("POST", `/api/v1/ecosystem/access/${payload.wallet}`, { protocol: payload.protocol });
  }

  /**
   * Retrieves the trust graph data and network rank insights for the wallet.
   */
  public async graph(wallet: string): Promise<any> {
    const data = await this.request("GET", `/api/graph/${wallet}`);
    const insights = await this.request("GET", `/api/graph/insights/${wallet}`);
    
    let networkRank = 85;
    const rankStr = insights.rank || "";
    if (rankStr.includes("Top 3%")) {
      networkRank = 97;
    } else if (rankStr.includes("Top 5%")) {
      networkRank = 95;
    } else if (rankStr.includes("Top 10%")) {
      networkRank = 90;
    } else if (rankStr.includes("Bottom")) {
      networkRank = 40;
    }
    
    return {
      ...data,
      rank: insights.rank,
      opportunities: insights.opportunities,
      networkRank
    };
  }

  public readonly protocol = {
    evaluate: async (payload: { wallet: string; type: string }): Promise<any> => {
      return (this as any).request("GET", `/api/v1/protocol/decision?wallet=${payload.wallet}&application=${payload.type}`);
    }
  };
}

const Credence = new CredenceSDK();
export default Credence;
export { CredenceSDK };
