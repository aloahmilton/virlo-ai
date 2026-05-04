/**
 * JobQueue — async video job tracker using Redis
 *
 * HeyGen renders take 2-10 min. Instead of blocking the HTTP request,
 * we store the job in Redis and let the client poll /api/video/status/:jobId
 */

import redis from "../services/redisClient.js";
import { randomUUID } from "crypto";

const JOB_TTL = 60 * 60 * 2; // 2 hours

export const JobStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
};

/** Create a new job and return its ID */
export async function createJob(type, payload) {
  const jobId = randomUUID();
  const job = {
    jobId,
    type,
    status: JobStatus.PENDING,
    payload,
    result: null,
    error: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await redis.set(`job:${jobId}`, JSON.stringify(job), "EX", JOB_TTL);
  return jobId;
}

/** Get a job by ID */
export async function getJob(jobId) {
  const raw = await redis.get(`job:${jobId}`);
  return raw ? JSON.parse(raw) : null;
}

/** Update job status + optional result/error */
export async function updateJob(jobId, updates) {
  const job = await getJob(jobId);
  if (!job) return null;
  const updated = { ...job, ...updates, updatedAt: Date.now() };
  await redis.set(`job:${jobId}`, JSON.stringify(updated), "EX", JOB_TTL);
  return updated;
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
