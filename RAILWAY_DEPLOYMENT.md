# Railway Deployment Guide

This guide will help you deploy MindEase to Railway.

## Prerequisites

1. A Railway account ([railway.app](https://railway.app))
2. Your GitHub repository connected to Railway
3. A Gmail account with App Password configured (for email OTP)

## Step-by-Step Deployment

### Step 1: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account if not already connected
5. Select the `senior-project-CS` repository

### Step 2: Add PostgreSQL Database

1. In your Railway project dashboard, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically provision a PostgreSQL database
4. The `DATABASE_URL` environment variable will be automatically set for your services

### Step 3: Configure Backend Service

Railway should automatically detect your backend. Configure it:

1. Click on the backend service (or create a new service)
2. Go to "Settings"
3. Set the **Root Directory** to: `backend`
4. Set the **Start Command** to:
   ```
   python manage.py migrate && gunicorn mindease.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120
   ```

### Step 4: Set Environment Variables

In your backend service settings, go to "Variables" and add:

#### Required Variables:
```
SECRET_KEY=<generate-a-random-secret-key>
DEBUG=False
ALLOWED_HOSTS=*.railway.app
USE_SQLITE=False
FRONTEND_URL=https://your-frontend-url.railway.app
```

**Note:** Railway automatically provides `DATABASE_URL`, so you don't need to set database credentials manually.

#### Email Configuration:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password
DEFAULT_FROM_EMAIL=noreply@mindease.com
```

**To get Gmail App Password:**
1. Go to Google Account settings
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate a new app password for "Mail"
5. Use this password in `EMAIL_HOST_PASSWORD`

### Step 5: Deploy Frontend (Optional - Separate Service)

If you want to deploy the frontend as a separate service:

1. Click "New" → "Empty Service"
2. Connect it to the same GitHub repository
3. Set **Root Directory** to: `/` (project root)
4. Set **Build Command** to: `npm install && npm run build`
5. Set **Start Command** to: `npx serve -s dist -l $PORT`
6. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app/api
   ```

**Alternative:** You can also deploy the frontend to Vercel, Netlify, or any static hosting service and point it to your Railway backend.

### Step 6: Get Your URLs

1. After deployment, Railway will provide URLs for your services
2. Backend URL will be something like: `https://your-app-name.up.railway.app`
3. Update `FRONTEND_URL` in backend environment variables with your frontend URL
4. Update `VITE_API_BASE_URL` in frontend with your backend URL

### Step 7: Run Migrations

Migrations should run automatically on deploy (configured in Procfile), but you can verify:

1. Go to your backend service
2. Click "Deployments" → "View Logs"
3. Look for migration output

To run manually:
```bash
railway run python manage.py migrate
```

### Step 8: Create Admin User

Create a superuser account:

```bash
railway run python manage.py createsuperuser
```

Or use Railway's web terminal in the service dashboard.

### Step 9: Test Your Deployment

1. Visit your backend URL: `https://your-backend.railway.app/api/`
2. Visit your frontend URL
3. Test signup/login functionality
4. Verify email OTP is working

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL service is running
- Check that `DATABASE_URL` is set (Railway sets this automatically)
- Verify `USE_SQLITE=False` in environment variables

### Static Files Not Loading

- WhiteNoise is configured for static file serving
- Run `python manage.py collectstatic` if needed:
  ```bash
  railway run python manage.py collectstatic
  ```

### CORS Errors

- Ensure `FRONTEND_URL` matches your frontend deployment URL
- Check that `ALLOWED_HOSTS` includes `*.railway.app`
- Verify CORS settings in `settings.py`

### Email Not Sending

- Verify Gmail App Password is correct
- Check that 2-Step Verification is enabled on Gmail
- Ensure `EMAIL_HOST_USER` and `EMAIL_HOST_PASSWORD` are set correctly

### Build Failures

- Check Railway build logs for errors
- Ensure all dependencies are in `requirements.txt`
- Verify Python version matches `runtime.txt` (3.11.0)

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `SECRET_KEY` | Django secret key | Yes |
| `DEBUG` | Debug mode (False for production) | Yes |
| `ALLOWED_HOSTS` | Allowed hostnames | Yes |
| `DATABASE_URL` | PostgreSQL connection string (auto-set by Railway) | Yes |
| `USE_SQLITE` | Use SQLite instead of PostgreSQL | No (False for production) |
| `FRONTEND_URL` | Frontend application URL | Yes |
| `EMAIL_HOST` | SMTP server host | Yes |
| `EMAIL_PORT` | SMTP server port | Yes |
| `EMAIL_USE_TLS` | Use TLS for email | Yes |
| `EMAIL_HOST_USER` | Email username | Yes |
| `EMAIL_HOST_PASSWORD` | Email app password | Yes |
| `DEFAULT_FROM_EMAIL` | Default sender email | Yes |

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/)
- [Gunicorn Configuration](https://docs.gunicorn.org/en/stable/settings.html)

