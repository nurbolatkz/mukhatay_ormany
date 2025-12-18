#!/bin/bash

# Build and deploy script for Mukhatay Ormany platform

echo "Building and deploying Mukhatay Ormany platform..."

# Create necessary directories
echo "Creating directories..."
mkdir -p /opt/mukhatay_ormany

# Copy project files
echo "Copying project files..."
cp -r ./* /opt/mukhatay_ormany/

# Navigate to project directory
cd /opt/mukhatay_ormany

# Build and start services with docker-compose
echo "Building Docker images..."
docker-compose -f deploy/docker-compose.yml build

echo "Starting services..."
docker-compose -f deploy/docker-compose.yml up -d

echo "Deployment complete!"
echo "Frontend available at: https://mukhatayormany.birqadam.kz"
echo "Backend API available at: https://mukhatayormany.birqadam.kz/api"
echo "Admin panel available at: https://mukhatayormany.birqadam.kz/admin"