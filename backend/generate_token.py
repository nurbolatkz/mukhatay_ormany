from app import app, db, User
import jwt
import datetime

with app.app_context():
    user = User.query.filter_by(email='admin@example.com').first()
    if user:
        token = jwt.encode({
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, app.config['SECRET_KEY'])
        print(f"Token: {token}")
        print(f"User ID: {user.id}")
        print(f"User Role: {user.role}")
    else:
        print("Admin user not found")