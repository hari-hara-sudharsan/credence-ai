"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ApiKeyRecord {
  raw_key?: string;
  masked_key: string;
  is_active: boolean;
  is_live: boolean;
  created_at: string;
  last_used: string | null;
}

export default function ApiKeyCard() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchKeys = async () => {
    try {
      const res = await API.get("/developer/api-keys");
      setKeys(res.data.keys);
    } catch (err) {
      console.error("Failed to load keys:", err);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const generateKey = async (isLive: boolean) => {
    setLoading(true);
    setNewKey(null);
    try {
      const res = await API.post("/developer/api-key", { is_live: isLive });
      setNewKey(res.data.api_key);
      await fetchKeys();
    } catch (err) {
      console.error("Failed to generate key:", err);
    } finally {
      setLoading(false);
    }
  };

  const revokeKey = async (key: string) => {
    try {
      await API.post("/developer/api-key/revoke", { key });
      if (newKey === key) {
        setNewKey(null);
      }
      await fetchKeys();
    } catch (err) {
      console.error("Failed to revoke key:", err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="border-[#2A3142] bg-[#1A1F2B]/40 text-[#E8E6DE]">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#2A3142]/40">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-3 bg-[#00E5FF] rounded-sm" />
          <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-[#E8E6DE]">
            API Keys Credentials
          </h3>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {/* Creation Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => generateKey(false)}
            disabled={loading}
            className="font-mono text-[10px] tracking-wider uppercase border border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/5 hover:bg-[#00E5FF]/10 px-4 py-2.5 rounded-sm transition-all cursor-pointer disabled:opacity-50"
          >
            Generate Test Key
          </button>
          <button
            onClick={() => generateKey(true)}
            disabled={loading}
            className="font-mono text-[10px] tracking-wider uppercase bg-[#3DDC97] text-[#0B0E14] px-4 py-2.5 rounded-sm font-semibold hover:bg-[#32c082] transition-all cursor-pointer disabled:opacity-50"
          >
            Generate Production Key
          </button>
        </div>

        {/* New key banner */}
        {newKey && (
          <div className="border border-[#3DDC97] bg-[#3DDC97]/5 rounded-sm p-4 space-y-3">
            <span className="font-mono text-[9px] text-[#3DDC97] tracking-wider uppercase block">
              New Key Created (Copy Immediately)
            </span>
            <div className="flex items-center gap-2 bg-[#0B0E14]/40 border border-[#2A3142]/40 rounded-sm p-2">
              <code className="font-mono text-xs text-[#E8E6DE]/90 break-all select-all flex-grow">
                {newKey}
              </code>
              <button 
                onClick={() => copyToClipboard(newKey)}
                className="font-mono text-[9px] text-[#00E5FF] hover:underline px-2 py-1 shrink-0"
              >
                Copy
              </button>
            </div>
            <p className="font-sans text-[10px] text-[#6B7280]">
              * Security note: For protection, this key will not be shown again. Write it down or save it locally.
            </p>
          </div>
        )}

        {/* Existing keys table */}
        <div className="space-y-3">
          <span className="font-mono text-[9px] text-[#6B7280] tracking-wider uppercase block">
            Active Developer Keys
          </span>

          {keys.length === 0 ? (
            <p className="font-sans text-xs text-[#6B7280]">No API keys registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px] text-[#E8E6DE]/80">
                <thead>
                  <tr className="border-b border-[#2A3142]/30 text-[#6B7280] text-[10px]">
                    <th className="pb-2">API Key</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Created</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A3142]/20">
                  {keys.map((record) => (
                    <tr key={record.raw_key || record.masked_key} className="hover:bg-[#0B0E14]/10">
                      <td className="py-3 font-semibold text-[#00E5FF]">
                        {record.masked_key}
                      </td>
                      <td className="py-3">
                        <Badge className={`text-[9px] px-1.5 py-0.5 rounded-sm ${
                          record.is_live 
                            ? "bg-[#3DDC97]/10 text-[#3DDC97] border-[#3DDC97]/20" 
                            : "bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20"
                        }`}>
                          {record.is_live ? "LIVE" : "TEST"}
                        </Badge>
                      </td>
                      <td className="py-3">
                        {record.is_active ? (
                          <span className="text-[#3DDC97]">Active</span>
                        ) : (
                          <span className="text-[#FF4D6A]">Revoked</span>
                        )}
                      </td>
                      <td className="py-3 text-[#6B7280]">
                        {new Date(record.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        {record.is_active && (
                          <button
                            onClick={() => revokeKey(record.raw_key || "")}
                            className="text-[#FF4D6A] hover:underline cursor-pointer text-[10px]"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
