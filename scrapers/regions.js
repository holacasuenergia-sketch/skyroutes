// Regions configuration for SkyRoutes
// Filter airlines based on origin/destination location

// Supported airports by region
const AIRPORTS_BY_REGION = {
  EUROPE: [
    // España
    'MAD', 'BCN', 'AGP', 'PMI', 'SVQ', 'VLC', 'BIO', 'OVD', 'LPA', 'TFN',
    'LCG', 'SVQ', 'SVQ', 'GRX', 'ALC', 'IBZ', 'TFS', 'LPA', 'FUE', 'VLL',
    // Francia
    'CDG', 'ORY', 'NCE', 'LYS', 'MRS', 'TLS', 'BOD', 'NTE',
    // Reino Unido
    'LHR', 'LGW', 'STN', 'MAN', 'EDI', 'GLA', 'BHX', 'BRS',
    // Alemania
    'FRA', 'MUC', 'BER', 'DUS', 'HAM', 'CGN',
    // Italia
    'FCO', 'MXP', 'VCE', 'NAP', 'BLQ', 'FLR',
    // Países Bajos
    'AMS',
    // Suiza
    'ZRH', 'GVA',
    // Portugal
    'LIS', 'OPO', 'FNC',
    // Europa del Este
    'WAW', 'PRG', 'VIE', 'BUD',
    // Nordics
    'CPH', 'OSL', 'ARN', 'HEL'
  ],

  LATIN_AMERICA: [
    // Colombia
    'BOG', 'MDE', 'CLO', 'BAQ', 'CTG',
    // Brasil
    'GRU', 'GIG', 'BSB', 'CNF', 'POA', 'FOR', 'CWB', 'SDU',
    // Argentina
    'EZE', 'AEP', 'COR', 'MDZ',
    // Chile
    'SCL', 'IPC',
    // Perú
    'LIM',
    // Ecuador
    'UIO', 'GYE',
    // México
    'MEX', 'MTY', 'GDL', 'CUN',
    // Panamá
    'PTY',
    // Cuba
    'HAV',
    // Venezuela
    'CCS',
    // Costa Rica
    'SJO',
    // Uruguay
    'MVD',
    // Bolivia
    'VVI',
    // Paraguay
    'ASU',
    // República Dominicana
    'SDQ', 'PUJ'
  ],

  USA: [
    'JFK', 'LGA', 'EWR', 'MIA', 'LAX', 'SFO', 'ORD', 'DFW', 'ATL', 'BOS', 'DEN', 'LAS', 'SEA'
  ]
};

// Airlines by region
const AIRLINES_BY_REGION = {
  EUROPE: [
    'ryanair',
    'easyjet',
    'vueling',
    'iberia',
    'air_europa',
    'lufthansa',
    'air_france',
    'klm',
    'tap_portugal'
  ],

  LATIN_AMERICA: [
    'avianca',
    'latam',
    'copa_airlines',
    'aeromexico',
    'aerolineas_argentinas',
    'tap_portugal' // Especialista Europa-LATAM
  ],

  USA: [
    'united',
    'american',
    'delta',
    'jetblue'
  ]
};

/**
 * Detect region from airport code
 */
function detectRegionFromAirport(airportCode) {
  if (!airportCode) return null;

  const code = airportCode.toUpperCase();

  if (AIRPORTS_BY_REGION.EUROPE.includes(code)) {
    return 'EUROPE';
  }

  if (AIRPORTS_BY_REGION.LATIN_AMERICA.includes(code)) {
    return 'LATIN_AMERICA';
  }

  if (AIRPORTS_BY_REGION.USA.includes(code)) {
    return 'USA';
  }

  // Unknown airports - return null
  return null;
}

/**
 * Get relevant airlines based on origin and destination
 */
