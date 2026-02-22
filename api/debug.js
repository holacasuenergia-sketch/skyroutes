// Vercel API Function - Debug environment variables
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Debug info
  const debugInfo = {
    env: {
      PAYPAL_MODE: process.env.PAYPAL_MODE || 'NOT_SET',
      PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID ? 'EXISTS' : 'NOT_SET',
      PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET ? 'EXISTS' : 'NOT_SET',
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'EXISTS' : 'NOT_SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'EXISTS' : 'NOT_SET',
      NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || 'NOT_SET',
    },
    timestamp: new Date().toISOString()
  };

  res.status(200).json(debugInfo);
}