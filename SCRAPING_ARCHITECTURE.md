# SkyRoutes Scraping Architecture

## OVERVIEW

Three main sources for flight + hotel data:

```
┌─────────────────────────────────────────────────────────────┐
│                    SkyRoutes Data Sources                    │
└─────────────────────────────────────────────────────────────┘
                          ↓

    ┌──────────┬──────────┬──────────┬──────────┬─────────┐
    │Skyscanner│Google    │Expedia   │Booking   │Airbnb   │
    │Flights   │Flights   │          │.com      │         │
    └────┬─────┴────┬─────┴────┬─────┴─────┬─────┴─────┬─┘
         │          │          │          │          │
         ↓          ↓          ↓          ↓          ↓
    ┌───────────────────────────────────────────────────────┐
    │          SkyRoutes Aggregation Engine                 │
    │  - Merge data from all sources                       │
    │  - Deduplicate entries                               │
    │  - Apply 10-15% markup logic                         │
    │  - Sort by relevance/price                           │
    └──────────────┬────────────────────────────────────────┘
                   ↓
            ─────────────────
           API Response
            ─────────────────
                   ↓
          Frontend Display
```

---

## FLIGHT DATA SOURCES

### Source 1: Skyscanner
**URL Pattern:** `https://www.skyscanner.es/transportes/vuelos/{origen}/{destino}/{fecha}`

**Data to Scrape:**
- Airline name + logo
- Flight number
- Departure/arrival times
- Duration
- Stops (number + airports)
- Price (original)
- Cancellation policy
- Baggage allowance

**Pros:**
- ✅ Most comprehensive flight data
- ✅ Good filtering/sorting options
- ✅ Often has best prices

**Cons:**
- ❌ CAPTCHA protection
- ❌ Dynamic loading with JavaScript
- ❌ May block scraping attempts

**Tool:** Selenium + Undetected Chrome

---

### Source 2: Google Flights
**URL Pattern:** `https://www.google.com/travel/flights?q=Flights%20{origen}%20to%20{destino}%20on%20{fecha}`

**Data to Scrape:**
- Same as Skyscanner
- Plus:
  - Real-time pricing trends
  - Flight history patterns
  - Alternative dates suggestions
  - Airport details

**Pros:**
- ✅ Real-time data
- ✅ Very accurate pricing
- ✅ Great for price insights

**Cons:**
- ❌ Strong anti-scraping protection
- ❌ Complex JavaScript rendering
- ❌ Frequent UI changes

**Tool:** Playwright (better for Google)

---

### Source 3: Direct Airline Websites
**Targets:**
- Iberia.com
- AirEuropa.com
- LATAM.com
- Vueling.com
- Ryanair.com
- Emirates.com
- etc.

**Data to Scrape:**
- Same as above
- Plus:
  - Official prices directly from airline
  - Exclusive airline promotions
  - True baggage allowance
  - Exact cancellation policies

**Pros:**
- ✅ No middleman markup
- ✅ Promotions only visible on airline sites
- ✅ Most accurate policies

**Cons:**
- ❌ Many sites to scrape individually
- ❌ High maintenance overhead
- ❌ Different UI patterns per airline

**Tool:** Selenium + Site-specific parsers

---

## HOTEL DATA SOURCES

### Source 1: Booking.com
**URL Pattern:** `https://www.booking.com/searchresults.html?ss={destino}&checkin={fecha_in}&checkout={fecha_out}`

**Data to Scrape:**
- Hotel name + branding
- Star rating (1-5)
- Location (GPS coordinates)
- Distance from center/airport
- Room types available
- Price per night (original)
- Review score (0-10)
- Number of reviews
- Location rating
- Cleanliness rating
- Service rating
- Value rating
- Amenities:
  - ✓ WiFi
  - ✓ Breakfast
  - ✓ Pool
  - ✓ Gym
  - ✓ Parking
  - ✓ Spa
  - ✓ Beach access
  - ✓ Shuttle service
