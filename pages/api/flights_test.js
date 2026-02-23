// Simple test endpoint - always returns success
export default async function handler(req, res) {
  // Allow all methods
  if (req.method === 'GET' || req.method === 'POST' || req.method === 'OPTIONS') {
    return res.status(200).json({
      status: 'ok',
      message: 'API is working',
      flights: [
        {
          airline: 'Ryanair',
          flight_number: 'FR1234',
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
          flight_number: 'U25678',
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
          flight_number: 'VY9012',
          departure_time: '16:30',
          arrival_time: '18:45',
          duration_minutes: 135,
          stops: 0,
          original_price: 60,
          skyroutes_price: 66,
          markup_percent: 10
        }
      ]
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}