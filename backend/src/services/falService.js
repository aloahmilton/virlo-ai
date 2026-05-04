/**
 * FalService — unified AI video engine router
 *
 * One API key, 600+ models via fal.ai
 * Routes to: Kling V3, Veo 3, Hailuo, Seedance
 * Used for B-roll generation and long-form scene rendering
 */

const FAL_BASE = "https://fal.run";

// Model endpoints on fal.ai
const MODELS = {
  kling_v3: "fal-ai/kling-video/v1.6/pro/text-to-video",
  kling_image: "fal-ai/kling-video/v1.6/pro/image-to-video", // native 4K image→video
  veo3: "fal-ai/veo3",
  hailuo: "fal-ai/minimax-video/image-to-video",
  seedance: "fal-ai/seedance-video",
};

export class FalService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Key ${this.apiKey}`,
    };
  }

  async submit(modelEndpoint, input) {
    const res = await fetch(`${FAL_BASE}/${modelEndpoint}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ input }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`fal.ai error [${modelEndpoint}]: ${err.detail || res.status}`);
    }

    return res.json();
  }

  async getResult(requestId) {
    const res = await fetch(`https://queue.fal.run/requests/${requestId}/status`, {
      headers: this.headers,
    });
    return res.json();
  }

  async waitForResult(requestId, timeoutMs = 300000, intervalMs = 5000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const status = await this.getResult(requestId);
      if (status.status === "COMPLETED") return status.output;
      if (status.status === "FAILED") throw new Error(`fal.ai job failed: ${status.error}`);
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    throw new Error("fal.ai job timed out");
  }

  /**
   * Generate a B-roll clip from a text prompt
   * Defaults to Kling V3 (best quality/cost balance)
   * model: "kling_v3" | "veo3" | "hailuo" | "seedance"
   */
  async textToVideo(prompt, options = {}) {
    const {
      model = "kling_v3",
      duration = 5,       // seconds (5 or 10)
      aspectRatio = "9:16",
      resolution = "1080p",
    } = options;

    const endpoint = MODELS[model] || MODELS.kling_v3;

    const result = await this.submit(endpoint, {
      prompt,
      duration,
      aspect_ratio: aspectRatio,
      resolution,
      cfg_scale: 0.5,
    });

    return {
      requestId: result.request_id,
      model,
      prompt,
    };
  }

  /**
   * Animate a static image — Kling V3 native 4K
   * Perfect for product photos → cinematic motion
   */
  async imageToVideo(imageUrl, prompt, options = {}) {
    const { duration = 5, aspectRatio = "9:16" } = options;

    const result = await this.submit(MODELS.kling_image, {
      image_url: imageUrl,
      prompt,
      duration,
      aspect_ratio: aspectRatio,
      cfg_scale: 0.5,
    });

    return {
      requestId: result.request_id,
      model: "kling_image",
      imageUrl,
      prompt,
    };
  }

  /**
   * Render all scenes from a Grok storyboard in parallel
   * This is the core of the long-form engine
   */
  async renderStoryboardScenes(storyboard, options = {}) {
    const { model = "kling_v3" } = options;

    const sceneJobs = storyboard.scenes.map(async (scene) => {
      let job;

      if (scene.useUserImage && scene.resolvedImageUrl) {
        job = await this.imageToVideo(scene.resolvedImageUrl, scene.motionPrompt, {
          aspectRatio: storyboard.aspectRatio,
        });
      } else {
        job = await this.textToVideo(scene.motionPrompt, {
          model,
          aspectRatio: storyboard.aspectRatio,
        });
      }

      return { sceneNumber: scene.sceneNumber, ...job };
    });

    // All scenes render in parallel
    const jobs = await Promise.all(sceneJobs);
    return jobs;
  }

  /**
   * Poll all scene jobs until completion
   * Returns array of { sceneNumber, videoUrl }
   */
  async waitForAllScenes(jobs) {
    const results = await Promise.all(
      jobs.map(async (job) => {
        const output = await this.waitForResult(job.requestId);
        return {
          sceneNumber: job.sceneNumber,
          videoUrl: output?.video?.url || output?.video_url,
        };
      })
    );

    return results.sort((a, b) => a.sceneNumber - b.sceneNumber);
  }
}
