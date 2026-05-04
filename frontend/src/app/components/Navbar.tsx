"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, User, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1rem 1.5rem",
      background: "#050505",
      color: "#ffffff",
      textShadow: "0 0 8px rgba(255,255,255,0.4)",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      marginBottom: "2.5rem",
      borderRadius: "0 0 16px 16px",
    }}>
      <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <img src="/logo.png" alt="Virlo Logo" style={{ height: "36px", objectFit: "contain" }} />
      </a>

      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        {(["Home", "API", "Pricing", "Long-form", "A/B Test", "Architecture"] as const).map((label, i) => {
          const href = ["/", "/api-docs", "/#pricing", "/long-form", "/ab-test", "/architecture"][i];
          return (
            <a key={href} href={href}
              style={{ 
                color: "#ffffff", 
                textDecoration: "none", 
                fontSize: "13px", 
                fontWeight: 600,
                cursor: "pointer", 
                transition: "all .3s",
                textShadow: "0 0 12px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.3)"
              }}
              onMouseEnter={(e) => { 
                const t = e.target as HTMLElement;
                t.style.color = "#c0a3ff"; // Clean light purple
                t.style.textShadow = "0 0 15px rgba(192,163,255,0.8), 0 0 30px rgba(192,163,255,0.4)";
              }}
              onMouseLeave={(e) => { 
                const t = e.target as HTMLElement;
                t.style.color = "#ffffff";
                t.style.textShadow = "0 0 12px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.3)";
              }}
            >
              {label}
            </a>
          );
        })}

        {/* Premium Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="theme-toggle"
            aria-label="Toggle theme"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            style={{
              position: "relative",
              width: "44px",
              height: "24px",
              borderRadius: "24px",
              border: "1px solid var(--border)",
              background: "var(--card)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "0 2px",
              transition: "background 0.3s, border-color 0.3s",
            }}
          >
            <div style={{
              position: "absolute",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "var(--accent)",
              transform: theme === "light" ? "translateX(0)" : "translateX(20px)",
              transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}>
              {theme === "light" ? <Sun size={10} strokeWidth={3} /> : <Moon size={10} strokeWidth={3} />}
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 4px", color: "var(--dim)" }}>
               <Sun size={12} strokeWidth={2} style={{ opacity: theme === "light" ? 0 : 1, transition: "opacity 0.3s" }}/>
               <Moon size={12} strokeWidth={2} style={{ opacity: theme === "dark" ? 0 : 1, transition: "opacity 0.3s" }}/>
            </div>
          </button>
        )}

        {/* User Menu */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.2)",
              background: user ? "var(--accent)" : "rgba(255,255,255,0.1)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.borderColor = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
            }}
          >
            {user ? (
              <User size={16} />
            ) : (
              <User size={16} />
            )}
          </button>

          {showUserMenu && (
            <div style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: "0.5rem",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "0.5rem",
              minWidth: "180px",
              zIndex: 1000,
              boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
            }}>
              {user ? (
                <>
                  <div style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid var(--border)",
                    fontSize: "0.9rem",
                    color: "var(--text)",
                    fontWeight: "600",
                  }}>
                    {user.email}
                  </div>
                  <Link
                    href="/generate"
                    style={{
                      display: "block",
                      padding: "0.75rem",
                      color: "var(--text)",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      borderRadius: "6px",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = "var(--surface)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = "transparent";
                    }}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={14} style={{ marginRight: "0.5rem", display: "inline" }} />
                    Generate Videos
                  </Link>
                  <button
                    onClick={handleSignOut}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "transparent",
                      border: "none",
                      color: "var(--text)",
                      fontSize: "0.9rem",
                      textAlign: "left",
                      cursor: "pointer",
                      borderRadius: "6px",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = "var(--surface)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <LogOut size={14} style={{ marginRight: "0.5rem", display: "inline" }} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    style={{
                      display: "block",
                      padding: "0.75rem",
                      color: "var(--text)",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      borderRadius: "6px",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = "var(--surface)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = "transparent";
                    }}
                    onClick={() => setShowUserMenu(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    style={{
                      display: "block",
                      padding: "0.75rem",
                      color: "var(--text)",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      borderRadius: "6px",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = "var(--surface)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = "transparent";
                    }}
                    onClick={() => setShowUserMenu(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        <span style={{
          background: theme === "dark" ? "rgba(0,229,192,0.1)" : "rgba(107,70,250,0.1)",
          color: "var(--accent2)",
          fontSize: "11px", padding: "3px 8px", borderRadius: "20px",
          border: "1px solid rgba(0,229,192,0.25)",
          fontFamily: "Syne, sans-serif", fontWeight: 700, letterSpacing: ".5px",
        }}>LIVE</span>
      </div>
    </nav>
  );
}
