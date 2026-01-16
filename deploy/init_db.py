import os
import sys

# Set default environment variables if not already set
os.environ.setdefault('DATABASE_URL', 'postgresql://mukhatay_user:StrongPassword2025!@postgres:5432/mukhatay_user')
os.environ.setdefault('SECRET_KEY', 'temp_key')
try:
    from app import app, db, User, Location, Package, Donation, Certificate, News
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Database tables created successfully!")
        
        # After create_all, we should stamp the database so migrations don't try to recreate tables
        try:
            from flask_migrate import stamp
            print("Stamping database with latest migration version...")
            stamp()
            print("Database stamped successfully!")
        except Exception as e:
            print(f"Warning: Could not stamp database: {e}")
except Exception as e:
    print(f"Error creating database tables: {e}")
    sys.exit(1)