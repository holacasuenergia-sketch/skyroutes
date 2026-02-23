# SkyRoutes Packages & Cross-Selling System

## OVERVIEW

**GOAL:** Automatically combine the best flights with the best hotels to create irresistible packages with 10-15% markup on total.

```
User searches: Barcelona → Bali, 10-20 May, 2 adults
                ↓
        ┌───────────────────────┐
        │  Parallel Scraping   │
        ├─── Flights ─────────┤
        │  - LATAM: €850      │
        │  - Emirates: €920   │
        │  - KLM: €880        │
        └──────────────────────┘
                ↓
        ┌───────────────────────┐
        │   Hotels Scraping    │
        │  - Seminyak: €200    │
        │  - Ubud: €150        │
        │  - Kuta: €120        │
        └───────────────────────┘
                ↓
        ┌───────────────────────┐
        │  Package Engine      │
        │  (Matching & Pricing)│
        └───────────────────────┘
                ↓
  ┌───────────┬───────────┬───────────┐
  │Best Value │   Luxury  │  Budget   │
  │€3,520    │  €4,600   │  €2,800   │
  └───────────┴───────────┴───────────┘
```

---

## PACKAGE MATCHING ALGORITHM

### Step 1: Get Matching Flights
```python
def get_flights_for_package(search_params):
    """
    Get all flights for the destination
    Filter by: dates, passengers, quality (4+ stars)
    """
    flights = scrape_flights(
        origin=search_params['origin'],
        destination=search_params['destination'],
        departure_date=search_params['check_in'],
        passengers=search_params['passengers']
    )

    # Filter by quality (airlines with 4.5+ rating)
    quality_flights = filter_by_rating(flights, min_rating=4.5)

    # Sort by price + quality balance
    ranked_flights = rank_by_value(quality_flights)

    return ranked_flights[:50]  # Top 50 flights
```

### Step 2: Get Best Hotels
```python
def get_hotels_for_package(search_params):
    """
    Get all hotels for destination + dates
    Filter by: location, rating, amenities, availability
    """
    hotels = scrape_hotels(
        destination=search_params['destination'],
        check_in=search_params['check_in'],
        check_out=search_params['check_out'],
        guests=search_params['passengers']
    )

    # Filter by quality (4.0+ stars)
    quality_hotels = filter_by_rating(hotels, min_rating=4.0)

    # Filter by location (within 10km of center)
    well_located = filter_by_distance(quality_hotels, max_km=10)

    # Sort by: rating × location × price
    ranked_hotels = rank_by_value_score(well_located)

    return ranked_hotels[:30]  # Top 30 hotels
```

### Step 3: Generate Package Combinations
```python
def generate_packages(flights, hotels, search_params):
    """
    Create all possible flight + hotel combinations
    Apply 10-15% markup
    """
    packages = []

    for flight in flights:
        for hotel in hotels:
            package = {
                'flight': flight,
                'hotel': hotel,
                'nights': search_params['nights'],
                'passengers': search_params['passengers'],

                # Original prices
                'flight_original': flight['skyroutes_price'],
                'hotel_original': hotel['skyroutes_price_per_night'] * search_params['nights'],
                'total_original': flight['skyroutes_price'] + (hotel['skyroutes_price_per_night'] * search_params['nights']),

                # SkyRoutes markup (12% average)
                'markup_percent': 12,
                'markup_amount': (flight['skyroutes_price'] + (hotel['skyroutes_price_per_night'] * search_params['nights'])) * 0.12,

                # Final price
                'skyroutes_price': (flight['skyroutes_price'] + (hotel['skyroutes_price_per_night'] * search_params['nights'])) * 1.12
            }

            # Calculate value score
            package['value_score'] = calculate_value_score(package)

            packages.append(package)

    # Remove exact duplicates
    unique_packages = deduplicate_packages(packages)

    # Sort by value score
    sorted_packages = sort_by_value_score(unique_packages)

    return sorted_packages[:20]  # Top 20 packages
```

