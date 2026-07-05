"use client";

import { useState, useEffect } from "react";
import API from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Subscription {
  url: string;
  events: string[];
  created_at: string;
}

export default function WebhookCard() {
  const [supportedEvents, setSupportedEvents] = useState<string[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [urlInput, setUrlInput] = useState<string>("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWebhooks = async () => {
    try {
      const evRes = await API.get("/developer/webhooks");
      setSupportedEvents(evRes.data.events);
      
      const listRes = await API.get("/developer/webhooks/list");
      setSubscriptions(listRes.data.subscriptions);
    } catch (err) {
      console.error("Failed to fetch webhooks:", err);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const handleCheckbox = (event: string) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== event));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  const registerWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput || selectedEvents.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      await API.post("/developer/webhooks/register", {
        url: urlInput,
        events: selectedEvents
      });
      setUrlInput("");
      setSelectedEvents([]);
      await fetchWebhooks();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to register webhook.");
    } finally {
      setLoading(false);
    }
  };

  const unregisterWebhook = async (url: string) => {
    try {
      await API.post("/developer/webhooks/unregister", { url });
      await fetchWebhooks();
    } catch (err) {
      console.error("Failed to unregister webhook:", err);
    }
  };

  const examplePayload = {
    event: "reputation.updated",
    timestamp: "2026-07-02T13:02:40Z",
    payload: {
      wallet: "0x...(connected wallet)",
      previous_score: 50,
      current_score: 62,
      delta: 12,
      reason: "Loan repaid successfully."
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Registration Column */}
      <Card className="border-[#2A3142] bg-[#1A1F2B]/40 text-[#E8E6DE] p-6 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[#2A3142]/40">
          <span className="inline-block w-1.5 h-3 bg-[#00E5FF] rounded-sm" />
          <h3 className="font-mono text-xs tracking-[0.1em] text-[#E8E6DE] uppercase">
            Register Webhook Listener
          </h3>
        </div>

        <form onSubmit={registerWebhook} className="space-y-4 font-sans text-xs">
          {error && <p className="text-[#FF4D6A] font-mono text-[10px]">{error}</p>}
          
          <div className="space-y-2">
            <label className="text-[#6B7280] font-mono text-[10px] uppercase tracking-wider block">
              Listener Endpoint URL
            </label>
            <input
              type="url"
              placeholder="https://your-protocol.xyz/webhooks/credence"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-[#0B0E14]/40 border border-[#2A3142]/60 rounded-sm px-3.5 py-2 text-xs outline-none text-[#E8E6DE]/90 placeholder-[#6B7280] font-mono focus:border-[#00E5FF]/50"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#6B7280] font-mono text-[10px] uppercase tracking-wider block">
              Subscribe to Event Triggers
            </label>
            <div className="grid grid-cols-2 gap-2">
              {supportedEvents.map((event) => (
                <label 
                  key={event} 
                  className="flex items-center gap-2 cursor-pointer border border-[#2A3142]/30 hover:border-[#00E5FF]/20 bg-[#0B0E14]/10 p-2 rounded-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event)}
                    onChange={() => handleCheckbox(event)}
                    className="accent-[#00E5FF]"
                  />
                  <span className="font-mono text-[10px] text-[#E8E6DE]/80">{event}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !urlInput || selectedEvents.length === 0}
            className="w-full font-mono text-[10px] tracking-wider uppercase bg-[#00E5FF] text-[#0B0E14] py-2.5 rounded-sm font-semibold hover:bg-[#00c5dd] transition-all cursor-pointer disabled:opacity-50"
          >
            Register Webhook URL
          </button>
        </form>

        {/* Subscriptions List */}
        <div className="space-y-3 border-t border-[#2A3142]/20 pt-4">
          <span className="font-mono text-[9px] text-[#6B7280] tracking-wider uppercase block">
            Active Subscriptions
          </span>

          {subscriptions.length === 0 ? (
            <p className="font-sans text-[11px] text-[#6B7280]">No active webhook subscriptions found.</p>
          ) : (
            <div className="space-y-2.5">
              {subscriptions.map((sub) => (
                <div 
                  key={sub.url}
                  className="bg-[#0B0E14]/30 border border-[#2A3142]/40 rounded-sm p-3 flex justify-between items-start gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <code className="font-mono text-[11px] text-[#E8E6DE] break-all block">
                      {sub.url}
                    </code>
                    <div className="flex flex-wrap gap-1">
                      {sub.events.map((ev) => (
                        <span key={ev} className="font-mono text-[8px] bg-[#2A3142]/30 text-[#6B7280] px-1 rounded-sm">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => unregisterWebhook(sub.url)}
                    className="text-[#FF4D6A] font-mono text-[10px] hover:underline shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Docs / Payloads Column */}
      <div className="space-y-6">
        {/* Example Payload */}
        <Card className="border-[#2A3142] bg-[#1A1F2B]/40 text-[#E8E6DE] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2A3142]/40">
            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-3 bg-[#00E5FF] rounded-sm" />
              <h3 className="font-mono text-xs tracking-[0.1em] text-[#E8E6DE] uppercase">
                Example Webhook Payload
              </h3>
            </div>
            <Badge className="font-mono text-[8px] tracking-wider bg-[#3DDC97]/10 text-[#3DDC97]">
              POST
            </Badge>
          </div>
          <pre className="font-mono text-[11px] text-[#00E5FF] bg-[#0B0E14]/40 border border-[#2A3142]/45 rounded-sm p-4 overflow-x-auto max-h-64 leading-relaxed">
            {JSON.stringify(examplePayload, null, 2)}
          </pre>
        </Card>

        {/* Retry policy */}
        <Card className="border-[#2A3142] bg-[#1A1F2B]/40 text-[#E8E6DE] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#2A3142]/40">
            <span className="inline-block w-1.5 h-3 bg-[#00E5FF] rounded-sm" />
            <h3 className="font-mono text-xs tracking-[0.1em] text-[#E8E6DE] uppercase">
              Webhook Delivery Policies
            </h3>
          </div>
          <div className="font-sans text-xs text-[#6B7280] space-y-3 leading-relaxed">
            <p>
              When a score or reputation event triggers, our webhook engine broadcasts an HTTP POST request immediately to your registered endpoint.
            </p>
            <ul className="list-disc pl-4 space-y-1.5">
              <li>
                <strong>Retry Policy:</strong> If your listener endpoint is offline or responds with any non-200 status code, our relayer will attempt up to 3 retries.
              </li>
              <li>
                <strong>Timeouts:</strong> Deliveries have a strict 5-second timeout window. Endpoint servers should return 200 OK immediately and process calculations asynchronously.
              </li>
              <li>
                <strong>Security:</strong> Verify payloads by matching signer parameters or validate request headers.
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
