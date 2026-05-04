# Virlo API Reference

## Base URL
```
http://localhost:3000    # Development
https://api.virlo.ai     # Production (example)
```

## Authentication
No authentication required for development. For production, add Bearer tokens in headers.

---

## 🎬 Video Generation Endpoints

### POST /api/video/generate
**Generate a short-form video from a product URL**

**Request:**
```json
{
  "productUrl": "https://example.com/product/item",
  "platform": "tiktok",           // tiktok | instagram | youtube
  "duration": 30,                 // seconds: 15, 30, 60
  "tone": "casual",               // casual | energetic | professional
  "language": "en",               // en | es | fr | de | it | ja | zh | ko | ...
  "brandVoice": "",               // optional: custom brand guidelines
  "avatarId": null,               // optional: force specific avatar
  "voiceId": null                 // optional: force specific voice
}
```

**Response:**
```json
{
  "success": true,
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "message": "Job queued. Poll /api/video/job/:jobId for updates."
}
```

**Polling Result:**
```json
{
  "success": true,
  "data": {
    "jobId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "result": {
      "videoId": "heygen-12345",
      "scriptData": {
        "hook": "This serum changed everything...",
        "problem": "Dry, aging skin",
        "solution": "Hyaluronic acid serum penetrates deep",
        "proof": "3.2M+ customers saw results in 7 days",
        "cta": "Get 40% off today with code VIRAL",
        "fullScript": "...",
        "estimatedDuration": "30s",
        "hashtags": ["skincare", "serum", "beauty"],
        "trendingAngles": ["before-after", "ingredients"]
      },
      "selectedAvatarId": "avatar-james-123",
      "status": "processing",
      "estimatedReadyIn": "2-10 minutes"
    }
  }
}
```

**Times:**
- Grok script generation: 2-5 seconds
- HeyGen avatar sync: 2-8 minutes
- Total: 3-10 minutes

---

### GET /api/video/job/:jobId
**Poll the status of a video generation job**

**Response (Processing):**
```json
{
  "success": true,
  "data": {
    "jobId": "550e8400-e29b-41d4-a716-446655440000",
    "type": "video_generate",
    "status": "processing",
    "progress": {
      "step": 2,
      "total": 4,
      "message": "Rendering avatar..."
    },
    "createdAt": 1714819200000,
    "updatedAt": 1714819215000
  }
}
```

**Response (Completed):**
```json
{
  "success": true,
  "data": {
    "jobId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "result": { ... }
  }
}
```

---

### POST /api/video/long-form
**Generate a long-form video (unlimited length, unlimited resolution)**

**Request:**
```json
{
  "topic": "How to fix dry skin naturally in 7 days",
  "durationMins": 3,                    // 1-10 minutes
  "platform": "youtube",                // youtube | tiktok | instagram
  "style": "cinematic",                 // cinematic | ugc | tutorial | documentary
  "tone": "engaging",                   // engaging | professional | casual
  "videoModel": "kling_v3"              // kling_v3 | veo3 | hailuo | seedance
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "outputPath": "/tmp/virlo/virlo_1714819200.mp4",
    "outputName": "virlo_1714819200.mp4",
    "fileSizeBytes": 52428800,
    "sceneCount": 7,
    "estimatedDurationSecs": 180,
    "storyboard": {
      "title": "How to fix dry skin naturally in 7 days",
      "totalScenes": 7,
      "totalDurationMins": 3,
      "scenes": [
        {
          "sceneNumber": 1,
          "durationSecs": 30,
          "voiceoverScript": "Are you tired of dry, itchy skin?",
          "motionPrompt": "Wide shot of person looking at mirror, dramatic lighting...",
          "musicMood": "dramatic"
        }
      ]
    },
    "status": "completed"
  }
}
```

**Times:**
- Storyboard generation: 5-10 seconds
- Scene rendering (parallel): 30-90 seconds per scene
- FFmpeg stitching: 10-30 seconds
- Total: 2-5 minutes

---

### POST /api/video/ab-test
**Generate 5 hook variants of the same video in parallel**

**Request:**
```json
{
  "productUrl": "https://example.com/product",
  "avatarId": "avatar-james-123",
  "voiceId": "voice-james-123",
  "aspectRatio": "9:16"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "videoId": "vid-1",
        "hook": "Wait till you see what happens...",
        "hookType": "curiosity",
        "emoji": "🤔"
      },
      {
        "videoId": "vid-2",
        "hook": "Stop using that product NOW",
        "hookType": "fear",
        "emoji": "😱"
      },
      {
        "videoId": "vid-3",
        "hook": "3.2 million people already know this...",
        "hookType": "social_proof",
        "emoji": "✅"
      },
      {
        "videoId": "vid-4",
        "hook": "Before and after in 7 days...",
        "hookType": "transformation",
        "emoji": "✨"
      },
      {
        "videoId": "vid-5",
        "hook": "Dermatologists hate this simple trick",
        "hookType": "controversy",
        "emoji": "🔥"
      }
    ],
    "baseScript": { ... }
  }
}
```

