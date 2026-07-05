"use client";

import { useState, useEffect, useRef } from "react";
import API from "@/lib/api";
import AlertFeed from "@/components/AlertFeed";
import RiskMonitor from "@/components/RiskMonitor";
import CreditMonitor from "@/components/CreditMonitor";
import ProtocolMonitor from "@/components/ProtocolMonitor";
import AlertTimeline from "@/components/AlertTimeline";
import AlertSettings from "@/components/AlertSettings";

export default function AlertsPage() {
  const [wallet, setWallet] = useState("");
  const [activeWallet, setActiveWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [riskLevel, setRiskLevel] = useState("LOW");
  const [currentScore, setCurrentScore] = useState(650);
  const [prevScore, setPrevScore] = useState(650);
  const [error, setError] = useState<string | null>(null);

  const sseRef = useRef<EventSource | null>(null);

  const startMonitoring = async () => {
    if (!wallet.trim()) {
      alert("Please input a valid wallet address.");
      return;
    }

    setLoading(true);
    setError(null);
    setActiveWallet(wallet.trim());

    // Close previous SSE stream
    if (sseRef.current) {
      sseRef.current.close();
      sseRef.current = null;
    }

    try {
      // 1. Initial snapshot check & alerts load
      const [verResp, altResp] = await Promise.all([
        API.get(`/verify?wallet=${wallet.trim()}`),
        API.get(`/alerts/${wallet.trim()}`)
      ]);

      if (verResp.data) {
        setRiskLevel(verResp.data.risk_level || "LOW");
        setCurrentScore(verResp.data.credit_score || 650);
        // default previous score mock
        setPrevScore(verResp.data.credit_score || 650);
      }

      setAlerts(altResp.data || []);

      // 2. Establish Server Sent Events (SSE) Stream
      const sseUrl = `${API.defaults.baseURL}/alerts/stream/${wallet.trim()}`;
      const eventSource = new EventSource(sseUrl);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.status === "CONNECTED") {
            console.log("SSE Stream Connected:", data);
            return;
          }

          // Real-time alert push! Add it to alerts feed list
          setAlerts((prev) => {
            if (prev.some((a) => a.alert_id === data.alert_id)) return prev;
            return [data, ...prev];
          });

          // Show browser dynamic notification
          if (Notification.permission === "granted") {
            new Notification(data.title, { body: data.description });
          }
        } catch (err) {
          console.error("Failed to parse SSE payload:", err);
        }
      };

      eventSource.onerror = () => {
        console.error("SSE connection drop. Reconnecting...");
      };

      sseRef.current = eventSource;
    } catch (err: any) {
      setError("Failed to initialize monitoring session.");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      await API.post(`/alerts/resolve/${alertId}`);
      setAlerts((prev) => prev.filter((a) => a.alert_id !== alertId));
    } catch (err) {
      alert("Failed to resolve alert.");
    }
  };

  const triggerSimulation = async () => {
    if (!activeWallet) return;
    try {
      // Create artificial shift by seeding previous snapshot as higher credit score
      const snapshots = { [activeWallet.toLowerCase()]: { credit_score: currentScore + 120, risk_level: "LOW" } };
      // Note: we can trigger a monitor run to evaluate changes
      const monResp = await API.post(`/alerts/monitor/${activeWallet}`);

      // The SSE stream will capture the newly created alerts and push them automatically!
    } catch (err) {
      console.error("Simulation failed:", err);
    }
  };

  useEffect(() => {
    // Request notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission();
    }
    return () => {
      if (sseRef.current) {
        sseRef.current.close();
      }
    };
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#040C1A",
        color: "#E2E8F0",
        fontFamily: "Inter, sans-serif",
        padding: "60px 0 100px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: "#4A6080",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          <span>AUTONOMOUS RISK TRACKER</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>REAL-TIME SSE MONITORING</span>
        </div>

        {/* Hero Section */}
        <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: "#E2E8F0",
                letterSpacing: -1,
                marginBottom: 12,
              }}
            >
              Autonomous Credit Monitoring
            </h1>
            <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
              Continuous, event-driven monitoring tracking credit scores, reputation logs, and systemic exposures.
            </p>
          </div>

          {activeWallet && (
            <button
              onClick={triggerSimulation}
              style={{
                background: "#00E5FF",
                border: "none",
                borderRadius: 8,
                color: "#040C1A",
                fontWeight: 700,
                fontSize: 13,
                padding: "12px 24px",
                cursor: "pointer",
              }}
            >
              ⚡ SIMULATE CREDIT DROP
            </button>
          )}
        </div>

        {/* Search controls */}
        <div
          style={{
            background: "#0A1425",
            border: "1px solid #111C2E",
            borderRadius: 14,
            padding: 24,
            marginBottom: 32,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            display: "flex",
            gap: 16,
          }}
        >
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="Input Wallet Address (0x...) to start real-time monitoring"
            style={{
              flex: 1,
              background: "#050B14",
              border: "1px solid #1D2E49",
              borderRadius: 8,
              padding: "12px 16px",
              color: "#E2E8F0",
              fontSize: 14,
              outline: "none",
              fontFamily: "JetBrains Mono, monospace",
            }}
          />
          <button
            onClick={startMonitoring}
            disabled={loading}
            style={{
              background: "#00E5FF",
              border: "none",
              borderRadius: 8,
              color: "#040C1A",
              fontWeight: 700,
              fontSize: 14,
              padding: "0 32px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "INITIALIZING..." : "START MONITORING"}
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(255, 77, 106, 0.08)",
              border: "1px solid rgba(255, 77, 106, 0.3)",
              borderRadius: 8,
              padding: "16px 20px",
              color: "#FF4D6A",
              fontSize: 14,
              marginBottom: 32,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {activeWallet && (
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32, alignItems: "start" }}>
            
            {/* Left column: Monitors & live alerts feed */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <RiskMonitor riskLevel={riskLevel} />
                <CreditMonitor currentScore={currentScore} prevScore={prevScore} />
              </div>

              <AlertFeed alerts={alerts} onResolve={handleResolve} />
            </div>

            {/* Right column: Pipelines & settings */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <ProtocolMonitor />
              <AlertTimeline />
              <AlertSettings />
            </div>

          </div>
        )}

      </div>
    </main>
  );
}


