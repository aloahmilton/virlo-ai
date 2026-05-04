import { Metadata } from "next";

export const metadata: Metadata = {
  title: "A/B Testing | Virlo",
};

export default function AbTest() {
  const hooks = [
    { icon: "🤔", name: "Curiosity", quote: "You won't believe what this does to your skin...", color: "var(--accent)" },
    { icon: "😱", name: "Fear", quote: "Stop using that moisturizer until you see this", color: "var(--accent3)" },
    { icon: "✅", name: "Social Proof", quote: "3.2 million people switched to this serum", color: "var(--accent2)" },
    { icon: "✨", name: "Transformation", quote: "Before → After: 7 days with this product", color: "var(--accent)" },
    { icon: "🔥", name: "Controversy", quote: "Dermatologists hate that this actually works", color: "#ff9a00" },
  ];

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ fontSize: "11px", fontFamily: "Syne, sans-serif", fontWeight: 700, letterSpacing: "2px", color: "var(--accent)", textTransform: "uppercase", marginBottom: "1rem" }}>
        Performance Marketing
      </div>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "1.5rem" }}>
        A/B Hook Testing
      </h1>
      <p style={{ color: "var(--muted)", maxWidth: "600px", marginBottom: "3rem", fontSize: "1.05rem" }}>
        Stop guessing what converts. Virlo generates 5 distinct psychological hooks for the exact same video body. Deploy all 5. Kill the losers in 24 hours.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
        {hooks.map((h) => (
          <div key={h.name} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{h.icon}</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: h.color, marginBottom: ".5rem" }}>{h.name}</div>
            <div style={{ fontSize: ".8rem", color: "var(--muted)", fontStyle: "italic", lineHeight: 1.5 }}>"{h.quote}"</div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--card)", padding: "2rem", borderRadius: "16px", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: ".5rem" }}>Generate a hook test suite</h3>
          <p style={{ color: "var(--muted)", fontSize: ".9rem" }}>Requires an active product URL and a selected Avatar.</p>
        </div>
        <a href="/#generate" style={{ background: "var(--text)", color: "var(--bg)", padding: ".75rem 1.5rem", borderRadius: "8px", fontWeight: 700, textDecoration: "none" }}>
          Go to Generator
        </a>
      </div>
    </div>
  );
}
