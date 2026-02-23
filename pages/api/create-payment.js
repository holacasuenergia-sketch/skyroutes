// API Route: Create Stripe Payment Intent
// POST /api/create-payment

import Stripe from 'stripe';

// Initialize Stripe with your secret key
// Production key should be in environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51T3iST...');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      flight,
      passenger: {
        firstName,
        lastName,
        email,
        phone
      },
      metadata = {}
    } = req.body;

    // Validate required fields
    if (!flight || !firstName || !lastName || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate amount in cents (EUR)
    const amount = Math.round(flight.skyroutes_price * 100);

    // Create Payment Intent with metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        flight_airline: flight.airline,
        flight_number: flight.flight_number,
        flight_date: flight.departure_date,
        flight_time: `${flight.departure_time}-${flight.arrival_time}`,
        flight_duration: flight.duration_minutes,
        flight_price_original: flight.original_price,
        flight_price_skyroutes: flight.skyroutes_price,
        flight_source: flight.source,
        passenger_name: `${firstName} ${lastName}`,
        passenger_email: email,
        passenger_phone: phone,
        skyroutes_booking_id: `SR-${Date.now()}`,
        ...metadata
      },
      description: `SkyRoutes - ${flight.airline} ${flight.flight_number} (${flight.origin} → ${flight.destination})`
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      bookingDetails: {
        airline: flight.airline,
        flightNumber: flight.flight_number,
        origin: flight.origin,
        destination: flight.destination,
        departureTime: flight.departure_time,
        arrivalTime: flight.arrival_time,
        duration: flight.duration_minutes,
        originalPrice: flight.original_price,
        skyroutesPrice: flight.skyroutes_price,
        markupPercent: flight.markup_percent,
        passengerName: `${firstName} ${lastName}`,
        passengerEmail: email,
        passengerPhone: phone
      }
    });

  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create payment'
    });
  }
}