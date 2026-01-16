#!/bin/bash

# Exit on error
set -e

echo "Waiting for database to be ready..."
# Optional: add wait-for-it.sh logic if needed, but docker-compose healthcheck usually handles this

echo "Running database migrations..."
flask db upgrade

echo "Starting application..."
exec gunicorn --bind 0.0.0.0:5000 --workers 3 --timeout 120 app:app
