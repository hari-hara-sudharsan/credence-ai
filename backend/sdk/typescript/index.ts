export class CredenceClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = "http://127.0.0.1:8000") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, "");
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
        const errorText = await res.text();
        throw new Error(`Credence SDK Error ${res.status}: ${errorText || res.statusText}`);
      }
      return await res.json();
    } catch (err: any) {
      throw new Error(`Credence SDK Request Failed: ${err.message}`);
    }
  }

  /**
   * Calculates and returns the Credit Profile and default probability.
   */
  public async getCreditProfile(wallet: string): Promise<any> {
    return this.request("POST", "/credit/score", { wallet });
  }

  /**
   * Fast, reliable read from the Production Indexer database.
   */
  public async getProfile(wallet: string): Promise<any> {
    return this.request("GET", `/api/profile/${wallet}`);
  }

  /**
   * Alias / wrapper to query protocol-specific adapter mappings.
   */
  public async getProtocolProfiles(protocol: string, wallet: string): Promise<any> {
    return this.getIntegration(protocol, wallet);
  }

  /**
   * Creates an underwriting loan offer.
   */
  public async getLoanOffer(wallet: string): Promise<any> {
    return this.request("POST", "/loan-offer", { wallet });
  }

  /**
   * Queries dynamic reputation scores and timeline evolution logs.
   */
  public async getReputation(wallet: string): Promise<any> {
    return this.request("GET", `/reputation/${wallet}`);
  }

  /**
   * Reads or queries the user's Credit Passport NFT standing.
   */
  public async getPassport(wallet: string): Promise<any> {
    return this.request("POST", "/wallet/analyze", { wallet });
  }

  /**
   * Refreshes oracle nodes or checks feeds.
   */
  public async getOracle(): Promise<any> {
    return this.request("POST", "/oracle/refresh");
  }

  /**
   * Executes standard protocol adapters to get adapted parameters.
   */
  public async getIntegration(protocol: string, wallet: string): Promise<any> {
    return this.request("GET", `/integrations/${protocol}/${wallet}`);
  }

  /**
   * AI Risk Intelligence Predict namespace.
   */
  public get trust() {
    return {
      predict: async (wallet: string) => {
        return this.request("GET", `/api/ai/risk/${wallet}`);
      }
    };
  }

  /**
   * AI Decision Explainability namespace.
   */
  public get ai() {
    return {
      explain: async (wallet: string) => {
        // First get recent decision
        const history = await this.request("GET", `/api/ai/history/${wallet}`);
        const latest = history[history.length - 1];
        if (!latest) throw new Error("No AI decision found for wallet.");
        
        // Fetch explain details
        const explanations = await this.request("POST", `/api/ai/explain`, {
          score: latest.confidence,
          inputs: latest.inputs
        });

        return {
          decision: latest,
          reasoning: explanations
        };
      }
    };
  }

  /**
   * Verifies the Proof-of-Trust (PoT) for a wallet to grant ecosystem access.
   */
  public async verifyProof(wallet: string): Promise<any> {
    const history = await this.request("GET", `/api/pot/${wallet}`);
    return {
      trusted: history && history.trustVerified === true,
      totalProofs: history?.totalProofs || 0,
      details: history
    };
  }
}

/**
 * Helper function to instantiate a new CredenceClient.
 */
export function createClient(apiKey: string, baseUrl?: string): CredenceClient {
  return new CredenceClient(apiKey, baseUrl);
}
