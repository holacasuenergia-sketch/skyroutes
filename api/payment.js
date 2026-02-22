// Vercel API Function - Ría + Western Union (sin PayPal)
const crypto = require('crypto');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'skyroutes25@';
const JWT_SECRET = process.env.JWT_SECRET || 'skyroutes_secret_change_me';

function createToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + (60 * 60)
  };

  const header64 = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payload64 = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(`${header64}.${payload64}`).digest('base64url');

  return `${header64}.${payload64}.${sig}`;
}

function verifyToken(token, secret) {
  try {
    const [header64, payload64, sig64] = token.split('.');
    const expectedSig = crypto.createHmac('sha256', secret).update(`${header64}.${payload64}`).digest('base64url');
    if (sig64 !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(payload64, 'base64url'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token, JWT_SECRET);
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' });
  if (decoded.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  try {
    const { customer, amount, concept } = req.body;

    if (!customer || !amount || !concept) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    res.status(200).json({
      success: true,
      message: 'Instrucciones generadas exitosamente'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}