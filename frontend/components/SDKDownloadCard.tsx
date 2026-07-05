"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SDKDownloadCard() {
  const [selectedSdk, setSelectedSdk] = useState<"TS" | "PY">("TS");

  const tsCode = `import { createClient } from "@credence-ai/sdk";

// Initialize Credence Client
const client = createClient("crd_live_xxxxxxxxxxxxxxxxx");

// Fetch on-chain lending adapted parameters
const terms = await client.getIntegration("LENDING", "0xf39Fd...");
console.log("Adapted LTV Cap:", terms.integration_result.max_ltv);
`;

  const pyCode = `from credence import createClient

# Initialize Credence Client
client = createClient("crd_live_xxxxxxxxxxxxxxxxx")

# Fetch on-chain lending adapted parameters
terms = client.getIntegration("LENDING", "0xf39Fd...")
print("Adapted LTV Cap:", terms["integration_result"]["max_ltv"])
`;

  const downloadFile = (lang: "TS" | "PY") => {
    // Reference local paths to download files
    const filename = lang === "TS" ? "index.ts" : "client.py";
    const path = lang === "TS" ? "/sdk/typescript/" : "/sdk/python/";
    
    // Create direct mock file downloader using client source text
    const sourceText = lang === "TS" 
      ? `export class CredenceClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = "http://127.0.0.1:8000") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\\/$/, "");
  }

  private async request(method: string, path: string, payload?: any): Promise<any> {
    const url = \`\${this.baseUrl}/\${path.replace(/^\\//, "")}\`;
    const headers: Record<string, string> = {
      "Authorization": \`Bearer \${this.apiKey}\`,
      "Content-Type": "application/json"
    };

    const config: RequestInit = {
      method: method.toUpperCase(),
      headers
    };

    if (payload) {
      config.body = JSON.stringify(payload);
    }

    const res = await fetch(url, config);
    return await res.json();
  }

  public async getIntegration(protocol: string, wallet: string): Promise<any> {
    return this.request("GET", \`/integrations/\${protocol}/\${wallet}\`);
  }
}` 
      : `import urllib.request
import json

class CredenceClient:
    def __init__(self, api_key: str, base_url: str = "http://127.0.0.1:8000"):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")

    def getIntegration(self, protocol: str, wallet: str) -> dict:
        url = f"{self.base_url}/integrations/{protocol}/{wallet}"
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {self.api_key}"})
        with urllib.request.urlopen(req) as res:
            return json.loads(res.read().decode())
`;

    const blob = new Blob([sourceText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <Card className="border-[#2A3142] bg-[#1A1F2B]/40 text-[#E8E6DE] p-6 space-y-6">
      {/* Selector Tabs */}
      <div className="flex justify-between items-center pb-3 border-b border-[#2A3142]/40">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-3 bg-[#00E5FF] rounded-sm" />
          <h3 className="font-mono text-xs tracking-[0.1em] text-[#E8E6DE] uppercase">
            Official Platform SDKs
          </h3>
        </div>

        <div className="flex gap-2 bg-[#0B0E14]/60 border border-[#2A3142]/40 p-1 rounded-sm">
          <button
            onClick={() => setSelectedSdk("TS")}
            className={`font-mono text-[9px] px-2 py-1 rounded-sm cursor-pointer ${
              selectedSdk === "TS" ? "bg-[#00E5FF] text-[#0B0E14] font-semibold" : "text-[#6B7280]"
            }`}
          >
            TypeScript
          </button>
          <button
            onClick={() => setSelectedSdk("PY")}
            className={`font-mono text-[9px] px-2 py-1 rounded-sm cursor-pointer ${
              selectedSdk === "PY" ? "bg-[#00E5FF] text-[#0B0E14] font-semibold" : "text-[#6B7280]"
            }`}
          >
            Python
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Specifications Column */}
        <div className="space-y-5 font-sans text-xs">
          <div className="space-y-2">
            <label className="text-[#6B7280] font-mono text-[10px] uppercase tracking-wider block">
              Package Installation
            </label>
            <div className="flex items-center justify-between bg-[#0B0E14]/40 border border-[#2A3142]/65 rounded-sm p-3 font-mono text-xs text-[#00E5FF]">
              <code>
                {selectedSdk === "TS" ? "npm install @credence-ai/sdk" : "pip install credence-ai-sdk"}
              </code>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[#6B7280] font-mono text-[10px] uppercase tracking-wider block">
              Quick Start
            </label>
            <pre className="font-mono text-[10px] text-[#E8E6DE]/90 bg-[#0B0E14]/30 border border-[#2A3142]/30 p-4 rounded-sm overflow-x-auto leading-relaxed">
              {selectedSdk === "TS" ? tsCode : pyCode}
            </pre>
          </div>
        </div>

        {/* Download Info Column */}
        <Card className="border-[#2A3142] bg-[#0B0E14]/30 text-[#E8E6DE] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A3142]/20 pb-3">
            <h4 className="font-mono text-xs font-semibold text-[#E8E6DE]/90">
              {selectedSdk === "TS" ? "TypeScript Client Module" : "Python Client Module"}
            </h4>
            <Badge className="font-mono text-[9px] bg-[#00E5FF]/10 text-[#00E5FF]">
              {selectedSdk === "TS" ? "index.ts" : "client.py"}
            </Badge>
          </div>
          <div className="font-sans text-[11px] text-[#6B7280] space-y-3 leading-relaxed">
            <p>
              Download and import the clean SDK wrapper directly into your codebase to avoid writing raw HTTP connection libraries.
            </p>
            <p>
              Includes built-in request serialization, automatic parsing of on-chain event properties, and typing schemas for adapted terms.
            </p>
          </div>
          
          <button
            onClick={() => downloadFile(selectedSdk)}
            className="w-full text-center font-mono text-[10px] tracking-wider uppercase bg-[#00E5FF] text-[#0B0E14] py-2.5 rounded-sm font-semibold hover:bg-[#00c5dd] transition-all cursor-pointer"
          >
            Download {selectedSdk === "TS" ? "index.ts" : "client.py"} Source
          </button>
        </Card>
      </div>
    </Card>
  );
}
