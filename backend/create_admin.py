from app import app, db, User
import sys
from werkzeug.security import generate_password_hash
import uuid

def create_admin_user():
    """Create an admin user with strong password"""
    with app.app_context():
        try:
            # Check if admin user already exists
            admin_user = User.query.filter_by(email="admin@example.com").first()
            if admin_user:
                print("Admin user already exists")
                return
            
            # Create admin user with strong password
            admin_user = User(
                id=str(uuid.uuid4()),
                full_name="Administrator",
                email="admin@example.com",
                password=generate_password_hash("StrongPass123!", method='pbkdf2:sha256'),
                phone="+77001234567",
                role="admin"  # Set role to admin
            )
            db.session.add(admin_user)
            db.session.commit()
            print("Admin user created successfully!")
            print("Username: admin@example.com")
            print("Password: StrongPass123!")
            
        except Exception as e:
            print(f"Error creating admin user: {e}")
            sys.exit(1)

if __name__ == "__main__":
    create_admin_user()