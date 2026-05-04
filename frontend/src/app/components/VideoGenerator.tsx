"use client";

import { useState } from "react";

const steps = [
  { id: "ps1", label: "1. AI Research", pct: 25, msg: "Intelligence Core is researching your product URL..." },
  { id: "ps2", label: "2. Avatar", pct: 50, msg: "Selecting best avatar for your audience..." },
  { id: "ps3", label: "3. Render", pct: 75, msg: "Queuing ultra-realistic render..." },
  { id: "ps4", label: "4. Queue", pct: 100, msg: "Video queued! Polling for completion..." },
];

interface ScriptData {
  hook: string;
  problem: string;
  solution: string;
  proof: string;
  cta: string;
  fullScript: string;
  estimatedDuration: string;
  hashtags: string[];
}

interface Result {
  videoId: string;
  scriptData: ScriptData;
  status: string;
  estimatedReadyIn: string;
}

export function VideoGenerator() {
  const [url, setUrl] = useState("https://example.com/product/super-serum");
  const [platform, setPlatform] = useState("tiktok");
  const [tone, setTone] = useState("casual");
  const [duration, setDuration] = useState("30");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!url) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setCurrentStep(0);

    try {
      // Animate progress steps while API call runs
      const progressInterval = setInterval(() => {
        setCurrentStep((prev) => (prev < steps.length - 2 ? prev + 1 : prev));
      }, 900);

      const res = await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productUrl: url, platform, tone, duration: parseInt(duration) }),
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "API request failed");
      }

      const { jobId } = await res.json();
      setCurrentStep(steps.length - 1);

      // Poll Redis job status every 5s
      const poll = setInterval(async () => {
        const statusRes = await fetch(`/api/video/job/${jobId}`);
        const { data: job } = await statusRes.json();
        if (job?.status === "completed") {
          clearInterval(poll);
          setResult(job.result);
          setLoading(false);
        } else if (job?.status === "failed") {
          clearInterval(poll);
          setError(job.error || "Job failed");
          setLoading(false);
        }
      }, 5000);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }


  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "1.5rem",
        marginTop: "2rem",
      }}
    >
      <div style={{ fontSize: "11px", fontFamily: "Syne, sans-serif", fontWeight: 700, letterSpacing: "2px", color: "var(--muted)", textTransform: "uppercase", marginBottom: "1rem" }}>
        Live demo — paste a product URL and generate
      </div>

      {/* URL input */}
      <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yourproduct.com/item/..."
          style={{
            flex: 1,
            minWidth: "200px",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: ".6rem 1rem",
            color: "var(--text)",
            fontSize: ".9rem",
            fontFamily: "DM Sans, sans-serif",
            outline: "none",
          }}
        />
        <button
          onClick={generate}
          disabled={loading}
          style={{
            background: loading ? "var(--dim)" : "var(--accent)",
            color: "#fff",
            padding: ".65rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: ".9rem",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "opacity .2s",
          }}
        >
          {loading ? "Generating..." : "Generate video →"}
        </button>
      </div>

      {/* Selects */}
      <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", marginTop: ".75rem" }}>
        {[
          { id: "platform", value: platform, setter: setPlatform, options: [["tiktok", "TikTok (9:16)"], ["instagram", "Instagram Reels"], ["youtube", "YouTube Shorts"]] },
          { id: "tone", value: tone, setter: setTone, options: [["casual", "Casual"], ["energetic", "Energetic"], ["professional", "Professional"]] },
          { id: "duration", value: duration, setter: setDuration, options: [["30", "30s"], ["60", "60s"], ["120", "2 min"]] },
        ].map(({ id, value, setter, options }) => (
          <select
            key={id}
            value={value}
            onChange={(e) => setter(e.target.value)}
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: ".5rem .85rem",
              color: "var(--muted)",
              fontSize: ".85rem",
              fontFamily: "DM Sans, sans-serif",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {options.map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        ))}
      </div>

      {/* Progress */}
      {loading && (
        <div style={{ marginTop: "1.25rem" }}>
          <div style={{ display: "flex", gap: 0, marginBottom: "1rem" }}>
            {steps.map((step, i) => (
              <div
                key={step.id}
                style={{
                  flex: 1,
                  padding: ".5rem",
                  textAlign: "center",
                  fontSize: "11px",
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  borderBottom: `2px solid ${i < currentStep ? "var(--accent2)" : i === currentStep ? "var(--accent)" : "var(--dim)"}`,
                  color: i < currentStep ? "var(--accent2)" : i === currentStep ? "var(--accent)" : "var(--muted)",
                  transition: "all .3s",
                }}
              >
                {step.label}
              </div>
            ))}
          </div>
          <div style={{ background: "var(--bg)", borderRadius: "4px", height: "4px", overflow: "hidden" }}>
            <div
              style={{
                height: "4px",
                background: "linear-gradient(90deg, var(--accent), var(--accent2))",
                borderRadius: "4px",
                width: `${steps[Math.max(0, currentStep)]?.pct ?? 0}%`,
                transition: "width .6s ease",
              }}
            />
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: ".6rem", fontStyle: "italic" }}>
            {steps[currentStep]?.msg ?? "Initializing..."}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ marginTop: "1rem", background: "rgba(255,92,135,0.1)", border: "1px solid rgba(255,92,135,0.3)", borderRadius: "8px", padding: "1rem", color: "var(--accent3)", fontSize: ".85rem" }}>
          ⚠ {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ background: "var(--bg)", border: "1px solid rgba(124,92,252,0.25)", borderRadius: "12px", padding: "1.25rem", marginTop: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: ".9rem" }}>Generated Script</span>
            <span style={{ fontSize: "11px", fontFamily: "Syne, sans-serif", fontWeight: 700, background: "rgba(0,229,192,0.08)", color: "var(--accent2)", padding: "3px 10px", borderRadius: "20px", border: "1px solid rgba(0,229,192,0.2)" }}>
              QUEUED — {result.estimatedReadyIn}
            </span>
          </div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem", fontSize: ".85rem", lineHeight: 1.7, color: "var(--muted)" }}>
            <strong style={{ color: "var(--text)" }}>Hook:</strong> {result.scriptData?.hook}<br /><br />
            <strong style={{ color: "var(--text)" }}>Problem:</strong> {result.scriptData?.problem}<br /><br />
            <strong style={{ color: "var(--text)" }}>Solution:</strong> {result.scriptData?.solution}<br /><br />
            <strong style={{ color: "var(--text)" }}>CTA:</strong> {result.scriptData?.cta}
          </div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
            {[
              ["Platform", platform],
              ["Duration", `${duration}s`],
              ["Tone", tone],
              ["Video ID", result.videoId?.slice(0, 8) + "..."],
            ].map(([label, val]) => (
              <span key={label} style={{ fontSize: "11px", color: "var(--muted)", background: "var(--surface)", padding: "4px 10px", borderRadius: "20px", border: "1px solid var(--border)" }}>
                {label}: <span style={{ color: "var(--text)", fontWeight: 500 }}>{val}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
