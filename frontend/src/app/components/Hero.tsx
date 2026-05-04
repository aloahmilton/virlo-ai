"use client";
import Link from "next/link";
import { LightningCanvas } from "./LightningCanvas";

const stats = [
  { num: "47s", label: "Average generation time", trend: "+12% faster" },
  { num: "180+", label: "Languages supported", trend: "Global reach" },
  { num: "∞", label: "Video length possible", trend: "No limits" },
  { num: "15+", label: "AI models integrated", trend: "Best in class" },
];

export function Hero() {
  return (
    <section id="how" style={{ padding: "3rem 0 2rem", position: "relative", overflow: "hidden" }}>

      {/* Live lightning canvas — behind everything */}
      <LightningCanvas />

      {/* All content above canvas */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Live ticker */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: ".5rem",
          background: "var(--surface)", border: "1px solid var(--border)",
          padding: ".35rem .85rem", borderRadius: "100px",
          fontSize: ".75rem", fontWeight: 700, letterSpacing: ".5px",
          textTransform: "uppercase", marginBottom: "2rem",
          fontFamily: "Syne, sans-serif",
        }}>
          <span style={{
            width: "7px", height: "7px", background: "#a78bfa",
            borderRadius: "50%", display: "inline-block",
            animation: "pulse-dot 1.5s infinite",
          }} />
          <span style={{ color: "var(--muted)" }}>Live — 2,847 videos generated today</span>
        </div>

        {/* Headline with real glitch */}
        <h1 style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 800, lineHeight: .95, letterSpacing: "-3px", marginBottom: "0" }}>
          <span className="glitch" data-text="URL TO VIRAL">URL TO VIRAL</span><br />
          <span className="glitch" data-text="VIDEO." style={{ color: "var(--accent)" }}>VIDEO.</span><br />
          <span className="glitch" data-text="IN 60 SECONDS." style={{
            background: "linear-gradient(90deg, #c0a3ff, #ffffff)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>IN 60 SECONDS.</span>
        </h1>

        {/* Sub + CTA row */}
        <div className="hero-content" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem", marginTop: "2.5rem" }}>
          <p style={{ maxWidth: "440px", fontSize: "1.05rem", fontWeight: 400, color: "var(--muted)", lineHeight: 1.6 }}>
            Transform any product URL into viral UGC videos in under a minute. <strong style={{ color: "var(--text)", fontWeight: 700 }}>Our AI analyzes your product, writes compelling scripts, selects perfect avatars, and renders cinematic B-roll</strong> — all automatically optimized for engagement.
          </p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1rem" }}>
            <Link href="/generate" style={{
              background: "var(--accent)", color: "#fff",
              padding: ".85rem 2rem", borderRadius: "8px",
              fontSize: "1rem", fontWeight: 800, textDecoration: "none",
              fontFamily: "Syne, sans-serif", letterSpacing: "-.3px",
              transition: "transform .15s, box-shadow .15s",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(124,92,252,0.4)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              Start Creating Free →
            </Link>
            <span style={{ fontSize: ".8rem", color: "var(--muted)" }}>No credit card · 3 free videos · Cancel anytime</span>
          </div>
        </div>

        {/* Stats */}
        <div className="hero-stats" style={{ display: "flex", gap: "3rem", marginTop: "4rem", paddingTop: "2.5rem", borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
          {stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "2.8rem", fontWeight: 800, lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: ".8rem", fontWeight: 500, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".5px", marginTop: ".2rem" }}>{s.label}</div>
              <div style={{ fontSize: ".7rem", color: "var(--accent2)", fontWeight: 600, marginTop: ".1rem" }}>{s.trend}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
