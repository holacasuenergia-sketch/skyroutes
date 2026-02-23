# Ejemplo de Mensaje WhatsApp - SkyRoutes

## Cuando usuario hace clic: "Ver Todas las Opciones ✈️"

### Aparece este mensaje en WhatsApp:

```
Hola! ✈️ *SkyRoutes - Vuelos Encontrados*

💫 *Búsqueda:*
📍 *Origen:* Madrid
🚀 *Destino:* Barcelona
📅 *Fechas:* 15-05-2026 a 22-05-2026
👥 *Pasajeros:* 1 adulto

✨ *Top 4 Opciones (Aerolíneas Directas):*

━━━━━━━━━━━━━━━━━
*Opción 1

Ryanair ✈️ FR1234
⏰ 08:30 → 10:45
⏱️ 2h 15m | Directo
💰 Precio: *€50.00* (markup 10%)

━━━━━━━━━━━━━━━━━
*Opción 2

EasyJet ✈️ EZY5678
⏰ 12:00 → 14:15
⏱️ 2h 15m | Directo
💰 Precio: *€61.00* (markup 11%)

━━━━━━━━━━━━━━━━━
*Opción 3

Vueling ✈️ VY9012
⏰ 16:30 → 18:50
⏱️ 2h 20m | Directo
💰 Precio: *€69.00* (markup 11%)

━━━━━━━━━━━━━━━━━
*Opción 4

Avianca 🇨🇴 AV456
⏰ 10:00 → 14:30
⏱️ 6h 30m | 1 escala
💰 Precio: *€185.00* (markup 12%)

━━━━━━━━━━━━━━━━━

📌 *Precios incluyen markup SkyRoutes*
Por favor, indicarme cuál opción prefieres para proceder con la reserva.

¡Gracias! 🙏
```

## En la UI de SkyRoutes:

### Búsqueda:
```
┌─────────────────────────────────────┐
│ Origo: [Madrid      ]               │
│ Destin: [Barcelona    ]             │
│ Fechas: [15-05-2026 a 22-05-2026]   │
│ Pasajeros: [1 Adulto     ▼]        │
│                                    │
│     [   🔍 BUSCAR   ]              │
└─────────────────────────────────────┘
```

### Resultados (Después de 10-15s):

```
┌─────────────────────────────────────┐
│ ✈️ 3 Vuelos Encontrados             │
│ (Aerolíneas Directas)               │
│ Madrid → Barcelona                  │
│ Precios directos, sin intermediarios│
│ ✓ Buscamos directamente en: Ryanair,│
│   EasyJet, Vueling, LATAM, Iberia   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Ryanair FR1234          [Aerolínea directa] │
│                                     │
│ 08:30               10:45           │
│ 15-05-2026          15-05-2026      │
│      ───────────────               │
│      2h 15m | Directo              │
│                                     │
│ Original: €45.00                    │
│ SkyRoutes: €50.00            [10%]  │
│                                     │
│  [Ver Todas las Opciones ✈️]        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ EasyJet EZY5678          [Aerolínea directa] │
│                                     │
│ 12:00               14:15           │
│ 15-05-2026          15-05-2026      │
│      ───────────────               │
│      2h 15m | Directo              │
│                                     │
│ Original: €55.00                    │
│ SkyRoutes: €61.00            [11%]  │
│                                     │
│  [Ver Todas las Opciones ✈️]        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Vueling VY9012           [Aerolínea directa] │
│                                     │
│ 16:30               18:50           │
│ 15-05-2026          15-05-2026      │
│      ───────────────               │
│      2h 20m | Directo              │
│                                     │
│ Original: €62.00                    │
│ SkyRoutes: €69.00            [11%]  │
│                                     │
│  [Ver Todas las Opciones ✈️]        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Avianca 🇨🇴 AV456          [Aerolínea directa] │
│                                     │
│ 10:00               16:30           │
│ 15-05-2026          15-05-2026      │
│      ───────────────               │
│      6h 30m | 1 escala             │
│                                     │
│ Original: €165.00                   │
│ SkyRoutes: €185.00           [12%]  │
│                                     │
│  [Ver Todas las Opciones ✈️]        │
└─────────────────────────────────────┘
```

## Flujo Completo del Usuario:

```
1. Usuario busca [MAD → BCN]
   ↓
2. Loading: "🔍 Buscando precios directos de aerolíneas..."
   ↓ (10-15s)
3. Muestra 3 opciones con:
   - Horarios exactos
   - Duración y escalas
   - Precio original + SkyRoutes price
   - Badges de markup (10%, 11%, etc.)
   ↓
4. Usuario hace clic "Ver Todas las Opciones ✈️"
   ↓
5. WhatsApp se abre con:
   - Resumen completo de búsqueda
   - Top 3 opciones formateadas
   - Solicitud de elección para Eduardo
   ↓
6. Usuario puede:
   - Enviar directamente a Eduardo (+34610243061)
   - Copiar texto para revisar
   ↓
7. Eduardo recibe mensaje completo y ayuda!
```

## Ventajas para Eduardo:

1. **Contexto completo:**
   - Ya sabe qué quiere el cliente
   - Vio exactamente las mismas opciones
   - Puede recomendar la mejor

2. **Transparencia:**
   - Cliente sabe markup exacto (10%, 11%, etc.)
   - Precio original visible
   - Sin sorpresas

3. **Eficiencia:**
   - No tiene que buscar manualmente
   - Scraping ya hizo el trabajo
   - Solo necesita elegir y cobrar

4. **Venta fácil:**
   - "Recomiendo la Opción 2 (EasyJet) por el horario"
   - Precio ya está calculado con markup
   - Sólo confirmar reservación

## Ejemplo de conversación con cliente:

**Cliente:** [Envía mensaje WhatsApp con las 3 opciones]

**Eduardo:** ¡Hola! Perfecto 👋

Te recomiendo la **Opción 2 (EasyJet, EZY5678)** porque:
- Horario cómodo (12:00 - 14:15)
- Precio justo: €61.00
- Vuelo directo, sin escalas

Si prefieres la Opción 1 (Ryanair) es €11 más barato pero sale más temprano (8:30).

¿Cuál prefieres? Cuando confirmes, procedo con la reserva.

---

**Para rutas LATAM (ejemplo: Bogotá → Madrid):**

**Eduardo:** También tengo Avianca 🇨🇴 con opción:
- Bogotá → Madrid directo
- 10h de vuelo
- Precio competitivo con mejor servicio

¿Interesado?

---

**Beneficio:** Cliente ve valor real (Eduardo recomienda, no solo bot)
**Speed:** Transacción en 1-2 mensajes, no 10+
**Trust:** Precios transparentes, markup visible
**Avianca added:** Más opciones para mercado latinoamericano 🇨🇴