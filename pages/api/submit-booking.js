import { NextApiRequest, NextApiResponse } from 'next';

// Firebase Admin
const admin = require('firebase-admin');
const credential = JSON.parse(
  Buffer.from(process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64 || '', 'base64').toString('utf-8')
);

// Initialize Firebase Admin
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

interface BookingRequest {
  type: 'flight' | 'hotel';
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  // Flight fields
  route?: string;
  tripType?: 'oneway' | 'roundtrip';
  departureDate?: string;
  returnDate?: string;
  passengers?: number;
  airline?: string;
  flightNumber?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: number;
  basePrice?: number;
  // Hotel fields
  hotelName?: string;
  hotelImage?: string;
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  basePricePerNight?: number;
  totalNights?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const booking: BookingRequest = req.body;

    // Validation
    if (!booking.clientName || !booking.clientEmail || !booking.clientPhone) {
      return res.status(400).json({ error: 'Missing required fields: clientName, clientEmail, or clientPhone' });
    }

    // Generate booking ID
    const bookingId = `SOL-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Calculate final price with markup
    let finalPrice = 0;
    let basePrice = 0;

    if (booking.type === 'flight') {
      basePrice = booking.basePrice || 0;
      finalPrice = Math.round(basePrice * 1.15); // 15% markup for flights
    } else if (booking.type === 'hotel') {
      const basePricePerNight = booking.basePricePerNight || 0;
      const totalNights = booking.totalNights || 1;
      basePrice = basePricePerNight * totalNights;
      finalPrice = Math.round(basePrice * 1.20); // 20% markup for hotels
    }

    // Create booking document
    const bookingData = {
      id: bookingId,
      type: booking.type,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      clientPhone: booking.clientPhone,
      // Flight specific
      route: booking.route || null,
      tripType: booking.tripType || null,
      departureDate: booking.departureDate || null,
      returnDate: booking.returnDate || null,
      passengers: booking.passengers || null,
      airline: booking.airline || null,
      flightNumber: booking.flightNumber || null,
      departureTime: booking.departureTime || null,
      arrivalTime: booking.arrivalTime || null,
      duration: booking.duration || null,
      basePrice: basePrice,
      finalPrice: finalPrice,
      // Hotel specific
      hotelName: booking.hotelName || null,
      hotelImage: booking.hotelImage || null,
      location: booking.location || null,
      checkIn: booking.checkIn || null,
      checkOut: booking.checkOut || null,
      guests: booking.guests || null,
      basePricePerNight: booking.basePricePerNight || null,
      totalNights: booking.totalNights || null,
      // Payment
      stripeLink: null,
      stripePaymentId: null,
    };

    // Save to Firestore
    await db.collection('bookings').doc(bookingId).set(bookingData);

    // Send email notification to admin (TODO: Implement SendGrid)
    // await sendBookingEmailToAdmin(bookingData);

    // TODO: Send WhatsApp notification (optional)
    // await sendWhatsAppToAdmin(bookingData);

    // Return booking ID to client
    res.status(200).json({
      success: true,
      bookingId: bookingId,
      message: '¡Solicitud recibida! Un asesor verificará disponibilidad y te enviará el enlace de pago seguro.',
      booking: {
        id: bookingId,
        type: booking.type,
        status: 'pending',
        finalPrice: finalPrice,
        clientEmail: booking.clientEmail,
      },
    });

  } catch (error) {
    console.error('Error submitting booking:', error);
    res.status(500).json({ error: 'Failed to submit booking', details: error.message });
  }
}