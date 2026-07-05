"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import GovernanceDashboard from "@/components/GovernanceDashboard";
import OracleManagement from "@/components/OracleManagement";
import RoleManagement from "@/components/RoleManagement";
import PolicyGovernance from "@/components/PolicyGovernance";
import EmergencyControls from "@/components/EmergencyControls";
import AuditTimeline from "@/components/AuditTimeline";

export default function GovernancePage() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const loadGovernanceData = async () => {
    setLoading(true);
    try {
      const [dResp, rResp, pResp, aResp] = await Promise.all([
        API.get("/governance/dashboard"),
        API.get("/governance/roles"),
        API.get("/governance/proposals"),
        API.get("/governance/audit")
      ]);

      setDashboard(dResp.data);
      setRoles(rResp.data || []);
      setProposals(pResp.data || []);
      setAuditLogs(aResp.data || []);
    } catch (err) {
      console.error("Governance dashboard load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGovernanceData();
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
          <span>SECURE GOVERNANCE LAYER</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4A6080" }} />
          <span>TRUST ADMINISTRATION</span>
        </div>

        {/* Hero Section */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#E2E8F0",
              letterSpacing: -1,
              marginBottom: 12,
            }}
          >
            Governance & Trust Administration
          </h1>
          <p style={{ fontSize: 18, color: "#64748B", margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
            Securely manage oracle operators, credential policies, RBAC access, proposals lifecycles, and on-chain proofs.
          </p>
        </div>

        {loading ? (
          <div style={{ color: "#64748B", textAlign: "center", padding: "100px 0" }}>
            CONSOLIDATING SYSTEM STATUS REGISTRIES...
          </div>
        ) : (
          dashboard && (
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              
              {/* Dashboard Overview stats */}
              <GovernanceDashboard
                activeOracles={dashboard.active_oracles}
                pendingPolicies={dashboard.pending_policies}
                activePassports={dashboard.active_passports}
                revokedPassports={dashboard.revoked_passports}
                auditEvents={dashboard.audit_events_today}
                status={dashboard.system_status}
              />

              {/* Row 1: Oracle and RBAC management */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32 }}>
                <OracleManagement />
                <RoleManagement roles={roles} />
              </div>

              {/* Row 2: Proposals and emergency buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32 }}>
                <PolicyGovernance initialProposals={proposals} />
                <EmergencyControls />
              </div>

              {/* Row 3: Audit Timelines */}
              <AuditTimeline logs={auditLogs} />

            </div>
          )
        )}

      </div>
    </main>
  );
}
