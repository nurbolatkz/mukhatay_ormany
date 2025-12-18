from app import app, db, User

with app.app_context():
    user = User.query.filter_by(email='admin@example.com').first()
    if user:
        print(f"User found: {user.full_name}, Role: {user.role}")
    else:
        print("User not found")