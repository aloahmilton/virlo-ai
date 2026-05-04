/**
 * JobQueue — async video job tracker using Redis
 *
 * HeyGen renders take 2-10 min. Instead of blocking the HTTP request,
 * we store the job in Redis and let the client poll /api/video/status/:jobId
 */

import jobQueue from "../services/jobQueue.js";

export const JobStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
};

/** Create a new job and return its ID */
export async function createJob(type, payload) {
  return await jobQueue.createJob(type, payload);
}

/** Get a job by ID */
export async function getJob(jobId) {
  return await jobQueue.getJob(jobId);
}

/** Update job status + optional result/error */
export async function updateJob(jobId, updates) {
  return await jobQueue.updateJob(jobId, updates);
}

/** Cache a value with TTL (for avatar/voice lists) */
export async function cacheSet(key, value, ttlSeconds = 300) {
  await redis.set(`cache:${key}`, JSON.stringify(value), "EX", ttlSeconds);
}

/** Get a cached value */
export async function cacheGet(key) {
  const raw = await redis.get(`cache:${key}`);
  return raw ? JSON.parse(raw) : null;
}
