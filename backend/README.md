# MindEase Django Backend

Django REST Framework backend for MindEase mental health application.

## Quick Start

1. **Set up virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**
   Create a `.env` file in the `backend/` directory with:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   USE_SQLITE=True
   SENDGRID_API_KEY=your-sendgrid-api-key  # For email sending
   DEFAULT_FROM_EMAIL=your-verified-email@example.com
   FRONTEND_URL=http://localhost:8080
   ```

4. **Set up database**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run server**
   ```bash
   python manage.py runserver
   ```

API will be available at `http://localhost:8000`

## Project Structure

```
backend/
├── mindease/          # Main Django project settings
├── accounts/          # User authentication & OTP management
├── mood_tracking/     # Mood logging API
├── admin_dashboard/   # Admin analytics API
├── journals/          # Journaling API (placeholder)
├── cbt/               # CBT exercises API (placeholder)
├── chat/              # Chat rooms API (placeholder)
├── assessments/       # Mental health assessments API (placeholder)
├── manage.py
└── requirements.txt
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

## Environment Variables

Required environment variables:
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (True/False)
- `USE_SQLITE` - Use SQLite for development (True/False)
- `DATABASE_URL` - PostgreSQL connection URL (for production)
- `SENDGRID_API_KEY` - SendGrid API key for email sending
- `DEFAULT_FROM_EMAIL` - Verified sender email address
- `FRONTEND_URL` - Frontend application URL

Optional (for local SMTP):
- `EMAIL_HOST` - SMTP host
- `EMAIL_PORT` - SMTP port
- `EMAIL_USE_TLS` - Use TLS
- `EMAIL_HOST_USER` - SMTP username
- `EMAIL_HOST_PASSWORD` - SMTP password

## Testing

```bash
python manage.py test
```

## Development

To add new features:
1. Create models in respective app
2. Create serializers
3. Create views/viewsets
4. Add URLs
5. Run migrations: `python manage.py makemigrations && python manage.py migrate`

## Deployment

See `RENDER_DEPLOYMENT.md` in the project root for complete deployment instructions.

The backend is configured to:
- Auto-run migrations on deploy
- Auto-create admin user if `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set
- Use SendGrid API for email sending (works on free hosting tiers)
- Serve static files with WhiteNoise

