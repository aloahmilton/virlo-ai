"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, User, LogOut, Settings, Menu, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
  };

  const closeMenus = () => {
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "API", href: "/api-docs" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Long-form", href: "/long-form" },
    { label: "A/B Test", href: "/ab-test" },
    { label: "Architecture", href: "/architecture" },
  ];

  return (
    <>
      <style jsx>{`
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: #050505;
          color: #ffffff;
          text-shadow: 0 0 8px rgba(255,255,255,0.4);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 2.5rem;
          border-radius: 0 0 16px 16px;
          position: relative;
        }

        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          z-index: 1001;
        }

        .logo img {
          height: 36px;
          object-fit: contain;
        }

        .nav-right {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .nav-links {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .nav-link {
          color: #ffffff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all .3s;
          text-shadow: 0 0 12px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.3);
          white-space: nowrap;
        }

        .nav-link:hover {
          color: #c0a3ff;
          text-shadow: 0 0 15px rgba(192,163,255,0.8), 0 0 30px rgba(192,163,255,0.4);
        }

        .theme-toggle {
          position: relative;
          width: 44px;
          height: 24px;
          border-radius: 24px;
          border: 1px solid var(--border);
          background: var(--card);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0 2px;
          transition: background 0.3s, border-color 0.3s;
        }

        .theme-toggle-slider {
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--accent);
          transform: translateX(${theme === "light" ? "0" : "20px"});
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        .theme-icons {
          display: flex;
          justify-content: space-between;
          width: 100%;
          padding: 0 4px;
          color: var(--dim);
        }

        .user-menu-container {
          position: relative;
        }

        .user-button {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
          background: ${user ? "var(--accent)" : "rgba(255,255,255,0.1)"};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          transition: all 0.2s ease;
        }

        .user-button:hover {
          border-color: var(--accent);
        }

        .user-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 0.5rem;
          min-width: 180px;
          z-index: 1000;
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }

        .user-email {
          padding: 0.75rem;
          border-bottom: 1px solid var(--border);
          font-size: 0.9rem;
          color: var(--text);
          font-weight: 600;
        }

        .menu-item {
          display: block;
          padding: 0.75rem;
          color: var(--text);
          text-decoration: none;
          font-size: 0.9rem;
          border-radius: 6px;
          transition: background 0.2s ease;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .menu-item:hover {
          background: var(--surface);
        }

        .live-badge {
          background: ${theme === "dark" ? "rgba(0,229,192,0.1)" : "rgba(107,70,250,0.1)"};
          color: var(--accent2);
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 20px;
          border: 1px solid rgba(0,229,192,0.25);
          font-family: Syne, sans-serif;
          font-weight: 700;
          letter-spacing: .5px;
        }

        /* Mobile Menu Button */
        .mobile-menu-button {
          display: none;
          width: 36px;
          height: 36px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          transition: all 0.2s ease;
        }

        .mobile-menu-button:hover {
          border-color: var(--accent);
        }

        /* Mobile Menu Overlay */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          z-index: 999;
          display: ${isMobileMenuOpen ? 'block' : 'none'};
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          width: 280px;
          height: 100vh;
          background: var(--card);
          border-left: 1px solid var(--border);
          padding: 2rem 1.5rem;
          z-index: 1000;
          transform: translateX(${isMobileMenuOpen ? '0' : '100%'});
          transition: transform 0.3s ease;
          overflow-y: auto;
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-nav-link {
          display: block;
          padding: 1rem;
          color: var(--text);
          text-decoration: none;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .mobile-nav-link:hover {
          background: var(--surface);
          border-color: var(--border);
        }

        .mobile-user-section {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .navbar {
            padding: 1rem;
          }

          .nav-links {
            display: none;
          }

          .mobile-menu-button {
            display: flex;
          }

          .nav-right {
            gap: 1rem;
          }

          .live-badge {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .navbar {
            padding: 0.75rem 1rem;
          }

          .logo img {
            height: 32px;
          }

          .user-button {
            width: 32px;
            height: 32px;
          }

          .theme-toggle {
            width: 40px;
            height: 22px;
          }

          .theme-toggle-slider {
            width: 16px;
            height: 16px;
            transform: translateX(${theme === "light" ? "0" : "18px"});
          }
        }
      `}</style>

      <nav className="navbar navbar-mobile">
        <Link href="/" className="logo" onClick={closeMenus}>
          <img src="/logo.png" alt="Virlo Logo" />
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="nav-right">
          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="theme-toggle"
              aria-label="Toggle theme"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              <div className="theme-toggle-slider">
                {theme === "light" ? <Sun size={10} strokeWidth={3} /> : <Moon size={10} strokeWidth={3} />}
              </div>
              <div className="theme-icons">
                <Sun size={12} strokeWidth={2} style={{ opacity: theme === "light" ? 0 : 1, transition: "opacity 0.3s" }}/>
                <Moon size={12} strokeWidth={2} style={{ opacity: theme === "dark" ? 0 : 1, transition: "opacity 0.3s" }}/>
              </div>
            </button>
          )}

          {/* User Menu */}
          <div className="user-menu-container">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="user-button"
              aria-label="User menu"
            >
              <User size={16} />
            </button>

            {showUserMenu && (
              <div className="user-menu">
                {user ? (
                  <>
                    <div className="user-email">{user.email}</div>
                    <Link href="/generate" className="menu-item" onClick={closeMenus}>
                      <Settings size={14} style={{ marginRight: "0.5rem", display: "inline" }} />
                      Generate Videos
                    </Link>
                    <button onClick={handleSignOut} className="menu-item">
                      <LogOut size={14} style={{ marginRight: "0.5rem", display: "inline" }} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="menu-item" onClick={closeMenus}>
                      Sign In
                    </Link>
                    <Link href="/auth/signup" className="menu-item" onClick={closeMenus}>
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <span className="live-badge">LIVE</span>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div className="mobile-menu">
        <div className="mobile-menu-header">
          <h3 style={{ margin: 0, color: 'var(--text)' }}>Menu</h3>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text)',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="mobile-nav-links">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-nav-link"
              onClick={closeMenus}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile User Section */}
        <div className="mobile-user-section">
          {user ? (
            <>
              <div style={{
                padding: '1rem',
                background: 'var(--surface)',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                color: 'var(--text)'
              }}>
                <strong>{user.email}</strong>
              </div>
              <Link href="/generate" className="mobile-nav-link" onClick={closeMenus}>
                <Settings size={16} style={{ marginRight: "0.5rem", display: "inline" }} />
                Generate Videos
              </Link>
              <button onClick={handleSignOut} className="mobile-nav-link" style={{ border: 'none', background: 'transparent' }}>
                <LogOut size={16} style={{ marginRight: "0.5rem", display: "inline" }} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="mobile-nav-link" onClick={closeMenus}>
                Sign In
              </Link>
              <Link href="/auth/signup" className="mobile-nav-link" onClick={closeMenus}>
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}"use client";

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
