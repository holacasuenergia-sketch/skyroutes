// API Route: Search Flights via Scraping
// POST /api/flights

import { spawn } from 'child_process';
import { promisify } from 'util';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { origin, destination, departure_date, return_date, passengers } = req.body;

    // Validate inputs
    if (!origin || !destination || !departure_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Spawn Python scraper with virtual environment
    const scraper = spawn('./venv/bin/python', [
      'scrapers/flight_scraper.py',
      '--origin', origin,
      '--destination', destination,
      '--departure-date', departure_date,
      ...(return_date ? ['--return-date', return_date] : []),
      '--passengers', passengers || '1'
    ]);

    let outputData = '';
    let errorData = '';

    scraper.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    scraper.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    scraper.on('close', (code) => {
      if (code !== 0) {
        console.error('Scraping error:', errorData);
        return res.status(500).json({ 
          error: 'Scraping failed', 
          details: errorData 
        });
      }

      try {
        const results = JSON.parse(outputData);
        
        // Apply 10-15% markup
        const markedResults = results.map(flight => ({
          ...flight,
          original_price: flight.price,
          skyroutes_price: Math.round(flight.price * 1.10), // 10% markup minimum
          markup_percent: 10 + Math.floor(Math.random() * 5) // 10-15% range
        }));

        // Sort by SkyRoutes price (ascending)
        markedResults.sort((a, b) => a.skyroutes_price - b.skyroutes_price);

        res.status(200).json({
          flights: markedResults,
          meta: {
            origin,
            destination,
            departure_date,
            return_date,
            passengers,
            timestamp: new Date().toISOString()
          }
        });
      } catch (parseError) {
        console.error('Parse error:', parseError);
        res.status(500).json({ error: 'Failed to parse scraping results' });
      }
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      scraper.kill();
      res.status(504).json({ error: 'Scraping timeout' });
    }, 30000);

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}