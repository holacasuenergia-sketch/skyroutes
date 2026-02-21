// Vercel API Function - Payment creation
const crypto = require('crypto');

// Simple Stripe SDK client (minimal implementation)
// In production, use: npm install stripe
function createStripeClient(secretKey) {
  return {
    checkout: {
      sessions: {
        create: async (params) => {
          const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${secretKey}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              'payment_method_types[]': params.payment_method_types[0],
              'line_items[0][price_data][currency]': params.line_items[0].price_data.currency,
              'line_items[0][price_data][product_data][name]': params.line_items[0].price_data.product_data.name,
              'line_items[0][price_data][product_data][description]': params.line_items[0].price_data.product_data.description,
              'line_items[0][price_data][unit_amount]': params.line_items[0].price_data.unit_amount,
              'line_items[0][quantity]': '1',
              'mode': params.mode,
              'success_url': params.success_url,
              'cancel_url': params.cancel_url,
              ...(params.customer_email ? { 'customer_email': params.customer_email } : {}),
              'expires_at': params.expires_at,
            }),
          });

          if (!response.ok) {
            const error = await response.text();
            throw new Error(`Stripe error: ${error}`);
          }

          return await response.json();
        }
      }
    }
  };
}

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

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_...';

  if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY === 'sk_test_...') {
    return res.status(500).json({ error: 'Stripe not configured - STRIPE_SECRET_KEY missing' });
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

    // Create Stripe client
    const stripe = createStripeClient(STRIPE_SECRET_KEY);

    // Create Checkout Session
    const successUrl = `${process.env.NEXT_PUBLIC_URL || 'https://skyroutes.vercel.app'}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_URL || 'https://skyroutes.vercel.app'}/cancel?session_id={CHECKOUT_SESSION_ID}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${concept} - ${customer}`,
            description: `Pago para: ${customer}${email ? ` (${email})` : ''}`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: email || undefined,
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    });

    res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
      expiresAt: new Date(session.expires_at * 1000).toISOString()
    });

  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      error: error.message || 'Failed to create payment link'
    });
  }
}