import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

import { videoRouter } from "./api/video.js";
import { scriptRouter } from "./api/script.js";
import { avatarRouter } from "./api/avatar.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static assets (CSS, JS, images)
app.use(express.static(path.join(__dirname, "../public")));

// API routes
app.use("/api/video", videoRouter);
app.use("/api/script", scriptRouter);
app.use("/api/avatar", avatarRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    version: "1.0.0", 
    name: "Virlo",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Welcome message
app.get("/", (req, res) => {
  res.json({
    message: "🎬 Virlo — AI UGC Video Factory",
    api: {
      short_form: "POST /api/video/generate",
      long_form: "POST /api/video/long-form",
      ab_test: "POST /api/video/ab-test",
      localization: "POST /api/video/localize",
      scripts: "POST /api/script/generate",
      avatars: "GET /api/avatar/list",
      status: "GET /api/video/status/:videoId",
      job: "GET /api/video/job/:jobId",
    },
    docs: "https://github.com/virlo-ai/virlo/blob/main/BACKEND_IMPLEMENTATION.md"
  });
});

// All other routes → 404
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found. See GET / for API docs" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🎬  Virlo running at http://localhost:${PORT}`);
  console.log(`📝  API docs at http://localhost:${PORT}`);
  console.log(`🔗  Frontend: ${process.env.FRONTEND_URL || "http://localhost:3001"}\n`);
});
