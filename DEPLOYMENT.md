# Serbian Schools Dashboard - Deployment Guide

## 🚀 Hosting Options for Your Full-Stack App

### Option 1: Static Deployment (GitHub Pages) - **FREE** ✅

**What you get:**
- ✅ Completely free hosting
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ✅ Fast global CDN
- ✅ URL: `https://stefmil.github.io/serbian-schools`

**Steps to deploy:**

1. **Commit and push your changes:**
```bash
git add .
git commit -m "Add static deployment support"
git push origin main
```

2. **Deploy to GitHub Pages:**
```bash
cd frontend
npm run deploy
```

3. **Enable GitHub Pages:**
   - Go to your repo: `https://github.com/stefmil/serbian-schools`
   - Settings → Pages
   - Source: Deploy from branch `gh-pages`
   - Your site will be live at: `https://stefmil.github.io/serbian-schools`

**Pros:**
- Completely free forever
- No server maintenance
- Lightning fast
- Works great for your use case

**Cons:**
- Static data only (no real-time updates)
- No server-side processing

---

### Option 2: Full Backend Hosting - **FREE** ✅

#### A. Render.com (Recommended for Python)

**What you get:**
- ✅ Free Python hosting (750 hours/month)
- ✅ Automatic deployments from GitHub
- ✅ PostgreSQL database included
- ✅ Custom domain support
- ✅ HTTPS included

**Setup:**
1. Create account at render.com
2. Connect your GitHub repo
3. Create Web Service:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python api.py`
   - Auto-deploy from GitHub

**Frontend:** Deploy on GitHub Pages, update API URL to Render

#### B. Railway.app

**What you get:**
- ✅ $5 monthly credit (free)
- ✅ Easy Python deployment
- ✅ PostgreSQL included
- ✅ Automatic HTTPS

#### C. Fly.io

**What you get:**
- ✅ Generous free tier
- ✅ Global edge deployment
- ✅ Great for Python apps

---

### Option 3: Serverless (Advanced)

**Vercel** (Frontend) + **Vercel Functions** (Backend)
- Deploy React app on Vercel
- Convert Python routes to Vercel Functions
- Completely free for personal use

---

## 🎯 My Recommendation

**For your use case, I recommend Option 1 (Static GitHub Pages)** because:

1. **It's completely free forever**
2. **Your data is mostly static** (from JSON file)
3. **Lightning fast performance**
4. **No server maintenance**
5. **Perfect for public education data**

The static version includes all your features:
- ✅ Serbian Cyrillic translations
- ✅ School search and filtering
- ✅ District analysis
- ✅ Modern colorful design
- ✅ Responsive design
- ✅ All charts and visualizations

---

## 📋 Quick Deploy Commands

### Static Deployment (Recommended):
```bash
# From the frontend directory
npm run build    # Builds with static data
npm run deploy   # Deploys to GitHub Pages
```

### Backend Deployment (Render.com):
```bash
# Create requirements.txt in backend/
echo "Flask==2.3.3
Flask-CORS==4.0.0
pandas==2.3.1" > backend/requirements.txt

# Commit and push
git add .
git commit -m "Add deployment files"
git push

# Then create web service on Render.com
```

---

## 🌐 Custom Domain (Optional)

For a custom domain like `serbian-schools.rs`:

1. **Buy domain** (€10-20/year)
2. **Add CNAME file** to your repo:
```bash
echo "serbian-schools.rs" > frontend/public/CNAME
```
3. **Update DNS** to point to GitHub Pages
4. **Enable custom domain** in GitHub Pages settings

---

## 🔄 Updates

**Static deployment:** Just run `npm run deploy` after changes
**Backend deployment:** Push to GitHub (auto-deploys on Render/Railway/Fly)

Ready to deploy? Just say the word! 🚀