- Cancellation policy
- Room size (m²)
- View options (sea, city, garden)
- Photos

**Pros:**
- ✅ Most comprehensive hotel data
- ✅ Detailed reviews (10,000+ hotels with 100+ reviews)
- ✅ Exact location info
- ✅ Clear amenity lists

**Cons:**
- ❌ Strong anti-scraping protection
- ❌ Slow response times
- ❌ Frequently changes HTML structure

**Tool:** Selenium + BeautifulSoup + Rate limiting

---

### Source 2: Airbnb
**URL Pattern:** `https://www.airbnb.com/s/{destino}?checkin={fecha_in}&checkout={fecha_out}`

**Data to Scrape:**
- Same as Booking.com
- Plus:
  - Superhost status
  - Response time
  - Instant book
  - House rules
  - Check-in/out times
  - Fees breakdown (cleaning, service)
  - Host verification
  - Listing photos count

**Pros:**
- ✅ Large inventory (500,000+ properties)
- ✅ Detailed host info
- ✅ Real reviews from actual guests
- ✅ Alternative accomodation types

**Cons:**
- ❌ Higher service fees
- ❌ Different pricing model (fees + taxes)
- ❌ Less standardized than Booking.com

**Tool:** Selenium + Airbnb-specific parser

---

### Source 3: TripAdvisor
**URL Pattern:** `https://www.tripadvisor.com/Hotels-g{city_id}-{destino}-Hotels.html`

**Data to Scrape:**
- Same as Booking/Airbnb
- Plus:
  - Certificate of Excellence
  - Traveler photos (more than official photos)
  - Detailed written reviews
  - Nearby attractions/restaurants
  - Weather predictions

**Pros:**
- ✅ Best review content
- ✅ High-trust reviews
- ✅ Great for location context

**Cons:**
- ❌ Not a booking site (redirects)
- ❌ Less booking data
- ❌ Sometimes outdated info

**Tool:** Requests + BeautifulSoup

---

## SCRAPING TECH STACK

### Layer 1: Request Layer
```
requests_session = {
    'user_agent': 'Mozilla/5.0...',
    'headers': {...},
    'cookies': {...},
    'proxies': [...], // Rotating proxies
    'rate_limit': 1 request/2s
}
```

### Layer 2: Browser Automation
```python
# Option 1: Selenium (most sites)
driver = webdriver.Chrome(options=options)
driver.get(url)

# Option 2: Playwright (Google Flights)
playwright = sync_playwright().start()
browser = playwright.chromium.launch(headless=True)
page = browser.new_page()
page.goto(url)
```

### Layer 3: Parser Layer
```python
# Flight Parser
class FlightParser:
    def parse_skyscanner(html):
        flights = []
        for flight_element in html.select('.flight-card'):
            flights.append({
                'airline': parse_airline(flight_element),
                'price': parse_price(flight_element),
                'duration': parse_duration(flight_element),
                ...
            })
        return flights

# Hotel Parser
class HotelParser:
    def parse_booking(html):
        hotels = []
        for hotel_element in html.select('.accommodation-card'):
            hotels.append({
                'name': hotel_element.select('h3')[0].text,
                'rating': parse_rating(hotel_element),
                'location': parse_location(hotel_element),
                'amenities': parse_amenities(hotel_element),
                ...
            })
        return hotels
```

### Layer 4: Aggregation & Deduplication
```python
class Aggregator:
    def aggregate_flights(search_results):
        all_flights = []
        for source_data in search_results:
            all_flights.extend(source_data['flights'])

        # Dedupe by flight number + times
        unique_flights = deduplicate_flights(all_flights)

        # Determine best price
        for flight in unique_flights:
            flight['best_price'] = find_cheapest_source(flight)

        return unique_flights

    def aggregate_hotels(search_results):
        all_hotels = []
        for source_data in search_results:
            all_hotels.extend(source_data['hotels'])

        # Dedupe by hotel name + location
        unique_hotels = deduplicate_hotels(all_hotels)

        # Aggregate reviews
        for hotel in unique_hotels:
            hotel['aggregated_rating'] = average_reviews(hotel)

        return unique_hotels
```