function getRelevantAirlines(origin, destination) {
  const originRegion = detectRegionFromAirport(origin);
  const destRegion = detectRegionFromAirport(destination);

  console.log(`Route: ${origin} → ${destination}`);
  console.log(`Origin region: ${originRegion}`);
  console.log(`Destination region: ${destRegion}`);

  // Europe ↔ Latin America: Most common route
  if ((originRegion === 'EUROPE' && destRegion === 'LATIN_AMERICA') ||
      (originRegion === 'LATIN_AMERICA' && destRegion === 'EUROPE')) {
    console.log('Route: Europe ↔ Latin America');
    console.log('Airlines: Avianca, LATAM, Iberia, KLM, Air France');
    return [
      'avianca',       // 🇨🇴 Colombia → Europa
      'latam',         // 🇧🇷 Brasil → Europa
      'tap_portugal',  // 🇵🇹 Especialista Europa-LATAM
      'iberia',        // 🇪🇸 España ↔ LATAM
      'air_france',    // 🇫🇷 Francia ↔ LATAM
      'klm'            // 🇳🇱 Países Bajos ↔ LATAM
    ];
  }

  // Within Europe
  if (originRegion === 'EUROPE' && destRegion === 'EUROPE') {
    console.log('Route: Within Europe');
    console.log('Airlines: Ryanair, EasyJet, Vueling, Iberia, Air Europa');
    return [
      'ryanair',
      'easyjet',
      'vueling',
      'iberia',
      'air_europa'
    ];
  }

  // Within Latin America
  if (originRegion === 'LATIN_AMERICA' && destRegion === 'LATIN_AMERICA') {
    console.log('Route: Within Latin America');
    console.log('Airlines: Avianca, LATAM, Copa');
    return [
      'avianca',
      'latam',
      'copa_airlines'
    ];
  }

  // Within USA
  if (originRegion === 'USA' && destRegion === 'USA') {
    console.log('Route: Within USA');
    console.log('Airlines: United, American, Delta, JetBlue');
    return [
      'united',
      'american',
      'delta',
      'jetblue'
    ];
  }

  // USA ↔ Europe
  if ((originRegion === 'USA' && destRegion === 'EUROPE') ||
      (originRegion === 'EUROPE' && destRegion === 'USA')) {
    console.log('Route: USA ↔ Europe');
    console.log('Airlines: Iberia, Air France, KLM, Lufthansa, British Airways');
    return [
      'iberia',
      'air_france',
      'klm',
      'lufthansa'
    ];
  }

  // USA ↔ Latin America
  if ((originRegion === 'USA' && destRegion === 'LATIN_AMERICA') ||
      (originRegion === 'LATIN_AMERICA' && destRegion === 'USA')) {
    console.log('Route: USA ↔ Latin America');
    console.log('Airlines: Aeroméxico, Avianca, LATAM, Copa');
    return [
      'aeromexico',
      'avianca',
      'latam',
      'copa_airlines'
    ];
  }

  // Default: Return all available airlines
  console.log('Route: Default - return all airlines');
  return [
    'ryanair',
    'easyjet',
    'vueling',
    'iberia',
    'air_europa',
    'avianca',
    'latam'
  ];
}

/**
 * Get airlines enabled for a specific route
 */
function getEnabledScrapers(origin, destination) {
  const relevantAirlines = getRelevantAirlines(origin, destination);

  console.log(`Enabled scrapers for ${origin} → ${destination}:`);
  relevantAirlines.forEach(airline => {
    console.log(`  - ${airline}`);
  });

  return relevantAirlines;
}

/**
 * Check if an airline is enabled for a route
 */
function isAirlineEnabled(airline, origin, destination) {
  const enabledAirlines = getEnabledScrapers(origin, destination);
  return enabledAirlines.includes(airline);
}

// Export as module (for Python compatibility, could be converted)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AIRPORTS_BY_REGION,
    AIRLINES_BY_REGION,
    detectRegionFromAirport,
    getRelevantAirlines,
    getEnabledScrapers,
    isAirlineEnabled
  };
}