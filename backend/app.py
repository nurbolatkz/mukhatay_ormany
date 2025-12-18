from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
import jwt
import base64
import hashlib
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import datetime
import uuid

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///tree_donation.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', os.urandom(24))  # Use environment variable or generate random key

# Enable CORS for all routes
CORS(app)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Models
class User(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = db.Column(db.String)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    phone = db.Column(db.String)
    company_name = db.Column(db.String)
    role = db.Column(db.String, default='user')
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    last_login = db.Column(db.DateTime)

class Location(db.Model):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)
    area_hectares = db.Column(db.Float)
    coordinates = db.Column(db.String)
    image_url = db.Column(db.String)
    status = db.Column(db.String)
    capacity_trees = db.Column(db.Integer)
    planted_trees = db.Column(db.Integer)

class Package(db.Model):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String)
    tree_count = db.Column(db.Integer)
    price = db.Column(db.Integer)
    description = db.Column(db.String)
    popular = db.Column(db.Boolean)

class Donation(db.Model):
    id = db.Column(db.String, primary_key=True)
    location_id = db.Column(db.String, db.ForeignKey('location.id'))
    package_id = db.Column(db.String, db.ForeignKey('package.id'))
    user_id = db.Column(db.String, db.ForeignKey('user.id'))
    tree_count = db.Column(db.Integer)
    amount = db.Column(db.Integer)
    status = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    donor_info = db.Column(db.JSON)

class Certificate(db.Model):
    id = db.Column(db.String, primary_key=True)
    donation_id = db.Column(db.String, db.ForeignKey('donation.id'))
    pdf_url = db.Column(db.String)
    created_date = db.Column(db.DateTime, server_default=db.func.now())

# Decorator for token validation
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['id']).first()
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401
        except Exception:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

