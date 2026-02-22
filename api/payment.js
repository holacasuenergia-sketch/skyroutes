// Vercel API Function - PayPal Payment creation
const crypto = require('crypto');

function verifyToken(token, secret) {
  try {
    const [header64, payload64, sig64] = token.split('.');

    const expectedSig = crypto.createHmac('sha256', secret).update(`${header64}.${payload64}`).digest('base64url');

    if (sig64 !== expectedSig) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payload64, 'base64url'));

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

// Simple PayPal API Client
async function createPayPalOrder(clientId, clientSecret, mode, orderData) {
  const baseUrl = mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

  // Get Access Token
  const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials'
    }),
    auth: `${clientId}:${clientSecret}`,
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();
    throw new Error(`PayPal token error: ${error}`);
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // Create Order
  const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(orderData),
  });

  if (!orderResponse.ok) {
    const error = await orderResponse.text();
    throw new Error(`PayPal order error: ${error}`);
  }

  return await orderResponse.json();
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

  const JWT_SECRET = process.env.JWT_SECRET || 'skyroutes_secret_change_me';

  // Verify authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token, JWT_SECRET);

  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }

  if (decoded.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden - Admin only' });
  }

  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
  const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox';

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    return res.status(500).json({ error: 'PayPal not configured - PAYPAL_CLIENT_ID/SECRET missing' });
  }

  try {
    const { customer, email, amount, concept } = req.body;

    // Validate inputs
    if (!customer || !amount || !concept) {
      return res.status(400).json({
        error: 'Missing required fields: customer, amount, concept'
      });
    }

    if (amount <= 0 || amount > 100000) {
      return res.status(400).json({ error: 'Invalid amount - must be between €1 and €100,000' });
    }

    // PayPal Order
    const successUrl = `${process.env.NEXT_PUBLIC_URL || 'https://skyroutes-one.vercel.app'}/success?payment_id={payment_id}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_URL || 'https://skyroutes-one.vercel.app'}/cancel?payment_id={payment_id}`;

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        description: `${concept} - ${customer}`,
        custom_id: customer,
        soft_descriptor: concept.substring(0, 22),
        amount: {
          currency_code: 'EUR',
          value: amount.toFixed(2),
        },
      }],
      application_context: {
        brand_name: 'SkyRoutes',
        landing_page: 'BILLING',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        return_url: successUrl,
        cancel_url: cancelUrl,
      },
    };

    // Add PayPal Client ID to URL for frontend
    const extendedSuccessUrl = `${successUrl}&client_id=${PAYPAL_CLIENT_ID}`;
    const extendedCancelUrl = `${cancelUrl}&client_id=${PAYPAL_CLIENT_ID}`;

    orderData.application_context.return_url = extendedSuccessUrl;
    orderData.application_context.cancel_url = extendedCancelUrl;

    // Create PayPal Order
    const order = await createPayPalOrder(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_MODE, orderData);

    // Extract approval URL from links
    const approveLink = order.links.find(link => link.rel === 'approve');

    if (!approveLink) {
      throw new Error('PayPal order created but no approve link returned');
    }

    // Calculate expiry (PayPal orders expire in 3 hours by default)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 3);

    res.status(200).json({
      success: true,
      url: approveLink.href,
      orderId: order.id,
      expiresAt: expiresAt.toISOString()
    });

  } catch (error) {
    console.error('PayPal payment error:', error);
    res.status(500).json({
      error: error.message || 'Failed to create PayPal payment link'
    });
  }
}