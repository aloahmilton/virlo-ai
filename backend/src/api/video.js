import { Router } from "express";
import { VideoPipeline } from "../services/videoPipeline.js";
import { createJob, updateJob, getJob, JobStatus } from "../middleware/jobQueue.js";

export const videoRouter = Router();

const getPipeline = () =>
  new VideoPipeline({
    grokApiKey: process.env.GROK_API_KEY,
    heygenApiKey: process.env.HEYGEN_API_KEY,
    falApiKey: process.env.FAL_API_KEY,
  });

/**
 * POST /api/video/generate
 * Short-form: URL → talking-head video (async, non-blocking)
 * Returns jobId immediately; client polls /api/video/job/:jobId
 */
videoRouter.post("/generate", async (req, res) => {
  try {
    const { productUrl, ...options } = req.body;
    if (!productUrl) return res.status(400).json({ error: "productUrl is required" });

    // Create a Redis job and return immediately
    const jobId = await createJob("video_generate", { productUrl, ...options });
    res.json({ success: true, jobId, status: "pending", message: "Job queued. Poll /api/video/job/:jobId for updates." });

    // Run the pipeline in the background (non-blocking)
    const pipeline = getPipeline();
    updateJob(jobId, { status: JobStatus.PROCESSING });

    pipeline.urlToVideo(productUrl, {
      ...options,
      onProgress: (p) => {
        console.log(`[Job ${jobId}] ${p.step}/${p.total}: ${p.message}`);
        updateJob(jobId, { status: JobStatus.PROCESSING, progress: p });
      },
    })
      .then((result) => updateJob(jobId, { status: JobStatus.COMPLETED, result }))
      .catch((err) => updateJob(jobId, { status: JobStatus.FAILED, error: err.message }));

  } catch (err) {
    console.error("[/generate]", err);
    res.status(500).json({ error: err.message });
  }
});

/** GET /api/video/job/:jobId — poll job status from Redis */
videoRouter.get("/job/:jobId", async (req, res) => {
  try {
    const job = await getJob(req.params.jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/video/long-form
 * Long-form: Topic → Grok storyboard → Kling scenes → FFmpeg MP4
 */
videoRouter.post("/long-form", async (req, res) => {
  try {
    const { topic, durationMins = 2, ...options } = req.body;
    if (!topic) return res.status(400).json({ error: "topic is required" });

    const pipeline = getPipeline();
    const result = await pipeline.topicToLongFormVideo(topic, durationMins, {
      ...options,
      onProgress: (p) => console.log(`[LongForm] ${p.step}/${p.total}: ${p.message}`),
    });

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("[/long-form]", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/video/status/:videoId
 * Poll HeyGen render progress
 */
videoRouter.get("/status/:videoId", async (req, res) => {
  try {
    const { HeyGenService } = await import("../services/heygenService.js");
    const heygen = new HeyGenService(process.env.HEYGEN_API_KEY);
    const status = await heygen.getVideoStatus(req.params.videoId);
    res.json({ success: true, data: status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/video/ab-test
 * 5 hook variants → 5 videos rendered in parallel
 */
videoRouter.post("/ab-test", async (req, res) => {
  try {
    const { productUrl, avatarId, voiceId, ...options } = req.body;
    const pipeline = getPipeline();
    const result = await pipeline.generateABTestBatch(productUrl, avatarId, voiceId, options);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/video/localize
 * Culturally adapt a video to multiple language markets
 */
videoRouter.post("/localize", async (req, res) => {
  try {
    const { videoId, script, languages } = req.body;
    const pipeline = getPipeline();
    const results = await pipeline.generateLocalizationBatch(videoId, script, languages);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
