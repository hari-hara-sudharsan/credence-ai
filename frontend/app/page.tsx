"use client";

import { useState } from "react";
import API from "@/lib/api";
import WalletForm from "@/components/WalletForm";
import CreditCard from "@/components/CreditCard";
import ReportCard from "@/components/ReportCard";
import LendingCard from "@/components/LendingCard";
import RegistryCard from "@/components/RegistryCard";
import RiskCard from "@/components/RiskCard";

export default function Home() {
  const [credit, setCredit] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [lending, setLending] = useState<any>(null);
  const [registry, setRegistry] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async (wallet: string) => {
    setLoading(true);
    try {
      const [creditRes, reportRes, lendingRes, registryRes] = await Promise.all([
        API.post("/credit/score", { wallet }),
        API.post("/report/", { wallet }),
        API.post("/lending/decision", { wallet }),
        API.post("/oracle/refresh", { wallet }),
      ]);

      setCredit(creditRes.data);
      setReport(reportRes.data);
      setLending(lendingRes.data);
      setRegistry(registryRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const hasResults = credit || report || lending || registry;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

        :root {
          --void: #050B18;
          --surface: #0D1629;
          --surface-2: #111E36;
          --surface-3: #162240;
          --cyan: #00E5FF;
          --cyan-dim: #00B8CC;
          --cyan-faint: rgba(0, 229, 255, 0.08);
          --cyan-border: rgba(0, 229, 255, 0.2);
          --green: #39FF14;
          --green-dim: #2ECC11;
          --amber: #FFB800;
          --amber-dim: #CC9200;
          --red: #FF4444;
          --text-primary: #E8F4FF;
          --text-secondary: #7A99C0;
          --text-muted: #3D5578;
          --border: rgba(255, 255, 255, 0.06);
          --border-cyan: rgba(0, 229, 255, 0.15);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background-color: var(--void);
          color: var(--text-primary);
          font-family: 'Space Grotesk', sans-serif;
          min-height: 100vh;
        }

        .credence-root {
          background: var(--void);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        /* Ambient grid background */
        .credence-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }

        /* Top radial glow */
        .credence-root::after {
          content: '';
          position: fixed;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 600px;
          background: radial-gradient(ellipse at center, rgba(0, 229, 255, 0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .page-wrap {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 64px 32px 96px;
        }

        /* ── NAV BAR ── */
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 80px;
        }

        .logo-mark {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          border: 1.5px solid var(--cyan);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .logo-icon::before {
          content: '';
          width: 14px;
          height: 14px;
          border: 1.5px solid var(--cyan);
          border-radius: 50%;
          display: block;
        }

        .logo-icon::after {
          content: '';
          position: absolute;
          width: 6px;
          height: 6px;
          background: var(--cyan);
          border-radius: 50%;
        }

        .logo-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--text-primary);
          text-transform: uppercase;
        }

        .nav-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          color: var(--cyan);
          background: var(--cyan-faint);
          border: 1px solid var(--cyan-border);
          padding: 5px 12px;
          border-radius: 20px;
          letter-spacing: 0.06em;
        }

        /* ── HERO ── */
        .hero {
          margin-bottom: 72px;
          max-width: 800px;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          color: var(--cyan);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .hero-eyebrow::before {
          content: '';
          display: block;
          width: 24px;
          height: 1.5px;
          background: var(--cyan);
        }

        .hero-title {
          font-size: clamp(48px, 7vw, 80px);
          font-weight: 700;
          line-height: 1.0;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .hero-title .accent {
          color: var(--cyan);
          display: block;
        }

        .hero-subtitle {
          font-size: 18px;
          font-weight: 400;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 520px;
          margin-top: 20px;
        }

        /* ── WALLET FORM WRAPPER ── */
        .form-section {
          background: var(--surface);
          border: 1px solid var(--border-cyan);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 48px;
          position: relative;
          overflow: hidden;
        }

        .form-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--cyan), transparent);
        }

        .form-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          color: var(--cyan);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border-cyan);
        }

        /* ── LOADING STATE ── */
        .loading-bar {
          width: 100%;
          height: 2px;
          background: var(--border);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 32px;
        }

        .loading-bar-inner {
          height: 100%;
          width: 40%;
          background: linear-gradient(90deg, transparent, var(--cyan), transparent);
          border-radius: 2px;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(350%); }
        }

        .loading-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: var(--cyan);
          text-align: center;
          letter-spacing: 0.06em;
          animation: pulse 1.4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* ── DIVIDER ── */
        .section-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 48px 0 32px;
        }

        .section-divider span {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .section-divider::before,
        .section-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        /* ── RESULTS GRID ── */
        .results-grid {
          display: grid;
          gap: 20px;
        }

        .results-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 640px) {
          .results-row-2 { grid-template-columns: 1fr; }
          .page-wrap { padding: 40px 20px 64px; }
          .hero-title { font-size: 40px; }
        }

        /* ── CARD BASE (applied globally to all child cards via CSS cascade) ── */
        .results-grid > *,
        .results-row-2 > * {
          background: var(--surface) !important;
          border: 1px solid var(--border) !important;
          border-radius: 16px !important;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .results-grid > *:hover,
        .results-row-2 > *:hover {
          border-color: var(--border-cyan) !important;
          transform: translateY(-2px);
        }

        /* ── STAT PILLS ── */
        .stat-row {
          display: flex;
          gap: 12px;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }

        .stat-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 8px 16px;
        }

        .stat-pill-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 6px var(--green);
          animation: blink 2s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .stat-pill-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .stat-pill-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          color: var(--text-primary);
        }

        /* ── FOOTER ── */
        .footer {
          margin-top: 80px;
          padding-top: 32px;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-left {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 0.06em;
        }

        .footer-right {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--text-muted);
        }

        .footer-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 5px var(--green);
          animation: blink 2s ease-in-out infinite;
        }
      `}</style>

      <div className="credence-root">
        <div className="page-wrap">

          {/* NAV */}
          <nav className="topbar">
            <div className="logo-mark">
              <div className="logo-icon" />
              <span className="logo-text">Credence</span>
            </div>
            <span className="nav-badge">v1.0 · Mainnet Beta</span>
          </nav>

          {/* HERO */}
          <header className="hero">
            <div className="hero-eyebrow">On-Chain Credit Intelligence</div>
            <h1 className="hero-title">
              DeFi Credit
              <span className="accent">Reimagined.</span>
            </h1>
            <p className="hero-subtitle">
              Paste any wallet address and get a complete on-chain credit profile — score, risk, lending eligibility, and oracle registration — in seconds.
            </p>
          </header>

          {/* STAT PILLS */}
          <div className="stat-row">
            {[
              { label: "Network", value: "Ethereum Mainnet" },
              { label: "Oracle", value: "Chainlink" },
              { label: "Latency", value: "~1.2s" },
              { label: "Status", value: "Live" },
            ].map(({ label, value }) => (
              <div key={label} className="stat-pill">
                <div className="stat-pill-dot" />
                <span className="stat-pill-label">{label}:</span>
                <span className="stat-pill-value">{value}</span>
              </div>
            ))}
          </div>

          {/* WALLET INPUT */}
          <div className="form-section">
            <div className="form-label">Wallet Address</div>
            <WalletForm onAnalyze={analyze} />
          </div>

          {/* LOADING */}
          {loading && (
            <div style={{ marginBottom: 32 }}>
              <div className="loading-bar">
                <div className="loading-bar-inner" />
              </div>
              <p className="loading-text">Querying on-chain data...</p>
            </div>
          )}

          {/* RESULTS */}
          {hasResults && (
            <>
              <div className="section-divider">
                <span>Analysis Results</span>
              </div>

              <div className="results-grid">
                {(credit) && (
                  <div className="results-row-2">
                    {credit && (
                      <CreditCard
                        score={credit.credit_score}
                        rating={credit.rating}
                      />
                    )}
                    {credit && (
                      <RiskCard
                        probability={credit.probability_of_default}
                      />
                    )}
                  </div>
                )}

                {report && (
                  <ReportCard report={report.report} />
                )}

                {lending && (
                  <LendingCard lending={lending} />
                )}

                {registry && (
                  <RegistryCard txHash={registry.tx_hash} />
                )}
              </div>
            </>
          )}

          {/* FOOTER */}
          <footer className="footer">
            <span className="footer-left">© 2025 Credence AI · Built for DeFi</span>
            <div className="footer-right">
              <div className="footer-dot" />
              All systems operational
            </div>
          </footer>

        </div>
      </div>
    </>
  );
}