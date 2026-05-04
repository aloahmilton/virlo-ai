"use client";

import { Navbar } from "../components/Navbar";
import { VideoGenerator } from "../components/VideoGenerator";
import { Footer } from "../components/Footer";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

const steps = [
  { number: 1, title: "Choose Input", description: "Paste a product URL, drag content, or upload a video" },
  { number: 2, title: "Configure", description: "Select platform, tone, and duration settings" },
  { number: 3, title: "Generate", description: "AI creates script, avatar, and cinematic B-roll" },
  { number: 4, title: "Download", description: "Get your viral-ready video in under 60 seconds" },
];

export default function Generate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)', marginBottom: '1rem', fontFamily: 'Syne, sans-serif' }}>
            Sign In Required
          </h1>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '1rem' }}>
            You need to be signed in to generate videos. Create a free account to get started.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/auth/login" style={{
              background: 'var(--accent)',
              color: '#fff',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              fontFamily: 'Syne, sans-serif',
            }}>
              Sign In
            </Link>
            <Link href="/auth/signup" style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              fontFamily: 'Syne, sans-serif',
            }}>
              Create Account
            </Link>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <Navbar />

      {/* Step indicator */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "11px", fontFamily: "Syne, sans-serif", fontWeight: 700, letterSpacing: "2px", color: "var(--muted)", textTransform: "uppercase", marginBottom: "1rem" }}>
          Video Generation Process
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {steps.map((step, index) => (
            <div key={step.number} style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "1rem",
              textAlign: "center",
              position: "relative",
            }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: index === 0 ? "var(--accent)" : "var(--border)",
                color: index === 0 ? "#fff" : "var(--muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: 700,
                margin: "0 auto 0.5rem",
                fontFamily: "Syne, sans-serif",
              }}>
                {step.number}
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginBottom: "0.25rem" }}>
                {step.title}
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.4 }}>
                {step.description}
              </div>
              {index < steps.length - 1 && (
                <div style={{
                  position: "absolute",
                  right: "-8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "16px",
                  height: "2px",
                  background: "var(--border)",
                  display: "none", // Hide on mobile, show on larger screens
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <section>
        <VideoGenerator />
      </section>

      <Footer />
    </main>
  );
}