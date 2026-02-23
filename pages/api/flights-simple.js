// API Route: Search Flights - Ultra Simple (ALWAYS RETURN JSON)
// GET/POST /api/flights-super-simple

export default async function handler(req, res) {
  // Set JSON header FIRST
  res.setHeader('Content-Type', 'application/json');

  // Simple response - NO LOGIC, JUST JSON
  const response = {
    status: 'ok',
    flights: [
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
    ],
    meta: {
      method: req.method,
      timestamp: new Date().toISOString()
    }
  };

  // Always return 200 with JSON
  return res.status(200).json(response);
}