@app.route('/api/auth/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'message': 'Пользователь с таким email уже существует'}), 400
        
        # Use stronger password hashing
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256', salt_length=12)
        new_user = User(id=str(uuid.uuid4()), full_name=data['full_name'], email=data['email'], password=hashed_password, phone=data['phone'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'Новый пользователь создан!'})
    except Exception as e:
        # Handle database integrity errors (like duplicate emails)
        db.session.rollback()
        if 'UNIQUE constraint failed' in str(e):
            return jsonify({'message': 'Пользователь с таким email уже существует'}), 400
        return jsonify({'message': 'Ошибка при создании пользователя'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login_user():
    auth = request.headers.get('Authorization')
    if not auth:
        return jsonify({'message': 'Could not verify'}), 401

    try:
        auth_type, auth_string = auth.split(' ')
        if auth_type.lower() != 'basic':
            return jsonify({'message': 'Could not verify'}), 401
        
        decoded_auth_string = base64.b64decode(auth_string).decode('utf-8')
        email, password = decoded_auth_string.split(':')
    except:
        return jsonify({'message': 'Could not verify'}), 401


    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'Could not verify'}), 401

    if check_password_hash(user.password, password):
        token = jwt.encode({'id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({'token': token})

    return jsonify({'message': 'Could not verify'}), 401

# Logout endpoint
@app.route('/api/auth/logout', methods=['POST'])
@token_required
def logout(current_user):
    # In a real application, you might want to add the token to a blacklist
    # For this simple implementation, we'll just return a success message
    return jsonify({'message': 'Successfully logged out'}), 200

@app.route('/api/locations', methods=['GET'])
def get_locations():
    locations = Location.query.all()
    output = []
    for location in locations:
        location_data = {
            'id': location.id,
            'name': location.name,
            'description': location.description,
            'area_hectares': location.area_hectares,
            'coordinates': location.coordinates,
            'image_url': location.image_url,
            'status': location.status,
            'capacity_trees': location.capacity_trees,
            'planted_trees': location.planted_trees
        }
        output.append(location_data)
    return jsonify(output)

@app.route('/api/locations/<string:location_id>', methods=['GET'])
def get_location_details(location_id):
    location = Location.query.get_or_404(location_id)
    location_data = {
        'id': location.id,
        'name': location.name,
        'description': location.description,
        'area_hectares': location.area_hectares,
        'coordinates': location.coordinates,
        'image_url': location.image_url,
        'status': location.status,
        'capacity_trees': location.capacity_trees,
        'planted_trees': location.planted_trees,
        'features': ["Доступно круглый год", "Быстрый старт", "Идеально для частных лиц"]
    }
    return jsonify(location_data)

@app.route('/api/packages', methods=['GET'])
def get_packages():
    packages = Package.query.all()
    output = []
    for package in packages:
        package_data = {
            'id': package.id,
            'name': package.name,
            'tree_count': package.tree_count,
            'price': package.price,
            'description': package.description,
            'popular': package.popular
        }
        output.append(package_data)
    return jsonify(output)

@app.route('/api/packages/by-location/<string:location_id>', methods=['GET'])
def get_packages_by_location(location_id):
    # For now, we'll just return all packages, regardless of location
    return get_packages()

@app.route('/api/donations', methods=['POST'])
@token_required
def create_donation(current_user):
    data = request.get_json()
    new_donation = Donation(
        id=str(uuid.uuid4()),
        location_id=data['location_id'],
        package_id=data['package_id'],
        user_id=current_user.id,
        tree_count=data['tree_count'],
        amount=data['amount'],
        status='pending_payment',
        donor_info=data['donor_info']
    )
    db.session.add(new_donation)
    db.session.commit()
    return jsonify({'id': new_donation.id, 'status': new_donation.status}), 201

@app.route('/api/donations/<string:donation_id>/payment', methods=['POST'])
@token_required
def process_payment(current_user, donation_id):
    donation = Donation.query.get_or_404(donation_id)
    if donation.user_id != current_user.id:
        return jsonify({'message': 'Permission denied'}), 403
    
    donation.status = 'completed'
    
    new_certificate = Certificate(
        id=str(uuid.uuid4()),
        donation_id=donation.id,
        pdf_url=f"/certificates/{donation.id}.pdf"
    )
    db.session.add(new_certificate)
    db.session.commit()

    response = {
        "success": True,
        "donation_id": donation.id,
        "status": donation.status,
        "certificate_id": new_certificate.id,
        "updated_at": datetime.datetime.utcnow().isoformat() + 'Z'
    }
    return jsonify(response)

@app.route('/api/users/me/donations', methods=['GET'])
@token_required
def get_user_donations(current_user):
    donations = Donation.query.filter_by(user_id=current_user.id).all()
    output = []
    for donation in donations:
        # Get location name instead of ID
        location = Location.query.get(donation.location_id)
        location_name = location.name if location else donation.location_id
        
        # Get certificate ID safely
        certificate = Certificate.query.filter_by(donation_id=donation.id).first()
        certificate_id = certificate.id if certificate else None
        
        donation_data = {
            'id': donation.id,
            'date': donation.created_at.isoformat() + 'Z',
            'location': location_name,
            'trees': donation.tree_count,
            'amount': donation.amount,
            'status': donation.status,
            'certificate_id': certificate_id
        }
        output.append(donation_data)
    return jsonify(output)

@app.route('/api/users/me', methods=['GET'])
@token_required
def get_user_profile(current_user):
    # Return user profile without password
    user_data = {
        'id': current_user.id,
        'full_name': current_user.full_name,
        'email': current_user.email,
        'phone': current_user.phone,
        'company_name': current_user.company_name,
        'role': current_user.role,
        'created_at': current_user.created_at.isoformat() + 'Z' if current_user.created_at else None,
        'last_login': current_user.last_login.isoformat() + 'Z' if current_user.last_login else None
    }
    return jsonify(user_data)

@app.route('/api/auth/logout', methods=['POST'])
@token_required
def logout_endpoint(current_user):
    # For now, we just return success
    # In a more complex implementation, you might want to invalidate the token
    return jsonify({'message': 'Logged out successfully'})

@app.route('/api/users/me/certificates', methods=['GET'])
@token_required
def get_user_certificates(current_user):
    donations = Donation.query.filter_by(user_id=current_user.id).all()
    donation_ids = [donation.id for donation in donations]
    certificates = Certificate.query.filter(Certificate.donation_id.in_(donation_ids)).all()
    
    output = []
    for certificate in certificates:
        donation = Donation.query.get(certificate.donation_id)
        certificate_data = {
            "id": certificate.id,
            "donation_id": certificate.donation_id,
            "trees": donation.tree_count,
            "location": donation.location_id,
            "date": certificate.created_date.isoformat() + 'Z' if certificate.created_date else None,
            "pdf_url": certificate.pdf_url
        }
        output.append(certificate_data)
    return jsonify(output)

# Decorator for admin-only routes
def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['id']).first()
            if current_user.role != 'admin':
                return jsonify({'message': 'Admin role required!'}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401
        except Exception:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

@app.route('/api/admin/donations', methods=['GET'])
@admin_required
def admin_get_donations(current_user):
    # For now, we'll just return all donations without pagination
    donations = Donation.query.all()
    output = []
    for donation in donations:
        user = User.query.get(donation.user_id)
        location = Location.query.get(donation.location_id)
        donation_data = {
            'id': donation.id,
            'donor_name': user.full_name,
            'email': user.email,
            'location': location.name,
            'trees': donation.tree_count,
            'amount': donation.amount,
            'status': donation.status,
            'date': donation.created_at.isoformat() + 'Z'
        }
        output.append(donation_data)
    return jsonify({'donations': output})

@app.route('/api/admin/donations/<string:donation_id>', methods=['PUT'])
@admin_required
def admin_update_donation(current_user, donation_id):
    donation = Donation.query.get_or_404(donation_id)
    data = request.get_json()
    donation.status = data.get('status', donation.status)
    db.session.commit()
    return jsonify({'message': 'Donation updated successfully'})

@app.route('/api/admin/users', methods=['GET'])
@admin_required
def admin_get_users(current_user):
    # For now, we'll just return all users without pagination
    users = User.query.all()
    output = []
    for user in users:
        donations = Donation.query.filter_by(user_id=user.id).all()
        user_data = {
            'id': user.id,
            'name': user.full_name,
            'email': user.email,
            'phone': user.phone or '',
            'company_name': user.company_name or '',
            'donations_count': len(donations),
            'trees_planted': sum(d.tree_count for d in donations),
            'total_amount': sum(d.amount for d in donations),
            'status': 'active',  # Placeholder
            'joined_date': user.created_at.isoformat() + 'Z',
            'role': user.role
        }
        output.append(user_data)
    return jsonify({'users': output})

@app.route('/api/admin/users/<string:user_id>', methods=['PUT'])
@admin_required
def admin_update_user(current_user, user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    # Update user fields
    if 'full_name' in data:
        user.full_name = data['full_name']
    if 'email' in data:
        # Check if email is already taken by another user
        existing_user = User.query.filter(User.email == data['email'], User.id != user_id).first()
        if existing_user:
            return jsonify({'message': 'Email already exists'}), 400
        user.email = data['email']
    if 'phone' in data:
        user.phone = data['phone']
    if 'company_name' in data:
        user.company_name = data['company_name']
    if 'role' in data:
        # Only allow setting role to 'user' or 'admin'
        if data['role'] in ['user', 'admin']:
            user.role = data['role']
    
    db.session.commit()
    return jsonify({'message': 'User updated successfully'})

@app.route('/api/admin/users/<string:user_id>', methods=['DELETE'])
@admin_required
def admin_delete_user(current_user, user_id):
    user = User.query.get_or_404(user_id)
    
    # Prevent deleting the admin user themselves
    if user.id == current_user.id:
        return jsonify({'message': 'Cannot delete yourself'}), 400
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'})

@app.route('/api/admin/users', methods=['POST'])
@admin_required
def admin_create_user(current_user):
    data = request.get_json()
    
    # Validate required fields
    if not data.get('full_name') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Full name, email, and password are required'}), 400
    
    # Check if user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'message': 'User with this email already exists'}), 400
    
    # Hash password with stronger settings
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256', salt_length=12)
    
    # Create new user
    new_user = User(
        id=str(uuid.uuid4()),
        full_name=data['full_name'],
        email=data['email'],
        password=hashed_password,
        phone=data.get('phone', ''),
        company_name=data.get('company_name', ''),
        role=data.get('role', 'user')
    )
    
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully', 'user_id': new_user.id}), 201

@app.route('/api/admin/reports/donations-summary', methods=['GET'])
@admin_required
def admin_get_donations_summary(current_user):
    total_donations = Donation.query.count()
    processing_count = Donation.query.filter_by(status='processing').count()
    pending_count = Donation.query.filter_by(status='pending_payment').count()
    total_revenue = db.session.query(db.func.sum(Donation.amount)).scalar()
    trees_planted = db.session.query(db.func.sum(Donation.tree_count)).scalar()
    
    locations = Location.query.all()
    by_location = {}
    for location in locations:
        donations = Donation.query.filter_by(location_id=location.id).all()
        by_location[location.name] = {
            'donations': len(donations),
            'trees': sum(d.tree_count for d in donations),
            'revenue': sum(d.amount for d in donations)
        }
        
    response = {
        "total_donations": total_donations,
        "processing_count": processing_count,
        "pending_count": pending_count,
        "total_revenue": total_revenue,
        "trees_planted": trees_planted,
        "by_location": by_location
    }
    return jsonify(response)

# Admin Location Management Endpoints

@app.route('/api/admin/locations', methods=['GET'])
@admin_required
def admin_get_locations(current_user):
    locations = Location.query.all()
    output = []
    for location in locations:
        location_data = {
            'id': location.id,
            'name': location.name,
            'description': location.description,
            'area_hectares': location.area_hectares,
            'coordinates': location.coordinates,
            'image_url': location.image_url,
            'status': location.status,
            'capacity_trees': location.capacity_trees,
            'planted_trees': location.planted_trees
        }
        output.append(location_data)
    return jsonify({'locations': output})

@app.route('/api/admin/locations', methods=['POST'])
@admin_required
def admin_create_location(current_user):
    data = request.get_json()
    
    # Validate required fields
    if not data.get('name'):
        return jsonify({'message': 'Name is required'}), 400
    
    new_location = Location(
        id=str(uuid.uuid4()),
        name=data['name'],
        description=data.get('description', ''),
        area_hectares=data.get('area_hectares', 0),
        coordinates=data.get('coordinates', ''),
        image_url=data.get('image_url', ''),
        status=data.get('status', 'active'),
        capacity_trees=data.get('capacity_trees', 0),
        planted_trees=data.get('planted_trees', 0)
    )
    
    db.session.add(new_location)
    db.session.commit()
    return jsonify({'message': 'Location created successfully', 'location_id': new_location.id}), 201

@app.route('/api/admin/locations/<string:location_id>', methods=['PUT'])
@admin_required
def admin_update_location(current_user, location_id):
    location = Location.query.get_or_404(location_id)
    data = request.get_json()
    
    # Update location fields
    if 'name' in data:
        location.name = data['name']
    if 'description' in data:
        location.description = data['description']
    if 'area_hectares' in data:
        location.area_hectares = data['area_hectares']
    if 'coordinates' in data:
        location.coordinates = data['coordinates']
    if 'image_url' in data:
        location.image_url = data['image_url']
    if 'status' in data:
        location.status = data['status']
    if 'capacity_trees' in data:
        location.capacity_trees = data['capacity_trees']
    if 'planted_trees' in data:
        location.planted_trees = data['planted_trees']
    
    db.session.commit()
    return jsonify({'message': 'Location updated successfully'})

@app.route('/api/admin/locations/<string:location_id>', methods=['DELETE'])
@admin_required
def admin_delete_location(current_user, location_id):
    location = Location.query.get_or_404(location_id)
    db.session.delete(location)
    db.session.commit()
    return jsonify({'message': 'Location deleted successfully'})


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.datetime.utcnow().isoformat() + 'Z'})


if __name__ == '__main__':
    # Add a test user for development if using the mock database
    # Uncomment the following lines if you want to use the mock database approach
    # Note: This would only work if you're using the mock database approach
    # For SQLAlchemy approach, you'd need to create a user through the register endpoint
    # test_user = {
    #     'id': 'usr_001',
    #     'full_name': 'Test User',
    #     'email': 'test@example.com',
    #     'password': hashlib.sha256('password123'.encode()).hexdigest(),
    #     'phone': '+1234567890',
    #     'company_name': '',
    #     'created_at': datetime.datetime.utcnow().isoformat() + 'Z',
    #     'last_login': None
    # }
    # users_db.append(test_user)
    
    app.run(debug=False, host='0.0.0.0', port=5000)