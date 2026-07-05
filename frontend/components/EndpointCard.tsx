"use client";

import { useState, useEffect } from "react";
import API from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Endpoint {
  method: string;
  path: string;
  description: string;
}

export default function EndpointCard() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [search, setSearch] = useState<string>("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fetchEndpoints = async () => {
    try {
      const res = await API.get("/developer/endpoints");
      setEndpoints(res.data.endpoints);
    } catch (err) {
      console.error("Failed to fetch endpoints:", err);
    }
  };

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const copyUrl = (path: string, index: number) => {
    const fullUrl = `http://127.0.0.1:8000${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filtered = endpoints.filter(
    (ep) => 
      ep.path.toLowerCase().includes(search.toLowerCase()) ||
      ep.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search filter bar */}
      <div className="flex items-center gap-3 bg-[#1A1F2B]/40 border border-[#2A3142]/70 rounded-sm px-3.5 py-2">
        <span className="text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search endpoints by path or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none font-sans text-xs text-[#E8E6DE]/90 w-full placeholder-[#6B7280]"
        />
      </div>

      {/* Endpoints display list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="font-sans text-xs text-[#6B7280]">No matching endpoints found.</p>
        ) : (
          filtered.map((ep, idx) => {
            const isGet = ep.method.toUpperCase() === "GET";
            return (
              <Card 
                key={`${ep.method}-${ep.path}`}
                className="border-[#2A3142] bg-[#1A1F2B]/20 text-[#E8E6DE] hover:border-[#2A3142]/90 hover:bg-[#1A1F2B]/35 transition-all"
              >
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start md:items-center gap-3">
                    <Badge className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-sm shrink-0 ${
                      isGet 
                        ? "bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/20" 
                        : "bg-[#3DDC97]/10 text-[#3DDC97] border-[#3DDC97]/20"
                    }`}>
                      {ep.method}
                    </Badge>
                    <div className="space-y-1">
                      <code className="font-mono text-xs font-semibold text-[#E8E6DE]">
                        {ep.path}
                      </code>
                      <p className="font-sans text-[11px] text-[#6B7280]">
                        {ep.description}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => copyUrl(ep.path, idx)}
                    className="font-mono text-[9px] text-[#00E5FF] border border-[#00E5FF]/20 hover:border-[#00E5FF]/60 px-3 py-1.5 rounded-sm cursor-pointer transition-all shrink-0 self-start md:self-auto"
                  >
                    {copiedIndex === idx ? "Copied!" : "Copy URL"}
                  </button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
