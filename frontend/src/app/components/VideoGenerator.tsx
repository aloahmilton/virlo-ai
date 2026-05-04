"use client";

import { useState, useRef, DragEvent } from "react";

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

type InputMode = 'url' | 'drag-drop' | 'upload';

export function VideoGenerator() {
  const [url, setUrl] = useState("https://example.com/product/super-serum");
  const [platform, setPlatform] = useState("tiktok");
  const [tone, setTone] = useState("casual");
  const [duration, setDuration] = useState("30");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>('url');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentWizardStep, setCurrentWizardStep] = useState(1);
  const [isExpanded, setIsExpanded] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const text = e.dataTransfer.getData('text');

    if (text && text.startsWith('http')) {
      setUrl(text);
      setInputMode('url');
      setIsExpanded(true);
    } else if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        setUploadedFile(file);
        setInputMode('upload');
        setIsExpanded(true);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setUploadedFile(file);
      setInputMode('upload');
      setIsExpanded(true);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const nextStep = () => {
    if (currentWizardStep < 3) {
      setCurrentWizardStep(currentWizardStep + 1);
    }
  };

  const prevStep = () => {
    if (currentWizardStep > 1) {
      setCurrentWizardStep(currentWizardStep - 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentWizardStep) {
      case 1:
        return inputMode === 'url' ? url.trim() !== '' : inputMode === 'upload' ? uploadedFile !== null : true;
      case 2:
        return true; // Settings always valid
      case 3:
        return !loading;
      default:
        return false;
    }
  };


  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "1.5rem",
        marginTop: "2rem",
        transition: "all 0.3s ease",
        overflow: "hidden",
      }}
    >
      {/* Header with wizard steps */}
      <div style={{ marginBottom: isExpanded ? "1.5rem" : "0" }}>
        <div style={{ fontSize: "11px", fontFamily: "Syne, sans-serif", fontWeight: 700, letterSpacing: "2px", color: "var(--muted)", textTransform: "uppercase", marginBottom: "1rem" }}>
          Step {currentWizardStep} of 3: {
            currentWizardStep === 1 ? "Choose Your Input" :
            currentWizardStep === 2 ? "Configure Settings" :
            "Generate Video"
          }
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              style={{
                flex: 1,
                height: "4px",
                background: step <= currentWizardStep ? "var(--accent)" : "var(--border)",
                borderRadius: "2px",
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Wizard content */}
      <div>
        {/* Step 1: Input Selection */}
        {currentWizardStep === 1 && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            {/* Input mode selector */}
            <div className="input-mode-selector" style={{ display: "flex", gap: ".5rem", marginBottom: "1.5rem" }}>
              {[
                { mode: 'url' as InputMode, label: 'Product URL', icon: '🔗', desc: 'Paste any product link' },
                { mode: 'drag-drop' as InputMode, label: 'Drag & Drop', icon: '📎', desc: 'Drop URL or content' },
                { mode: 'upload' as InputMode, label: 'Upload Video', icon: '📁', desc: 'Use your own footage' },
              ].map(({ mode, label, icon, desc }) => (
                <button
                  key={mode}
                  onClick={() => setInputMode(mode)}
                  className="input-mode-button"
                  style={{
                    flex: 1,
                    padding: "1rem",
                    borderRadius: "12px",
                    border: `2px solid ${inputMode === mode ? "var(--accent)" : "var(--border)"}`,
                    background: inputMode === mode ? "rgba(124,92,252,0.05)" : "var(--bg)",
                    color: inputMode === mode ? "var(--accent)" : "var(--text)",
                    fontSize: ".9rem",
                    fontFamily: "DM Sans, sans-serif",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textAlign: "center",
                    minHeight: "100px",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icon}</div>
                  <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{label}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{desc}</div>
                </button>
              ))}
            </div>

            {/* Input content based on mode */}
            {inputMode === 'url' && (
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.5rem" }}>
                  Product URL
                </label>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yourstore.com/product/amazing-serum"
                  style={{
                    width: "100%",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: ".75rem 1rem",
                    color: "var(--text)",
                    fontSize: ".9rem",
                    fontFamily: "DM Sans, sans-serif",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLElement).style.borderColor = "var(--accent)";
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLElement).style.borderColor = "var(--border)";
                  }}
                />
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.5rem" }}>
                  We'll analyze your product page and create a compelling video script
                </div>
              </div>
            )}

            {inputMode === 'drag-drop' && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${isDragOver ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: "12px",
                  padding: "2rem",
                  textAlign: "center",
                  background: isDragOver ? "rgba(124,92,252,0.05)" : "var(--bg)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  marginBottom: "1.5rem",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                  {isDragOver ? "📥" : "📎"}
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: ".5rem" }}>
                  {isDragOver ? "Drop your content here!" : "Drag & drop a product URL or video"}
                </div>
                <div style={{ fontSize: ".85rem", color: "var(--muted)" }}>
                  Or paste a URL directly above
                </div>
                {url && (
                  <div style={{ marginTop: "1rem", fontSize: ".9rem", color: "var(--accent)" }}>
                    Current URL: {url}
                  </div>
                )}
              </div>
            )}

            {inputMode === 'upload' && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: "2px dashed var(--border)",
                    borderRadius: "12px",
                    padding: "2rem",
                    textAlign: "center",
                    background: "var(--bg)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.borderColor = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.borderColor = "var(--border)";
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📁</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: ".5rem" }}>
                    {uploadedFile ? `Selected: ${uploadedFile.name}` : "Click to upload a video file"}
                  </div>
                  <div style={{ fontSize: ".85rem", color: "var(--muted)" }}>
                    Supports MP4, MOV, AVI up to 100MB
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 2: Settings */}
        {currentWizardStep === 2 && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: "1rem" }}>
                Configure Your Video
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.5rem" }}>
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    style={{
                      width: "100%",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: ".75rem",
                      color: "var(--text)",
                      fontSize: ".9rem",
                      fontFamily: "DM Sans, sans-serif",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="tiktok">TikTok (9:16)</option>
                    <option value="instagram">Instagram Reels</option>
                    <option value="youtube">YouTube Shorts</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.5rem" }}>
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    style={{
                      width: "100%",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: ".75rem",
                      color: "var(--text)",
                      fontSize: ".9rem",
                      fontFamily: "DM Sans, sans-serif",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="casual">Casual & Friendly</option>
                    <option value="energetic">Energetic & Excited</option>
                    <option value="professional">Professional & Trustworthy</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.5rem" }}>
                    Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={{
                      width: "100%",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: ".75rem",
                      color: "var(--text)",
                      fontSize: ".9rem",
                      fontFamily: "DM Sans, sans-serif",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="30">30 seconds</option>
                    <option value="60">60 seconds</option>
                    <option value="120">2 minutes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Generate */}
        {currentWizardStep === 3 && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.5rem" }}>
                Ready to Generate!
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.5 }}>
                We'll create a viral video script, select the perfect avatar, and generate cinematic B-roll
                for your {platform} video in under 60 seconds.
              </p>
            </div>

            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.5rem" }}>Your Settings:</div>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--muted)", background: "var(--bg)", padding: "0.25rem 0.75rem", borderRadius: "20px", border: "1px solid var(--border)" }}>
                  Platform: <strong>{platform}</strong>
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--muted)", background: "var(--bg)", padding: "0.25rem 0.75rem", borderRadius: "20px", border: "1px solid var(--border)" }}>
                  Tone: <strong>{tone}</strong>
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--muted)", background: "var(--bg)", padding: "0.25rem 0.75rem", borderRadius: "20px", border: "1px solid var(--border)" }}>
                  Duration: <strong>{duration}s</strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
          <button
            onClick={prevStep}
            disabled={currentWizardStep === 1}
            style={{
              padding: ".75rem 1.5rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: currentWizardStep === 1 ? "var(--dim)" : "var(--text)",
              fontSize: ".9rem",
              fontFamily: "DM Sans, sans-serif",
              cursor: currentWizardStep === 1 ? "not-allowed" : "pointer",
              opacity: currentWizardStep === 1 ? 0.5 : 1,
              transition: "all 0.2s ease",
            }}
          >
            ← Back
          </button>

          {currentWizardStep < 3 ? (
            <button
              onClick={nextStep}
              disabled={!canProceedToNext()}
              style={{
                padding: ".75rem 1.5rem",
                borderRadius: "8px",
                border: "none",
                background: canProceedToNext() ? "var(--accent)" : "var(--dim)",
                color: "#fff",
                fontSize: ".9rem",
                fontFamily: "Syne, sans-serif",
                fontWeight: 600,
                cursor: canProceedToNext() ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={generate}
              disabled={loading}
              style={{
                padding: ".75rem 2rem",
                borderRadius: "8px",
                border: "none",
                background: loading ? "var(--dim)" : "var(--accent)",
                color: "#fff",
                fontSize: ".9rem",
                fontFamily: "Syne, sans-serif",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {loading ? "Generating..." : "🚀 Generate Video"}
            </button>
          )}
        </div>

        {/* Progress */}
        {loading && (
          <div
            style={{
              marginTop: "2rem",
              animation: "fadeUp 0.3s ease",
            }}
          >
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
                    transition: "all .3s ease",
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
          <div
            style={{
              marginTop: "2rem",
              background: "rgba(255,92,135,0.1)",
              border: "1px solid rgba(255,92,135,0.3)",
              borderRadius: "8px",
              padding: "1rem",
              color: "var(--accent3)",
              fontSize: ".85rem",
              animation: "fadeUp 0.3s ease",
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div
            style={{
              background: "var(--bg)",
              border: "1px solid rgba(124,92,252,0.25)",
              borderRadius: "12px",
              padding: "1.25rem",
              marginTop: "2rem",
              animation: "fadeUp 0.3s ease",
            }}
          >
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
    </div>
  );
}
