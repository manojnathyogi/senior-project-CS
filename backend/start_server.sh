#!/bin/bash
# Start Django development server

cd "$(dirname "$0")"
source venv/bin/activate
python manage.py runserver

