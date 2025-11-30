# Render Deployment Guide - Complete Setup

Render is the best free alternative to Railway. Follow these steps to deploy everything.

## Why Render?

- ✅ Free tier with PostgreSQL database
- ✅ Hosts frontend, backend, and database together
- ✅ Auto-deploys from GitHub
- ✅ Very similar to Railway
- ✅ Free SSL certificates
- ✅ Easy setup

## Prerequisites

1. Render account: [render.com](https://render.com)
2. GitHub repository connected
3. SendGrid account (free tier: 100 emails/day) - [sendgrid.com](https://sendgrid.com)

---

## Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

---

## Step 2: Create PostgreSQL Database

1. In Render dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Configure:
   - **Name:** `mindease-db` (or any name)
   - **Database:** `mindease`
   - **User:** `mindease_user` (or any name)
   - **Region:** Choose closest to you
   - **PostgreSQL Version:** 15 (or latest)
   - **Plan:** Free (or Starter for production)
4. Click **"Create Database"**
5. Wait for database to be ready (1-2 minutes)
6. **Important:** Copy these values from the database dashboard:
   - **Internal Database URL** (for backend connection)
   - **External Database URL** (if needed)

---

## Step 3: Deploy Backend Service

### 3a. Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `senior-project-CS`
3. Configure service:

**Basic Settings:**
- **Name:** `mindease-backend` (or any name)
- **Region:** Same as database
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Python 3`
- **Build Command:**
  ```
  pip install -r requirements.txt && python manage.py collectstatic --noinput
  ```
- **Start Command:**
  ```
  gunicorn mindease.wsgi:application
  ```

**Plan:**
- Select **Free** (or Starter for always-on)

### 3b. Add Environment Variables

In the backend service, go to **"Environment"** tab and add:

**Database:**
- `DATABASE_URL` = (Render automatically adds this from PostgreSQL)
- `USE_SQLITE` = `False`

**Django Settings:**
- `SECRET_KEY` = (generate: `python -c "import secrets; print(secrets.token_urlsafe(50))"`)
- `DEBUG` = `False`
- `ALLOWED_HOSTS` = `your-backend-name.onrender.com,*.onrender.com`
- `FRONTEND_URL` = `https://your-frontend-name.onrender.com` (update after frontend deploy)

**Email Configuration (SendGrid - Recommended):**
- `SENDGRID_API_KEY` = Your SendGrid API key (get from https://app.sendgrid.com/settings/api_keys)
- `DEFAULT_FROM_EMAIL` = Your verified email address in SendGrid (e.g., `your-email@gmail.com`)

**Note:** SendGrid is recommended because Render's free tier blocks SMTP connections. To verify a sender:
1. Go to SendGrid → Settings → Sender Authentication → Single Sender Verification
2. Add your email address
3. Verify via the confirmation email
4. Use the verified email as `DEFAULT_FROM_EMAIL`

### 3c. Deploy Backend

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repo
   - Install dependencies
   - Run migrations (if configured)
   - Start Gunicorn
3. Wait for deployment (3-5 minutes)
4. Copy your backend URL: `https://your-backend-name.onrender.com`

---

## Step 4: Update Django Settings for Render

We need to ensure Django uses Render's DATABASE_URL. Update `backend/mindease/settings.py`:

The settings should already support `DATABASE_URL` (we added this for Railway). Verify it's there:

```python
import dj_database_url

DATABASE_URL = config('DATABASE_URL', default=None)

if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL)
    }
```

This should already be in your code from Railway setup.

---

## Step 5: Run Migrations

1. Go to your backend service in Render
2. Click **"Shell"** tab (or use "Manual Deploy" → "Run Command")
3. Run:
```bash
python manage.py migrate
```

Or add this to your build command:
```
pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
```

---

## Step 6: Create Admin User

1. In backend service, go to **"Shell"** tab
2. Run:
```bash
python manage.py createsuperuser
```
3. Follow prompts to create admin account

---

## Step 7: Deploy Frontend

### 7a. Create Static Site

1. Click **"New +"** → **"Static Site"**
2. Connect GitHub repository: `senior-project-CS`
3. Configure:

**Settings:**
- **Name:** `mindease-frontend`
- **Branch:** `main`
- **Root Directory:** `/` (leave empty)
- **Build Command:**
  ```
  npm install && npm run build
  ```
- **Publish Directory:** `dist`

**Environment Variables:**
- `VITE_API_BASE_URL` = `https://your-backend-name.onrender.com/api`

### 7b. Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for build and deployment (2-3 minutes)
3. Copy your frontend URL: `https://your-frontend-name.onrender.com`

---

## Step 8: Update CORS Settings

1. Go back to your **backend service**
2. Go to **"Environment"** tab
3. Find `FRONTEND_URL`
4. Update value to: `https://your-frontend-name.onrender.com`
5. Render will automatically redeploy

---

## Step 9: Test Everything

1. **Backend API:**
   - Visit: `https://your-backend-name.onrender.com/api/`
   - Should see API endpoints

2. **Frontend:**
   - Visit: `https://your-frontend-name.onrender.com`
   - Should load your app

3. **Admin Panel:**
   - Visit: `https://your-backend-name.onrender.com/admin/`
   - Login with superuser credentials

4. **Test Signup:**
   - Try signing up with an email
   - Check if OTP email arrives

---

## Render Free Tier Limitations

### Important Notes:

1. **Services Sleep:** Free tier services sleep after 15 minutes of inactivity
   - First request after sleep takes 30-60 seconds (cold start)
   - Subsequent requests are fast

2. **Database:**
   - Free PostgreSQL database available
   - 90 days retention (data persists)
   - 1 GB storage limit

3. **Bandwidth:**
   - 100 GB/month included
   - Usually enough for small-medium apps

### Solutions for Sleep Issue:

**Option 1: Upgrade to Starter ($7/month)**
- Services stay awake 24/7
- No cold starts

**Option 2: Use Uptime Monitoring**
- Services like UptimeRobot ping your service every 5 minutes
- Keeps service awake (free)

**Option 3: Accept Cold Starts**
- Fine for development/testing
- Users wait 30-60 seconds on first visit

---

## Environment Variables Summary

### Backend Service:
```
DATABASE_URL=<auto-set by Render>
USE_SQLITE=False
SECRET_KEY=<your-secret-key>
DEBUG=False
ALLOWED_HOSTS=your-backend-name.onrender.com,*.onrender.com
FRONTEND_URL=https://your-frontend-name.onrender.com
SENDGRID_API_KEY=<your-sendgrid-api-key>
DEFAULT_FROM_EMAIL=<your-verified-email@example.com>
ADMIN_EMAIL=<admin-email@example.com>  # Optional: auto-create admin
ADMIN_PASSWORD=<admin-password>  # Optional: auto-create admin
```

### Frontend Service:
```
VITE_API_BASE_URL=https://your-backend-name.onrender.com/api
```

---

## Troubleshooting

### Build Fails:

1. Check build logs in Render dashboard
2. Common issues:
   - Missing dependencies → Check `requirements.txt`
   - Python version → Render auto-detects, but you can specify in `runtime.txt`
   - Build command error → Check syntax

### Database Connection Error:

1. Verify PostgreSQL service is running
2. Check `DATABASE_URL` is set (Render sets this automatically)
3. Ensure `USE_SQLITE=False`
4. Check database is in same region as backend

### CORS Errors:

1. Verify `FRONTEND_URL` matches your frontend URL exactly
2. Check `ALLOWED_HOSTS` includes `*.onrender.com`
3. Restart backend service after changing variables

### Static Files Not Loading:

1. Ensure `collectstatic` runs in build command
2. Check WhiteNoise is configured (already done)
3. Verify `STATIC_ROOT` is set correctly

### Service Keeps Sleeping:

1. Upgrade to Starter plan ($7/month)
2. Use UptimeRobot to ping service
3. Accept cold starts (free tier limitation)

---

## Render vs Railway Comparison

| Feature | Render | Railway |
|---------|--------|---------|
| Free Tier | ✅ Yes (with limitations) | ⚠️ Limited trial |
| PostgreSQL | ✅ Free tier available | ✅ Free tier available |
| Ease of Use | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Auto-Deploy | ✅ Yes | ✅ Yes |
| Sleep on Free | ⚠️ Yes (15 min) | ❌ No (trial only) |
| Always-On Cost | $7/month | $5/month |
| Documentation | ✅ Excellent | ✅ Good |

---

## Next Steps

1. Deploy to Render using steps above
2. Test all functionality
3. Set up custom domain (optional)
4. Configure monitoring (optional)
5. Set up backups for database (recommended)

---

## Need Help?

- Render Docs: [render.com/docs](https://render.com/docs)
- Render Community: [community.render.com](https://community.render.com)
- Check deployment logs in Render dashboard

