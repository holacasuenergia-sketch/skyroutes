# 🧪 TESTING GUIDE - Stripe Payment Flow (LOCAL)

## ✅ SERVIDOR INICIADO

**URL:** http://localhost:3000
**Estado:** ✅ READY (Next.js 14.2.35 iniciado en 869ms)
**Stripe Keys:** ✅ Configuradas (TEST MODE)

**Claves Test:**
- Publishable: `pk_test_51T3DC67...`
- Secret: `sk_test_51T3DC67...`

---

## 📋 TEST FLOW - COMPLETO

### **PASO 1: Buscar Vuelo** (1-2 min)

1. **Abre el browser:** http://localhost:3000

2. **Completa el formulario:**
   - **Origen:** Madrid
   - **Destino:** Barcelona
   - **Tipo de Vuelo:** Ida y Vuelta
   - **Fechas:** 15-05-2026 → 22-05-2026
   - **Pasajeros:** 1 adulto

3. **Click en "Buscar"**

4. **Espera:**
   - Loading spinner: "🔍 Buscando..."
   - 15-30s (scraping real de 3 aerolíneas en paralelo)

5. **Verás resultados:**
   - Cards de vuelos
   - Ryanair, EasyJet, Vueling
   - Horarios, duración, precios

---

### **PASO 2: Ver Resultados** (30s)

**Revisa que todo esté OK:**

✅ **Filtrado Geográfico:**
- Solo aerolíneas europeas (Ryanair, EasyJet, Vueling)
- NO Avianca/LATAM (correcto para ruta España-España)

✅ **Tarjeta de vuelo:**
- Airline + Flight number
- Times: 08:30 → 10:45
- Duration: 2h 15m
- Directo: "0 escalas"

✅ **Precios:**
- Original: €45.00
- SkyRoutes: €50.00
- Badge: "+10%"

---

### **PASO 3: Botones de Acción** (15s)

**En cada card de vuelo verás 2 botones:**

**✅ BOTÓN 1: "Reservar Esta Opción 💳"**
- Click en uno
- Debe redirigir a: `/checkout.html`

**✅ BOTÓN 2: "¿Tienes dudas?"**
- Click en otro
- Debe abrir WhatsApp con mensaje pre-formateado

**✅ BOTÓN 3 ( abajo): "Ver Todas las Opciones ✈️"**
- Click en este botón grande
- Debe abrir WhatsApp con top X opciones

---

### **PASO 4: Checkout Page** (1-2 min)

**Después de click en "Reservar Esta Opción":**

1. **Redirige a:** http://localhost:3000/checkout.html?flight_id=...

2. **Revisa UI:**
   - Header: "Completa tu reserva"
   - Flight details card (abajo)
   - Formulario pasajero
   - Stripe Elements (card input)

---

### **PASO 5: Completa Formulario** (1 min)

**Datos del Pasajero:**
```
Nombre: Juan Pérez
Email: test@skyroutes.com
Teléfono: +34 600 000 000
```

**Datos de Tarjeta (TEST CARD):**
```
Número: 4242 4242 4242 4242
Expira: 12/34
CVC: 123
Nombre en tarjeta: Juan Pérez
```

**⚠️ NOTA:** Esta es una tarjeta test de Stripe. No se cobra nada.

---

### **PASO 6: Procesar Pago** (5-10s)

1. **Click en botón: "PAGAR €50.00"**

2. **Verás:**
   - Loading: "Procesando pago..."
   - Llamada a: `/api/create-payment`
   - Stripe confirma payment

3. **Si todo OK:**
   - Success → Redirige a `/success.html`

---

### **PASO 7: Success Page** (30s)

**Debes ver:**

```
━━━━━━━━━━━━━━━━━━
    ✓ PAYMENT SUCCESS
   ¡Pago Completado! 🎉
━━━━━━━━━━━━━━━━━━

RYANAIR FR1234
  MAD → BCN

📅 15-05-2026
  08:30 → 10:45
  2h 15m | DIRECTO

💰 Precio: €50.00 (Pagado)

[💬 ENVIAR TICKET A EDUARDO]
```

**Revisa:**
✅ ✓ PAYMENT SUCCESS badge
✅ Vuelo correcto (Ryanair FR1234)
✅ Ruta correcta (MAD → BCN)
✅ Horarios correctos (08:30 → 10:45)
✅ Precio correcto (€50.00 pagado)

---

### **PASO 8: WhatsApp Integration** ( FINAL)

1. **Click en botón: "💬 ENVIAR TICKET A EDUARDO"**

2. **WhatsApp se abre con mensaje:**

