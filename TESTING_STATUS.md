# TESTING PLAN - SkyRoutes

## Status Actual (2026-02-23)

### ✅ Implementado:
1. **Regional Filtering** 🌎
   - Clientes LATAM ven solo aerolíneas LATAM
   - Clientes Europa ven solo aerolíneas europeas

2. **Solo Ida / Ida y Vuelta** ✈️
   - Selector de tipo de vuelo
   - flatpickr dinámico (single/range mode)
   - API y Python scraper con trip_type

3. **Stripe Payments** 💳
   - checkout.html + payment.js + success.html
   - /api/create-payment endpoint
   - Flujo completo implementado

4. **WhatsApp Integration** 💬
   - Botón "Ver Todas las Opciones"
   - Botón "¿Tienes dudas?"
   - Mensaje completo con ticket

### ❓ Issues Pendientes:

1. **Deploy Error de Vercel:**
   - Error de implementación en producción
   - Revisar: git push origin main → Vercel deploy logs

2. **Python Dependencies:**
   - npm install está demorando
   - Warning: puppeteer@21.11.0 deprecation

3. **Playwright Installation:**
   - Chromium ya instalado (162MB)
   - Virtual environment lista

---

## TESTING LOCAL

### Paso 1: Instalar Dependencias (PENDING)
```bash
cd /Users/agentebond/.openclaw/workspace/skyroutes
npm install

# Si demora mucho, puede ser error
# Output esperado: ~200 MB de node_modules
```

### Paso 2: Iniciar Servidor Next.js
```bash
npm run dev

# Output esperado:
# ✓ Ready in Xms
# - Local:        http://localhost:3000
# - Network:      http://192.168.x.x:3000
```

### Paso 3: Testing en Browser

1. **Abrir:** http://localhost:3000

2. **Test de Regional Filtering:**
   - Búsqueda: BOG → MAD (LATAM → Europa)
   - Esperar: Solo Avianca, Iberia, LATAM
   - ❌ NO ver: Ryanair, EasyJet (no relevantes)

3. **Test de Solo Ida:**
   - Seleccionar: "Solo Ida"
   - Fecha: 15-05-2026 (única)
   - Resultados: "X Vuelos Encontrados (Solo Ida)"

4. **Test de Ida y Vuelta:**
   - Seleccionar: "Ida y Vuelta"
   - Fechas: 15-05-2026 a 22-05-2026
   - Resultados: "X Vuelos Encontrados (Ida y Vuelta)"

### Paso 4: Testing de Stripe (Mock)

1. **Seleccionar vuelo**
2. **Click "Reservar Esta Opción 💳"**
3. **Redirige a checkout.html**
4. **Completa:**
   - Nombre: Juan Pérez
   - Email: test@skyroutes.com
   - Teléfono: +34 600 000 000
5. **Tarjeta test:** 4242 4242 4242 4242
6. **Click "Pagar €50.00"**
7. **Espero:** success.html + botón WhatsApp

---

## DEPLOY VERCEL

### Issues:

1. **Error de implementación:**
   - Revisar: https://vercel.com/[usuario]/skyroutes
   - Ver: Dashboard → Deployments → Latest
   - Buscar: Build logs error

2. **Environment Variables:**
   - STRIPE_PUBLISHABLE_KEY (no configurado aún)
   - STRIPE_SECRET_KEY (no configurado aún)

### Corregir Deploy:

```bash
# 1. Revisar build logs
git push origin main

# 2. Ver Vercel dashboard
https://vercel.com/.../skyroutes/settings/deployments

# 3. Ver error en logs
```

---

## NEXT STEPS:

1. **Completo instalación npm**
2. **Testing local**
3. **Corregir deploy error Vercel**
4. **Configure Stripe keys en Vercel**
5. **End-to-end testing**

---

STATUS: Esperando npm install complete
NEXT: Iniciar servidor local + testing