import sys
from app import app, db
from flask_migrate import upgrade, stamp

with app.app_context():
    try:
        print("Professional Database Initialization Start...")
        # Instead of db.create_all(), we use migrations
        print("Running migrations (upgrade)...")
        upgrade()
        print("Database is now up to date with migrations.")
    except Exception as e:
        if "already exists" in str(e):
            print("Tables already exist. Stamping database to current version...")
            stamp()
            print("Database stamped successfully.")
        else:
            print(f"Error: {e}")
            sys.exit(1)
