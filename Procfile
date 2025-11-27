web: cd backend && python manage.py migrate && gunicorn mindease.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120

