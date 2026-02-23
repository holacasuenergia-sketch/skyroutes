# DEPLOYMENT INSTRUCTIONS

## Vercel (Current - FAILING)

1. Open: https://vercel.com/dashboard
2. Select "skyroutes" project
3. Click "Deployments" tab
4. Click "Redeploy" on latest commit
5. Choose "Force Redeploy"

IF STILL FAILING:
- Click "Settings" → "General"
- Check "Build & Development Settings"
- Framework Preset: MUST be "Next.js"
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

## Netlify (ALTERNATIVE - More Simple)

### Method 1: Drag & Drop (NO sign-in required)

1. Create folder on Desktop: `skyroutes-demo`
2. Copy these files to folder:
   - `public/demo-vuelos.html` → Rename to `index.html`
   - Copy `public/logo.png`
   - Copy `public/logo.svg`

3. Open: https://app.netlify.com/drop
4. Drag & Drop ENTIRE `skyroutes-demo` folder
5. Wait 30 seconds
6. Get URL like: `https://random-string.netlify.app`

### Method 2: GitHub Integration (Recommended)

1. Create Netlify account: https://app.netlify.com/signup
2. Click "Add new site" → "Deploy site"
3. Choose "Import from an existing project"
4. Authorize GitHub
5. Select: `holacasuenergia-sketch/skyroutes` repo
6. Configure:
   - Build Command: `npm run build`
   - Publish Directory: `.next`
   - Node Version: 18

7. Click "Deploy site"

## GitHub Pages (ALTERNATIVE - Simple Static)

GitHub Pages ONLY works for static files, NOT Next.js.

For full functionality, use:
- Vercel (if fixed)
- OR Netlify

---

## QUICK FIX: Use public/demo-vuelos.html

The demo page works ANYWHERE:

### Via Netlify Drop:
1. Create folder: `skyroutes-demo`
2. Copy `public/demo-vuelos.html` → `index.html`

3. Drag & Drop to: https://app.netlify.com/drop
4. Get working URL in 30 seconds

### Via GitHub Pages:
1. Create new branch: `gh-pages`
2. Push with only `public/` folder contents
3. Enable GitHub Pages in repo settings
4. URL: `https://username.github.io/repo/public/demo-vuelos.html`

---

## CURRENT DEPLOYMENT STATUS

**Vercel:**
- URL: https://skyroutes-one.vercel.app
- Status: ❌ FAILED - 404 NOT_FOUND
- Last Commit: 9f811ca (demo-vuelos.html)

**Issue:**
- Commits push to GitHub ✅
- Vercel NOT updating site ❌
- API routes: 404 ❌
- Static pages: Partially working ✅

**Diagnosis:**
- Possible: Build not triggering
- Possible: Framework not detecting
- Possible: Repo desync from Vercel

---

## SOLVED: Use demo-vuelos.html via Netlify Drop

This is TEMPORARY solution for client demos while Vercel issue resolved.

Instructions above in "Netlify" section.