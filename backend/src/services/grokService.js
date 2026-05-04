/**
 * GrokService — the intelligence layer
 * 4-agent system: script · hooks · brand voice · localization · storyboard
 */

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";
const GROK_MODEL = "grok-4-20-reasoning";

export class GrokService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async complete(systemPrompt, userPrompt, options = {}) {
    const response = await fetch(GROK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: options.maxTokens || 1500,
        temperature: options.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Grok API error: ${err.error?.message || response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /** URL → optimized UGC script */
  async generateScriptFromUrl(productUrl, options = {}) {
    const { platform = "tiktok", duration = 30, tone = "casual", brandVoice = "" } = options;

    const systemPrompt = `You are an elite UGC ad scriptwriter specializing in high-converting 
short-form video ads for ${platform}. You understand hooks, pattern interrupts, social proof, CTAs.
${brandVoice ? `Brand voice: ${brandVoice}` : ""}
Return valid JSON only. No markdown, no preamble.`;

    const userPrompt = `Research this product URL and write a UGC video script:
URL: ${productUrl}
Platform: ${platform}
Duration: ${duration} seconds
Tone: ${tone}

Return JSON:
{
  "hook": "Opening line — must stop the scroll",
  "problem": "Pain point the product solves",
  "solution": "How it solves it",
  "proof": "Social proof or result claim",
  "cta": "Call to action",
  "fullScript": "Complete word-for-word script",
  "speakingPace": "words per minute estimate",
  "estimatedDuration": "seconds",
  "hashtags": ["tag1", "tag2"],
  "trendingAngles": ["angle1", "angle2"]
}`;

    const raw = await this.complete(systemPrompt, userPrompt, { temperature: 0.8 });
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  }

  /** Generate 5 A/B hook variants */
  async generateHookVariants(productDescription, count = 5) {
    const systemPrompt = `You are a viral content strategist. Generate scroll-stopping hooks 
for UGC ads. Each hook must be under 10 words.
Return valid JSON only.`;

    const userPrompt = `Product: ${productDescription}
Generate ${count} different hook styles.
Return JSON:
{
  "hooks": [
    { "type": "curiosity", "text": "...", "emoji": "🤔" },
    { "type": "fear", "text": "...", "emoji": "😱" },
    { "type": "social_proof", "text": "...", "emoji": "✅" },
    { "type": "transformation", "text": "...", "emoji": "✨" },
    { "type": "controversy", "text": "...", "emoji": "🔥" }
  ]
}`;

    const raw = await this.complete(systemPrompt, userPrompt, { temperature: 0.9 });
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  }

  /** Recommend avatar demographics based on script */
  async recommendAvatar(scriptData, platform) {
    const systemPrompt = `You are a UGC performance strategist. 
Return valid JSON only.`;

    const userPrompt = `Based on this script and platform, recommend the best avatar demographics:
Script hook: ${scriptData.hook}
Problem: ${scriptData.problem}
Platform: ${platform}

Return JSON:
{
  "filter": { "gender": "male|female|any", "style": "realistic|animated" },
  "reasoning": "Why this demographic converts best for this product"
}`;

    const raw = await this.complete(systemPrompt, userPrompt, { temperature: 0.3 });
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  }

  /** Trend-aware script using Grok's X data advantage */
  async getTrendAwareScript(productUrl, niche) {
    const systemPrompt = `You are aware of current social media trends from X/Twitter. 
Return valid JSON only.`;

    const userPrompt = `Create a trend-aware UGC script:
Product URL: ${productUrl}
Niche: ${niche}

Return JSON:
{
  "trendUsed": "Name of the trend",
  "trendExplanation": "Why it fits",
  "script": "Full trend-aware script",
  "hook": "Trend-based hook",
  "expiryEstimate": "How long this angle stays relevant"
}`;

    const raw = await this.complete(systemPrompt, userPrompt, { temperature: 0.85 });
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  }

  /** Storyboard for long-form videos (topic → 30s scenes) */
  async generateStoryboard(topic, durationMins, options = {}) {
    const {
      platform = "youtube",
      style = "cinematic",
      tone = "engaging",
      brandVoice = "",
      hasUserImages = false,
      imageUrls = [],
    } = options;

    const scenesPerMinute = 2.5; // Each 30s scene
    const totalScenes = Math.ceil(durationMins * scenesPerMinute);

    const systemPrompt = `You are a documentary filmmaker and video editor. 
Create detailed scene breakdowns for B-roll generation.
${brandVoice ? `Brand voice: ${brandVoice}` : ""}
Return valid JSON only. No markdown.`;

    const userPrompt = `Create a ${durationMins}-minute video storyboard (${totalScenes} scenes, 30s each).
Topic: ${topic}
Platform: ${platform}
Style: ${style}
Tone: ${tone}

Return JSON:
{
  "title": "Video title",
  "totalScenes": ${totalScenes},
  "totalDurationMins": ${durationMins},
  "totalDurationSecs": ${durationMins * 60},
  "aspectRatio": "16:9",
  "captionStyle": "on-screen-text",
  "scenes": [
    {
      "sceneNumber": 1,
      "durationSecs": 30,
      "voiceoverScript": "The narrative for this scene",
      "motionPrompt": "Detailed Kling V3 prompt for the cinematic B-roll",
      "musicMood": "energetic|calm|dramatic",
      "onscreenText": "Optional text overlay",
      "cameraAngle": "wide shot|close-up|pan",
      "useUserImage": false,
      "transitionType": "cut|fade|zoom"
    }
  ],
  "voiceoverNarrationFull": "Full continuous narration across all scenes",
  "musicGenre": "genre suggestion"
}`;

    const raw = await this.complete(systemPrompt, userPrompt, { 
      maxTokens: 4000,
      temperature: 0.7 
    });
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  }

  /** Generate a Kling V3 optimized motion prompt from scene description */
  async generateMotionPrompt(description, style = "cinematic") {
    const systemPrompt = `You are a Kling V3 expert. Create detailed, specific motion prompts that
maximize video quality and realism. Return valid JSON only.`;

    const userPrompt = `Generate a Kling V3 motion prompt for:
Description: ${description}
Style: ${style}

Return JSON:
{
  "motionPrompt": "Detailed 2-3 sentence prompt optimized for Kling V3",
  "cameraKeywords": ["keyword1", "keyword2"],
  "qualitySettings": {
    "cinematography": "principle used",
    "lighting": "lighting approach",
    "colorGrade": "color palette"
  }
}`;

    const raw = await this.complete(systemPrompt, userPrompt, { temperature: 0.6 });
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  }

  /** Learn brand voice from past scripts */
  async analyzeBrandVoice(pastScripts) {
    const systemPrompt = `You are a brand strategist. Return valid JSON only.`;

    const userPrompt = `Analyze these scripts and extract brand voice:
${pastScripts.map((s, i) => `Script ${i + 1}: ${s}`).join("\n\n")}

Return JSON:
{
  "toneWords": ["word1", "word2"],
  "avoidWords": ["word1", "word2"],
  "sentenceLength": "short|medium|long",
  "commonPhrases": ["phrase1", "phrase2"],
  "uniqueVoiceProfile": "Description of what makes this brand voice unique"
}`;

    const raw = await this.complete(systemPrompt, userPrompt, { temperature: 0.5 });
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  }

  /** Localize a script for a specific market */
  async localizeScript(script, targetLanguage, targetMarket, brandVoice = "") {
    const systemPrompt = `You are a cultural localization expert, not just a translator.
Rewrite scripts to resonate with specific cultural contexts.
${brandVoice ? `Brand voice: ${brandVoice}` : ""}
Return valid JSON only.`;

    const userPrompt = `Localize this script for ${targetMarket} (language: ${targetLanguage}):
Original Script: ${script}

Return JSON:
{
  "localizedScript": "Full culturally adapted script",
  "translatedHook": "Hook optimized for local tastes",
  "culturalInsights": ["insight1", "insight2"],
  "localTrends": "Current trends this script leverages",
  "languageCode": "${targetLanguage}"
}`;

    const raw = await this.complete(systemPrompt, userPrompt, { temperature: 0.75 });
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  }

  /** Cultural localization — not just translation */
  async localizeScript(script, targetLanguage, targetMarket, brandVoice = "") {
    const systemPrompt = `You are a cultural localization expert. Adapt, don't just translate. Return valid JSON only.`;

    const userPrompt = `Localize this UGC script:
Original: ${script}
Target language: ${targetLanguage}
Target market: ${targetMarket}

Return JSON:
{
  "localizedScript": "...",
  "culturalChanges": ["change1", "change2"],
  "localTrends": ["trend referenced"],
  "speakingNotes": "Delivery tips for this market"
}`;

    const raw = await this.complete(systemPrompt, userPrompt, { temperature: 0.6 });
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  }

  /**
   * generateStoryboard — brain of long-form video
   * Topic + duration → full scene breakdown with Kling motion prompts
   */
  async generateStoryboard(topic, durationMins = 2, opts = {}) {
    const {
      platform = "youtube",
      style = "cinematic",
      tone = "engaging",
      brandVoice = "",
      hasUserImages = false,
      imageUrls = [],
    } = opts;

    const sceneDurationSecs = 30;
    const totalScenes = Math.ceil((durationMins * 60) / sceneDurationSecs);
    const actualDurationSecs = totalScenes * sceneDurationSecs;

    const systemPrompt = `You are an expert video director for ${style} ${platform} content.
${brandVoice ? `Brand voice: ${brandVoice}` : ""}
Return ONLY valid JSON — no markdown, no preamble.`;

    const userPrompt = `Create a detailed video storyboard:
TOPIC: "${topic}"
TOTAL SCENES: ${totalScenes}
SECONDS PER SCENE: ${sceneDurationSecs}
TOTAL DURATION: ${actualDurationSecs} seconds
PLATFORM: ${platform}
STYLE: ${style}
TONE: ${tone}
${hasUserImages && imageUrls.length > 0
  ? `USER IMAGES: ${imageUrls.length} images uploaded. Reference as [IMAGE_1], [IMAGE_2] etc.`
  : "VIDEO TYPE: text-to-video"}

Return this EXACT JSON:
{
  "title": "Video title",
  "description": "One sentence summary",
  "totalDurationSecs": ${actualDurationSecs},
  "totalScenes": ${totalScenes},
  "platform": "${platform}",
  "aspectRatio": "${["tiktok","instagram","reels"].includes(platform) ? "9:16" : "16:9"}",
  "voiceoverScript": "Complete narration for the full video",
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "Scene name",
      "type": "hook|problem|solution|demo|proof|cta|b-roll",
      "durationSecs": ${sceneDurationSecs},
      "motionPrompt": "Highly specific Kling AI prompt: subject, camera movement, lighting, motion details, mood",
      "voiceoverSegment": "Narrator lines during this scene",
      "onScreenText": "Text overlays or null",
      "useUserImage": false,
      "userImageIndex": null,
      "transition": "cut|fade|dissolve|whip-pan",
      "musicMood": "upbeat|calm|tense|inspiring|dramatic",
      "notes": "Director notes"
    }
  ],
  "audioNotes": "Music and audio direction",
  "captionStyle": "bold-center|bottom-thirds|none",
  "hooks": {
    "title": "Platform title hook",
    "thumbnail": "Ideal thumbnail description",
    "firstLine": "First spoken words"
  }
}`;

    const raw = await this.complete(systemPrompt, userPrompt, {
      temperature: 0.75,
      maxTokens: 4000,
    });

    const storyboard = JSON.parse(raw.replace(/```json|```/g, "").trim());

    if (hasUserImages && imageUrls.length > 0) {
      storyboard.scenes = storyboard.scenes.map((scene) => ({
        ...scene,
        resolvedImageUrl:
          scene.useUserImage && scene.userImageIndex !== null
            ? imageUrls[scene.userImageIndex] || null
            : null,
      }));
    }

    return storyboard;
  }

  /** Upgrade a basic description into a Kling-optimized prompt */
  async generateMotionPrompt(basicDescription, style = "cinematic") {
    const systemPrompt = `You are an expert at writing Kling AI video prompts. 
Return only the enhanced prompt as plain text, no JSON.`;

    const userPrompt = `Upgrade this into a cinematic Kling AI prompt:
BASIC: "${basicDescription}"
STYLE: ${style}
Rules: subject + camera movement + lighting + secondary motion + mood. Under 80 words.`;

    return this.complete(systemPrompt, userPrompt, { temperature: 0.7, maxTokens: 200 });
  }
}