### Layer 5: Markup Calculator
```python
def apply_markup_flights(flights, margin_percent=10):
    for flight in flights:
        original_price = flight['best_price']

        # Apply 10-15% markup
        markup_multiplier = 1 + (margin_percent / 100)
        skyroutes_price = original_price * markup_multiplier

        flight['original_price'] = original_price
        flight['skyroutes_price'] = skyroutes_price
        flight['markup'] = skyroutes_price - original_price
        flight['markup_percent'] = margin_percent

    return flights

def apply_markup_hotels(hotels, margin_percent=10):
    for hotel in hotels:
        original_price = hotel['price_per_night']

        # Apply 10-15% markup
        markup_multiplier = 1 + (margin_percent / 100)
        skyroutes_price = original_price * markup_multiplier

        hotel['original_price'] = original_price
        hotel['skyroutes_price'] = skyroutes_price
        hotel[' markup_per_night'] = skyroutes_price - original_price
        hotel['markup_percent'] = margin_percent

    return hotels

def apply_markup_packages(packages, margin_percent=12):
    for package in packages:
        original_total = package['flight_price'] + package['hotel_total']

        # Apply 10-15% markup on total
        markup_multiplier = 1 + (margin_percent / 100)
        skyroutes_price = original_total * markup_multiplier

        package['flight_original'] = package['flight_price']
        package['hotel_original'] = package['hotel_total']
        package['total_original'] = original_total
        package['skyroutes_price'] = skyroutes_price
        package['markup'] = skyroutes_price - original_total
        package['markup_percent'] = margin_percent

    return packages
```

---

## DATABASE SCHEMA

### Flights Table
```sql
CREATE TABLE flights (
    id UUID PRIMARY KEY,
    flight_number VARCHAR(20) NOT NULL,
    airline VARCHAR(100) NOT NULL,
    origin_airport VARCHAR(10) NOT NULL,
    destination_airport VARCHAR(10) NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    duration_minutes INT NOT NULL,
    stops INT NOT NULL,
    stop_airports TEXT[],
    original_price DECIMAL(10,2) NOT NULL,
    skyroutes_price DECIMAL(10,2) NOT NULL,
    markup DECIMAL(10,2) NOT NULL,
    markup_percent DECIMAL(5,2) NOT NULL,
    sources TEXT[], -- Which sites we scraped
    created_at TIMESTAMP DEFAULT NOW(),
    search_query JSONB, -- Store original search params
    INDEX (flight_number),
    INDEX (origin_airport, destination_airport),
    INDEX (departure_time)
);
```

### Hotels Table
```sql
CREATE TABLE hotels (
    id UUID PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    star_rating INT,
    location_gps POINT NOT NULL,
    distance_from_center_km DECIMAL(5,2),
    price_per_night DECIMAL(10,2) NOT NULL,
    skyroutes_price_per_night DECIMAL(10,2) NOT NULL,
    markup_per_night DECIMAL(10,2) NOT NULL,
    review_score DECIMAL(3,1),
    review_count INT,
    amenities TEXT[],
    cancellation_policy VARCHAR(50),
    sources TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    search_query JSONB,
    INDEX (city, country),
    INDEX (price_per_night),
    INDEX (review_score)
);
```

