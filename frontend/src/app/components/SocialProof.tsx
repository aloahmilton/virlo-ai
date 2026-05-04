const testimonials = [
  {
    stars: 5,
    text: "We used to spend $3k per video on UGC creators. Virlo gives us the same quality in 60 seconds for a fraction of the cost. We're now posting 5 videos a day.",
    name: "Sara Kim", role: "Head of Growth, Luminary Skincare",
    initials: "SK", avatarBg: "rgba(255,61,0,0.15)", avatarColor: "#ff6b35",
  },
  {
    stars: 5,
    text: "The A/B hook feature alone paid for our annual plan in week one. We found our winning angle for Q4 in 24 hours instead of 3 weeks.",
    name: "James Monroe", role: "Performance Marketing, DTC Athletics",
    initials: "JM", avatarBg: "rgba(0,229,192,0.15)", avatarColor: "#00e5c0",
  },
  {
    stars: 5,
    text: "We launched in 8 new markets in one afternoon. The Intelligence Core rewrote the script culturally for each country — and the Avatar Engine re-synced the lips perfectly. It was genuinely unreal.",
    name: "Adaeze Obi", role: "CMO, Prosper Foods",
    initials: "AO", avatarBg: "rgba(124,92,252,0.15)", avatarColor: "#a78bfa",
  },
];

export function SocialProof() {
  return (
    <section style={{ padding: "2.5rem 0" }}>
      <div style={{ fontSize: "11px", fontFamily: "Syne, sans-serif", fontWeight: 700, letterSpacing: "2px", color: "var(--muted)", textTransform: "uppercase", marginBottom: "1.25rem" }}>
        Real results
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>

        {/* Big metric */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div className="glitch" data-text="14×" style={{ fontFamily: "Syne, sans-serif", fontSize: "4.5rem", fontWeight: 800, lineHeight: 1, color: "var(--accent)" }}>14×</div>
          <div style={{ fontSize: ".875rem", color: "var(--muted)", marginTop: ".5rem", lineHeight: 1.5 }}>
            Average ROAS improvement within 30 days of switching from manual UGC production
          </div>
        </div>

        {/* Testimonials */}
        {testimonials.map((t) => (
          <div key={t.name} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ color: "#f59e0b", fontSize: ".9rem", marginBottom: ".75rem" }}>{"★".repeat(t.stars)}</div>
            <p style={{ fontSize: ".9rem", fontWeight: 500, lineHeight: 1.6, marginBottom: "1rem", color: "var(--text)" }}>&ldquo;{t.text}&rdquo;</p>
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: t.avatarBg, color: t.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".8rem", fontWeight: 800, flexShrink: 0 }}>
                {t.initials}
              </div>
              <div>
                <div style={{ fontSize: ".85rem", fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: ".75rem", color: "var(--muted)" }}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
