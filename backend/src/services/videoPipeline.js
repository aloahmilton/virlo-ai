/**
 * VideoPipeline — the core orchestrator
 *
 * Short-form: URL → Grok script → HeyGen avatar → MP4
 * Long-form:  Topic → Grok storyboard → fal.ai scenes → FFmpeg stitch → MP4
 */

import { GrokService } from "./grokService.js";
import { HeyGenService } from "./heygenService.js";
import { FalService } from "./falService.js";
import { StitchService } from "./stitchService.js";

export class VideoPipeline {
  constructor({ grokApiKey, heygenApiKey, falApiKey }) {
    this.grok = new GrokService(grokApiKey);
    this.heygen = new HeyGenService(heygenApiKey);
    this.fal = new FalService(falApiKey);
    this.stitch = new StitchService();
  }

  /**
   * SHORT-FORM: URL → Finished talking-head video
   * Steps: Grok script → avatar select → HeyGen render
   */
  async urlToVideo(productUrl, options = {}) {
    const {
      platform = "tiktok",
      duration = 30,
      tone = "casual",
      avatarId = null,
      voiceId = null,
      brandVoice = "",
      language = "en",
      aspectRatio = "9:16",
      onProgress = () => {},
    } = options;

    try {
      onProgress({ step: 1, total: 4, message: "Grok is researching your product..." });
      const scriptData = await this.grok.generateScriptFromUrl(productUrl, {
        platform, duration, tone, brandVoice,
      });

      let selectedAvatarId = avatarId;
      let selectedVoiceId = voiceId;

      if (!selectedAvatarId) {
        onProgress({ step: 2, total: 4, message: "Selecting best avatar for your audience..." });
        const avatarRec = await this.grok.recommendAvatar(scriptData, platform);
        const avatars = await this.heygen.getAvatars(avatarRec.filter);
        selectedAvatarId = avatars[0]?.avatar_id || "default_avatar_id";
        const voices = await this.heygen.getVoices(language);
        selectedVoiceId = voices[0]?.voice_id || "default_voice_id";
      }

      onProgress({ step: 3, total: 4, message: "Rendering your video..." });
      const { videoId } = await this.heygen.generateVideo({
        script: scriptData.fullScript,
        avatarId: selectedAvatarId,
        voiceId: selectedVoiceId,
        aspectRatio,
        background: { type: "color", value: "#FFFFFF" },
      });

      onProgress({ step: 4, total: 4, message: "Video queued! Polling for completion..." });

      return {
        videoId,
        scriptData,
        selectedAvatarId,
        status: "processing",
        estimatedReadyIn: "2-10 minutes",
      };
    } catch (err) {
      throw new Error(`Pipeline failed: ${err.message}`);
    }
  }

  /**
   * LONG-FORM: Topic → Storyboard → Scene renders → Stitched MP4
   * The key differentiator: unlimited length, quality never degrades
   */
  async topicToLongFormVideo(topic, durationMins, options = {}) {
    const {
      platform = "youtube",
      style = "cinematic",
      tone = "engaging",
      brandVoice = "",
      hasUserImages = false,
      imageUrls = [],
      videoModel = "kling_v3",
      onProgress = () => {},
    } = options;

    try {
      // Step 1: Grok generates the storyboard
      onProgress({ step: 1, total: 4, message: `Writing ${durationMins}-minute storyboard...` });
      const storyboard = await this.grok.generateStoryboard(topic, durationMins, {
        platform, style, tone, brandVoice, hasUserImages, imageUrls,
      });

      // Step 2: Render all scenes in parallel via fal.ai
      onProgress({
        step: 2,
        total: 4,
        message: `Rendering ${storyboard.totalScenes} scenes via Kling V3...`,
      });
      const sceneJobs = await this.fal.renderStoryboardScenes(storyboard, {
        model: videoModel,
      });

      // Step 3: Wait for all scenes to complete
      onProgress({ step: 3, total: 4, message: "Waiting for scene renders..." });
      const renderedScenes = await this.fal.waitForAllScenes(sceneJobs);

      // Step 4: Stitch scenes into final video
      onProgress({ step: 4, total: 4, message: "Stitching scenes with FFmpeg..." });
      const result = await this.stitch.stitchScenes(renderedScenes, storyboard);

      return {
        ...result,
        storyboard,
        status: "completed",
      };
    } catch (err) {
      throw new Error(`Long-form pipeline failed: ${err.message}`);
    }
  }

  /**
   * A/B TEST: Same product → 5 hook variants → 5 videos in parallel
   */
  async generateABTestBatch(productUrl, avatarId, voiceId, options = {}) {
    const description = `Product at ${productUrl}`;
    const { hooks } = await this.grok.generateHookVariants(description, 5);
    const baseScript = await this.grok.generateScriptFromUrl(productUrl, options);

    const videoPromises = hooks.map(async (hook) => {
      const scriptWithHook = `${hook.text}\n\n${baseScript.solution}\n\n${baseScript.proof}\n\n${baseScript.cta}`;
      const { videoId } = await this.heygen.generateVideo({
        script: scriptWithHook,
        avatarId,
        voiceId,
        aspectRatio: options.aspectRatio || "9:16",
      });
      return { videoId, hook: hook.text, hookType: hook.type, emoji: hook.emoji };
    });

    const videos = await Promise.all(videoPromises);
    return { videos, baseScript };
  }

  /**
   * LOCALIZE: Existing video → 20 culturally adapted language versions
   */
  async localizeToLanguages(videoId, script, languages) {
    const jobs = languages.map(async ({ code, market }) => {
      const localized = await this.grok.localizeScript(script, code, market);
      const result = await this.heygen.translateVideo(videoId, code, localized.localizedScript);
      return {
        language: code,
        market,
        videoId: result.video_id,
        culturalChanges: localized.culturalChanges,
      };
    });
    return Promise.all(jobs);
  }
}
