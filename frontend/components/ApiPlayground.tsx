"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import API from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ApiPlayground() {
  const { wallet } = useWallet();
  const [targetWallet, setTargetWallet] = useState<string>("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (wallet) {
      setTargetWallet(wallet);
    }
  }, [wallet]);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetWallet) return;
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await API.get(`/profiles/${targetWallet}`);
      setResponse(res.data);
    } catch (err: any) {
      console.error("Playground error:", err);
      setError(
        err.response?.data?.detail || 
        "Failed to query playground. Ensure the backend server is running and wallet format is valid."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-[#2A3142] bg-[#1A1F2B]/40 text-[#E8E6DE]">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#2A3142]/40">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-3 bg-[#00E5FF] rounded-sm" />
          <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-[#E8E6DE]">
            Interactive API Playground
          </h3>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <form onSubmit={handleQuery} className="space-y-4 font-sans text-xs">
          {error && <p className="text-[#FF4D6A] font-mono text-[10px]">{error}</p>}
          
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2 flex-grow">
              <label className="text-[#6B7280] font-mono text-[10px] uppercase tracking-wider block">
                Target Wallet Address
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={targetWallet}
                onChange={(e) => setTargetWallet(e.target.value)}
                className="w-full bg-[#0B0E14]/40 border border-[#2A3142]/60 rounded-sm px-3.5 py-2 text-xs outline-none text-[#E8E6DE]/90 placeholder-[#6B7280] font-mono focus:border-[#00E5FF]/50"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !targetWallet}
              className="w-full md:w-auto font-mono text-xs tracking-wider uppercase bg-[#00E5FF] text-[#0B0E14] px-6 py-2.5 rounded-sm font-semibold hover:bg-[#00c5dd] transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {loading ? "Executing..." : "Execute Request"}
            </button>
          </div>
        </form>

        {/* Live response output */}
        {response ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#6B7280]">
              <span>GET /profiles/{targetWallet.slice(0, 6)}...</span>
              <Badge className="font-mono text-[8px] bg-[#3DDC97]/10 text-[#3DDC97] uppercase">
                200 OK
              </Badge>
            </div>
            <pre className="font-mono text-xs text-[#00E5FF] bg-[#0B0E14]/50 border border-[#2A3142]/45 rounded-sm p-4 overflow-x-auto max-h-72 leading-relaxed">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        ) : !loading && (
          <div className="border border-dashed border-[#2A3142]/50 bg-[#0B0E14]/10 rounded-sm p-8 text-center text-xs text-[#6B7280]">
            Enter a target wallet and click "Execute Request" to view dynamic query results.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
