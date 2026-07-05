"use client";

import { useState } from "react";
import API from "@/lib/api";

interface ProposalItem {
  proposal_id: string;
  title: string;
  type: string;
  status: string;
  submitted_by: string;
  created_at: string;
}

interface Props {
  initialProposals: ProposalItem[];
}

export default function PolicyGovernance({ initialProposals }: Props) {
  const [proposals, setProposals] = useState<ProposalItem[]>(initialProposals);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const createProposal = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const response = await API.post("/governance/proposals", {
        title: title.trim(),
        type: "ADAPTER"
      });
      setProposals((prev) => [...prev, response.data]);
      setTitle("");
      alert("Proposal submitted successfully!");
    } catch (err) {
      alert("Failed to submit proposal.");
    } finally {
      setLoading(false);
    }
  };

  const approveProposal = async (id: string) => {
    try {
      await API.post(`/governance/proposals/${id}/approve`);
      setProposals((prev) =>
        prev.map((p) => (p.proposal_id === id ? { ...p, status: "APPROVED" } : p))
      );
      alert("Proposal approved successfully.");
    } catch (err) {
      alert("Approval failed.");
    }
  };

  const executeProposal = async (id: string) => {
    try {
      await API.post(`/governance/proposals/${id}/execute`);
      setProposals((prev) =>
        prev.map((p) => (p.proposal_id === id ? { ...p, status: "EXECUTED" } : p))
      );
      alert("Proposal executed successfully.");
    } catch (err) {
      alert("Execution failed.");
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "EXECUTED") return "#34D399";
    if (status === "APPROVED") return "#00E5FF";
    return "#FFB830";
  };

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#00E5FF",
          letterSpacing: 2,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 16,
        }}
      >
        GOVERNANCE PROPOSALS MANAGEMENT
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Proposal Title..."
          style={{
            flex: 1,
            background: "#050B14",
            border: "1px solid #1D2E49",
            borderRadius: 8,
            padding: "8px 12px",
            color: "#E2E8F0",
            fontSize: 13,
            outline: "none",
          }}
        />
        <button
          onClick={createProposal}
          disabled={loading}
          style={{
            background: "#00E5FF",
            border: "none",
            borderRadius: 8,
            color: "#040C1A",
            fontWeight: 700,
            fontSize: 13,
            padding: "0 20px",
            cursor: "pointer",
          }}
        >
          {loading ? "SUBMITTING..." : "SUBMIT"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {proposals.map((p) => (
          <div
            key={p.proposal_id}
            style={{
              background: "#050B14",
              border: "1px solid #111C2E",
              borderRadius: 8,
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{p.title}</div>
              <span style={{ fontSize: 10, color: "#64748B", marginRight: 12 }}>ID: {p.proposal_id}</span>
              <span style={{ fontSize: 10, color: "#64748B" }}>By: {p.submitted_by.substring(0, 6)}...</span>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  color: getStatusColor(p.status),
                  background: `${getStatusColor(p.status)}1A`,
                  border: `1px solid ${getStatusColor(p.status)}`,
                  borderRadius: 4,
                  padding: "2px 6px",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {p.status}
              </span>

              {p.status === "UNDER_REVIEW" && (
                <button
                  onClick={() => approveProposal(p.proposal_id)}
                  style={{
                    background: "#00E5FF",
                    border: "none",
                    borderRadius: 4,
                    color: "#040C1A",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "4px 10px",
                    cursor: "pointer",
                  }}
                >
                  APPROVE
                </button>
              )}

              {p.status === "APPROVED" && (
                <button
                  onClick={() => executeProposal(p.proposal_id)}
                  style={{
                    background: "#34D399",
                    border: "none",
                    borderRadius: 4,
                    color: "#040C1A",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "4px 10px",
                    cursor: "pointer",
                  }}
                >
                  EXECUTE
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
