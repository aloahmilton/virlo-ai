import { Router } from "express";
import { GrokService } from "../services/grokService.js";

export const scriptRouter = Router();

const getGrok = () => new GrokService(process.env.GROK_API_KEY);

/** POST /api/script/generate — script from URL */
scriptRouter.post("/generate", async (req, res) => {
  try {
    const { productUrl, platform, duration, tone, brandVoice } = req.body;
    if (!productUrl) return res.status(400).json({ error: "productUrl is required" });

    const grok = getGrok();
    const script = await grok.generateScriptFromUrl(productUrl, {
      platform, duration, tone, brandVoice,
    });

    res.json({ success: true, data: script });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** POST /api/script/hooks — 5 A/B hook variants */
scriptRouter.post("/hooks", async (req, res) => {
  try {
    const { productDescription, count = 5 } = req.body;
    const grok = getGrok();
    const hooks = await grok.generateHookVariants(productDescription, count);
    res.json({ success: true, data: hooks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** POST /api/script/trend — trend-aware script */
scriptRouter.post("/trend", async (req, res) => {
  try {
    const { productUrl, niche } = req.body;
    const grok = getGrok();
    const result = await grok.getTrendAwareScript(productUrl, niche);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** POST /api/script/brand-voice — analyze brand voice from past scripts */
scriptRouter.post("/brand-voice", async (req, res) => {
  try {
    const { scripts } = req.body;
    if (!scripts?.length) return res.status(400).json({ error: "scripts array required" });

    const grok = getGrok();
    const voice = await grok.analyzeBrandVoice(scripts);
    res.json({ success: true, data: voice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** POST /api/script/storyboard — long-form storyboard */
scriptRouter.post("/storyboard", async (req, res) => {
  try {
    const { topic, durationMins = 2, ...opts } = req.body;
    if (!topic) return res.status(400).json({ error: "topic is required" });

    const grok = getGrok();
    const storyboard = await grok.generateStoryboard(topic, durationMins, opts);
    res.json({ success: true, data: storyboard });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** POST /api/script/motion-prompt — enhance a basic description for Kling */
scriptRouter.post("/motion-prompt", async (req, res) => {
  try {
    const { description, style = "cinematic" } = req.body;
    const grok = getGrok();
    const prompt = await grok.generateMotionPrompt(description, style);
    res.json({ success: true, data: { prompt } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