### Packages Table
```sql
CREATE TABLE packages (
    id UUID PRIMARY KEY,
    flight_id UUID REFERENCES flights(id),
    hotel_id UUID REFERENCES hotels(id),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    nights INT NOT NULL,
    flight_original_price DECIMAL(10,2),
    hotel_original_total DECIMAL(10,2),
    total_original DECIMAL(10,2),
    skyroutes_price DECIMAL(10,2),
    markup DECIMAL(10,2),
    markup_percent DECIMAL(5,2),
    passengers INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API ENDPOINTS

### Search Flights
```
POST /api/flights/search
{
    "origin": "MAD",
    "destination": "LIM",
    "departure_date": "2026-05-15",
    "return_date": "2026-05-22",
    "passengers": 2
}

Response:
{
    "flights": [
        {
            "airline": "LATAM",
            "flight_number": "LA2354",
            "departure_time": "2026-05-15T10:30:00",
            "arrival_time": "2026-05-15T20:15:00",
            "duration_minutes": 585,
            "stops": 1,
            "original_price": 850.00,
            "skyroutes_price": 935.00,  // 10% markup
            "markup": 85.00,
            "sources": ["skyscanner", "google_flights"]
        }
    ]
}
```

### Search Hotels
```
POST /api/hotels/search
{
    "destination": "Bali",
    "check_in": "2026-05-15",
    "check_out": "2026-05-25",
    "guests": 2
}

Response:
{
    "hotels": [
        {
            "name": "Seminyak Beach Resort",
            "star_rating": 5,
            "price_per_night": 200.00,
            "skyroutes_price_per_night": 220.00,  // 10% markup
            "review_score": 4.8,
            "amenities": ["pool", "wifi", "breakfast", "spa"],
            "sources": ["booking", "airbnb"]
        }
    ]
}
```

### Search Packages
```
POST /api/packages/search
{
    "origin": "BCN",
    "destination": "Bali",
    "check_in": "2026-05-15",
    "check_out": "2026-05-25",
    "passengers": 2
}

Response:
{
    "packages": [
        {
            "flight": {...},
            "hotel": {...},
            "nights": 10,
            "original_total": 3200.00,
            "skyroutes_price": 3520.00,  // 10% markup
            "markup": 320.00,
            "savings_vs_ota": 480.00  // 15% savings
        }
    ]
}
```

---

## RATE LIMITING & ANTI-BLOCKING

### Per Source Limits
```
Skyscanner:      1 req / 2s  (max 30 req/min)
Google Flights:  1 req / 3s  (max 20 req/min)
Booking.com:     1 req / 4s  (max 15 req/min)
Airbnb:          1 req / 5s  (max 12 req/min)
Direct Airlines: 1 req / 2s  (per airline)
```

### Proxy Rotation
```python
proxies = [
    'proxy1:port1',
    'proxy2:port2',
    'proxy3:port3',
    # ... rotate every 20 requests
]

session.proxies = {
    'http': random.choice(proxies),
    'https': random.choice(proxies)
}
```

### Request Headers
```python
headers = {
    'User-Agent': get_random_user_agent(),
    'Accept': 'text/html,application/xhtml+xml',
    'Accept-Language': 'es-ES,es;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Referer': 'https://www.skyscanner.es/'
}
```

### CAPTCHA Handling
```python
if captcha_detected(response):
    # Option 1: Wait and retry
    time.sleep(30)
    return retry_request()

    # Option 2: Solve CAPTCHA (2Captcha, Anti-Captcha)
    solution = solve_captcha(image_url)
    return submit_captcha_solution(solution)

    # Option 3: Use alternative source
    return scrape_alternative_source()
```

---

## MONITORING & MAINTENANCE

### Daily Health Checks
- ✅ All scrapers returning data
- ✅ No CAPTCHA blocks
- ✅ Response times < 10s
- ✅ Data quality validation

### Weekly Reviews
- Check for site HTML changes
- Update parsers if needed
- Rotate proxies
- Review rate limits

### Monthly Optimization
- Add new sources
- Improve parsing accuracy
- Update markup strategies
- Review competitor strategies

---

**Next: PASO 3 - Sistema de Paquetes Cross-Selling**