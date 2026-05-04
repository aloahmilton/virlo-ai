"use client";
import Link from "next/link";

const plans = [
  {
    tier: "Starter",
    price: "$49",
    sub: "per month",
    features: ["30 videos / month", "TikTok, Reels, Shorts", "5 avatar styles", "Script generation", "A/B hook testing"],
    na: ["Long-form video", "Brand voice memory", "Localization"],
    cta: "Get started",
    featured: false,
  },
  {
    tier: "Scale",
    price: "$149",
    sub: "per month",
    badge: "Most popular",
    features: ["Unlimited videos", "All platforms + 16:9", "40+ avatar styles", "Trend-aware scripts", "A/B testing (5 variants)", "Long-form up to 10 min", "Brand voice memory", "5 language markets"],
    na: [],
    cta: "Start 7-day free trial",
    featured: true,
  },
  {
    tier: "Enterprise",
    price: "Custom",
    sub: "let's talk",
    features: ["Unlimited everything", "Custom avatar cloning", "API access", "175+ languages", "Brand voice training", "Dedicated support", "White-label option", "SLA guarantee"],
    na: [],
    cta: "Book a demo",
    featured: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" style={{ padding: "2.5rem 0" }}>
      <div style={{ fontSize: "11px", fontFamily: "Syne, sans-serif", fontWeight: 700, letterSpacing: "2px", color: "var(--muted)", textTransform: "uppercase", marginBottom: "1rem" }}>
        Pricing
      </div>
      <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1px", textAlign: "center", marginBottom: "2.5rem" }}>
        Straightforward.<br />No surprises.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", maxWidth: "900px", margin: "0 auto" }}>
        {plans.map((plan) => (
          <div key={plan.tier} style={{
            border: `1px solid ${plan.featured ? "var(--accent)" : "var(--border)"}`,
            borderRadius: "16px",
            padding: "2rem",
            position: "relative",
            background: plan.featured ? "var(--surface)" : "transparent",
          }}>
            {plan.badge && (
              <div style={{
                position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                background: "var(--accent)", color: "#fff",
                fontSize: ".7rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase",
                padding: "4px 14px", borderRadius: "100px", whiteSpace: "nowrap",
                fontFamily: "Syne, sans-serif",
              }}>
                {plan.badge}
              </div>
            )}
            <div style={{ fontSize: ".75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "var(--muted)", marginBottom: ".75rem" }}>{plan.tier}</div>
            <div className="glitch" data-text={plan.price} style={{ fontFamily: "Syne, sans-serif", fontSize: "3rem", fontWeight: 800, lineHeight: 1, marginBottom: ".25rem", color: plan.featured ? "var(--accent)" : "var(--text)" }}>{plan.price}</div>
            <div style={{ fontSize: ".8rem", color: "var(--muted)", marginBottom: "1.5rem" }}>{plan.sub}</div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".6rem", marginBottom: "2rem" }}>
              {plan.features.map((f) => (
                <li key={f} style={{ fontSize: ".875rem", display: "flex", alignItems: "flex-start", gap: ".5rem" }}>
                  <span style={{ color: "var(--accent2)", fontWeight: 800, flexShrink: 0 }}>✓</span> {f}
                </li>
              ))}
              {plan.na.map((f) => (
                <li key={f} style={{ fontSize: ".875rem", display: "flex", alignItems: "flex-start", gap: ".5rem", color: "var(--dim)" }}>
                  <span style={{ flexShrink: 0 }}>—</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/generate" style={{
              display: "block", textAlign: "center",
              padding: ".75rem",
              border: plan.featured ? "none" : "1.5px solid var(--border)",
              borderRadius: "8px",
              fontSize: ".9rem", fontWeight: 800, textDecoration: "none",
              fontFamily: "Syne, sans-serif",
              background: plan.featured ? "var(--accent)" : "transparent",
              color: plan.featured ? "#fff" : "var(--text)",
              transition: "all .2s",
            }}>
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
