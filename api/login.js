// Vercel API Function - Login handler
const crypto = require('crypto');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'skyroutes25@';
const JWT_SECRET = process.env.JWT_SECRET || 'skyroutes_secret_change_me';

function createToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + (60 * 60) // 1 hour
  };

  const header64 = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payload64 = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(`${header64}.${payload64}`).digest('base64url');

  return `${header64}.${payload64}.${sig}`;
}

function verifyToken(token) {
  try {
    const [header64, payload64, sig64] = token.split('.');

    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header64}.${payload64}`).digest('base64url');

    if (sig64 !== expectedSig) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payload64, 'base64url'));

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = createToken({ role: 'admin' });

    res.status(200).json({
      success: true,
      token,
      expiresIn: '1h'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}