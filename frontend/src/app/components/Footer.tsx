"use client";

export function Footer() {
  return (
    <>
      {/* CTA Banner */}
      <section style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "20px",
        padding: "3rem 2rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        marginBottom: "2.5rem",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(124,92,252,0.08), transparent)",
          pointerEvents: "none",
        }} />
        <div style={{ fontSize: "11px", fontFamily: "Syne, sans-serif", fontWeight: 700, letterSpacing: "2px", color: "var(--accent2)", textTransform: "uppercase", marginBottom: "1rem" }}>
          Get started free
        </div>
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.05, marginBottom: "1rem" }}>
          Your first viral video<br />is 60 seconds{" "}
          <span className="glitch" data-text="away." style={{ color: "var(--accent)" }}>away.</span>
        </h2>
        <p style={{ color: "var(--muted)", margin: "0 auto 2rem", maxWidth: "480px" }}>
          No credit card. No editing software. No UGC creator agency fees.
        </p>
        <div style={{ display: "flex", gap: ".75rem", maxWidth: "480px", margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
          <input
            placeholder="Enter your email address"
            type="email"
            style={{
              flex: 1, minWidth: "200px",
              background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)",
              borderRadius: "8px", padding: ".75rem 1rem",
              color: "var(--text)", fontSize: ".9rem",
              fontFamily: "DM Sans, sans-serif", outline: "none",
            }}
          />
          <a href="#generate" style={{
            background: "var(--accent)", color: "#fff",
            padding: ".75rem 1.5rem", borderRadius: "8px",
            fontSize: ".9rem", fontWeight: 800, textDecoration: "none",
            fontFamily: "Syne, sans-serif", whiteSpace: "nowrap",
          }}>
            Create free account →
          </a>
        </div>
      </section>

      {/* Footer bar */}
      <footer style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "1rem", padding: "2rem 1.5rem",
        background: "#050505",
        color: "#ffffff",
        textShadow: "0 0 8px rgba(255,255,255,0.4)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px 16px 0 0",
        marginTop: "1rem"
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/logo.png" alt="Virlo Logo" style={{ height: "28px", objectFit: "contain", opacity: 0.9 }} />
        </a>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {[
            { label: "Privacy",      href: "/privacy",       external: false },
            { label: "Terms",        href: "/terms",         external: false },
            { label: "API Docs",     href: "/api-docs",      external: false },
            { label: "GitHub",       href: "https://github.com/virlo-ai", external: true },
            { label: "Twitter / X",  href: "https://x.com/virlo_ai",     external: true },
          ].map(({ label, href, external }) => (
            <a key={label} href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
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
                t.style.color = "#c0a3ff";
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
          ))}
        </div>
        <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,0.6)", textShadow: "none" }}>© 2025 Virlo. All rights reserved.</div>
      </footer>
    </>
  );
}
