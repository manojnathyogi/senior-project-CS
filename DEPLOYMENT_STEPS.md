# Step-by-Step Railway Deployment Guide

Follow these steps exactly to deploy MindEase to Railway.

## Step 1: Create a New Railway Project

1. Go to [railway.app](https://railway.app) and log in
2. Click the **"New Project"** button (top right or center of dashboard)
3. Select **"Deploy from GitHub repo"**
4. If you haven't connected GitHub:
   - Click **"Configure GitHub App"**
   - Authorize Railway to access your repositories
   - Select the repositories you want to give access to
5. Find and select your repository: **`senior-project-CS`**
6. Click **"Deploy Now"**

Railway will start detecting your project automatically.

---

## Step 2: Add PostgreSQL Database

1. In your Railway project dashboard, you'll see your service
2. Click the **"New"** button (top right)
3. Select **"Database"** from the dropdown
4. Click **"Add PostgreSQL"**
5. Railway will automatically:
   - Create a PostgreSQL database
   - Set the `DATABASE_URL` environment variable
   - Link it to your project

**Note:** The database will appear as a separate service in your project. You don't need to configure anything - Railway handles it automatically.

---

## Step 3: Configure Backend Service

1. Click on your **backend service** (the one that says "Deploying" or your repo name)
2. Go to the **"Settings"** tab
3. Scroll down to find these settings:

### Root Directory:
- Set **Root Directory** to: `backend`
- This tells Railway where your Django project is located

### Start Command:
- Set **Start Command** to:
```
python manage.py migrate && gunicorn mindease.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120
```

4. Click **"Save"** or the changes will auto-save

---

## Step 4: Set Environment Variables

1. Still in your backend service, go to the **"Variables"** tab
2. Click **"New Variable"** for each of these:

### Required Variables:

**SECRET_KEY:**
- Click "New Variable"
- Name: `SECRET_KEY`
- Value: Generate a random secret key. You can use:
  ```bash
  python -c "import secrets; print(secrets.token_urlsafe(50))"
  ```
- Click "Add"

**DEBUG:**
- Name: `DEBUG`
- Value: `False`
- Click "Add"

**ALLOWED_HOSTS:**
- Name: `ALLOWED_HOSTS`
- Value: `*.railway.app`
- Click "Add"

**USE_SQLITE:**
- Name: `USE_SQLITE`
- Value: `False`
- Click "Add"

**FRONTEND_URL:**
- Name: `FRONTEND_URL`
- Value: `https://your-frontend-url.railway.app` (we'll update this later)
- Click "Add"

### Email Configuration Variables:

**EMAIL_HOST:**
- Name: `EMAIL_HOST`
- Value: `smtp.gmail.com`
- Click "Add"

**EMAIL_PORT:**
- Name: `EMAIL_PORT`
- Value: `587`
- Click "Add"

**EMAIL_USE_TLS:**
- Name: `EMAIL_USE_TLS`
- Value: `True`
- Click "Add"

**EMAIL_HOST_USER:**
- Name: `EMAIL_HOST_USER`
- Value: Your Gmail address (e.g., `yourname@gmail.com`)
- Click "Add"

**EMAIL_HOST_PASSWORD:**
- Name: `EMAIL_HOST_PASSWORD`
- Value: Your Gmail App Password (see instructions below)
- Click "Add"

**DEFAULT_FROM_EMAIL:**
- Name: `DEFAULT_FROM_EMAIL`
- Value: `noreply@mindease.com`
- Click "Add"

### How to Get Gmail App Password:

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click **"Security"** in the left sidebar
3. Under **"Signing in to Google"**, find **"2-Step Verification"**
4. If not enabled, enable it first
5. After enabling, go back to Security
6. Click **"App passwords"** (under 2-Step Verification)
7. Select **"Mail"** as the app
8. Select **"Other"** as device and type "Railway"
9. Click **"Generate"**
10. Copy the 16-character password (no spaces)
11. Use this password for `EMAIL_HOST_PASSWORD`

---

## Step 5: Deploy Backend

1. Go back to the **"Deployments"** tab in your backend service
2. Railway should automatically start deploying
3. Watch the build logs - you'll see:
   - Installing Python dependencies
   - Installing Node.js dependencies (for frontend build)
   - Running migrations
   - Starting Gunicorn server

4. Wait for deployment to complete (usually 2-5 minutes)
5. Once it says **"Deployed"**, click on your service
6. Go to the **"Settings"** tab
7. Scroll down to **"Domains"**
8. Click **"Generate Domain"** (if not already generated)
9. Copy your backend URL (e.g., `https://your-app-name.up.railway.app`)

**Save this URL - you'll need it for the frontend!**

---

## Step 6: Test Backend API

1. Open your backend URL in a browser
2. You should see Django's default page or API root
3. Try accessing: `https://your-backend-url.railway.app/api/`
4. You should see your API endpoints

---

## Step 7: Create Admin User

1. In Railway, go to your backend service
2. Click the **"Deployments"** tab
3. Click on the latest deployment
4. Click **"View Logs"** or use the terminal icon
5. In the terminal, run:
```bash
python manage.py createsuperuser
```
6. Follow the prompts:
   - Email: (your admin email)
   - Password: (create a strong password)
   - Password again: (confirm)

---

## Step 8: Deploy Frontend (Option A - Railway)

### 8a. Create Frontend Service:

1. In your Railway project, click **"New"**
2. Select **"Empty Service"**
3. Click **"Add GitHub Repo"**
4. Select the same repository: `senior-project-CS`
5. Click on the new service

### 8b. Configure Frontend:

1. Go to **"Settings"** tab
2. Set **Root Directory** to: `/` (leave empty or put `/`)
3. Set **Build Command** to:
```
npm install && npm run build
```
4. Set **Start Command** to:
```
npx serve -s dist -l $PORT
```
5. Click **"Save"**

### 8c. Set Frontend Environment Variables:

1. Go to **"Variables"** tab
2. Add:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-backend-url.railway.app/api` (use the URL from Step 5)
3. Click **"Add"**

### 8d. Deploy Frontend:

1. Go to **"Deployments"** tab
2. Railway will automatically deploy
3. Wait for deployment to complete
4. Go to **"Settings"** → **"Domains"**
5. Generate a domain for your frontend
6. Copy the frontend URL

### 8e. Update Backend CORS:

1. Go back to your **backend service**
2. Go to **"Variables"** tab
3. Find `FRONTEND_URL`
4. Click the edit icon
5. Update the value to your frontend URL from Step 8d
6. Click **"Save"**
7. Railway will automatically redeploy with the new CORS settings

---

## Step 9: Deploy Frontend (Option B - Vercel - Recommended for Free Tier)

If you want to save Railway credits, deploy frontend to Vercel (free):

### 9a. Prepare Frontend:

1. Create a `.env.production` file in your project root:
```bash
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
```

2. Commit and push:
```bash
git add .env.production
git commit -m "Add production env file"
git push origin main
```

### 9b. Deploy to Vercel:

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Import your repository: `senior-project-CS`
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `/` (default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Add Environment Variable:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-backend-url.railway.app/api`
7. Click **"Deploy"**
8. Wait for deployment (1-2 minutes)
9. Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

### 9c. Update Backend CORS:

1. Go back to Railway → Backend service → Variables
2. Update `FRONTEND_URL` to your Vercel URL
3. Save (auto-redeploys)

---

## Step 10: Test Everything

1. **Test Frontend:**
   - Visit your frontend URL
   - Try signing up with an email
   - Check if OTP email arrives

2. **Test Backend API:**
   - Visit: `https://your-backend-url.railway.app/api/`
   - Should see API endpoints

3. **Test Admin Panel:**
   - Visit: `https://your-backend-url.railway.app/admin/`
   - Login with superuser credentials

---

## Troubleshooting

### Build Fails:

1. Check Railway logs:
   - Go to Deployments → Click latest → View Logs
2. Common issues:
   - Missing dependencies → Check `requirements.txt`
   - Python version → Check `runtime.txt`
   - Build command error → Check `nixpacks.toml`

### Database Connection Error:

1. Verify PostgreSQL service is running
2. Check that `DATABASE_URL` is set (Railway sets this automatically)
3. Ensure `USE_SQLITE=False`

### CORS Errors:

1. Verify `FRONTEND_URL` matches your actual frontend URL
2. Check `ALLOWED_HOSTS` includes `*.railway.app`
3. Restart backend service after changing variables

### Email Not Sending:

1. Verify Gmail App Password is correct (16 characters, no spaces)
2. Check 2-Step Verification is enabled
3. Verify all email variables are set correctly

### Static Files Not Loading:

1. Run collectstatic:
```bash
railway run python manage.py collectstatic
```

---

## Quick Reference

### Backend URL:
`https://your-backend-name.up.railway.app`

### Frontend URL (Railway):
`https://your-frontend-name.up.railway.app`

### Frontend URL (Vercel):
`https://your-app.vercel.app`

### Admin Panel:
`https://your-backend-name.up.railway.app/admin/`

### API Root:
`https://your-backend-name.up.railway.app/api/`

---

## Next Steps After Deployment

1. Set up custom domains (optional)
2. Configure monitoring and alerts
3. Set up automated backups for database
4. Review Railway usage dashboard
5. Consider upgrading to Hobby plan ($5/month) for:
   - More resources
   - Better support
   - No deployment restrictions

---

## Need Help?

- Check Railway logs for errors
- Review `RAILWAY_DEPLOYMENT.md` for detailed explanations
- Railway Community Support (read-only on trial plan)
- Check Django logs: `railway logs` in terminal

