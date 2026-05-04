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
app.use(cors());
app.use(express.json());

// Serve static assets (CSS, JS, images)
app.use(express.static(path.join(__dirname, "../public")));

// API routes
app.use("/api/video", videoRouter);
app.use("/api/script", scriptRouter);
app.use("/api/avatar", avatarRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", version: "1.0.0", name: "Virlo" });
});

// All other routes → serve the homepage SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🎬  Virlo running at http://localhost:${PORT}\n`);
});
