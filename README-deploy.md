# SkyRoutes - Dashboard de Pagos

## 📋 Configuración en Vercel

### 1. Variables de Entrenamiento (Necesarias)

No agregues esto al código - configurá en Vercel Dashboard:

**Settings > Environment Variables:**

```
STRIPE_SECRET_KEY=sk_test_XXX_PLACEHOLDER
JWT_SECRET=su_contraseña_super_segura_aqui_cambiar_en_produccion
ADMIN_PASSWORD=skyroutes25@
NEXT_PUBLIC_URL=https://skyroutes.vercel.app
```

**⚠️ IMPORTANTE:**
- Cambiar `JWT_SECRET` antes de producción
- Poner `NEXT_PUBLIC_URL` correcto (dominio de producción)
- `STRIPE_SECRET_KEY` nunca debe estar en el frontend

---

## 📂 Copiar archivos a tu repo

Estos archivos te los generé en `/tmp/skyroutes/`. Debes copiarlos:

```bash
cd /Tu/Ruta/al/repo/skyroutes

# Copiar desde temp
cp /tmp/skyroutes/package.json .
cp /tmp/skyroutes/admin-pagos.html .
cp /tmp/skyroutes/success.html .
cp /tmp/skyroutes/cancel.html .
cp -r /tmp/skyroutes/api .
cp -r /tmp/skyroutes/lib .
```

---

## 🚀 Deploy en Vercel

### Opción A: Desde Vercel Dashboard (Más simple)

1. **Conectar repo en Vercel:**
   - Entra a vercel.com
   - Add New Project → Import from Git
   - Selecciona tu repo: `holacasuenergia-sketch/skyroutes`

2. **Configurar variables:**
   - Antes de deploy, ve a "Environment Variables"
   - Agrega las 4 variables de arriba

3. **Deploy:**
   - Click en "Deploy"
   - Espera ~1-2 minutos

---

### Opción B: Desde CLI

```bash
# Instalar Vercel CLI (si no lo tenés)
npm i -g vercel

# Login
vercel login

# Deploy desde el directorio del repo
cd /Tu/Ruta/skyroutes
vercel

# Seguir las instrucciones
# Cuando pregunte por directory, dejar vacío (default)
# Cuando pregunte por variables, agregar las 4 de arriba
```

---

## ✅ Verificar que funciona

1. **Ir a:** `https://skyroutes.vercel.app/admin-pagos.html`
2. **Login con:** `skyroutes25@`
3. **Crear un payment link** (usando monto pequeño, €0.10)
4. **Probar el link generado**
5. **Verificar que WhatsApp funciona**

---

## 🔐 Cambiar la contraseña de admin

Para cambiar la contraseña del panel:

**En Vercel:**
1. Ve al proyecto → Settings → Environment Variables
2. Edita `ADMIN_PASSWORD`
3. Redeploy

**Locales (testing):**
- Busca en `lib/auth.ts`: `verifyPassword()` y el endpoint `api/admin/login.ts`
- Cambia la comparación actual

---

## 📱 Número de WhatsApp

El número está en:
- `admin-pagos.html` línea del link de wa.me
- Variables de entorno: no necesario cambiar si no querés

**Para cambiar:**
1. Buscar `34610243061` en `admin-pagos.html`
2. Reemplazar con tu número nuevo (formato: código país + número sin +, sin espacios)
3. Ej: `34612345678`

---

## 🧪 Testing

Antes de producción, probá con:

1. **Monto pequeño:** €0.50 - €1.00
2. **Tarjeta de prueba de Stripe:**
   - Número: `4242 4242 4242 4242`
   - Fecha: Cualquier fecha futura
   - CVC: Cualquier 3 dígitos
   - ZIP: Cualquier código postal

---

## 🚨 PARA PRODUCCIÓN

Cuando quieras ir LIVE:

1. **Cambiar STRIPE_SECRET_KEY:**
   - De: `sk_test_...` → Dejar así para testing
   - De: `sk_live_...` → Para producción (real)

2. **Cambiar JWT_SECRET:**
   - Debe ser algo NUEVO, NO el que te pasé
   - Usa: `openssl rand -base64 32`

3. **Cambiar NEXT_PUBLIC_URL:**
   - De: `https://skyroutes.vercel.app/test`
   - Para: `https://skyroutes.vercel.app` (o tu dominio real)

4. **Cambiar ADMIN_PASSWORD:**
   - NÚMERO 1: algo fuerte y único

---

## 🐛 Errores Comunes

| Error | Solución |
|-------|----------|
| `401 Unauthorized` | No estás logueado o token expiró. Re-login en panel. |
| `StripeInvalidRequestError` | Stripe key incorrecta o expiró |
| `500 Error` | Check logs en Vercel Dashboard |
| `Link no funciona` | Check NEXT_PUBLIC_URL en variables |

---

## 📞 Soporte

Si tenés problemas:
1. Check Vercel logs: Deployment → Functions
2. Verificar variables de entorno estén correctas
3. Probar con monto pequeño primero

---

¡Suerte con el deploy! 🚀