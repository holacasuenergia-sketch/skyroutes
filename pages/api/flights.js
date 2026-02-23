// API Route: Search Flights via Demo Data
// POST /api/flights

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { origin, destination, departure_date, return_date, trip_type, passengers } = req.body;

    // Validate inputs
    if (!origin || !destination || !departure_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Default trip_type to roundtrip if not specified
    const tripType = trip_type || 'roundtrip';

    // Determine which airlines to use based on origin/destination
    const isLatinAmericanRoute =
      (['BOG', 'MEX', 'LIM', 'UIO', 'SCL', 'EZE', 'GRU', 'BSB', MDC, 'HAV', 'PUN'].includes(origin?.toUpperCase())) ||
      (['BOG', 'MEX', 'LIM', 'UIO', 'SCL', 'EZE', 'GRU', 'BSB', 'MIA', 'MAD', 'BCN', 'FRA', 'LHR', 'ORY', 'CDG', 'VCE'].includes(destination?.toUpperCase()));

    // Generate demo flight data
    let demoFlights = [];

    if (isLatinAmericanRoute) {
      // Latin American airlines
      demoFlights = [
        {
          airline: 'Avianca',
          flight_number: 'AV' + Math.floor(Math.random() * 9000 + 1000),
          departure_time: '08:00',
          arrival_time: '17:00',
          duration_minutes: 540,
          stops: 0,
          price: 480
        },
        {
          airline: 'LATAM',
          flight_number: 'LA' + Math.floor(Math.random() * 9000 + 1000),
          departure_time: '10:30',
          arrival_time: '19:00',
          duration_minutes: 510,
          stops: 0,
          price: 450
        },
        {
          airline: 'Iberia',
          flight_number: 'IB' + Math.floor(Math.random() * 9000 + 1000),
          departure_time: '09:00',
          arrival_time: '17:30',
          duration_minutes: 510,
          stops: 0,
          price: 520
        }
      ];
    } else {
      // European airlines
      demoFlights = [
        {
          airline: 'Ryanair',
          flight_number: 'FR' + Math.floor(Math.random() * 9000 + 1000),
          departure_time: '08:30',
          arrival_time: '10:45',
          duration_minutes: 135,
          stops: 0,
          price: 45
        },
        {
          airline: 'EasyJet',
          flight_number: 'U2' + Math.floor(Math.random() * 9000 + 1000),
          departure_time: '12:00',
          arrival_time: '14:30',
          duration_minutes: 150,
          stops: 0,
          price: 55
        },
        {
          airline: 'Vueling',
          flight_number: 'VY' + Math.floor(Math.random() * 9000 + 1000),
          departure_time: '16:30',
          arrival_time: '18:45',
          duration_minutes: 135,
          stops: 0,
          price: 60
        }
      ];
    }

    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    // Apply 10-15% markup
    const markedFlights = demoFlights.map(flight => ({
      ...flight,
      original_price: flight.price,
      skyroutes_price: Math.round(flight.price * 1.10),
      markup_percent: 10 + Math.floor(Math.random() * 5)
    }));

    // Sort by SkyRoutes price (ascending)
    markedFlights.sort((a, b) => a.skyroutes_price - b.skyroutes_price);

    // Return success response
    res.status(200).json({
      flights: markedFlights,
      meta: {
        origin,
        destination,
        departure_date,
        return_date: tripType === 'oneway' ? null : return_date,
        trip_type: tripType,
        passengers,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}