### Step 4: Value Score Calculation
```python
def calculate_value_score(package):
    """
    Calculate overall value score (0-100)
    Higher = better value
    """
    score = 0

    # Flight quality (0-35)
    flight_score = 0
    flight_score += min(package['flight']['airline_rating'] * 7, 35)  # Max 35

    # Hotel quality (0-30)
    hotel_score = 0
    hotel_score += min(package['hotel']['star_rating'] * 6, 30)  # Max 30

    # Hotel location (0-15)
    if package['hotel']['distance_from_center_km'] <= 2:
        location_score = 15
    elif package['hotel']['distance_from_center_km'] <= 5:
        location_score = 10
    else:
        location_score = 5

    # Hotel amenities (0-15)
    amenities_score = len(package['hotel']['amenities']) * 1.5  # Max 15
    amenities_score = min(amenities_score, 15)

    # Price efficiency (0-5)
    # Lower markup = better value
    if package['markup_percent'] <= 10:
        price_score = 5
    elif package['markup_percent'] <= 12:
        price_score = 4
    elif package['markup_percent'] <= 15:
        price_score = 3
    else:
        price_score = 2

    # Total score
    total_score = flight_score + hotel_score + location_score + amenities_score + price_score

    return min(total_score, 100)  # Cap at 100
```

---

## PACKAGE CATEGORIES

### Category 1: Best Value (Recommended)
```python
def get_best_value_packages(packages):
    """
    Select packages with best value score
    Lower markup (10%), high quality
    """
    best_value = []

    for pkg in packages:
        # Best value: 88-100 score, 10-12% markup
        if (pkg['value_score'] >= 88 and
            pkg['markup_percent'] <= 12):
            best_value.append(pkg)

    # Sort by score, take top 5
    return sorted(best_value, key=lambda x: x['value_score'], reverse=True)[:5]
```

**Example:**
```
✈️ LATAM LA2354 (4.7⭐) + 🏨 Seminyak Beach Resort (4.8⭐)
• Total original: €3,200
• SkyRoutes price: €3,520 (10% markup)
• Value score: 94/100
• Savings vs Despegar: €480
```

---

### Category 2: Luxury Premium
```python
def get_luxury_packages(packages):
    """
    Premium flights (5⭐ airlines) + Luxury hotels (5⭐)
    Higher markup acceptable (15%)
    """
    luxury = []

    for pkg in packages:
        # Luxury: 5⭐ airline + 5⭐ hotel
        if (pkg['flight']['airline_rating'] >= 5 and
            pkg['hotel']['star_rating'] >= 5):
            luxury.append(pkg)

    # Sort by quality, take top 3
    return sorted(luxury, key=lambda x: x['value_score'], reverse=True)[:3]
```

**Example:**
```
✈️ Emirates EK2345 (5.0⭐) + 🏨 St. Regis Bali (5.0⭐)
• Total original: €5,800
• SkyRoutes price: €6,670 (15% markup)
• Value score: 96/100
• Premium experience guaranteed
```

---

### Category 3: Budget Friendly
```python
def get_budget_packages(packages):
    """
    Lowest price options
    Still 4⭐+ quality
    10% markup
    """
    budget = []

    for pkg in packages:
        # Budget: Quality 4.0-4.5, low price
        if (pkg['hotel']['star_rating'] >= 4.0 and
            pkg['hotel']['star_rating'] <= 4.5 and
            pkg['markup_percent'] <= 10):
            budget.append(pkg)

    # Sort by price, take top 3
    return sorted(budget, key=lambda x: x['skyroutes_price'])[:3]
```

**Example:**
```
✈️ KLM KL6789 (4.3⭐) + 🏨 Ubud Retreat (4.2⭐)
• Total original: €2,400
• SkyRoutes price: €2,640 (10% markup)
• Value score: 82/100
• Best price for good quality
```

---

### Category 4: Short Flight Times
```python
def get_short_flight_packages(packages):
    """
    Focus on fastest flights
    Less than 12 hours total
    """
    short_flights = []

    for pkg in packages:
        # Short: < 12h flight
        if pkg['flight']['duration_minutes'] <= 720:
            short_flights.append(pkg)

    # Sort by flight duration, take top 2
    return sorted(short_flights, key=lambda x: x['flight']['duration_minutes'])[:2]
```

---

### Category 5: Beachfront Hotels
```python
def get_beachfront_packages(packages):
    """
    Hotels within 500m of beach
    """
    beachfront = []

    for pkg in packages:
        if package['hotel']['distance_to_beach_m'] <= 500:
            beachfront.append(pkg)

    # Sort by beach proximity, take top 2
    return sorted(beachfront, key=lambda x: x['hotel']['distance_to_beach_m'])[:2]
```

---

## CROSS-SELLING STRATEGIES

