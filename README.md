# MindEase - Mental Health Support Platform

MindEase is a comprehensive mental health support platform designed for university students, featuring mood tracking, CBT exercises, peer support, counseling integration, and administrative analytics.

## Features

### For Students
- **Mood Tracking**: Log daily moods with sentiment analysis
- **CBT Exercises**: Access cognitive behavioral therapy modules
- **Peer Support**: Join anonymous chat rooms for peer support
- **Campus Events**: Discover and register for mental health events
- **Wellness Resources**: Access meditation, journaling, and wellness tips
- **OTP Authentication**: Secure email-based authentication with optional password setup

### For Administrators
- **Analytics Dashboard**: Comprehensive analytics on student mental health trends
- **User Management**: View and manage all users (students, counselors, admins)
- **Resource Allocation**: AI-powered resource allocation recommendations
- **Risk Assessment**: Identify students requiring counseling support
- **Integration Management**: Configure university counseling system integrations
- **Counselor Management**: Create and assign counselor accounts

### For Counselors
- **Student Cases**: View assigned student cases with mood history
- **Communication**: Direct messaging with students
- **Risk Monitoring**: Track student risk levels and mood trends

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **Recharts** for data visualization
- **Sonner** for toast notifications

### Backend
- **Django 5.0** with Django REST Framework
- **JWT Authentication** (djangorestframework-simplejwt)
- **SQLite** (development) / **PostgreSQL** (production)
- **Email OTP** for email verification
- **CORS** enabled for frontend integration

## Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.11 or higher)
- **pip** (Python package manager)
- **PostgreSQL** (optional, for production)
- **SendGrid Account** (for email OTP functionality - free tier available)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd spec-sheet-delight
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example if available)
# Configure your environment variables (see Configuration section)

# Run migrations
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser

# Start Django development server
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Create .env file (if needed)
# VITE_API_BASE_URL=http://localhost:8000/api

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:8080`

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
USE_SQLITE=True  # Set to False for PostgreSQL
DB_NAME=mindease
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# Email Configuration (SendGrid API - Recommended for production)
SENDGRID_API_KEY=your-sendgrid-api-key  # Get from https://app.sendgrid.com/settings/api_keys
DEFAULT_FROM_EMAIL=your-verified-email@example.com  # Must be verified in SendGrid

# Alternative: Gmail SMTP (for local development only)
# Note: SMTP may not work on free hosting tiers (e.g., Render free tier)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password  # Gmail App Password

FRONTEND_URL=http://localhost:8080
```

### SendGrid Setup (Recommended)

