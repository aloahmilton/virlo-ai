import redis from './redisClient.js';

// Webhook utility function
async function sendWebhook(event, jobId, data = {}) {
  const webhookUrl = process.env.WEBHOOK_URL;
  const webhookSecret = process.env.WEBHOOK_SECRET;

  if (!webhookUrl) {
    console.log(`ℹ️ No webhook URL configured, skipping ${event} for job ${jobId}`);
    return;
  }

  try {
    const payload = {
      event,
      jobId,
      timestamp: new Date().toISOString(),
      data
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    if (webhookSecret) {
      headers['x-webhook-secret'] = webhookSecret;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log(`📡 Webhook sent: ${event} for job ${jobId}`);
    } else {
      console.error(`❌ Webhook failed: ${event} for job ${jobId}`, response.status);
    }
  } catch (err) {
    console.error(`❌ Webhook error: ${event} for job ${jobId}`, err.message);
  }
}

// Job queue operations
export const jobQueue = {
  // Create a new job
  async createJob(type, data) {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const job = {
      id: jobId,
      type,
      status: 'pending',
      data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await redis.setex(`job:${jobId}`, 3600, JSON.stringify(job)); // 1 hour TTL
    console.log(`📋 Created job: ${jobId} (${type})`);
    return jobId;
  },

  // Get job status
  async getJob(jobId) {
    const jobData = await redis.get(`job:${jobId}`);
    return jobData ? JSON.parse(jobData) : null;
  },

  // Update job status
  async updateJob(jobId, updates) {
    const job = await this.getJob(jobId);
    if (!job) return null;

    const updatedJob = {
      ...job,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await redis.setex(`job:${jobId}`, 3600, JSON.stringify(updatedJob));

    // Send webhook for status changes
    if (updates.status) {
      const event = updates.status === 'completed' ? 'video.completed' :
                   updates.status === 'failed' ? 'video.failed' : 'job.progress';
      await sendWebhook(event, jobId, { status: updates.status, ...updates });
    }

    console.log(`📊 Updated job: ${jobId} -> ${updates.status || 'updated'}`);
    return updatedJob;
  },

  // Mark job as completed
  async completeJob(jobId, result) {
    return this.updateJob(jobId, { status: 'completed', result, completedAt: new Date().toISOString() });
  },

  // Mark job as failed
  async failJob(jobId, error) {
    return this.updateJob(jobId, { status: 'failed', error: error.message || error, failedAt: new Date().toISOString() });
  },

  // Update job progress
  async updateProgress(jobId, progress, message) {
    return this.updateJob(jobId, { progress, message });
  }
};

export default jobQueue;