### Strategy 1: Flight-First Cross-Sell
```
User searches flights: MAD → LIM, €660 (10% markup)

SKY ROUTES RESPONDS:
✈️ Voo encontrado: LATAM, 10h45m
• Tu precio: €660 (10% markup)
• Original: €600

🏨 ¿QUE HAY DEL HOTEL?
Como ya tienes el voo, ¡mira estos hoteles increíbles en Lima!

🌟 RECOMENDADO: Hotel Andino 4.5⭐
• 5 min de centro, rooftop, desayuno incluído
• €110/night → €121 (10% markup)
• TOTAL: €660 + €121 = €781

[VER MÁS HOTELES EN LIMA]
```

---

### Strategy 2: Hotel-First Cross-Sell
```
User searches hotels: Bali, 10 nights, €200/night

SKYROUTES RESPONDS:
🏨 Hotel encontrado: Seminyak Beach Resort 4.8⭐
• Tu precio: €220 (10% markup)
• Original: €200

✈️ ¿QUÉ HAY DEL VOO?
Como ya estás en Bali, ¡mira estos voos increíbles a Bali!

🌟 RECOMENDADO: LATAM directo
• 10h45m, 1 escala
• €660/persona × 2 = €1,320
• TOTAL: €1,320 + €2,200 = €3,520

[VER MÁS VOOS A BALI]
```

---

### Strategy 3: After Booking Cross-Sell
```
User completes: Flight booking

SKY ROUTES AUTOMATED MESSAGE:
¡Gracias por booking tu vuelo a Bali! 🎉

As tu voo confirmado:
• LATAM LA2354, 10 May 10:30 → Bali

🏨 HOTEL SUGERIDO:
Te recomiendo el Seminyak Beach Resort:
• Perfecto ubicación, 4.8⭐
• €220/night (€2,200 total)
• 15% de descuento para clientes de voo

[RESERVAR HOTEL AHOYA]

🎯 OTROS SERVICIOS:
→ Traslados a hotel (+€75)
→ Tours por Bali (+€50)
→ Car hire (+€100)
→ Seguro viaje (+€30)

¿Quieres algum servicio adicional?
```

---

## PRICING STRATEGY

### Dynamic Markup (10-15%)

**Rule 1: Base price depends on total**
```
€0-500 total:       15% markup (€0-75)
€500-1,500 total:   12% markup (€60-180)
€1,500+ total:      10% markup (€150+)
```

**Rule 2: Premium quality = higher markup tolerance**
```
5⭐ hotel + 5⭐ airline: 15% OK
4⭐-5⭐: 12%
3⭐-4⭐: 10%
```

**Rule 3: Seasonal adjustments**
```
High season (Jun-Aug, Dec-Jan): +2% extra
Off season (Feb, Sep-Nov): -2% discount
```

**Rule 4: Multi-passenger discount**
```
2+ passengers: -1% markup (encourages groups)
```

---

## API: SEARCH PACKAGES

```
POST /api/packages/search
Request:
{
    "origin": "BCN",
    "destination": "Bali",
    "check_in": "2026-05-15",
    "check_out": "2026-05-25",
    "passengers": 2,
    "preferences": {
        "category": "value",  // "value", "luxury", "budget", "short_flight", "beachfront"
        "min_hotel_stars": 4,
        "max_price": 4000
    }
}

Response:
{
    "packages": [
        {
            "id": "pkg_12345",
            "category": "value",
            "flight": {
                "airline": "LATAM",
                "flight_number": "LA2354",
                "departure": "2026-05-15T10:30:00",
                "arrival": "2026-05-15T20:15:00",
                "duration_minutes": 585,
                "stops": 1,
                "airline_rating": 4.7
            },
            "hotel": {
                "name": "Seminyak Beach Resort",
                "star_rating": 5,
                "price_per_night": 200.00,
                " nights": 10,
                "review_score": 4.8,
                "distance_from_center_km": 0.5,
                "amenities": ["pool", "wifi", "breakfast", "spa", "beach_access"]
            },
            "pricing": {
                "flight_original": 1700.00,
                "hotel_original": 2000.00,
                "total_original": 3700.00,
                "markup_percent": 12,
                "skyroutes_price": 4144.00,
                "markup_amount": 444.00,
                "savings_vs_ota": 556.00
            },
            "value_score": 94,
            "highlights": [
                "Best value flight + hotel combination",
                "5⭐ hotel with beach access",
                "12% markup (lower than OTAs 15-25%)"
            ]
        }
    ]
}
```

---

## FRONTEND: PACKAGE DISPLAY

