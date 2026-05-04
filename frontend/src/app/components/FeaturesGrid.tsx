"use client";

import { useState } from "react";

const features = [
  {
    icon: "🧠", title: "Trend-aware scripts", desc: "Our Intelligence Engine scans real-time social data to write hooks that reference what's trending today. Your ads feel current, never canned.",
    tag: "SMART AI", tagBg: "rgba(124,92,252,0.2)", tagColor: "#a78bfa",
  },
  {
    icon: "🎬", title: "Infinite-length video", desc: "Our proprietary Scene-by-Scene rendering plus seamless stitching equals zero quality cap. A 10-minute documentary looks as crisp as a 30-second ad.",
    tag: "NATIVE 4K", tagBg: "rgba(255,154,0,0.15)", tagColor: "#ff9a00",
  },
  {
    icon: "⚗️", title: "5-variant A/B testing", desc: "Provide one product link. We generate 5 distinct hooks (curiosity, fear, social proof, etc.) and render them in parallel. Post the winners, kill the losers.",
    tag: "PERFORMANCE", tagBg: "rgba(124,92,252,0.2)", tagColor: "#a78bfa",
  },
  {
    icon: "🌍", title: "175+ language rollout", desc: "Not just translation — true cultural adaptation. We rewrite idioms for each market and auto-sync the lip movements. Go global with one click.",
    tag: "HYPER-LOCAL", tagBg: "rgba(255,92,135,0.15)", tagColor: "#ff8fab",
  },
  {
    icon: "🎭", title: "Cinematic B-Roll", desc: "Our video engine dynamically selects the optimal generation model per scene to ensure the highest visual fidelity and consistency for your product.",
    tag: "STUDIO QUALITY", tagBg: "rgba(0,229,192,0.15)", tagColor: "#00e5c0",
  },
  {
    icon: "🗣️", title: "Brand voice memory", desc: "Feed Virlo your past content and it learns your exact tone, vocabulary, and brand guidelines. Every new video sounds authentically like you.",
    tag: "CUSTOM TONE", tagBg: "rgba(124,92,252,0.2)", tagColor: "#a78bfa",
  },
];

export function FeaturesGrid() {
  const [activeSparkIndex, setActiveSparkIndex] = useState<number | null>(null);

  const handleSparkClick = (index: number) => {
    setActiveSparkIndex(index);
    setTimeout(() => {
      setActiveSparkIndex(null);
    }, 1500); // Spark stays visible for 1.5s after click
  };

  return (
    <section id="features" style={{ background: "var(--surface)", borderRadius: "20px", padding: "2.5rem", margin: "0 -0rem" }}>
      <div style={{ fontSize: "11px", fontFamily: "Syne, sans-serif", fontWeight: 700, letterSpacing: "2px", color: "var(--accent2)", textTransform: "uppercase", marginBottom: "1rem" }}>
        What&apos;s inside
      </div>
      <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1px", marginBottom: ".75rem" }}>
        Everything you need<br />to dominate your feed.
      </h2>
      <p style={{ color: "var(--muted)", fontSize: "1rem", maxWidth: "480px", marginBottom: "2.5rem", lineHeight: 1.6 }}>
        One unified platform. Our engine handles the scripting, the hyper-realistic avatars, the cinematic B-roll, and the final cut. You just post.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
        {features.map((f, index) => {
          // Every 2nd card gets the spark effect, others get glitch
          const isSpark = index % 2 !== 0;
          const isActive = activeSparkIndex === index;
          
          return (
            <div key={f.title}
              className={isSpark ? `spark-card ${isActive ? 'active-spark' : ''}` : "glitch-active"}
              onClick={() => isSpark && handleSparkClick(index)}
              style={{
                borderRadius: "14px", padding: "1.75rem",
                border: isSpark ? "none" : "1px solid var(--border)",
                background: isSpark ? "transparent" : "var(--card)",
                transition: "border-color .2s, background .2s", cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isSpark) {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.background = "var(--surface)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSpark) {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = "var(--card)";
                }
              }}
            >
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ fontSize: "1.4rem", marginBottom: ".75rem" }}>{f.icon}</div>
                <span style={{ display: "inline-block", fontSize: ".7rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "4px", marginBottom: ".75rem", background: f.tagBg, color: f.tagColor }}>
                  {f.tag}
                </span>
                {/* Glitch on A/B testing (index 2) and Infinite video (index 1) — highest value features */}
                {(index === 1 || index === 2) ? (
                  <h3 className="glitch" data-text={f.title} style={{ fontSize: "1rem", fontWeight: 700, marginBottom: ".5rem" }}>{f.title}</h3>
                ) : (
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: ".5rem" }}>{f.title}</h3>
                )}
                <p style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.55 }}>{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
