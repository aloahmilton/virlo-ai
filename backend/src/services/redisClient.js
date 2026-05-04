/**
 * Redis client — job queue + caching layer
 * Cloud: redis-16939.c14.us-east-1-2.ec2.cloud.redislabs.com
 */

import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST || "redis-16939.c14.us-east-1-2.ec2.cloud.redislabs.com",
  port: parseInt(process.env.REDIS_PORT || "16939"),
  username: process.env.REDIS_USER || "default",
  password: process.env.REDIS_PASSWORD,
  tls: {},           // Redis Cloud requires TLS
  lazyConnect: true,
  retryStrategy: (times) => Math.min(times * 200, 3000),
});

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err.message));

export default redis;
