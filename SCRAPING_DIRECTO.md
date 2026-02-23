# SkyRoutes - Scraping Directo de Aerolíneas

## Política: Solo Aerolíneas Directas

**IMPORTANTE:** SkyRoutes solo usa scraping directo de aerolíneas, NO agregadores externos.

## Por qué? 🤔

### Agregadores (Skyscanner, Google Flights, Expedia, etc.):
- ❌ Precios INFLADOS (markup invisible del 10-25%)
- ❌ Vuelos que ya no existen
- ❌ Horarios incorrectos
- ❌ Doble markup (agregador + SkyRoutes = poco competitivo)

### Aerolíneas Directas (Ryanair, EasyJet, Vueling, etc.):
- ✅ Precios 100% reales y actuales
- ✅ Disponibilidad garantizada
- ✅ Horarios exactos
- ✅ Solo 1 markup (SkyRoutes = mejor precio)

## Aerolíneas Objetivo

### ✅ SCRAPING ACTIVO:
1. **Ryanair** - Low-cost líder Europa
2. **EasyJet** - Red principal UK/Europa
3. **Vueling** - IAG, España y Europa
4. **LATAM** - Líder Latinoamérica
5. **Avianca** - 🇨🇴 Aerolínea bandera Colombia, extensa red Latinoamérica + Europa + USA
6. **Iberia** - Principal España
7. **Air Europa** - Alternativa España

### 🔄 FUTURO:
- Lufthansa
- Air France
- KLM
- TAP Portugal

## Fuentes NO USADAS ❌

- ❌ **Skyscanner** - Agregador, precios inflados
- ❌ **Google Flights** - Agregador, anti-bot fuerte
- ❌ **Expedia** - OTA, precios inflados
- ❌ **eDreams** - OTA, precios inflados
- ❌ **Kayak** - Agregador, redundante
- ❌ **Momondo** - Agregador, complicado

## Flujo de Scraping

```
Usuario busca [MAD → BCN, 15-05-2026]
    ↓
SkyRoutes API dispara EN PARALELO:
    ├─> Ryanair scraper (5-8s)
    ├─> EasyJet scraper (5-8s)
    ├─> Vueling scraper (5-8s)
    ├─> LATAM scraper (5-8s)
    └─> Avianca scraper (5-8s)
    ↓
Agrega resultados
    ↓
Deduplica (mismo vuelo, misma aerolínea)
    ↓
Aplica markup SkyRoutes 10-15%
    ↓
Muestra al usuario ORDENADO por precio
    ↓
WhatsApp: Todas las opciones para que Eduardo ayude
```

## Ventajas Competitivas

### vs Skyscanner:
- **Mejores precios:** Buscamos directamente, sin markup intermedio
- **Atención personalizada:** Eduardo, no bot
- **Flexibilidad:** Eduardo puede negociar o buscar más opciones

### vs Expedia/eDreams:
- **Solo 1 markup:** 10-15% vs 25-35% de OTAs
- **Aerolíneas directas:** Sin capas intermedias
- **Soporte 24/7:** Eduardo responde, no call center automatizado

### vs Aerolíneas directas:
- **Comparación:** No tienes que buscar en 10 sitios
- **Atención:** Eduardo te ayuda a elegir mejor opción
- **Conveniencia:** Todo en un lugar, con humano detrás

## Margen de Beneficio

**Ejemplo Madrid → Barcelona:**

| Fuente | Precio Original | Precio SkyRoutes | Margen |
|--------|---------------|----------------|--------|
| Ryanair directo | €45 | €50 (10%) | €5 |
| EasyJet directo | €55 | €61 (11%) | €6 |
| Vueling directo | €62 | €69 (11%) | €7 |
| LATAM directo | €480 | €528 (10%) | €48 |

**Promedio por venta:** €20-40 por vuelo
**Volumen objetivo:** 20-40 ventas/semana
**Ingreso mensual estimado:** €1,600 - €6,400

## Implementación Técnica

**Stack:**
- Python + Playwright (headless Chrome)
- Next.js API routes (backend)
- Vanilla JS + Fetch API (frontend)
- Vercel hosting

**Anti-detección:**
- User agents rotativos
- Random delays (2-5s entre requests)
- Headless mode (sin GUI)
- Rate limiting por aerolínea

**Rate Limits:**
- Ryanair: 1 request / 2s
- EasyJet: 1 request / 3s
- Vueling: 1 request / 2s
- LATAM: 1 request / 2s

## Mantenimiento

**Semanal:**
- Verificar que scrapers siguen funcionando
- Probar búsquedas de ejemplo
- Revisar logs de errores

**Mensual:**
- Actualizar selectors (HTML cambia)
- Revisar rate limits
- Optimizar timeouts

**Por problema:**
- Si scraper falla → Marca aerolínea como "offline"
- Muestra mensaje: "Aerolínea temporalmente no disponible"
- Notifica a Eduardo

## Documentación de Aerolíneas

### Ryanair
- URL: `https://www.ryanair.com/es/es`
- Método: Playwright + async/await
- Dificultad: Media (anti-bot básico)
- Datos: Real scraping

### EasyJet
- URL: `https://www.easyjet.com/es`
- Método: Playwright + async/await
- Dificultad: Media (anti-bot moderado)
- Datos: Mock/Real en desarrollo

### Vueling
- URL: `https://www.vueling.com`
- Método: Playwright + async/await
- Dificultad: Baja (HTML más limpio)
- Datos: Mock/Real en desarrollo

### LATAM
- URL: `https://www.latam.com`
- Método: Playwright + async/await
- Dificultad: Media-Alta (anti-bot fuerte)
- Datos: Pendiente

### Avianca 🇨🇴
- URL: `https://www.avianca.com`
- Método: Playwright + async/await
- Dificultad: Media (anti-bot moderado)
- Datos: Mock/Real en desarrollo
- Nota: Aerolínea bandera de Colombia, red extensa por toda Latinoamérica + Europa + USA

### Iberia
- URL: `https://www.iberia.es`
- Método: Playwright + async/await
- Dificultad: Alta (anti-bot + CAPTCHA)
- Datos: Pendiente

### Air Europa
- URL: `https://www.aireuropa.com`
- Método: Playwright + async/await
- Dificultad: Media
- Datos: Pendiente

---

**Última actualización:** 2026-02-23
**Estatus:** Scraping directo activo (Ryanair + EasyJet + Vueling + Avianca)
**Próximos:** LATAM real scraping + Iberia + Air Europa