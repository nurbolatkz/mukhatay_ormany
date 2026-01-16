
#!/bin/bash
set -e

echo "⏳ Waiting for database to be ready..."
sleep 5

# Проверяем существует ли папка migrations
if [ ! -d "migrations" ]; then
    echo "📁 Creating migrations directory..."
    flask db init
    echo "✅ Migrations directory created"
    
    echo "📝 Creating initial migration..."
    flask db migrate -m "Initial migration"
    echo "✅ Initial migration created"
fi

echo "🔄 Applying database migrations..."
flask db upgrade || {
    echo "⚠️ Migration failed, trying to create tables directly..."
    python << PYTHON
from app import app, db
with app.app_context():
    db.create_all()
    print("✅ Tables created directly")
PYTHON
}

echo "🌱 Seeding database with default data..."
python seed.py || echo "⚠️ Seeding skipped or already done"

echo "🚀 Starting application..."
exec gunicorn --bind 0.0.0.0:5000 --workers 3 --timeout 120 --access-logfile - --error-logfile - app:app
