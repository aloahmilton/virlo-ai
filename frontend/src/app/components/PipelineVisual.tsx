"use client";

const pipelineSteps = [
  { icon: "🔗", name: "Product URL", desc: "Any e-commerce link" },
  { icon: "🧠", name: "AI Research", desc: "4-agent script system" },
  { icon: "🎭", name: "Avatar Engine", desc: "Ultra-realistic talking head" },
  { icon: "🎬", name: "B-Roll Stitch", desc: "Cinematic 4K + Assembly" },
  { icon: "📱", name: "Final Video", desc: "TikTok/Reels-ready" },
];

const howSteps = [
  { icon: "🔗", title: "Paste your URL", desc: "Any product page — Shopify, Amazon, your own store. Virlo reads the product, extracts key benefits, and identifies pain points automatically." },
  { icon: "🧠", title: "AI writes & renders", desc: "Our Intelligence Core writes a platform-optimized script. The Avatar Engine renders a human speaker. The B-Roll Engine generates cinematic visuals. All automatic." },
  { icon: "📤", title: "Download & post", desc: "Get back a publish-ready MP4 with captions, music, and aspect ratio dialed in for your platform. Post it. Watch it perform." },
];

export function PipelineVisual() {
  return (
    <section id="how">
      {/* Pipeline flow */}
      <div style={{ fontSize: "11px", fontFamily: "Syne, sans-serif", fontWeight: 700, letterSpacing: "2px", color: "var(--muted)", textTransform: "uppercase", marginBottom: "1.25rem" }}>
        The pipeline
      </div>
      <div style={{ display: "flex", alignItems: "center", overflowX: "auto", padding: ".5rem 0", scrollbarWidth: "none" }}>
        {pipelineSteps.map((step, i) => (
          <div key={step.name} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <div style={{
              minWidth: "140px",
              background: "var(--card)", border: `1px solid ${i === 0 ? "var(--accent)" : "var(--border)"}`,
              borderRadius: "10px", padding: "1rem", textAlign: "center",
              cursor: "pointer", transition: "border-color .2s, transform .15s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = i === 0 ? "var(--accent)" : "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: ".4rem" }}>{step.icon}</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: ".8rem", fontWeight: 700 }}>{step.name}</div>
              <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "3px", lineHeight: 1.4 }}>{step.desc}</div>
            </div>
            {i < pipelineSteps.length - 1 && (
              <div style={{ color: "var(--dim)", fontSize: "1.1rem", padding: "0 .4rem", flexShrink: 0 }}>→</div>
            )}
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ marginTop: "3rem" }}>
        <div style={{ fontSize: "11px", fontFamily: "Syne, sans-serif", fontWeight: 700, letterSpacing: "2px", color: "var(--muted)", textTransform: "uppercase", marginBottom: "1.25rem" }}>
          How it works
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1px", background: "var(--border)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
          {howSteps.map((step, i) => (
            <div key={step.title} style={{ background: "var(--card)", padding: "2rem 1.5rem", position: "relative", transition: "background .2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--card)"; }}
            >
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "5rem", color: "var(--border)", position: "absolute", top: ".5rem", right: "1rem", lineHeight: 1, fontWeight: 800 }}>
                0{i + 1}
              </div>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{step.icon}</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: ".5rem" }}>{step.title}</h3>
              <p style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.55 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
