#!/bin/bash

# Health check script for Mukhatay Ormany services

echo "Checking Mukhatay Ormany services health..."

# Check if docker-compose services are running
if docker-compose -f deploy/docker-compose.yml ps | grep -q "Up"; then
    echo "✅ All services are running"
else
    echo "❌ Some services are not running"
    docker-compose -f deploy/docker-compose.yml ps
    exit 1
fi

# Check backend health
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" https://mukhatayormany.birqadam.kz/api/health || echo "000")
if [ "$BACKEND_HEALTH" == "200" ]; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed with status: $BACKEND_HEALTH"
fi

# Check frontend accessibility
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" https://mukhatayormany.birqadam.kz/ || echo "000")
if [ "$FRONTEND_HEALTH" == "200" ]; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend accessibility check failed with status: $FRONTEND_HEALTH"
fi

# Check database connectivity
DB_STATUS=$(docker-compose -f deploy/docker-compose.yml exec -T postgres pg_isready -U bulletin_user 2>/dev/null)
if [[ $? -eq 0 ]]; then
    echo "✅ Database is accessible"
else
    echo "❌ Database connectivity check failed"
fi

echo "Health check completed."