import { NextApiRequest, NextApiResponse } from 'next';

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
  if (req.method !== 'PUT' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Simple admin password check (for MVP)
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { bookingId, status, stripeLink, stripePaymentId } = req.body;

    // Validation
    if (!bookingId) {
      return res.status(400).json({ error: 'bookingId is required' });
    }

    // Valid statuses
    const validStatuses = ['pending', 'in_progress', 'confirmed', 'paid', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (status) {
      updateData.status = status;
    }

    if (stripeLink) {
      updateData.stripeLink = stripeLink;
    }

    if (stripePaymentId) {
      updateData.stripePaymentId = stripePaymentId;
    }

    // Update booking
    await db.collection('bookings').doc(bookingId).update(updateData);

    // Get updated booking
    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    const booking = {
      id: bookingDoc.id,
      ...bookingDoc.data(),
    };

    // TODO: Send email to client if status changes
    // if (status && status !== 'pending') {
    //   await sendStatusUpdateEmail(booking);
    // }

    res.status(200).json({
      success: true,
      booking: booking,
      message: 'Booking updated successfully',
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking', details: error.message });
  }
}