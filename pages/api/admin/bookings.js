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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Simple admin password check (for MVP)
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get query parameters
    const status = (req.query.status as string) || null;
    const type = (req.query.type as string) || null;

    // Build query
    let query = db.collection('bookings').orderBy('createdAt', 'desc');

    // Filter by status if provided
    if (status) {
      query = query.where('status', '==', status);
    }

    // Filter by type if provided
    if (type) {
      query = query.where('type', '==', type);
    }

    // Get bookings
    const snapshot = await query.get();

    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      bookings: bookings,
      total: bookings.length,
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
  }
}