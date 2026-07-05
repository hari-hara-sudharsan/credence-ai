"use client";

import { useState } from "react";
import API from "@/lib/api";

interface Props {
  onSearchResult: (insights: any[]) => void;
}

export default function AIAgentChat({ onSearchResult }: Props) {
  const [wallet, setWallet] = useState("");
  const [agentType, setAgentType] = useState<"BORROWER_AGENT" | "LENDER_AGENT" | "PROTOCOL_AGENT">("BORROWER_AGENT");
  const [question, setQuestion] = useState("");
  const [chatLog, setChatLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!wallet.trim()) {
      alert("Please input a valid wallet address first.");
      return;
    }
    if (!question.trim()) return;

    const userMsg = { role: "user", text: question };
    setChatLog((prev) => [...prev, userMsg]);
    const currentQuestion = question;
    setQuestion("");
    setLoading(true);

    try {
      const response = await API.post("/agents/ask", {
        wallet: wallet.trim(),
        agent_type: agentType,
        question: currentQuestion
      });

      const replyMsg = {
        role: "agent",
        text: response.data.answer,
        confidence: response.data.confidence,
        recommendations: response.data.recommendations,
        decision_trace: response.data.decision_trace
      };

      setChatLog((prev) => [...prev, replyMsg]);

      // Load insights
      const insightsResp = await API.get(`/agents/insights/${wallet.trim()}`);
      onSearchResult(insightsResp.data);
    } catch (err: any) {
      const errMsg = {
        role: "agent",
        text: "Error: Failed to fetch advisor reasoning. Confirm target wallet has active credential state."
      };
      setChatLog((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const selectPrebuiltQuestion = (q: string) => {
    setQuestion(q);
  };

  const prebuiltQuestions = {
    BORROWER_AGENT: [
      "Why is my score limited?",
      "How can I reach 800 credit score?",
      "How much can I borrow?"
    ],
    LENDER_AGENT: [
      "Should I lend to this wallet?",
      "What default risks exist here?",
      "Why is this borrower safe?"
    ],
    PROTOCOL_AGENT: [
      "Should this wallet access my protocol?",
      "Which policy is recommended?",
      "What segment is this user?"
    ]
  };

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Target Wallet Input */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
        <div>
          <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
            TARGET WALLET ADDRESS
          </label>
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="Input Wallet Address (0x...)"
            style={{
              width: "100%",
              background: "#050B14",
              border: "1px solid #1D2E49",
              borderRadius: 8,
              padding: "10px 14px",
              color: "#E2E8F0",
              fontSize: 13,
              outline: "none",
              fontFamily: "JetBrains Mono, monospace",
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
            SELECT ACTIVE ADVISOR AGENT
          </label>
          <select
            value={agentType}
            onChange={(e: any) => setAgentType(e.target.value)}
            style={{
              width: "100%",
              background: "#050B14",
              border: "1px solid #1D2E49",
              borderRadius: 8,
              padding: "10px 12px",
              color: "#E2E8F0",
              fontSize: 13,
              outline: "none",
              height: 38,
            }}
          >
            <option value="BORROWER_AGENT">Borrower Advisor</option>
            <option value="LENDER_AGENT">Lender Advisor</option>
            <option value="PROTOCOL_AGENT">Protocol Advisor</option>
          </select>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div
        style={{
          background: "#050B14",
          border: "1px solid #111C2E",
          borderRadius: 10,
          padding: 16,
          height: 320,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {chatLog.length === 0 ? (
          <div style={{ color: "#64748B", fontSize: 12, textAlign: "center", margin: "auto" }}>
            Select an advisor agent, enter target address, and ask your questions.
          </div>
        ) : (
          chatLog.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                background: msg.role === "user" ? "#00E5FF10" : "#111C2E",
                border: `1px solid ${msg.role === "user" ? "#00E5FF" : "#1D2E49"}`,
                borderRadius: 10,
                padding: "12px 16px",
              }}
            >
              <div style={{ fontSize: 13, color: "#E2E8F0", lineHeight: 1.5 }}>{msg.text}</div>

              {msg.role === "agent" && msg.confidence !== undefined && (
                <div style={{ marginTop: 12, borderTop: "1px solid #1D2E49", paddingTop: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10 }}>
                    <span style={{ color: "#64748B" }}>Confidence Score</span>
                    <span style={{ color: "#34D399", fontWeight: 700 }}>{msg.confidence}%</span>
                  </div>

                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 9, color: "#64748B", marginBottom: 4 }}>RECOMMENDATIONS</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {msg.recommendations.map((rec: string, rIdx: number) => (
                          <div key={rIdx} style={{ fontSize: 11, color: "#94A3B8" }}>
                            ⚡ {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.decision_trace && msg.decision_trace.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 9, color: "#4A6080", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
                        EXPLAINABLE DECISION TRACE
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3, borderLeft: "2px solid #1D2E49", paddingLeft: 8 }}>
                        {msg.decision_trace.map((tr: string, tIdx: number) => (
                          <div key={tIdx} style={{ fontSize: 10, color: "#64748B", fontFamily: "JetBrains Mono, monospace" }}>
                            ▫️ {tr}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div style={{ alignSelf: "flex-start", background: "#111C2E", borderRadius: 10, padding: "10px 16px", color: "#64748B", fontSize: 12 }}>
            Thinking...
          </div>
        )}
      </div>

      {/* Suggested Prebuilt Questions chips */}
      <div>
        <div style={{ fontSize: 9, color: "#64748B", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>
          SUGGESTED QUESTIONS
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {prebuiltQuestions[agentType].map((q) => (
            <button
              key={q}
              onClick={() => selectPrebuiltQuestion(q)}
              style={{
                background: "transparent",
                border: "1px solid #1D2E49",
                borderRadius: 6,
                color: "#94A3B8",
                fontSize: 11,
                padding: "6px 12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e: any) => (e.target.style.borderColor = "#00E5FF")}
              onMouseLeave={(e: any) => (e.target.style.borderColor = "#1D2E49")}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Message input controls */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a financial question..."
          style={{
            flex: 1,
            background: "#050B14",
            border: "1px solid #1D2E49",
            borderRadius: 8,
            padding: "12px 16px",
            color: "#E2E8F0",
            fontSize: 13,
            outline: "none",
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !question.trim()}
          style={{
            background: "#00E5FF",
            border: "none",
            borderRadius: 8,
            color: "#040C1A",
            fontWeight: 700,
            fontSize: 13,
            padding: "0 20px",
            cursor: loading || !question.trim() ? "not-allowed" : "pointer",
            opacity: loading || !question.trim() ? 0.6 : 1,
          }}
        >
          SEND
        </button>
      </div>
    </div>
  );
}
