// API Route: Ultra Simple Test - Always Return JSON
// GET/POST /api/test

export default async function handler(req, res) {
  // Set JSON header FIRST
  res.setHeader('Content-Type', 'application/json');

  return res.status(200).json({
    status: 'ok',
    message: 'API is working on Vercel serverless',
    method: req.method,
    timestamp: new Date().toISOString(),
    hint: 'This proves API routes are working'
  });
}