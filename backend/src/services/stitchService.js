/**
 * StitchService — long-form video assembly engine
 *
 * Takes rendered scene clips + voiceover + music
 * → concatenates with FFmpeg into a single publish-ready MP4
 *
 * This is what beats Runway/Pika on length:
 * Each scene renders fresh → quality never degrades
 */

import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import https from "https";
import http from "http";

const execAsync = promisify(exec);
const TMP_DIR = "/tmp/virlo";

export class StitchService {
  constructor() {
    this.ensureTmpDir();
  }

  async ensureTmpDir() {
    await fs.mkdir(TMP_DIR, { recursive: true });
  }

  /** Download a file from URL to local disk */
  async downloadFile(url, destPath) {
    const client = url.startsWith("https") ? https : http;
    const file = createWriteStream(destPath);

    await new Promise((resolve, reject) => {
      client.get(url, (response) => {
        pipeline(response, file).then(resolve).catch(reject);
      }).on("error", reject);
    });
  }

  /**
   * Main stitch: takes ordered scene video URLs + storyboard
   * Downloads clips, generates concat list, runs FFmpeg
   * Returns path to final MP4
   */
  async stitchScenes(scenes, storyboard, options = {}) {
    const {
      voiceoverAudioUrl = null,  // Pre-rendered TTS audio URL (optional)
      musicUrl = null,           // Background music URL (optional)
      outputName = `virlo_${Date.now()}`,
      captionStyle = storyboard.captionStyle || "none",
    } = options;

    const jobDir = path.join(TMP_DIR, outputName);
    await fs.mkdir(jobDir, { recursive: true });

    // 1. Download all scene clips in parallel
    console.log(`[Stitch] Downloading ${scenes.length} scene clips...`);
    await Promise.all(
      scenes.map(async (scene, i) => {
        const destPath = path.join(jobDir, `scene_${String(i).padStart(3, "0")}.mp4`);
        await this.downloadFile(scene.videoUrl, destPath);
        scene.localPath = destPath;
      })
    );

    // 2. Write FFmpeg concat list
    const concatListPath = path.join(jobDir, "concat.txt");
    const concatContent = scenes
      .map((s) => `file '${s.localPath}'`)
      .join("\n");
    await fs.writeFile(concatListPath, concatContent);

    // 3. Build FFmpeg command
    const outputPath = path.join(jobDir, `${outputName}.mp4`);
    let ffmpegCmd;

    if (voiceoverAudioUrl) {
      const audioPath = path.join(jobDir, "voiceover.mp3");
      await this.downloadFile(voiceoverAudioUrl, audioPath);

      ffmpegCmd = [
        "ffmpeg -y",
        `-f concat -safe 0 -i "${concatListPath}"`,
        `-i "${audioPath}"`,
        musicUrl ? `-i "${path.join(jobDir, "music.mp3")}"` : "",
        "-c:v libx264 -preset fast -crf 23",
        musicUrl
          ? `-filter_complex "[1:a][2:a]amix=inputs=2:duration=first:weights=1 0.15[aout]" -map 0:v -map "[aout]"`
          : "-c:a aac -b:a 128k -shortest",
        `-movflags +faststart "${outputPath}"`,
      ].filter(Boolean).join(" ");
    } else {
      ffmpegCmd = [
        "ffmpeg -y",
        `-f concat -safe 0 -i "${concatListPath}"`,
        "-c:v libx264 -preset fast -crf 23",
        "-an",
        `-movflags +faststart "${outputPath}"`,
      ].join(" ");
    }

    // 4. Run FFmpeg
    console.log(`[Stitch] Running FFmpeg concat...`);
    await execAsync(ffmpegCmd);
    console.log(`[Stitch] Done → ${outputPath}`);

    // 5. Return output path + metadata
    const stats = await fs.stat(outputPath);
    return {
      outputPath,
      outputName: `${outputName}.mp4`,
      fileSizeBytes: stats.size,
      sceneCount: scenes.length,
      estimatedDurationSecs: storyboard.totalDurationSecs,
    };
  }

  /** Clean up temp files for a job */
  async cleanup(outputName) {
    const jobDir = path.join(TMP_DIR, outputName);
    await fs.rm(jobDir, { recursive: true, force: true });
  }
}
