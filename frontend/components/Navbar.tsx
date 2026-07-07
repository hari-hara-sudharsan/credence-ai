"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletConnect from "@/components/WalletConnect";

const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/borrow", label: "Borrow" },
  { href: "/lend", label: "Lend" },
  { href: "/pool", label: "Pool" },
  { href: "/developers", label: "Developers" },
  { href: "/submission", label: "Docs" }
];

const ADVANCED_LINKS = [
  { href: "/trust-evolution", label: "Trust Identity Center" },
  { href: "/ecosystem", label: "Ecosystem & Marketplace" },
  { href: "/governance", label: "Governance & Oracle Admin" },
  { href: "/institution", label: "Institution CommandCenter" },
  { href: "/system", label: "System Status & Telemetry" },
  { href: "/developers", label: "Developer SDK Console" },
  { href: "/proof", label: "Judge Verification Suite" }
];



export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
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
              border: "1.5px solid #34D399",
              borderRadius: 7,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
              flexShrink: 0,
            }}>
              <div style={{
                width: 10, height: 10,
                border: "1.5px solid #34D399",
                borderRadius: "50%",
              }} />
              <div style={{
                position: "absolute",
                width: 4, height: 4,
                background: "#34D399",
                borderRadius: "50%",
                boxShadow: "0 0 6px #34D399",
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
              Credence AI
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
            {PRIMARY_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    fontWeight: active ? 600 : 500,
                    color: active ? "#34D399" : "#4A6080",
                    textDecoration: "none",
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: active ? "rgba(52, 211, 153, 0.08)" : "transparent",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                    letterSpacing: 0.3,
                  }}
                >
                  {label}
                </Link>
              );
            })}

            {/* Dropdown menu */}
            <div
              onMouseEnter={() => setAdvancedOpen(true)}
              onMouseLeave={() => setAdvancedOpen(false)}
              style={{ position: "relative" }}
            >
              <button
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#4A6080",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                More ▾
              </button>


              {advancedOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    background: "#0A1425",
                    border: "1px solid #111C2E",
                    borderRadius: 8,
                    padding: "8px 0",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    minWidth: 140,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {ADVANCED_LINKS.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 12,
                        color: "#94A3B8",
                        textDecoration: "none",
                        padding: "8px 16px",
                        transition: "all 0.15s ease",
                        display: "block",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#34D399")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
            {PRIMARY_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                    color: active ? "#34D399" : "#94A3B8",
                    textDecoration: "none",
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: active ? "rgba(52, 211, 153, 0.08)" : "transparent",
                    transition: "all 0.15s ease",
                  }}
                >
                  {label}
                </Link>
              );
            })}
            
            <div style={{ margin: "8px 12px", height: 1, background: "#111C2E" }} />
            
            {ADVANCED_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#64748B",
                  textDecoration: "none",
                  padding: "10px 12px",
                  borderRadius: 8,
                  transition: "all 0.15s ease",
                }}
              >
                {label}
              </Link>
            ))}

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