"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletConnect from "@/components/WalletConnect";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/borrower", label: "Borrower" },
  { href: "/lender", label: "Lender" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/compare", label: "Compare" },
  { href: "/simulator", label: "Simulator" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/protocol-demo", label: "Oracle" },
  { href: "/protocol-models", label: "Models" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
      `}</style>

      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled ? "rgba(4, 12, 26, 0.92)" : "rgba(4, 12, 26, 0.7)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          borderBottom: `1px solid ${scrolled ? "#111C2E" : "transparent"}`,
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30,
              border: "1.5px solid #00E5FF",
              borderRadius: 7,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
              flexShrink: 0,
            }}>
              <div style={{
                width: 10, height: 10,
                border: "1.5px solid #00E5FF",
                borderRadius: "50%",
              }} />
              <div style={{
                position: "absolute",
                width: 4, height: 4,
                background: "#00E5FF",
                borderRadius: "50%",
                boxShadow: "0 0 6px #00E5FF",
              }} />
            </div>
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: "#E2E8F0",
              letterSpacing: 1.2,
              textTransform: "uppercase",
            }}>
              Credence
            </span>
          </Link>

          {/* Desktop nav links */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
            className="desktop-nav"
          >
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    fontWeight: active ? 600 : 500,
                    color: active ? "#00E5FF" : "#4A6080",
                    textDecoration: "none",
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: active ? "rgba(0, 229, 255, 0.08)" : "transparent",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                    letterSpacing: 0.3,
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side: wallet + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="desktop-only">
              <WalletConnect />
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="mobile-hamburger"
              aria-label="Toggle menu"
              style={{
                display: "none",
                background: "transparent",
                border: `1px solid #1A2740`,
                borderRadius: 8,
                padding: "6px 8px",
                cursor: "pointer",
                color: "#E2E8F0",
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div
            className="mobile-dropdown"
            style={{
              padding: "12px 24px 20px",
              borderTop: "1px solid #111C2E",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                    color: active ? "#00E5FF" : "#94A3B8",
                    textDecoration: "none",
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: active ? "rgba(0, 229, 255, 0.08)" : "transparent",
                    transition: "all 0.15s ease",
                  }}
                >
                  {label}
                </Link>
              );
            })}
            <div style={{ marginTop: 12 }}>
              <WalletConnect />
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (min-width: 900px) {
          .mobile-hamburger { display: none !important; }
          .mobile-dropdown { display: none !important; }
          .desktop-nav { display: flex !important; }
          .desktop-only { display: block !important; }
        }
        @media (max-width: 899px) {
          .desktop-nav { display: none !important; }
          .desktop-only { display: none !important; }
          .mobile-hamburger { display: block !important; }
        }
      `}</style>
    </>
  );
}