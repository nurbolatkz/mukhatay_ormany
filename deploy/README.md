# Deployment Guide for Mukhatay Ormany Platform

## Prerequisites
- Docker and Docker Compose installed
- Access to Traefik reverse proxy setup
- Domain: `mukhatayormany.birqadam.kz`

## Deployment Files
This directory contains all necessary files for deploying the Mukhatay Ormany platform:

1. `Dockerfile.backend` - Docker configuration for the Flask backend
2. `Dockerfile.frontend` - Docker configuration for the Next.js frontend
3. `docker-compose.yml` - Main deployment configuration with Traefik integration
4. `mukhatay-ormany-backend.service` - Systemd service file (alternative deployment)
5. `requirements.txt` - Python dependencies for the backend

## Deployment Steps

### Using Docker Compose (Recommended)

1. Copy the entire project to your server:
   ```bash
   mkdir -p /opt/mukhatay_ormany
   cp -r ./* /opt/mukhatay_ormany/
   ```

2. Navigate to the project directory:
   ```bash
   cd /opt/mukhatay_ormany
   ```

3. Build the Docker images:
   ```bash
   docker-compose -f deploy/docker-compose.yml build
   ```

4. Start the services:
   ```bash
   docker-compose -f deploy/docker-compose.yml up -d
   ```

### Services Overview

- **PostgreSQL Database**: Stores user and donation data
- **Backend Service**: Flask API running on port 5000
- **Frontend Service**: Next.js application running on port 3000

### Traefik Integration

The docker-compose file includes Traefik labels for automatic routing:
- Frontend: `https://mukhatayormany.birqadam.kz`
- Backend API: `https://mukhatayormany.birqadam.kz/api`
- Admin Panel: `https://mukhatayormany.birqadam.kz/admin`

## Environment Variables

The deployment uses the following environment variables:
- Database: `postgresql://mukhatay_user:StrongPassword2025!@postgres:5432/mukhatay_ormany_db`

## Useful Commands

Check service status:
```bash
docker-compose -f deploy/docker-compose.yml ps
```

View logs:
```bash
docker-compose -f deploy/docker-compose.yml logs -f
```

Stop services:
```bash
docker-compose -f deploy/docker-compose.yml down
```