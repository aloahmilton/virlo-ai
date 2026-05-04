import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { PipelineVisual } from "./components/PipelineVisual";
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
