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
import jobQueue from "./jobQueue.js";

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

    // Create job for tracking
    const jobId = await jobQueue.createJob('urlToVideo', {
      productUrl,
      platform,
      duration,
      tone,
      avatarId,
      voiceId,
      brandVoice,
      language,
      aspectRatio
    });

    try {
      onProgress({ step: 1, total: 4, message: "Grok is researching your product..." });
      await jobQueue.updateProgress(jobId, 25, "Researching product...");

      const scriptData = await this.grok.generateScriptFromUrl(productUrl, {
        platform, duration, tone, brandVoice,
      });

      let selectedAvatarId = avatarId;
      let selectedVoiceId = voiceId;

      if (!selectedAvatarId) {
        onProgress({ step: 2, total: 4, message: "Selecting best avatar for your audience..." });
        await jobQueue.updateProgress(jobId, 50, "Selecting avatar...");

        const avatarRec = await this.grok.recommendAvatar(scriptData, platform);
        const avatars = await this.heygen.getAvatars(avatarRec.filter);
        selectedAvatarId = avatars[0]?.avatar_id || "default_avatar_id";
        const voices = await this.heygen.getVoices(language);
        selectedVoiceId = voices[0]?.voice_id || "default_voice_id";
      }

      onProgress({ step: 3, total: 4, message: "Rendering your video..." });
      await jobQueue.updateProgress(jobId, 75, "Rendering video...");

      const { videoId } = await this.heygen.generateVideo({
        script: scriptData.fullScript,
        avatarId: selectedAvatarId,
        voiceId: selectedVoiceId,
        aspectRatio,
        background: { type: "color", value: "#FFFFFF" },
      });

      onProgress({ step: 4, total: 4, message: "Video queued! Polling for completion..." });
      await jobQueue.updateProgress(jobId, 90, "Video queued for processing...");

      // Complete the job
      await jobQueue.completeJob(jobId, {
        videoId,
        scriptData,
        selectedAvatarId,
        status: "processing",
        estimatedReadyIn: "2-10 minutes",
      });

      return {
        jobId,
        videoId,
        scriptData,
        selectedAvatarId,
        status: "processing",
        estimatedReadyIn: "2-10 minutes",
      };
    } catch (err) {
      await jobQueue.failJob(jobId, err);
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

    // Create job for tracking
    const jobId = await jobQueue.createJob('topicToLongFormVideo', {
      topic,
      durationMins,
      platform,
      style,
      tone,
      brandVoice,
      hasUserImages,
      imageUrls,
      videoModel
    });

    try {
      // Step 1: Grok generates the storyboard
      onProgress({ step: 1, total: 4, message: `Writing ${durationMins}-minute storyboard...` });
      await jobQueue.updateProgress(jobId, 10, `Writing ${durationMins}-minute storyboard...`);

      const storyboard = await this.grok.generateStoryboard(topic, durationMins, {
        platform, style, tone, brandVoice, hasUserImages, imageUrls,
      });

      // Step 2: Render all scenes in parallel via fal.ai
      onProgress({
        step: 2,
        total: 4,
        message: `Rendering ${storyboard.totalScenes} scenes via Kling V3...`,
      });
      await jobQueue.updateProgress(jobId, 40, `Rendering ${storyboard.totalScenes} scenes...`);

      const sceneJobs = await this.fal.renderStoryboardScenes(storyboard, {
        model: videoModel,
      });

      // Step 3: Wait for all scenes to complete
      onProgress({ step: 3, total: 4, message: "Waiting for scene renders..." });
      await jobQueue.updateProgress(jobId, 70, "Waiting for scene renders...");

      const renderedScenes = await this.fal.waitForAllScenes(sceneJobs);

      // Step 4: Stitch scenes into final video
      onProgress({ step: 4, total: 4, message: "Stitching scenes with FFmpeg..." });
      await jobQueue.updateProgress(jobId, 90, "Stitching scenes...");

      const result = await this.stitch.stitchScenes(renderedScenes, storyboard);

      // Complete the job
      await jobQueue.completeJob(jobId, {
        ...result,
        storyboard,
        status: "completed",
      });

      return {
        jobId,
        ...result,
        storyboard,
        status: "completed",
      };
    } catch (err) {
      await jobQueue.failJob(jobId, err);
      throw new Error(`Long-form pipeline failed: ${err.message}`);
    }
  }

  /**
   * A/B TEST: Same product → 5 hook variants → 5 videos in parallel
   */
  async generateABTestBatch(productUrl, avatarId, voiceId, options = {}) {
    // Create job for tracking
    const jobId = await jobQueue.createJob('generateABTestBatch', {
      productUrl,
      avatarId,
      voiceId,
      options
    });

    try {
      await jobQueue.updateProgress(jobId, 10, "Generating hook variants...");

      const description = `Product at ${productUrl}`;
      const { hooks } = await this.grok.generateHookVariants(description, 5);
      const baseScript = await this.grok.generateScriptFromUrl(productUrl, options);

      await jobQueue.updateProgress(jobId, 30, "Rendering 5 video variants...");

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

      await jobQueue.completeJob(jobId, { videos, baseScript });

      return {
        jobId,
        videos,
        baseScript
      };
    } catch (err) {
      await jobQueue.failJob(jobId, err);
      throw new Error(`A/B test batch failed: ${err.message}`);
    }
  }

  /**
   * LOCALIZATION: Video → 20 language versions with cultural adaptation
   */
  async generateLocalizationBatch(videoId, scriptContent, targetLanguages = []) {
    // Create job for tracking
    const jobId = await jobQueue.createJob('generateLocalizationBatch', {
      videoId,
      scriptContent,
      targetLanguages
    });

    try {
      const languages = targetLanguages.length > 0
        ? targetLanguages
        : [
          { code: "es", market: "Mexico" },
          { code: "pt", market: "Brazil" },
          { code: "fr", market: "France" },
          { code: "de", market: "Germany" },
          { code: "it", market: "Italy" },
          { code: "ja", market: "Japan" },
          { code: "zh", market: "China" },
          { code: "ko", market: "South Korea" },
          { code: "in", market: "India" },
          { code: "ru", market: "Russia" },
          { code: "ar", market: "Middle East" },
          { code: "th", market: "Thailand" },
          { code: "vi", market: "Vietnam" },
          { code: "pl", market: "Poland" },
          { code: "tr", market: "Turkey" },
        ];

      await jobQueue.updateProgress(jobId, 10, `Localizing to ${languages.length} languages...`);

      const localizePromises = languages.map(async (lang) => {
        const localizedScript = await this.grok.localizeScript(
          scriptContent,
          lang.code,
          lang.market
        );

        const { videoId: newVideoId } = await this.heygen.translateVideo(
          videoId,
          lang.code,
          localizedScript.localizedScript
        );

        return {
          languageCode: lang.code,
          market: lang.market,
          videoId: newVideoId,
          localizedScript: localizedScript.localizedScript,
        };
      });

      const localizedVideos = await Promise.all(localizePromises);

      await jobQueue.completeJob(jobId, {
        originalVideoId: videoId,
        localizedVersions: localizedVideos
      });

      return {
        jobId,
        originalVideoId: videoId,
        localizedVersions: localizedVideos
      };
    } catch (err) {
      await jobQueue.failJob(jobId, err);
      throw new Error(`Localization batch failed: ${err.message}`);
    }
  }
}