1. Sign up at [sendgrid.com](https://sendgrid.com) (free tier: 100 emails/day)
2. Go to Settings → API Keys
3. Create a new API key with "Full Access" or "Mail Send" permission
4. Copy the API key (starts with `SG.`)
5. Verify a sender email:
   - Go to Settings → Sender Authentication → Single Sender Verification
   - Add your email address (e.g., `your-email@gmail.com`)
   - Verify the email via the confirmation link sent to your inbox
6. Use the verified email as `DEFAULT_FROM_EMAIL`

### Gmail App Password Setup (Local Development Only)

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate a new app password for "Mail"
5. Use this password in `EMAIL_HOST_PASSWORD`

### Frontend Environment Variables

Create a `.env` file in the project root (optional):

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Running the Project

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Production Build

**Frontend:**
```bash
npm run build
# Output will be in dist/ directory
```

**Backend:**
```bash
cd backend
python manage.py collectstatic
# Configure your production server (gunicorn, uwsgi, etc.)
```

## API Endpoints

### Authentication (`/api/auth/`)

- `POST /otp/request/` - Request OTP code for signup/login
- `POST /otp/verify-signup/` - Verify OTP and create account
- `POST /otp/verify-login/` - Verify OTP and login
- `POST /login/` - Login with email and password
- `GET /profile/` - Get current user profile
- `PUT /profile/update/` - Update user profile
- `GET /users/` - List all users (admin only)
- `POST /create-counselor/` - Create counselor account (admin only)
- `DELETE /users/<id>/delete/` - Delete user (admin only)

### Mood Tracking (`/api/mood/`)

- `GET /` - List user's mood logs
- `POST /` - Create new mood log
- `GET /stats/?days=7` - Get mood statistics

### Admin Dashboard (`/api/admin/`)

- `GET /stats/?time_filter=week` - Dashboard statistics
- `GET /mood-metrics/?time_filter=week` - Mood metrics
- `GET /feature-usage/?time_filter=week` - Feature usage analytics
- `GET /risk-assessment/?time_filter=week` - Risk assessment data
- `GET /campus-distribution/?time_filter=week` - Campus distribution
- `GET /resource-allocation/?time_filter=month` - Resource allocation
- `GET /budget-optimization/?time_filter=month` - Budget optimization
- `GET /high-impact-areas/?time_filter=month` - High impact areas
- `GET /counselors/` - List all counselors
- `GET /students-requiring-counseling/?time_filter=week` - Students needing counseling
- `GET /integration-settings/` - Get integration settings
- `PUT /integration-settings/update/` - Update integration settings
- `GET /integration-status/` - Get integration status
- `POST /integration-test/` - Test integration

### JWT Tokens (`/api/token/`)

- `POST /` - Get access/refresh tokens
- `POST /refresh/` - Refresh access token

## Project Structure

```
spec-sheet-delight/
├── backend/                 # Django backend
│   ├── accounts/           # User authentication & management
│   ├── admin_dashboard/    # Admin analytics API
│   ├── mood_tracking/      # Mood logging API
│   ├── journals/          # Journaling API (to be implemented)
│   ├── cbt/               # CBT exercises API (to be implemented)
│   ├── chat/              # Chat rooms API (to be implemented)
│   ├── assessments/       # Mental health assessments API (to be implemented)
│   ├── mindease/         # Django project settings
│   ├── manage.py
│   ├── requirements.txt
│   └── .env               # Environment variables
│
├── src/                    # React frontend
│   ├── components/        # React components
│   │   ├── admin/        # Admin dashboard components
│   │   ├── login/        # Login form components
│   │   ├── signup/       # Signup components
│   │   └── ui/          # shadcn/ui components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and API client
│   └── main.tsx         # Entry point
│
├── public/                # Static assets
├── package.json          # Frontend dependencies
├── vite.config.ts       # Vite configuration
└── README.md            # This file
```

## Authentication Flow

1. **Signup with OTP:**
   - User enters email and optional password
   - OTP code sent to email
   - User verifies OTP code
   - Account created with email verification

2. **Login Options:**
   - **Password Login**: If password was set during signup
   - **OTP Login**: Request OTP code, verify and login

3. **Role-Based Access:**
   - **Student**: Access to mood tracking, CBT, peer support
   - **Admin**: Access to admin dashboard and user management
   - **Counselor**: Access to counselor dashboard and student cases

## User Roles

### Student
- Default role for new signups
- Must use Howard University email (@bison.howard.edu or @howard.edu)
- Access to all student features

### Admin
- Created via Django admin or superuser
- Full access to analytics and user management
- Can create counselor accounts

### Counselor
- Created by admin via dashboard
- Access to assigned student cases
- Can communicate with students

## Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
npm run test  # If test setup exists
```

## Deployment

The application is currently deployed on **Render**. See `RENDER_DEPLOYMENT.md` for complete deployment instructions.

### Quick Deployment Summary

**Backend:** Deployed as a Web Service on Render
- Uses PostgreSQL database
- Configured with SendGrid for email sending
- Auto-deploys from GitHub

**Frontend:** Deployed as a Static Site on Render
- Configured with SPA routing support
- Connects to backend API

### Alternative: Railway Deployment

Railway is another cloud platform option. See `RAILWAY_DEPLOYMENT.md` for detailed instructions:

#### Prerequisites

1. Create a Railway account at [railway.app](https://railway.app)
2. Install Railway CLI (optional): `npm i -g @railway/cli`

#### Step 1: Create a New Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account and select `senior-project-CS` repository

#### Step 2: Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create a PostgreSQL database
4. The `DATABASE_URL` environment variable will be automatically set

#### Step 3: Configure Environment Variables

In Railway project settings, add these environment variables:

**Required Variables:**
```
SECRET_KEY=your-secret-key-here-generate-a-random-string
DEBUG=False
ALLOWED_HOSTS=your-app-name.railway.app,*.railway.app
USE_SQLITE=False
FRONTEND_URL=https://your-frontend-url.railway.app
```

**Email Configuration (SendGrid - Recommended):**
```
SENDGRID_API_KEY=your-sendgrid-api-key
DEFAULT_FROM_EMAIL=your-verified-email@example.com
```

**Email Configuration (Gmail SMTP - Alternative):**
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password
DEFAULT_FROM_EMAIL=noreply@mindease.com
```

**Note:** Railway automatically provides `DATABASE_URL` when you add PostgreSQL, so you don't need to set DB_NAME, DB_USER, etc.

#### Step 4: Deploy Backend Service

1. Railway will automatically detect the Python backend
2. Set the root directory to `/backend` in service settings
3. Set the start command to: `python manage.py migrate && gunicorn mindease.wsgi:application --bind 0.0.0.0:$PORT`
4. Railway will automatically build and deploy

#### Step 5: Deploy Frontend Service (Optional - Separate Service)

If you want to deploy frontend separately:

1. Add a new service in Railway
2. Set root directory to `/` (project root)
3. Set build command to: `npm install && npm run build`
4. Set start command to: `npx serve -s dist -l $PORT`
5. Add environment variable: `VITE_API_BASE_URL=https://your-backend-url.railway.app/api`

#### Step 6: Update CORS Settings

After deployment, update your backend's `FRONTEND_URL` environment variable to match your frontend URL.

#### Step 7: Run Migrations

Railway will automatically run migrations on deploy (configured in Procfile), but you can also run manually:

1. Go to your backend service in Railway
2. Click "Deployments" → "View Logs"
3. Or use Railway CLI: `railway run python manage.py migrate`

#### Step 8: Create Superuser

Create an admin account:

```bash
railway run python manage.py createsuperuser
```

Or use Railway's web terminal in the service dashboard.

### Alternative Deployment Methods

#### Backend Deployment (Other Platforms)

1. Set `DEBUG=False` in production
2. Configure production database (PostgreSQL recommended)
3. Set secure `SECRET_KEY`
4. Configure `ALLOWED_HOSTS` with your domain
5. Set up static file serving (WhiteNoise is configured)
6. Use production WSGI server (gunicorn)

#### Frontend Deployment

1. Build production bundle: `npm run build`
2. Serve `dist/` directory with a web server (nginx, Apache, Vercel, Netlify)
3. Configure API base URL for production
4. Set up HTTPS

## Development Notes

- **Database**: SQLite is used by default for development. Switch to PostgreSQL for production.
- **Email**: SendGrid API is used in production (works on free hosting tiers). Gmail SMTP can be used for local development.
- **CORS**: CORS is enabled for localhost:8080 and production domains. Configured for Render deployment.
- **JWT Tokens**: Access tokens expire in 1 hour, refresh tokens in 7 days.
- **Deployment**: Currently deployed on Render. See `RENDER_DEPLOYMENT.md` for deployment instructions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues or questions:
- Check existing issues in the repository
- Create a new issue with detailed description
- Contact the development team

## Acknowledgments

- Built with Django REST Framework
- UI components from shadcn/ui
- Icons from Lucide React

---

**Note**: This is a development version. Ensure all security measures are properly configured before deploying to production.
