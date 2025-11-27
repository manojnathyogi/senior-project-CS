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
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Set up database**
   ```bash
   # Create PostgreSQL database first
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
├── accounts/          # User authentication & management
├── mood_tracking/     # Mood logging API
├── journals/          # Journaling API (to be implemented)
├── cbt/               # CBT exercises API (to be implemented)
├── chat/               # Chat rooms API (to be implemented)
├── assessments/       # Mental health assessments API (to be implemented)
└── admin_dashboard/   # Admin analytics API (to be implemented)
```

## API Endpoints

### Authentication (`/api/auth/`)
- `POST /register/` - Register new user
- `POST /login/` - Login (returns JWT tokens)
- `POST /verify-email/` - Verify email address
- `POST /password-reset/` - Request password reset
- `POST /password-reset-confirm/` - Confirm password reset
- `GET /profile/` - Get current user profile
- `PUT /profile/update/` - Update profile

### Mood Tracking (`/api/mood/`)
- `GET /` - List user's mood logs
- `POST /` - Create new mood log
- `GET /stats/?days=7` - Get mood statistics

### JWT Tokens (`/api/token/`)
- `POST /` - Get access/refresh tokens
- `POST /refresh/` - Refresh access token

## Environment Variables

See `.env.example` for required environment variables:
- Database configuration
- Email/SMTP settings
- Django secret key
- Frontend URL

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
5. Run migrations

## Deployment

See deployment guide in main project README.

