# SkyRoutes - Configuración de Stripe en Vercel

## 📋 Paso 1: Crear Cuenta de Stripe

Si aún no tienes cuenta de Stripe:

1. Ve a https://dashboard.stripe.com/register
2. Regístrate con tu email
3. Completa el proceso de verificación
4. Agrega tu información de negocio (nombre, país, etc.)

---

## 🔑 Paso 2: Obtener Claves de Stripe

### Claves de Prueba (Test Keys) - Para Development

1. Ve a Stripe Dashboard: https://dashboard.stripe.com/test/apikeys
2. Asegúrate de estar en modo **Test** (arriba a la derecha)
3. Verás dos claves:

#### **Publishable Key (Llave pública):**
```
pk_test_51T3iSTx... (ejemplo)
```
- Esta clave es **segura para compartir** (visible en el frontend)
- Se usa en el JavaScript del browser

#### **Secret Key (Llave secreta):**
```
sk_test_51T3iSTx... (ejemplo)
```
- Esta clave es **SECRETA**, **NO** compartirla
- Solo se usa en el servidor (API de Next.js)
- NUNCA va al código del navegador

---

### Claves de Producción (Live Keys) - Para Usar con Clientes Reales

1. Ve a Stripe Dashboard: https://dashboard.stripe.com/apikeys
2. Cambia a modo **Live** (arriba a la derecha)
3. Verás dos claves:
   - `pk_live_...` (Publishable Key - ejemplo)
   - `sk_live_...` (Secret Key - ejemplo)

**⚠️ IMPORTANTE:**
- Solo usa live keys cuando esté listo para production
- Test keys son gratuitas y seguras para pruebas
- Live keys cobran tarjetas reales

---

## 🚀 Paso 3: Configurar Stripe en Vercel

### Opción A: Test Keys (Development)

Si estás probando, usa claves de test:

```
STRIPE_PUBLISHABLE_KEY=pk_test_51T3iSTx...
STRIPE_SECRET_KEY=sk_test_51T3iSTx...
```

### Opción B: Live Keys (Production)

Si ya tienes clientes reales:

```
STRIPE_PUBLISHABLE_KEY=pk_live_51T3iSTx...
STRIPE_SECRET_KEY=sk_live_51T3iSTx...
```

---

### ¿Dónde configurar las claves en Vercel?

**Opción 1: Vercel Dashboard (Recomendado)**

1. Ve a tu proyecto en Vercel: https://vercel.com/[tu-usuario]/skyroutes
2. Click en **Settings** (sidebar)
3. Click en **Environment Variables**
4. Agrega las siguientes variables:

| Variable | Valor |
|---|---|
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_51T3iSTx...` o `pk_live_51T3iSTx...` |
| `STRIPE_SECRET_KEY` | `sk_test_51T3iSTx...` o `sk_live_51T3iSTx...` |

5. Guarda las variables (`Add` y `Save`)

6. **IMPORTANTE:** Redeploy automático
   - Vercel guardará las variables
   - Click en **Redeploy** en la sección Deployments
   - Espera ~2 minutos para que se apliquen

---

**Opción 2: Vercel CLI**

Si prefieres usar la línea de comandos:

```bash
# Agregar publishable key
vercel env add STRIPE_PUBLISHABLE_KEY
> Valor: pk_test_51T3iSTx... (o pk_live_...)

# Agregar secret key
vercel env add STRIPE_SECRET_KEY
> Valor: sk_test_51T3iSTx... (o sk_live_...)

# Deployment automático
```

---

## ✅ Paso 4: Verificar Configuración

### Testing con Tarjeta Test

Stripe provides tarjeta test para probar:

**Número de tarjeta:** `4242 4242 4242 4242`
**Expiración:** Cualquier fecha futura (ej: `12/34`)
**CVC:** Cualquier 3 dígitos (ej: `123`)
**ZIP:** Cualquier 5 dígitos (ej: `12345`)

### Testing del Sistema

1. Ve a tu proyecto Vercel: https://skyroutes-one.vercel.app
2. Busca un vuelo: Bogotá → Madrid
3. Elige una opción
4. Click en "Reservar Esta Opción 💳"
5. Completa el formulario de pasajero:
   - Nombre: Juan Pérez
   - Email: test@skyroutes.com
   - Teléfono: +34 600 000 000
6. Ingresa tarjeta test:
   - Número: 4242 4242 4242 4242
   - Expira: 12/34
   - CVC: 123
7. Click en "Pagar €50.00"
8. **Espero:** Redirección a success.html

---

## 📊 Paso 5: Verificar en Stripe Dashboard

1. Ve al Stripe Dashboard: https://dashboard.stripe.com/payments
2. Verás el pago de prueba:
   - Amount: €50.00
   - Status: Succeeded
   - Metadata pasajero: Juan Pérez
   - Metadata flight: Ryanair FR1234

---

## 🔐 Paso 6: Seguir Pago con WhatsApp

1. Sistema redirect a success.html
2. Click en "Enviar Ticket a Eduardo"
3. WhatsApp se abre con mensaje completo:
   - ID de reserva (pi_1234567890abcdef)
   - Estado: Pago completado
   - Vuelo completo + pasajero + desglose de pago
4. Eduardo recibe y procesa ticket

---

## ⚠️ PRECAUCIONES:

### **SECRECY:**
- **NUNCA** compartas `sk_test_` o `sk_live_` keys
- Solo `pk_test_` y `pk_live_` pueden aparecer en frontend
- Las secrets keys solo se usan en servidor (API)

### **MODES:**
- **Test mode** → Tarjeta `4242 4242 4242 4242` (sin cobro real)
- **Live mode** → Cobros REALES a tarjetas de clientes
- Cambiar a live keys solo cuando esté 100% listo

### **WEBHOOKS (Opcional):**
- Puedes configurar webhooks para notificaciones automáticas
- Evento: `payment_intent.succeeded`
- Recibe notificaciones cuando clientes pagan
- Usar para confirmaciones automáticas en WhatsApp

---

## 📚 Recursos Útiles:

- **Stripe Docs:** https://stripe.com/docs
- **Stripe Payment Intents:** https://stripe.com/docs/api/payment_intents
- **Stripe Test Cards:** https://stripe.com/docs/testing#cards
- **Vercel Environment Variables:** https://vercel.com/docs/concepts/projects/environment-variables

---

## ❓ Preguntas Comunes:

### **¿Por qué error 'Invalid API Key'?**
- El secreto key en Vercel es incorrecto
- Verifica que uses `sk_test_...` no `pk_test_...`
- Secret keys empiezan con `sk_`, publishable con `pk_`

### **¿Por qué falla el pago?**
- Tarjeta de test no válida
- Expiración en el pasado (debe ser futuro)
- Secret key no está configurada en Vercel

### **¿Cómo cambiar de test a production?**
1. Cambiar env variables en Vercel:
   - `pk_test_` → `pk_live_`
   - `sk_test_` → `sk_live_`
2. Redeploy Vercel
3. Prueba con una tarjeta real (tú mismo)

### **¿Cómo hacer testing de refunds?**
1. Stripe Dashboard → Payments
2. Click en el pago
3. Click en "Refund"
4. Stripe procesa reembolso al cliente

---

**Status:** Sistema implementado + guía completa
**Next:** Configurar claves en Vercel + test real
**Última actualización:** 2026-02-23