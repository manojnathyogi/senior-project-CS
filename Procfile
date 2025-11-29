web: python manage.py migrate && python manage.py create_default_admin && gunicorn mindease.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120

