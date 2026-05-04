#!/usr/bin/env node

/**
 * Webhook Test Server
 * Simple HTTP server to test Virlo webhook callbacks
 */

import http from 'http';

const PORT = 3002;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/webhooks/virlo') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const webhookData = JSON.parse(body);
        const secret = req.headers['x-webhook-secret'];

        console.log('🔔 Webhook received!');
        console.log('Event:', webhookData.event);
        console.log('Job ID:', webhookData.jobId);
        console.log('Secret:', secret ? 'Present' : 'Missing');
        console.log('Data:', JSON.stringify(webhookData.data, null, 2));
        console.log('---');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, received: true }));
      } catch (err) {
        console.error('❌ Webhook parse error:', err.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`🪝 Webhook test server running at http://localhost:${PORT}`);
  console.log(`📡 Listening for webhooks at /api/webhooks/virlo`);
  console.log(`🔧 Test with: curl -X POST http://localhost:3002/api/webhooks/virlo -H "Content-Type: application/json" -d '{"event":"test","jobId":"test123"}'`);
});