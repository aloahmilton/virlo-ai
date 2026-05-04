/**
 * HeyGenService — avatar rendering layer
 * Talking-head video generation with lip-sync in 175+ languages
 */

const HEYGEN_BASE = "https://api.heygen.com";

export class HeyGenService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.headers = {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    };
  }

  async request(method, path, body = null) {
    const res = await fetch(`${HEYGEN_BASE}${path}`, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`HeyGen error: ${err.message || res.status}`);
    }

    return res.json();
  }

  async getAvatars(filter = {}) {
    const data = await this.request("GET", "/v2/avatars");
    let avatars = data.data?.avatars || [];
    if (filter.gender) avatars = avatars.filter((a) => a.gender === filter.gender);
    if (filter.style) avatars = avatars.filter((a) => a.style === filter.style);
    return avatars;
  }

  async getVoices(language = "en") {
    const data = await this.request("GET", "/v2/voices");
    const voices = data.data?.voices || [];
    return voices.filter((v) => v.language?.startsWith(language));
  }

  /** Core: render a talking-head video from script */
  async generateVideo(config) {
    const {
      script,
      avatarId,
      voiceId,
      background = { type: "color", value: "#FFFFFF" },
      resolution = "1080p",
      aspectRatio = "9:16",
    } = config;

    const payload = {
      video_inputs: [
        {
          character: { type: "avatar", avatar_id: avatarId, avatar_style: "normal" },
          voice: { type: "text", input_text: script, voice_id: voiceId },
          background,
        },
      ],
      dimension: this.getDimensions(resolution, aspectRatio),
      aspect_ratio: aspectRatio,
    };

    const data = await this.request("POST", "/v2/video/generate", payload);
    return { videoId: data.data?.video_id, status: "pending" };
  }

  async getVideoStatus(videoId) {
    const data = await this.request("GET", `/v1/video_status.get?video_id=${videoId}`);
    return {
      videoId,
      status: data.data?.status,
      videoUrl: data.data?.video_url,
      thumbnailUrl: data.data?.thumbnail_url,
      duration: data.data?.duration,
      error: data.data?.error,
    };
  }

  async waitForVideo(videoId, timeoutMs = 600000, intervalMs = 15000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      const status = await this.getVideoStatus(videoId);
      if (status.status === "completed") return status;
      if (status.status === "failed") throw new Error(`Video failed: ${status.error}`);
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    throw new Error("Video generation timed out");
  }

  async createCustomAvatar(config) {
    const { name, videoUrl, consentStatement } = config;
    return this.request("POST", "/v2/avatar/create", {
      name,
      video_url: videoUrl,
      consent: consentStatement,
    });
  }

  /** Translate + lip-sync with Grok's culturally adapted script */
  async translateVideo(videoId, targetLanguage, adaptedScript = null) {
    return this.request("POST", "/v2/video/translate", {
      video_id: videoId,
      output_language: targetLanguage,
      ...(adaptedScript && { translated_script: adaptedScript }),
    });
  }

  getDimensions(resolution, aspectRatio) {
    const dims = {
      "1080p": {
        "9:16": { width: 1080, height: 1920 },
        "16:9": { width: 1920, height: 1080 },
        "1:1": { width: 1080, height: 1080 },
      },
      "720p": {
        "9:16": { width: 720, height: 1280 },
        "16:9": { width: 1280, height: 720 },
        "1:1": { width: 720, height: 720 },
      },
    };
    return dims[resolution]?.[aspectRatio] || dims["1080p"]["9:16"];
  }
}
