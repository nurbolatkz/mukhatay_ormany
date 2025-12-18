from app import app, db, User

with app.app_context():
    users = User.query.all()
    print("All users in database:")
    for user in users:
        print(f"ID: {user.id[:8]}, Name: {user.full_name}, Email: {user.email}, Role: {user.role}")