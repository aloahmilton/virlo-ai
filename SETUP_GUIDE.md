# Virlo — Complete Setup & Deployment Guide

## 🚀 Quick Start (Local Development)

### Step 1: Clone the repository
```bash
git clone https://github.com/aloahmilton/virlo-ai.git
cd virlo-ai
```

### Step 2: Set up backend

```bash
# Install dependencies
cd backend
npm install

# Create environment file
cp .env.example .env

# Edit .env with your API keys
# GROK_API_KEY=xai-...
# HEYGEN_API_KEY=...
# FAL_API_KEY=...
# REDIS_PASSWORD=...

# Start backend (development)
npm run dev
# Server runs at http://localhost:3000
```

### Step 3: Set up frontend

```bash
cd frontend
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local if needed (frontend should connect to backend)

# Start frontend (development)
npm run dev
# App runs at http://localhost:3001
```

### Step 4: Test the pipeline

Open http://localhost:3001 in your browser and:
1. Paste a product URL (e.g., from Amazon, Shopify)
2. Click "Generate video"
3. Watch the progress bar as Grok researches → HeyGen renders
4. See the generated script in real-time

**First video typically takes 3-10 minutes** (HeyGen render time)

---

## 📋 Prerequisites

You'll need API keys for:

### 1. **Grok 4.20** (Script Generation)
- Get key: https://x.ai console
- Free tier: 100K tokens/month
- Model: `grok-4-20-reasoning`
- Cost: ~$0.02 per short-form script

### 2. **HeyGen** (Avatar Rendering)
- Get key: https://www.heygen.com/api
- Free tier: 10 min/month video generation
- 40+ avatars, 175+ languages
- Cost: ~$0.02 per 10s video

### 3. **fal.ai** (B-roll Generation)
- Get key: https://www.fal.ai
- Free tier: $5 credits/month
- 600+ models (Kling, Veo, Hailuo, etc.)
- Cost: ~$0.05 per 5s video clip

### 4. **Redis Cloud** (Job Queue)
- Get: https://redis.com/cloud
- Free tier: 30MB database
- Connection: TLS required
- Used for async job tracking

---

## 🏗️ Architecture

```
Frontend (Next.js 15)
    ↓ HTTP POST /api/video/generate
Backend (Express + Node.js)
    ↓
VideosPipeline (orchestrator)
    ├─→ GrokService (script + storyboard)
    ├─→ HeyGenService (avatar + lip-sync)
    ├─→ FalService (B-roll generation)
    ├─→ StitchService (FFmpeg assembly)
    └─→ JobQueue (Redis async tracking)
    ↓
Output: MP4 video URLs
```

---

## 🔧 Environment Setup

### Backend (.env)

```bash
# Intelligence Layer
GROK_API_KEY=xai-your-key-here

# Avatar & Voice
HEYGEN_API_KEY=your-key-here

# B-roll & Video Generation
FAL_API_KEY=your-key-here

# Job Queue
REDIS_HOST=redis-xxxxx.c14.us-east-1-2.ec2.cloud.redislabs.com
REDIS_PORT=16939
REDIS_USER=default
REDIS_PASSWORD=your-password-here

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Virlo
NEXT_PUBLIC_ENABLE_LONG_FORM=true
NEXT_PUBLIC_ENABLE_AB_TESTING=true
NEXT_PUBLIC_ENABLE_LOCALIZATION=true
```

---

## 📝 API Usage Examples

### Generate Short-Form Video
```bash
curl -X POST http://localhost:3000/api/video/generate \
  -H "Content-Type: application/json" \
  -d '{
    "productUrl": "https://example.com/product/serum",
    "platform": "tiktok",
    "duration": 30,
    "tone": "casual"
  }'

# Response:
{
  "success": true,
  "jobId": "uuid-here",
  "status": "pending",
  "message": "Job queued. Poll /api/video/job/:jobId for updates."
}
```

### Poll Job Status
```bash
curl http://localhost:3000/api/video/job/{jobId}

# Response (while processing):
{
  "success": true,
  "data": {
    "jobId": "...",
    "status": "processing",
    "progress": {
      "step": 2,
      "total": 4,
      "message": "Rendering avatar..."
    }
  }
}

# Response (complete):
{
  "success": true,
  "data": {
    "jobId": "...",
    "status": "completed",
    "result": {
      "videoId": "heygen-video-id",
      "scriptData": { ... },
      "status": "processing",
      "estimatedReadyIn": "2-10 minutes"
    }
  }
}
```

### Generate with Custom Brand Voice
```bash
curl -X POST http://localhost:3000/api/video/generate \
  -H "Content-Type: application/json" \
  -d '{
    "productUrl": "https://example.com/product",
    "platform": "instagram",
    "tone": "energetic",
    "brandVoice": "Use casual language, lots of emojis, Gen-Z slang"
  }'
```

