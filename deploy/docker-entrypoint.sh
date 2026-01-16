#!/bin/bash

# Exit on error
set -e

echo "Waiting for database to be ready..."
# docker-compose healthcheck handles the wait

echo "Applying database migrations..."
# This will create tables if they don't exist OR update them if they do
flask db upgrade

echo "Seeding database with default data..."
# Run seed script to ensure locations/packages exist (it should handle duplicates safely)
python seed.py || echo "Seeding skipped or already done"

echo "Starting application..."
exec gunicorn --bind 0.0.0.0:5000 --workers 3 --timeout 120 app:app