```html
<!-- Package Card -->
<div class="package-card">
    <!-- Header -->
    <div class="package-header">
        <span class="badge best-value">🌟 BEST VALUE</span>
        <span class="value-score">94/100</span>
    </div>

    <!-- Flight -->
    <div class="flight-section">
        <div class="airline">LATAM 4.7⭐</div>
        <div class="route">Barcelona → Bali</div>
        <div class="times">10 May 10:30 → 11 May 8:15</div>
        <div class="duration">10h45 + 1 escala</div>
    </div>

    <!-- Hotel -->
    <div class="hotel-section">
        <div class="hotel-name">Seminyak Beach Resort 5⭐</div>
        <div class="hotel-location">0.5km de centro, acceso playa</div>
        <div class="hotel-amenities">
            ✓ Pool ✓ Spa ✓ WiFi ✓ Desayuno ✓ Beach
        </div>
        <div class="hotel-reviews">4.8⭐ (2,340 reviews)</div>
    </div>

    <!-- Pricing -->
    <div class="pricing-section">
        <div class="original-price">
            Total original: €3,700
        </div>
        <div class="skyroutes-price">
            Precio SkyRoutes: €4,144
        </div>
        <div class="savings">
            Ahorras €556 vs Despegar/Booking
        </div>
        <div class="markup-info">
            SkyRoutes markup: 12%
        </div>
    </div>

    <!-- CTA -->
    <button class="book-button">
        RESERVAR STE PAQUETE ✈️🏨
    </button>
</div>
```

---

## RECOMMENDATION ENGINE

### Smart Recommendations Based on User Behavior

```python
def get_personalized_recommendations(user_history):
    """
    Recommend packages based on:
    - Past destinations
    - Price preferences
    - Preferred hotel styles (luxury vs budget)
    - Travel companion type (solo, couple, family)
    """
    recommendations = []

    # User usually travels to tropical destinations
    if user_history.destinations_count('tropical') > 3:
        recommendations.append({
            'type': 'similar_destination',
            'destination': 'Maldives',
            'reason': 'Te gustan destinos tropicales'
        })

    # User prefers 4-5⭐ hotels
    if user_history.avg_hotel_stars() >= 4.5:
        recommendations.append({
            'type': 'luxury_upgrade',
            'message': 'Te recomiendo el St. Regis Bali',
            'reason': 'Siempre prefieres hoteles 5⭐'
        })

    # User travels with partner
    if user_history.frequent_companion_type() == 'couple':
        recommendations.append({
            'type': 'romantic_addon',
            'addon': 'Couple spa package',
            'reason': 'Viajes en pareja'
        })

    return recommendations
```

---

## AUTOMATED MARKETING MESSAGES

### WhatsApp Templates

**Template 1: Flight Booked → Hotel Recommendation**
```
¡Tu voo está confirmado! 🎉

Voo: LATAM LA2354 → 10 May 10:30 → Bali

🏨 HOTEL RECOMENDADO:
Como ya tienes el voo, te recomiendo el Seminyak Beach Resort:
• 5⭐, beach access, amazing reviews
• €220/night (€2,200 total 10 nights)
• 10% de descuento para clientes de voo

[RESERVAR AHORA]

¿Quieres ver más opciones en Bali?
```

**Template 2: Hotel Booked → Flight Cross-sell**
```
¡Tu hotel está reservado! 🏨

Hotel: Seminyak Beach Resort → 10-20 May

✈️ VOO RECOMENDADO:
Llegarás a Bali, ¿tienes el voo?
Te recomiendo LATAM LA2354:
• 10h45m, 1 escala
• €660/persona (€1,320 total 2 personas)
• 10% de descuento para clientes de hotel

[RESERVAR AHORA]

¿Quieres ver más voos a Bali?
```

**Template 3: Package Booked → Add-ons**
```
¡Tu paquete está completo! ✈️🏨

Barcelona → Bali, 10-20 May

🎯 MEJORA TU VIAJE:
→ Traslados hotel + €75
→ Tours por Bali + €50
→ Car hire + €100
→ Seguro viaje + €30

[AGREGAR SERVICIOS]

¿Queres alguno de estos servicios?
```

---

**COMPLETO:**
✅ PASO 1: Prototipo visual
✅ PASO 2: Arquitectura de scraping
✅ PASO 3: Sistema de paquetes cross-selling

**Modelo de negocio:** 10-15% markup
**Próximo paso:** Implementar scraping + backend