**Times:**
- All 5 videos render in parallel
- Each video: 2-8 minutes
- Total: 2-8 minutes (not 10)

---

### POST /api/video/localize
**Create 20-language versions with cultural adaptation**

**Request:**
```json
{
  "videoId": "heygen-12345",
  "script": "Original English script here...",
  "languages": [
    { "code": "es", "market": "Mexico" },
    { "code": "pt", "market": "Brazil" },
    { "code": "fr", "market": "France" },
    { "code": "de", "market": "Germany" },
    { "code": "ja", "market": "Japan" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "originalVideoId": "heygen-12345",
    "localizedVersions": [
      {
        "languageCode": "es",
        "market": "Mexico",
        "videoId": "heygen-12345-es",
        "localizedScript": "Script adaptado para el mercado mexicano..."
      },
      ...
    ]
  }
}
```

**Times:**
- Per language: 2-8 minutes
- All languages in parallel: 2-8 minutes total

---

### GET /api/video/status/:videoId
**Get HeyGen video render status**

**Response (Pending):**
```json
{
  "success": true,
  "data": {
    "videoId": "heygen-12345",
    "status": "pending",
    "videoUrl": null,
    "duration": null
  }
}
```

**Response (Completed):**
```json
{
  "success": true,
  "data": {
    "videoId": "heygen-12345",
    "status": "completed",
    "videoUrl": "https://cdn.heygen.com/videos/heygen-12345.mp4",
    "thumbnailUrl": "https://cdn.heygen.com/thumbnails/heygen-12345.jpg",
    "duration": 30,
    "error": null
  }
}
```

---

## 📝 Script Endpoints

### POST /api/script/generate
**Generate a UGC script from a product URL**

**Request:**
```json
{
  "productUrl": "https://example.com/product",
  "platform": "tiktok",
  "duration": 30,
  "tone": "casual",
  "brandVoice": ""
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hook": "This serum changed my life...",
    "problem": "Dry, aging skin",
    "solution": "Hyaluronic acid serum penetrates deep",
    "proof": "3.2M+ customers saw results",
    "cta": "Get 40% off today",
    "fullScript": "HOOK This serum changed my life... PROBLEM: Dry, aging skin... SOLUTION: ...",
    "speakingPace": 150,
    "estimatedDuration": 30,
    "hashtags": ["skincare", "serum", "beauty"],
    "trendingAngles": ["before-after", "ingredients", "testimonial"]
  }
}
```

---

### POST /api/script/hooks
**Generate 5 viral hook variants**

**Request:**
```json
{
  "productDescription": "Anti-aging serum with hyaluronic acid",
  "count": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hooks": [
      { "type": "curiosity", "text": "Wait till you see...", "emoji": "🤔" },
      { "type": "fear", "text": "Stop using...", "emoji": "😱" },
      { "type": "social_proof", "text": "3.2M people...", "emoji": "✅" },
      { "type": "transformation", "text": "Before & after...", "emoji": "✨" },
      { "type": "controversy", "text": "Doctors hate...", "emoji": "🔥" }
    ]
  }
}
```

---

### POST /api/script/trend
**Get a trend-aware script using Grok's real-time X data**

**Request:**
```json
{
  "productUrl": "https://example.com/product",
  "niche": "skincare"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trendUsed": "Before and After Transformation",
    "trendExplanation": "High engagement on TikTok right now",
    "script": "Trend-aware script leveraging current viral angle...",
    "hook": "7 days to glass skin - here's what I did",
    "expiryEstimate": "This trend stays hot for ~2-3 weeks"
  }
}
```

---

### POST /api/script/brand-voice
**Analyze brand voice from past scripts**

**Request:**
```json
{
  "scripts": [
    "Our revolutionary serum transforms skin in days...",
    "Tired of dry skin? Try our hydrating formula...",
    "Join 3M+ happy customers..."
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "toneWords": ["transformative", "revolutionary", "natural"],
    "avoidWords": ["cheap", "fake", "clinical"],
    "sentenceLength": "medium",
    "commonPhrases": ["join millions", "real results", "skin transformation"],
    "uniqueVoiceProfile": "Energetic, benefit-focused, customer-centric approach"
  }
}
```

---

### POST /api/script/storyboard
**Generate a detailed storyboard for long-form videos**

