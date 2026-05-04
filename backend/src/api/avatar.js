import { Router } from "express";
import { HeyGenService } from "../services/heygenService.js";

export const avatarRouter = Router();

const getHeygen = () => new HeyGenService(process.env.HEYGEN_API_KEY);

/** GET /api/avatar/list — list available avatars */
avatarRouter.get("/list", async (req, res) => {
  try {
    const { gender, style } = req.query;
    const heygen = getHeygen();
    const avatars = await heygen.getAvatars({ gender, style });
    res.json({ success: true, data: avatars });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** GET /api/avatar/voices — list voices by language */
avatarRouter.get("/voices", async (req, res) => {
  try {
    const { language = "en" } = req.query;
    const heygen = getHeygen();
    const voices = await heygen.getVoices(language);
    res.json({ success: true, data: voices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** POST /api/avatar/clone — create a custom avatar from video footage */
avatarRouter.post("/clone", async (req, res) => {
  try {
    const { name, videoUrl, consentStatement } = req.body;
    const heygen = getHeygen();
    const result = await heygen.createCustomAvatar({ name, videoUrl, consentStatement });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
