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
- **Gmail Account** (for email OTP functionality)

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

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password  # Gmail App Password
DEFAULT_FROM_EMAIL=noreply@mindease.com
FRONTEND_URL=http://localhost:8080
```

### Gmail App Password Setup

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

### Backend Deployment

1. Set `DEBUG=False` in production
2. Configure production database (PostgreSQL recommended)
3. Set secure `SECRET_KEY`
4. Configure `ALLOWED_HOSTS` with your domain
5. Set up static file serving
6. Use production WSGI server (gunicorn, uwsgi)

### Frontend Deployment

1. Build production bundle: `npm run build`
2. Serve `dist/` directory with a web server (nginx, Apache)
3. Configure API base URL for production
4. Set up HTTPS

## Development Notes

- **Database**: SQLite is used by default for development. Switch to PostgreSQL for production.
- **Email**: Gmail SMTP is configured. Ensure app password is set correctly.
- **CORS**: CORS is enabled for localhost:8080. Update for production domains.
- **JWT Tokens**: Access tokens expire in 15 minutes, refresh tokens in 7 days.

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
