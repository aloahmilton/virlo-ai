import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Architecture | Virlo",
};

export default function Architecture() {
  const layers = [
    {
      icon: "🔀", name: "API Gateway", color: "var(--text)", 
      items: [{ text: "Rate Limiter", type: "accent" }, { text: "Auth Check", type: "accent" }, { text: "Secure Endpoints", type: "default" }]
    },
    {
      icon: "⚙️", name: "Orchestration", color: "var(--text)", 
      items: [{ text: "Pipeline Manager", type: "accent" }, { text: "Job Queue", type: "accent" }, { text: "Async Workers", type: "default" }]
    },
    {
      icon: "🧠", name: "Intelligence Core", color: "var(--text)", 
      items: [{ text: "Script Engine", type: "accent" }, { text: "Storyboard", type: "default" }, { text: "Brand Voice", type: "default" }]
    },
    {
      icon: "🎬", name: "Video Engines", color: "var(--text)", 
      items: [{ text: "Cinematic B-Roll", type: "green" }, { text: "Native 4K Generation", type: "green" }, { text: "Avatar Engine", type: "default" }]
    },
    {
      icon: "✂️", name: "Post-processing", color: "var(--text)", 
      items: [{ text: "Seamless Concat", type: "pink" }, { text: "Global Captions", type: "pink" }, { text: "Audio Ducking", type: "pink" }, { text: "Final Export", type: "default" }]
    }
  ];

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ fontSize: "11px", fontFamily: "Syne, sans-serif", fontWeight: 700, letterSpacing: "2px", color: "var(--muted)", textTransform: "uppercase", marginBottom: "1rem" }}>
        System Design
      </div>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "3rem" }}>
        Architecture
      </h1>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "2rem" }}>
        <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.5rem" }}>Service Layer Stack</h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {layers.map((layer) => (
            <div key={layer.name} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px" }}>
              <div style={{ fontSize: "1.5rem", width: "40px", textAlign: "center", flexShrink: 0 }}>{layer.icon}</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1rem", color: layer.color, minWidth: "140px", flexShrink: 0 }}>{layer.name}</div>
              <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                {layer.items.map((item) => {
                  let bg = "var(--surface)", border = "var(--border)", color = "var(--muted)";
                  if (item.type === "accent") { bg = "rgba(107,70,250,0.1)"; border = "rgba(107,70,250,0.3)"; color = "var(--accent)"; }
                  if (item.type === "green") { bg = "rgba(0,229,192,0.1)"; border = "rgba(0,229,192,0.3)"; color = "var(--accent2)"; }
                  if (item.type === "pink") { bg = "rgba(232,68,90,0.1)"; border = "rgba(232,68,90,0.3)"; color = "var(--accent3)"; }

                  return (
                    <span key={item.text} style={{ fontSize: "12px", fontWeight: 600, background: bg, border: `1px solid ${border}`, color: color, padding: "4px 10px", borderRadius: "6px" }}>
                      {item.text}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
