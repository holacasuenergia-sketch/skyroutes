import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Get Stripe Secret Key from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

// Firebase Admin
const admin = require('firebase-admin');
const credential = JSON.parse(
  Buffer.from(process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64 || '', 'base64').toString('utf-8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: credential,
    }),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
  });
}

const db = admin.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Simple admin password check (for MVP)
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { bookingId, amount, description, clientEmail } = req.body;

    // Validation
    if (!bookingId || !amount || !clientEmail) {
      return res.status(400).json({ error: 'bookingId, amount, and clientEmail are required' });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: description || 'Reserva de vuelo SkyRoutes',
              description: `Booking ID: ${bookingId}`,
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyroutes-plum.vercel.app'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyroutes-plum.vercel.app'}/payment-cancel`,
      customer_email: clientEmail,
      metadata: {
        bookingId: bookingId,
        clientEmail: clientEmail,
      },
    });

    const paymentUrl = session.url;

    // Update booking with Stripe link
    await db.collection('bookings').doc(bookingId).update({
      stripeLink: paymentUrl,
      stripePaymentId: session.id,
      status: 'confirmed',
      updatedAt: new Date().toISOString(),
    });

    // Get updated booking
    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    const booking = {
      id: bookingDoc.id,
      ...bookingDoc.data(),
    };

    // TODO: Send email to client with payment link
    // await sendPaymentLinkEmail(clientEmail, bookingId, paymentUrl, amount);

    res.status(200).json({
      success: true,
      paymentUrl: paymentUrl,
      sessionId: session.id,
      booking: booking,
      message: 'Stripe payment link generated successfully',
    });

  } catch (error) {
    console.error('Error generating Stripe link:', error);
    res.status(500).json({ error: 'Failed to generate Stripe link', details: error.message });
  }
}