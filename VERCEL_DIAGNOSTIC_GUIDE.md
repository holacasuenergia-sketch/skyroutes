# Vercel Deployment Diagnostic Guide

## 🔴 CURRENT ISSUE:
**API routes returning 404 - Vercel not deploying serverless functions**

---

## ✅ WHAT WAS ATTEMPTED:

1. ✅ Simplified package.json (removed playwright, puppeteer)
2. ✅ Updated Next.js to 15.1.0
3. ✅ Local build works perfectly
4. ✅ Added next.config.js (explicit config)
5. ✅ Added pages/_app.js (required for Next.js)
6. ✅ API routes compiled as serverless functions (ƒ) locally

---

## 🔍 DIAGNOSTIC STEPS:

### **STEP 1: Check Vercel Deployment Status**

Visit: **https://vercel.com/dashboard**

1. Find project: **skyroutes**
2. Click **Deployments** tab
3. Find latest deployment
4. Check status:

**✅ READY (Green)**
→ Deployment succeeded
→ If API still 404, see Step 2

**🔄 BUILDING (Yellow)**
→ Still building
→ Wait 3-5 more minutes

**❌ FAILED (Red)**
→ Build failed
→ Click deployment to see error
→ Copy Build Log

---

### **STEP 2: Check Vercel Build Log**

If deployment status is READY but API still returns 404:

1. Click on latest deployment
2. Click **"Build Log"** or **"View Logs"**
3. Search for these keywords:

```
Search for: "api" (should see API routes listed)
Search for: "Building"
Search for: "Compiling"
Search for: "Error"
Search for: "Failed"
```

**EXPECTED:**
```
Building...
✓ Compiled successfully
Collecting page data...
Generating static pages...
┌ ƒ /api/test
├ ƒ /api/flights-simple
├ ƒ /api/flights_test
├ ƒ /api/flights
└ ƒ /api/create-payment
```

**IF THIS IS MISSING:**
→ API routes were NOT compiled
→ Vercel detected framework as static site
→ Need to fix detection

---

### **STEP 3: Re-link Project to Vercel**

If API routes listed in build log but still 404:

1. Go to: **https://vercel.com/dashboard/skyroutes**
2. Click **Settings** → **Git**
3. Check **Connected Repository**
4. Should see: **https://github.com/holacasuenergia-sketch/skyroutes**

**If not connected:**
→ Click **Connect Repository**
→ Select GitHub
→ Select **holacasuenergia-sketch/skyroutes**
→ Connect

**Then:**
→ Click **Redeploy** (or **Redeploy from Git**)

---

### **STEP 4: Check Vercel Environment**

1. Go to: **https://vercel.com/dashboard/skyroutes**
2. Click **Settings** → **General**
3. Check **Framework Preset**:
   - Should be: **Next.js**

4. Check **Build & Development Settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

**If different:**
→ Change to Next.js preset
→ Save
→ Redeploy

---

### **STEP 5: Test from Browser**

**AFTER deployment successfully completes:**

1. Visit: **https://skyroutes-one.vercel.app**

2. Open Browser Console: **F12** → **Console**

3. Test these URLs directly:

```
Test API Test Endpoint:
https://skyroutes-one.vercel.app/api/test

Test Flights Simple:
https://skyroutes-one.vercel.app/api/flights-simple

Test Flights:
https://skyroutes-one.vercel.app/api/flights
```

**Expected:**
```json
{
  "status": "ok",
  "message": "API is working..."
}
```

**If 404:**
→ API routes not deployed
→ See Step 6

---

### **STEP 6: Check Vercel Dashboard - Functions**

1. Go to: **https://vercel.com/dashboard/skyroutes**
2. Click **Functions** tab (if available)
3. Should list serverless functions:
   - api/test
   - api/flights-simple
   - api/flights
   - api/flights_test
   - api/create-payment

**If missing:**
→ Functions not deployed
→ Build may have failed silently

---

## 🚨 IF NOTHING WORKS - ALTERNATIVE APPROACH:

### **Option A: Manual Redeploy from Vercel**

1. Go to: **https://vercel.com/dashboard/skyroutes**
2. Click **Deployments**
3. Find latest deployment
4. Click **...** (three dots)
5. Click **Redeploy**

**Then wait 3-5 minutes and test again**

---

### **Option B: Reset Project in Vercel**

1. Go to: **https://vercel.com/dashboard/skyroutes**
2. Click **Settings** → **General**
3. Click **Delete Project**
4. Re-import from GitHub:
   → Go to Vercel Dashboard
   → Click **Add New** → **Project**
   → Import from Git → **skyroutes**

**This will force Vercel to re-detect the framework**

---

### **Option C: Use Vercel CLI (Advanced)**

If you have access to terminal and can run Vercel CLI:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link project
cd /path/to/skyroutes
vercel link

# Redeploy
vercel --prod
```

---

## 📋 INFORMATION TO SEND TO AGENT:

If API routes still return 404 after all steps, collect:

1. **Screenshot of Vercel Dashboard** → Deployments → Latest
   - Status (Ready/Building/Failed)
   - Commit SHA
   - Build time

2. **Screenshot of Vercel Build Log**
   - Click deployment → Build Log
   - Scroll and show key sections

3. **Screenshot of Browser Console**
   - F12 → Console
   - After clicking "Buscar Vuelos"

4. **Direct URL test results:**
   ```
   Visit: https://skyroutes-one.vercel.app/api/test
   What do you see? (JSON or 404?)
   ```

5. **Vercel Project Settings:**
   - Framework Preset: ?
   - Build Command: ?
   - Output Directory: ?

---

## 🎯 ROOT CAUSE POSSIBILITIES:

1. **Vercel detected wrong framework**
   - Thought it was static site instead of Next.js
   - Fix: Explicit Next.js config/preset

2. **API routes not compiled in build**
   - Build process skipped pages/api
   - Fix: next.config.js + pages/_app.js

3. **Repository not linked correctly**
   - Vercel pointing to wrong branch/repo
   - Fix: Reconnect Git repository

4. **Cached deployment**
   - Vercel using old deployment
   - Fix: Redeploy from dashboard

5. **Node version mismatch**
   - Vercel using different Node version
   - Fix: Set Node version in package.json or Vercel settings

---

## ✅ SUCCESS CRITERIA:

**These should work after deployment:**

1. ✅ `https://skyroutes-one.vercel.app/api/test` → JSON response
2. ✅ `https://skyroutes-one.vercel.app/api/flights-simple` → JSON response
3. ✅ Flight search on homepage shows 3 airlines
4. ✅ No 404 errors in console

---

## 📞 Next Steps:

1. **Wait 5 minutes for deployment to complete**
2. **Test: `https://skyroutes-one.vercel.app/api/test`**
3. **If works:** Test main site flight search
4. **If fails:** Follow diagnostic steps above
5. **If still fails:** Send screenshots/info from "Information to Send to Agent"

---

_Last Updated: 2026-02-23_
_Commit: d198dcf_
_Project: skyroutes_