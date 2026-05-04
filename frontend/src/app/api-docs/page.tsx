import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Reference | Virlo",
};

export default function ApiDocs() {
  const endpoints = [
    {
      method: "POST",
      path: "/api/video/generate",
      desc: "URL to short-form video in one call.",
      code: `const response = await fetch('/api/video/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productUrl: 'https://yourproduct.com/item',
    platform: 'tiktok',   // tiktok | instagram | youtube
    duration: 30,         // seconds
    tone: 'casual',
    language: 'en',
    brandId: 'your-brand-id'
  })
});`
    },
    {
      method: "POST",
      path: "/api/video/long-form",
      desc: "Topic to storyboard to fully stitched long-form video.",
      code: `await fetch('/api/video/long-form', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: 'How our product cures dry skin in 7 days',
    durationMins: 3,
    style: 'documentary',
    imageUrls: ['...']
  })
});`
    },
    {
      method: "POST",
      path: "/api/video/ab-test",
      desc: "Generate 5 hooks and 5 videos in parallel.",
      code: `await fetch('/api/video/ab-test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ productUrl, avatarId, voiceId })
});`
    },
    {
      method: "POST",
      path: "/api/video/localize",
      desc: "Re-render and lip-sync video into multiple languages.",
      code: `await fetch('/api/video/localize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    videoId, script,
    languages: [
      { code: 'es', market: 'Mexico' },
      { code: 'pt', market: 'Brazil' }
    ]
  })
});`
    }
  ];

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ fontSize: "11px", fontFamily: "Syne, sans-serif", fontWeight: 700, letterSpacing: "2px", color: "var(--accent)", textTransform: "uppercase", marginBottom: "1rem" }}>
        Developers
      </div>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "2rem" }}>
        API Reference
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "3rem", fontSize: "1.05rem" }}>
        Integrate the Virlo pipeline directly into your own applications. Full programmatic access to our Intelligence Core, Avatar Engine, and Cinematic Rendering pipeline.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {endpoints.map((ep) => (
          <div key={ep.path} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
            <div style={{ padding: "1.25rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "11px", fontWeight: 800, background: "rgba(107,70,250,0.1)", color: "var(--accent)", padding: "4px 10px", borderRadius: "20px" }}>
                {ep.method}
              </span>
              <code style={{ fontSize: ".9rem", fontWeight: 700 }}>{ep.path}</code>
            </div>
            <div style={{ padding: "1.25rem" }}>
              <p style={{ color: "var(--muted)", fontSize: ".9rem", marginBottom: "1.25rem" }}>{ep.desc}</p>
              <pre style={{ background: "var(--card)", padding: "1.25rem", borderRadius: "8px", overflowX: "auto", fontSize: "13px", color: "var(--text)" }}>
                <code>{ep.code}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
