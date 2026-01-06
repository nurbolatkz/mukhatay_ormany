from app import app, db, User, News
import sys

with app.app_context():
    try:
        db.create_all()
        print("Database tables created successfully")
        
        # Check if test user exists, if not create one
        test_user = User.query.filter_by(email="test@example.com").first()
        if not test_user:
            from werkzeug.security import generate_password_hash
            import uuid
            
            new_user = User(
                id=str(uuid.uuid4()),
                full_name="Test User",
                email="test@example.com",
                password=generate_password_hash("password123", method='pbkdf2:sha256'),
                phone="+1234567890"
            )
            db.session.add(new_user)
            db.session.commit()
            print("Test user created successfully")
        else:
            print("Test user already exists")
            
    except Exception as e:
        print(f"Error initializing database: {e}")
        sys.exit(1)