```
¡Hola! ✈️ 🎉

CONFIRMACIÓN DE RESERVA - SkyRoutes

📋 ID de Reserva: pi_1234567890...
✅ Estado: Pago completado

🛫 Vuelo reservado:
• Airline: Ryanair
• Vuelo: FR1234
• Ruta: MAD → BCN
• Fecha: 15-05-2026
• Horario: 08:30 → 10:45

💰 Detalles de pago:
• Precio original: €45.00
• SkyRoutes: €50.00 (10%)

📧 Pasajero: Juan Pérez

Por favor, confirmarme que la reserva está
lista y enviarme los detalles del billete. 🙏
```

3. **Revisa:**
   - ID de reserva (debe ser: pi_....)
   - Estado: "Pago completado"
   - Vuelo completo: airline + flight # + ruta + fecha + horarios
   - Desglose de pago: original + SkyRoutes + %
   - Pasajero: Juan Pérez

---

## 📊 VERIFICACIÓN EN STRIPE DASHBOARD

1. **Ve a:** https://dashboard.stripe.com/test/payments

2. **Busca el pago:**
   - Amount: €50.00
   - Status: Succeeded ✅
   - Customer email: test@skyroutes.com

3. **Revisa metadata:**
   ```json
   {
     "passenger_name": "Juan Pérez",
     "passenger_email": "test@skyroutes.com",
     "passenger_phone": "+34 600 000 000",
     "flight_airline": "Ryanair",
     "flight_number": "FR1234",
     "flight_price_original": "45.00",
     "skyroutes_booking_id": "SR-..."
   }
   ```

---

## ✅ CHECKLIST - LO QUE DEBE FUNCIONAR:

### **Frontend:**
- ✅ HomePage carga
- ✅ Formulario búsqueda funciona
- ✅ Flatpickr dates picker funciona
- ✅ Loading spinner aparece
- ✅ Flight results aparecen

### **API:**
- ✅ POST /api/flights llama scraper Python
- ✅ Scraping devuelve resultados
- ✅ Markup aplicado: 10-15%

### **Checkout Flow:**
- ✅ "Reservar Esta Opción" → checkout.html
- ✅ Flight details card muestra vuelo
- ✅ Formulario pasajero valida inputs
- ✅ Stripe Elements carga correctamente

### **Stripe Payment:**
- ✅ POST /api/create-payment crea Payment Intent
- ✅ Stripe confirma payment con tarjeta test 4242...
- ✅ Payment status: "succeeded"
- ✅ Redirección a success.html

### **Success Page:**
- ✅ Payment SUCCESS badge
- ✅ Flight details correctos
- ✅ Passenger data correctos
- ✅ Price breakdown correcto

### **WhatsApp:**
- ✅ Botón abre WhatsApp
- ✅ Message pre-formateado completo
- ✅ Todos los datos incluidos
- ✅ No faltan campos

---

## ⚠️ VERIFICAR BUGS / ERRORES:

**If FAILS:**

**Error 1: "No se encontraron vuelos"**
- Revisa consola browser (F12)
- Buscar errors en Network tab
- Ver si /api/flights responded

**Error 2: Stripe "Invalid API Key"**
- Revisa .env file
- Verifica STRIPE_SECRET_KEY es correcta
- Recarga página (F5)

**Error 3: Payment fails**
- Revisa Network tab (F12)
- Ver: POST /api/create-payment response
- Ver: Stripe error message

**Error 4: WhatsApp no abre**
- Verifica: https://wa.me/34610243061?text=...
- Revisa que message se encode correctamente
- Revisa browser tiene permiso abrir links

---

## 🎯 RESULTADOS ESPERADOS:

**✅ ALL PASS:**
- Flight search: WORKING
- Regional filtering: WORKING
- Checkout: WORKING
- Stripe payment: WORKING (test card)
- Success page: WORKING
- WhatsApp: WORKING

**⚠️ WARNING IF:**
- Scraping timeout (30s) - OK, es normal scraping real
- Slow loading (15-30s) - OK, scraping 3 aerolíneas en paralelo

---

## 📝 NOTAS DE TESTING:

**Duración total:**
- Flight search: 15-30s
- Form completion: 1-2min
- Payment processing: 5-10s
- Success + WhatsApp: 30s
- **TOTAL: ~3-5 minutes**

**Revisar en Stripe Dashboard:**
- https://dashboard.stripe.com/test/payments
- Verificar payment metadata completa

**Revisar logs API:**
- Terminal donde corre: `npm run dev`
- Ver requests/responses de /api/create-payment

---

## ⭐ TEST STATUS:

**Fecha:** 2026-02-23
**Servidor:** http://localhost:3000
**Stripe Mode:** TEST
**Tarjeta:** 4242 4242 4242 4242

**Resultados:**
- [ ] Flight search: __WORKING / FAILING__
- [ ] Regional filtering: __WORKING / FAILING__
- [ ] Checkout: __WORKING / FAILING__
- [ ] Stripe payment: __WORKING / FAILING__
- [ ] Success page: __WORKING / FAILING__
- [ ] WhatsApp: __WORKING / FAILING__

---

**¡LISTO PARA TESTING! 🚀**

Abre: http://localhost:3000