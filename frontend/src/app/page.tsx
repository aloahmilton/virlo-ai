import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { PipelineVisual } from "./components/PipelineVisual";
import { VideoGenerator } from "./components/VideoGenerator";
import { FeaturesGrid } from "./components/FeaturesGrid";
import { SocialProof } from "./components/SocialProof";
import { PricingSection } from "./components/PricingSection";
import { Footer } from "./components/Footer";

const Divider = () => (
  <div style={{ height: "1px", background: "var(--border)", margin: "2.5rem 0" }} />
);

export default function Home() {
  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <Navbar />
      <Hero />
      <Divider />
      <PipelineVisual />
      <Divider />
      <section id="generate">
        <div style={{ fontSize: "11px", fontFamily: "Syne, sans-serif", fontWeight: 700, letterSpacing: "2px", color: "var(--muted)", textTransform: "uppercase", marginBottom: ".5rem" }}>
          Live demo
        </div>
        <VideoGenerator />
      </section>
      <Divider />
      <FeaturesGrid />
      <Divider />
      <SocialProof />
      <Divider />
      <PricingSection />
      <Divider />
      <Footer />
    </main>
  );
}
