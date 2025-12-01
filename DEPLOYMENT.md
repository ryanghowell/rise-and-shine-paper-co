# Deployment Guide - Rise and Shine Paper Co.

## Quick Deploy to Vercel (Recommended)

### Prerequisites
- A GitHub account (free)
- A Vercel account (free) - sign up at https://vercel.com

### Step-by-Step Instructions

#### 1. Push Your Code to GitHub

First, let's commit all your changes:

```bash
git add .
git commit -m "Initial commit - Rise and Shine Paper Co. website"
```

Create a new repository on GitHub:
1. Go to https://github.com/new
2. Name it: `rise-and-shine-paper-co`
3. Make it Public or Private (your choice)
4. Don't initialize with README (we already have code)
5. Click "Create repository"

Push your code to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/rise-and-shine-paper-co.git
git branch -M main
git push -u origin main
```

#### 2. Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New Project"
3. Import your `rise-and-shine-paper-co` repository
4. Vercel will auto-detect Next.js settings - just click "Deploy"
5. Wait 2-3 minutes for deployment to complete
6. You'll get a live URL like: `https://rise-and-shine-paper-co.vercel.app`

#### 3. Custom Domain (Optional)

Once deployed, you can add a custom domain:
1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your domain (e.g., `riseandshinepaperco.com`)
4. Follow the DNS instructions to point your domain to Vercel

### Automatic Updates

Every time you push to GitHub, Vercel will automatically rebuild and deploy your site!

```bash
# Make changes to your code
git add .
git commit -m "Updated gallery images"
git push
# Vercel automatically deploys in ~2 minutes
```

---

## Alternative: Netlify

If you prefer Netlify:

1. Go to https://netlify.com
2. Drag and drop your `.next` folder (after running `npm run build`)
3. Or connect your GitHub repo for automatic deployments

---

## Alternative: Self-Hosting

If you have your own server:

```bash
# Build the production version
npm run build

# Start the production server
npm start
```

Then use a process manager like PM2 to keep it running:
```bash
npm install -g pm2
pm2 start npm --name "rise-and-shine" -- start
```

---

## Environment Variables

If you need environment variables (for forms, analytics, etc.), add them in:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables

---

## Current Build Status

✅ Build successful (19 pages generated)
✅ All routes working
✅ Images configured
✅ Ready to deploy!

## What's Included

- ✅ Home page
- ✅ Navigation & Footer
- ✅ Shop pages (5 categories)
- ✅ Learn pages (5 educational pages)
- ✅ Gallery with lightbox
- ✅ About, FAQ, Terms, Order pages
- ✅ Responsive design
- ✅ SEO optimized