**Request:**
```json
{
  "topic": "How to fix dry skin naturally",
  "durationMins": 2,
  "style": "cinematic"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "How to fix dry skin naturally",
    "totalScenes": 5,
    "totalDurationMins": 2,
    "scenes": [
      {
        "sceneNumber": 1,
        "durationSecs": 30,
        "voiceoverScript": "Dry skin affects 60% of people worldwide...",
        "motionPrompt": "Wide shot of person in bathroom looking at mirror, warm morning lighting...",
        "musicMood": "calming",
        "onscreenText": "Dry Skin Reality",
        "cameraAngle": "wide shot",
        "transitionType": "fade"
      }
    ]
  }
}
```

---

### POST /api/script/motion-prompt
**Convert a description to Kling V3 optimized motion prompt**

**Request:**
```json
{
  "description": "A person applying sunscreen to their face",
  "style": "cinematic"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "motionPrompt": "Close-up cinematic shot of person carefully applying SPF 50 sunscreen, soft golden hour lighting, shallow depth of field, smooth camera pan, professional skincare advertisement style...",
    "cameraKeywords": ["close-up", "golden hour", "smooth pan"],
    "qualitySettings": {
      "cinematography": "Shallow depth of field with smooth motion",
      "lighting": "Golden hour with soft diffusion",
      "colorGrade": "Warm, saturated tones"
    }
  }
}
```

---

## 👤 Avatar Endpoints

### GET /api/avatar/list
**List all available avatars**

**Query Parameters:**
- `gender` (optional): `male` | `female` | `any`
- `style` (optional): `realistic` | `animated` | `any`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "avatar_id": "james-001",
      "name": "James",
      "gender": "male",
      "style": "realistic",
      "language": "en",
      "thumbnail": "...",
      "accent": "American"
    },
    {
      "avatar_id": "sophia-001",
      "name": "Sophia",
      "gender": "female",
      "style": "realistic",
      "language": "en",
      "thumbnail": "...",
      "accent": "British"
    }
    // 38+ more avatars
  ]
}
```

---

### GET /api/avatar/voices
**List voices by language**

**Query Parameters:**
- `language` (optional): `en` | `es` | `fr` | `de` | `ja` | `zh` | etc.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "voice_id": "james-en",
      "name": "James (American Male)",
      "language": "en",
      "accent": "American",
      "gender": "male"
    },
    {
      "voice_id": "sophia-en",
      "name": "Sophia (British Female)",
      "language": "en",
      "accent": "British",
      "gender": "female"
    }
    // More voices...
  ]
}
```

---

### POST /api/avatar/clone
**Create a custom avatar from video footage**

**Request:**
```json
{
  "name": "My Custom Avatar",
  "videoUrl": "https://example.com/my-video.mp4",
  "consentStatement": "I consent to use my likeness in videos"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "avatar_id": "custom-avatar-12345",
    "name": "My Custom Avatar",
    "status": "processing",
    "processingTime": "24-48 hours"
  }
}
```

---

## ⚙️ System Endpoints

### GET /health
**Check API health**

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "name": "Virlo",
  "timestamp": "2024-05-04T10:30:00Z",
  "environment": "production"
}
```

---

### GET /
**API documentation**

**Response:**
```json
{
  "message": "Virlo — AI UGC Video Factory",
  "api": {
    "short_form": "POST /api/video/generate",
    "long_form": "POST /api/video/long-form",
    "ab_test": "POST /api/video/ab-test",
    "localization": "POST /api/video/localize",
    "scripts": "POST /api/script/generate",
    "avatars": "GET /api/avatar/list"
  },
  "docs": "https://github.com/virlo-ai/virlo"
}
```

---

## 🔄 Common Workflows

### Workflow 1: Generate and Download Video
```bash
# 1. Create job
JOB_ID=$(curl -X POST http://localhost:3000/api/video/generate \
  -H "Content-Type: application/json" \
  -d '{"productUrl":"..." }' | jq -r '.jobId')

# 2. Poll until complete
while true; do
  STATUS=$(curl http://localhost:3000/api/video/job/$JOB_ID | jq -r '.data.status')
  if [ "$STATUS" = "completed" ]; then
    break
  fi
  sleep 5
done

# 3. Get final video URL
curl http://localhost:3000/api/video/job/$JOB_ID | jq '.data.result.videoId'
```

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (missing required field) |
| 404 | Not found (invalid endpoint) |
| 500 | Server error (API failure) |
| 503 | Service unavailable (Redis down, API quota exceeded) |

---

## 🔐 Rate Limiting

- Free tier: 10 requests/minute
- Pro tier: 100 requests/minute (planned)
- Enterprise: Custom limits

---

## 📞 Support

Issues? Check:
1. [Backend Implementation Docs](./BACKEND_IMPLEMENTATION.md)
2. [Setup Guide](./SETUP_GUIDE.md)
3. GitHub Issues: https://github.com/virlo-ai/virlo/issues