### Generate Long-Form Video
```bash
curl -X POST http://localhost:3000/api/video/long-form \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "How to fix dry skin in 7 days",
    "durationMins": 3,
    "style": "cinematic",
    "tone": "engaging"
  }'

# Response:
{
  "success": true,
  "data": {
    "outputPath": "/tmp/virlo/virlo_1234567890.mp4",
    "outputName": "virlo_1234567890.mp4",
    "fileSizeBytes": 12582912,
    "sceneCount": 7,
    "estimatedDurationSecs": 180
  }
}
```

### A/B Test (5 Hook Variants)
```bash
curl -X POST http://localhost:3000/api/video/ab-test \
  -H "Content-Type: application/json" \
  -d '{
    "productUrl": "https://example.com/product",
    "avatarId": "avatar-123",
    "voiceId": "voice-456"
  }'

# Response: 5 different videos with different hooks
{
  "success": true,
  "data": {
    "videos": [
      {
        "videoId": "vid-1",
        "hook": "Wait till you see this...",
        "hookType": "curiosity"
      },
      ...
    ],
    "baseScript": { ... }
  }
}
```

---

## 🧪 Testing

### 1. Test Backend Health
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","version":"1.0.0","name":"Virlo"}
```

### 2. Test Script Generation (Grok)
```bash
curl -X POST http://localhost:3000/api/script/generate \
  -H "Content-Type: application/json" \
  -d '{
    "productUrl": "https://www.amazon.com/dp/B001234567",
    "platform": "tiktok"
  }'
```

### 3. Test Avatar Listing (HeyGen)
```bash
curl http://localhost:3000/api/avatar/list
```

### 4. Test Full Pipeline
```bash
# 1. Generate
JOB_ID=$(curl -X POST http://localhost:3000/api/video/generate \
  -H "Content-Type: application/json" \
  -d '{"productUrl":"test"}' | jq -r '.jobId')

# 2. Poll every 5s
for i in {1..60}; do
  curl http://localhost:3000/api/video/job/$JOB_ID | jq '.data.status'
  sleep 5
done
```

---

## 🚨 Troubleshooting

### Problem: "Redis connection failed"
**Solution:** Check Redis credentials in `.env`
```bash
# Test Redis connection:
redis-cli -h $REDIS_HOST -u redis://$REDIS_USER:$REDIS_PASSWORD@$REDIS_HOST:$REDIS_PORT
```

### Problem: "Grok API error: Unauthorized"
**Solution:** Verify Grok API key is valid
```bash
# Test Grok:
curl https://api.x.ai/v1/chat/completions \
  -H "Authorization: Bearer $GROK_API_KEY" \
  -d '{"model":"grok-4-20-reasoning","messages":[{"role":"user","content":"test"}]}'
```

### Problem: "HeyGen timeout"
**Solution:** HeyGen videos take 2-10 minutes. This is normal.
- Check status: `GET /api/video/status/:videoId`
- Polling will eventually return the video URL

### Problem: CORS errors in browser
**Solution:** Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL
```bash
# If frontend is on different port, update:
FRONTEND_URL=http://localhost:3001
```

### Problem: "fal.ai job timed out"
**Solution:** Some long-form renders can take longer
- Increase timeout in falService.js: `waitForResult(requestId, 600000)`
- Or try shorter scenes/lower resolution

---

## 📦 Deployment

### Deploy Backend (Vercel, Heroku, AWS)

```bash
# Environment variables to set:
GROK_API_KEY=...
HEYGEN_API_KEY=...
FAL_API_KEY=...
REDIS_HOST=...
REDIS_PORT=...
REDIS_PASSWORD=...
NODE_ENV=production
FRONTEND_URL=https://your-frontend.com
```

### Deploy Frontend (Vercel)

```bash
npm run build
# Then deploy with Vercel CLI or GitHub integration
```

---

## 📊 Monitoring

### Check API performance
```bash
# Response time check:
time curl http://localhost:3000/api/video/job/{jobId}

# Queue depth check:
curl http://localhost:3000/api/video/job/{jobId} | jq '.data'
```

### Monitor Redis queue
```bash
# Count pending jobs:
redis-cli KEYS "job:*" | wc -l

# Get job details:
redis-cli GET "job:{jobId}"
```

---

## 💡 Pro Tips

1. **Batch Processing**: Send multiple `/api/video/generate` requests in sequence for batch video creation
2. **Caching**: Grok results are cached per product URL to avoid redundant API calls
3. **Model Selection**: For long-form, Kling V3 offers best balance of quality/speed
4. **Language Support**: HeyGen supports 175+ languages automatically with lip-sync
5. **Brand Voice**: Train the system with 5+ past scripts for better voice matching

---

## 📚 Documentation

- [Backend Implementation](./BACKEND_IMPLEMENTATION.md)
- [Frontend Components](./frontend/README.md)
- [API Reference](./docs/API.md)

---

## 🤝 Contributing

PRs welcome! Please test locally first:
```bash
npm run dev    # backend
npm run dev    # frontend (in separate terminal)
# Then test the flows
```

---

## 📄 License

MIT

---

**Questions?** Check the issues or ask in the Discord community!
