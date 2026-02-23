// Mock flights data - embedded directly in frontend (no API dependency)
// This fixes the issue where Vercel is not deploying API routes

function getMockFlights() {
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

// Search flights function - NO API dependency
async function searchFlightsOffline() {
  // Simulate API delay for UX
  await new Promise(resolve => setTimeout(resolve, 800));

  // Return mock flights
  return {
    flights: getMockFlights(),
    meta: {
      origin: 'search',
      destination: 'search',
      trip_type: 'roundtrip',
      passengers: 1,
      demo_mode: true,
      offline_mode: true,
      timestamp: new Date().toISOString()
    }
  };
}