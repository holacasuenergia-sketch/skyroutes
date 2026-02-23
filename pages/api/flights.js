// API Route: Search Flights - Simple Demo (Always Return Success)
// POST /api/flights

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  // Handle OPTIONS request (for CORS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Set JSON header
  res.setHeader('Content-Type', 'application/json');

  // Only allow POST for simplicity
  if (req.method !== 'POST') {
    return res.status(200).json({
      flights: getDemoFlights('demo', 'demo'),
      meta: {
        demo_mode: true,
        method: req.method
      }
    });
  }

  try {
    // Extract params (but accept anything)
    const { origin, destination, departure_date, return_date, trip_type, passengers } = req.body || {};

    console.log('Flights API called:', { origin, destination, departure_date, return_date, trip_type, passengers });

    // Return demo flights
    const flights = getDemoFlights(origin || 'demo', destination || 'demo');

    // Return success immediately
    return res.status(200).json({
      flights,
      meta: {
        origin: origin || 'demo',
        destination: destination || 'demo',
        departure_date: departure_date || 'demo',
        return_date: return_date || null,
        trip_type: trip_type || 'roundtrip',
        passengers: passengers || 1,
        demo_mode: true,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('API error:', error);
    // Even if error, return demo flights
    return res.status(200).json({
      flights: getDemoFlights('demo', 'demo'),
      meta: {
        error_mode: true,
        error_message: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// Simple demo flights generator
function getDemoFlights(origin, destination) {
  return [
    {
      airline: 'Ryanair',
      flight_number: 'FR' + Math.floor(Math.random() * 9000 + 1000),
      departure_time: '08:30',
      arrival_time: '10:45',
      duration_minutes: 135,
      stops: 0,
      original_price: 45,
      skyroutes_price: 50,
      markup_percent: 10
    },
    {
      airline: 'EasyJet',
      flight_number: 'U2' + Math.floor(Math.random() * 9000 + 1000),
      departure_time: '12:00',
      arrival_time: '14:30',
      duration_minutes: 150,
      stops: 0,
      original_price: 55,
      skyroutes_price: 60,
      markup_percent: 10
    },
    {
      airline: 'Vueling',
      flight_number: 'VY' + Math.floor(Math.random() * 9000 + 1000),
      departure_time: '16:30',
      arrival_time: '18:45',
      duration_minutes: 135,
      stops: 0,
      original_price: 60,
      skyroutes_price: 66,
      markup_percent: 10
    }
  ];
}