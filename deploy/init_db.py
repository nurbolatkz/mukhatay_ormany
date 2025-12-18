import os
import sys

# Set default environment variables if not already set
os.environ.setdefault('DATABASE_URL', 'postgresql://mukhatay_user:StrongPassword2025!@postgres:5432/mukhatay_user')
os.environ.setdefault('SECRET_KEY', 'temp_key')
try:
    from app import app, db
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Database tables created successfully!")
except Exception as e:
    print(f"Error creating database tables: {e}")
    sys.exit(1)