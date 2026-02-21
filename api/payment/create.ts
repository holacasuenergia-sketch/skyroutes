// ts-ignore
import Stripe from 'stripe';
import { verifyAuth } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...');

export default async function handler(req, res) {
  // Verificar que el request sea autenticado
  const authResult = await verifyAuth(req);
  if (!authResult.valid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customer, email, amount, concept } = req.body;

  // Validar datos
  if (!customer || !amount || !concept) {
    return res.status(400).json({
      error: 'Missing required fields: customer, amount, concept'
    });
  }

  if (amount <= 0 || amount > 100000) { // Máx 100.000 EUR
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    // Crear Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${concept} - ${customer}`,
            description: `Pago para: ${customer}${email ? ` (${email})` : ''}`,
            metadata: {
              customer,
              email: email || '',
              concept
            }
          },
          unit_amount: Math.round(amount * 100), // Stripe usa centavos
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'https://skyroutes.vercel.app'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'https://skyroutes.vercel.app'}/cancel?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: email || undefined,
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // Expira en 24h
    });

    res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
      expiresAt: new Date(session.expires_at * 1000).toISOString()
    });

  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({
      error: error.message || 'Failed to create payment link'
    });
  }
}