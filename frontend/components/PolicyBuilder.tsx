"use client";

import { useState } from "react";
import API from "@/lib/api";

interface Props {
  onSuccess: () => void;
}

export default function PolicyBuilder({ onSuccess }: Props) {
  const [name, setName] = useState("");
  const [protocol, setProtocol] = useState("LENDING");
  const [rules, setRules] = useState<any[]>([
    { field: "credit_score", operator: ">=", value: "600" }
  ]);
  const [loading, setLoading] = useState(false);

  const fieldOptions = [
    "credit_score",
    "trust_score",
    "risk_level",
    "passport_verified",
    "oracle_verified",
    "wallet_age",
    "default_probability",
    "max_ltv",
    "interest_rate",
    "coverage_limit",
    "asset_limit"
  ];

  const operatorOptions = [">", ">=", "<", "<=", "==", "!=", "contains"];

  const handleAddRule = () => {
    setRules([...rules, { field: "credit_score", operator: ">=", value: "600" }]);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleRuleChange = (index: number, key: string, value: any) => {
    const updated = [...rules];
    updated[index][key] = value;
    setRules(updated);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Policy name is required.");
      return;
    }
    if (rules.length === 0) {
      alert("At least one rule is required.");
      return;
    }

    setLoading(true);
    try {
      // Format rule values to float if numeric
      const formattedRules = rules.map((r) => {
        let val: any = r.value;
        if (r.value === "true") val = true;
        else if (r.value === "false") val = false;
        else if (!isNaN(Number(r.value)) && r.value.trim() !== "") {
          val = Number(r.value);
        }
        return {
          field: r.field,
          operator: r.operator,
          value: val
        };
      });

      await API.post("/policies", {
        policy_name: name,
        protocol: protocol,
        rules: formattedRules
      });

      alert("Policy created successfully!");
      setName("");
      setRules([{ field: "credit_score", operator: ">=", value: "600" }]);
      onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to create policy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#0A1425",
        border: "1px solid #111C2E",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#4A6080",
          letterSpacing: 1.5,
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: 20,
        }}
      >
        PROGRAMMABLE POLICY BUILDER
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Name input */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
              POLICY NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Institutional Lending Tier 1"
              style={{
                width: "100%",
                background: "#050B14",
                border: "1px solid #1D2E49",
                borderRadius: 8,
                padding: "10px 14px",
                color: "#E2E8F0",
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 6 }}>
              PROTOCOL DOMAIN
            </label>
            <select
              value={protocol}
              onChange={(e) => setProtocol(e.target.value)}
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
              {["LENDING", "INSURANCE", "RWA", "DAO", "INSTITUTIONAL"].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rules builder table */}
        <div>
          <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 8 }}>
            POLICY CRITERIA RULES
          </label>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rules.map((rule, idx) => (
              <div key={idx} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <select
                  value={rule.field}
                  onChange={(e) => handleRuleChange(idx, "field", e.target.value)}
                  style={{
                    flex: 2,
                    background: "#050B14",
                    border: "1px solid #1D2E49",
                    borderRadius: 8,
                    padding: "8px 10px",
                    color: "#E2E8F0",
                    fontSize: 12,
                    outline: "none",
                  }}
                >
                  {fieldOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                <select
                  value={rule.operator}
                  onChange={(e) => handleRuleChange(idx, "operator", e.target.value)}
                  style={{
                    flex: 1,
                    background: "#050B14",
                    border: "1px solid #1D2E49",
                    borderRadius: 8,
                    padding: "8px 8px",
                    color: "#E2E8F0",
                    fontSize: 12,
                    outline: "none",
                  }}
                >
                  {operatorOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={rule.value}
                  onChange={(e) => handleRuleChange(idx, "value", e.target.value)}
                  placeholder="Value"
                  style={{
                    flex: 2,
                    background: "#050B14",
                    border: "1px solid #1D2E49",
                    borderRadius: 8,
                    padding: "8px 10px",
                    color: "#E2E8F0",
                    fontSize: 12,
                    outline: "none",
                  }}
                />

                <button
                  onClick={() => handleRemoveRule(idx)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#FF4D6A",
                    fontSize: 16,
                    cursor: "pointer",
                    padding: "0 6px",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddRule}
            style={{
              background: "transparent",
              border: "1px dashed #1D2E49",
              borderRadius: 8,
              color: "#64748B",
              fontSize: 11,
              fontWeight: 600,
              padding: "8px 14px",
              marginTop: 12,
              cursor: "pointer",
              width: "100%",
            }}
          >
            + ADD CRITERIA RULE
          </button>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: "#00E5FF",
            border: "none",
            borderRadius: 8,
            color: "#040C1A",
            fontWeight: 700,
            fontSize: 14,
            padding: "12px 20px",
            marginTop: 12,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            width: "100%",
          }}
        >
          {loading ? "REGISTERING..." : "REGISTER CREDIT POLICY"}
        </button>
      </div>
    </div>
  );
}
