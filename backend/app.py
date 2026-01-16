from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
import jwt
import base64
import hashlib
import time
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import datetime
import uuid
from dotenv import load_dotenv

# PDF Generation Imports
try:
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import A4, landscape
    from reportlab.lib import colors
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    PDF_ENABLED = True
except ImportError:
    PDF_ENABLED = False
    print("Warning: reportlab not installed. PDF generation disabled.")

# Load environment variables
load_dotenv()

# Import Ioka service
try:
    from ioka_service import ioka_service
    IOKA_ENABLED = True
except Exception as e:
    print(f"Warning: Ioka service not available: {e}")
    IOKA_ENABLED = False

app = Flask(__name__, static_folder='static')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///tree_donation.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', os.urandom(24))  # Use environment variable or generate random key

# Enable CORS for all routes
CORS(app)

# Add request logging
import logging
logging.basicConfig(level=logging.DEBUG)
app.logger.setLevel(logging.DEBUG)

@app.before_request
def log_request_info():
    app.logger.debug(f'Request: {request.method} {request.path}')
    if request.data:
        app.logger.debug(f'Body: {request.get_data(as_text=True)[:200]}')

db = SQLAlchemy(app)
migrate = Migrate(app, db)

def generate_certificate_pdf(donation):
    """Generate a physical PDF file for the certificate"""
    if not PDF_ENABLED:
        return None
        
    # Extra safety check: only generate if paid
    if donation.status != 'completed':
        print(f"Skipping PDF generation: donation {donation.id} status is {donation.status}")
        return None
        
    try:
        # Create directory if it doesn't exist
        certificates_dir = os.path.join(app.root_path, 'static', 'certificates')
        if not os.path.exists(certificates_dir):
            os.makedirs(certificates_dir)
            
        file_path = os.path.join(certificates_dir, f"{donation.id}.pdf")
        
        # Create canvas
        c = canvas.Canvas(file_path, pagesize=landscape(A4))
        width, height = landscape(A4)
        
        # Background color
        c.setFillColor(colors.HexColor('#F9FDF9'))
        c.rect(0, 0, width, height, fill=1)
        
        # Border
        c.setStrokeColor(colors.HexColor('#10B981'))
        c.setLineWidth(10)
        c.rect(20, 20, width-40, height-40)
        
        # Title
        c.setFillColor(colors.HexColor('#064E3B'))
        c.setFont("Helvetica-Bold", 40)
        c.drawCentredString(width/2, height - 100, "СЕРТИФИКАТ ПОСАДКИ")
        
        # Message
        c.setFont("Helvetica", 20)
        c.drawCentredString(width/2, height - 160, "Настоящим подтверждается, что")
        
        # Donor Name
        donor_name = donation.donor_info.get('full_name', 'Анонимный благотворитель')
        c.setFont("Helvetica-Bold", 30)
        c.drawCentredString(width/2, height - 220, donor_name)
        
        # Contribution
        c.setFont("Helvetica", 20)
        c.drawCentredString(width/2, height - 280, f"внес(ла) вклад в посадку {donation.tree_count} деревьев")
        
        # Location
        location = Location.query.get(donation.location_id)
        location_name = location.name if location else 'Mukhatay Ormany'
        c.drawCentredString(width/2, height - 320, f"в локации {location_name}")
        
        # Date
        c.setFont("Helvetica", 14)
        date_str = donation.created_at.strftime('%d.%m.%Y')
        c.drawCentredString(width/2, 100, f"Дата: {date_str}")
        
        # ID
        c.setFont("Helvetica-Oblique", 10)
        c.drawCentredString(width/2, 60, f"ID Сертификата: {donation.id}")
        
        c.save()
        return f"/certificates/{donation.id}.pdf"
    except Exception as e:
        print(f"Error generating PDF: {e}")
        return None

# Models
class User(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = db.Column(db.String)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    phone = db.Column(db.String)
    company_name = db.Column(db.String)
    role = db.Column(db.String, default='user')
    status = db.Column(db.String, default='active')  # active, guest
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
    email = db.Column(db.String)  # For guest donations linking
    tree_count = db.Column(db.Integer)
    amount = db.Column(db.Integer)
    status = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    donor_info = db.Column(db.JSON)
    payment_order_id = db.Column(db.String)  # Ioka payment order ID

class Certificate(db.Model):
    id = db.Column(db.String, primary_key=True)
    donation_id = db.Column(db.String, db.ForeignKey('donation.id'))
    pdf_url = db.Column(db.String)
    created_date = db.Column(db.DateTime, server_default=db.func.now())

class News(db.Model):
    id = db.Column(db.String, primary_key=True)
    title = db.Column(db.String, nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String)
    author = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    published = db.Column(db.Boolean, default=True)
    category = db.Column(db.String, default='general')

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
        guest_user_id = data.get('guest_user_id')
        
        # Try to find user to upgrade (either by guest ID or email)
        existing_user = None
        if guest_user_id:
            existing_user = User.query.get(guest_user_id)
        
        if not existing_user:
            existing_user = User.query.filter_by(email=data['email']).first()
        
        if existing_user:
            if existing_user.status == 'guest':
                # UPGRADE Guest to Active
                
                # If changing email, check if new email is already taken by another active user
                if existing_user.email != data['email']:
                    email_taken = User.query.filter_by(email=data['email']).first()
                    if email_taken and email_taken.id != existing_user.id:
                        return jsonify({'message': 'Этот email уже используется другим аккаунтом'}), 400
                
                hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256', salt_length=12)
                existing_user.full_name = data.get('full_name', existing_user.full_name)
                existing_user.email = data['email']
                existing_user.password = hashed_password
                existing_user.phone = data.get('phone', existing_user.phone)
                existing_user.status = 'active'
                
                # Re-link any other donations with the NEW email that might have been legacy guests
                legacy_donations = Donation.query.filter_by(email=existing_user.email, user_id=None).all()
                for d in legacy_donations:
                    d.user_id = existing_user.id
                
                db.session.commit()
                return jsonify({
                    'message': 'Аккаунт успешно активирован!',
                    'user_id': existing_user.id,
                    'is_upgrade': True
                })
            else:
                return jsonify({'message': 'Пользователь с таким email уже существует'}), 400
        
        # Create new active user from scratch
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256', salt_length=12)
        new_user = User(
            id=str(uuid.uuid4()), 
            full_name=data['full_name'], 
            email=data['email'], 
            password=hashed_password, 
            phone=data['phone'],
            status='active'
        )
        db.session.add(new_user)
        db.session.commit()
        
        # Link any legacy guest donations with the same email
        guest_donations = Donation.query.filter_by(email=data['email'], user_id=None).all()
        for donation in guest_donations:
            donation.user_id = new_user.id
        if guest_donations:
            db.session.commit()
        
        return jsonify({
            'message': 'Новый пользователь создан!',
            'user_id': new_user.id,
            'is_upgrade': False
        })
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
        
        # Link any guest donations with the same email
        guest_donations = Donation.query.filter_by(email=email, user_id=None).all()
        for donation in guest_donations:
            donation.user_id = user.id
        if guest_donations:
            db.session.commit()
        
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
        email=current_user.email,  # Store user's email for consistency
        tree_count=data['tree_count'],
        amount=data['amount'],
        status='pending',
        donor_info=data['donor_info']
    )
    db.session.add(new_donation)
    db.session.commit()
    return jsonify({'id': new_donation.id, 'status': new_donation.status}), 201

@app.route('/api/guest-donations', methods=['POST'])
def create_guest_donation():
    data = request.get_json()
    
    # Extract email from donor_info
    donor_info = data.get('donor_info', {})
    donor_email = donor_info.get('email')
    donor_name = donor_info.get('full_name')
    
    if not donor_email:
        return jsonify({'message': 'Email is required'}), 400

    # Link to guest user or existing user
    user = User.query.filter_by(email=donor_email).first()
    if not user:
        # Create a guest user if they don't exist
        user = User(
            id=str(uuid.uuid4()),
            full_name=donor_name,
            email=donor_email,
            password=generate_password_hash(str(uuid.uuid4()), method='pbkdf2:sha256', salt_length=12),
            status='guest'
        )
        db.session.add(user)
        db.session.commit()
    
    new_donation = Donation(
        id=str(uuid.uuid4()),
        location_id=data['location_id'],
        package_id=data['package_id'],
        user_id=user.id,
        email=donor_email,
        tree_count=data['tree_count'],
        amount=data['amount'],
        status='pending',
        donor_info=data['donor_info']
    )
    db.session.add(new_donation)
    db.session.commit()
    return jsonify({
        'id': new_donation.id, 
        'status': new_donation.status,
        'user_id': user.id,
        'is_guest': user.status == 'guest'
    }), 201

@app.route('/api/donations/<string:donation_id>/payment', methods=['POST'])
@token_required
def process_payment(current_user, donation_id):
    """Process payment for authenticated user donation using Ioka"""
    print(f"\n=== PAYMENT REQUEST for donation {donation_id} ===")
    print(f"User: {current_user.email}")
    print(f"IOKA_ENABLED: {IOKA_ENABLED}")
    
    donation = Donation.query.get_or_404(donation_id)
    if donation.user_id != current_user.id:
        return jsonify({'message': 'Permission denied'}), 403
    
    # If Ioka is enabled, create payment order
    if IOKA_ENABLED:
        try:
            # Get location for description
            location = Location.query.get(donation.location_id)
            location_name = location.name if location else 'Unknown'
            description = f"Посадка {donation.tree_count} деревьев в {location_name}"
            
            # Create Ioka payment order
            print(f"Creating Ioka payment order for donation {donation.id}")
            payment_result = ioka_service.create_payment_order(
                amount=donation.amount,
                description=description,
                donation_id=donation.id,
                customer_email=current_user.email,
                customer_name=current_user.full_name
            )
            print(f"Ioka payment result: {payment_result}")
            
            if payment_result.get('success'):
                # Store Ioka order ID
                donation.payment_order_id = payment_result.get('order_id')
                donation.status = 'awaiting_payment'
                db.session.commit()
                
                return jsonify({
                    'success': True,
                    'checkout_url': payment_result.get('checkout_url'),
                    'order_id': payment_result.get('order_id'),
                    'donation_id': donation.id,
                    'status': donation.status
                }), 200
            else:
                return jsonify({
                    'success': False,
                    'message': payment_result.get('message', 'Failed to create payment')
                }), 500
                
        except Exception as e:
            return jsonify({
                'success': False,
                'message': f'Payment processing error: {str(e)}'
            }), 500
    else:
        # Fallback: mark as completed without payment gateway
        donation.status = 'completed'
        
        new_certificate = Certificate(
            id=str(uuid.uuid4()),
            donation_id=donation.id,
            pdf_url=f"/api/certificates/{donation.id}.pdf"
        )
        db.session.add(new_certificate)
        db.session.commit()

        return jsonify({
            "success": True,
            "donation_id": donation.id,
            "status": donation.status,
            "certificate_id": new_certificate.id,
            "updated_at": datetime.datetime.utcnow().isoformat() + 'Z'
        })

@app.route('/api/guest-donations/<string:donation_id>/payment', methods=['POST'])
def process_guest_payment(donation_id):
    """Process payment for guest donation using Ioka"""
    print(f"\n=== GUEST PAYMENT REQUEST for donation {donation_id} ===")
    print(f"IOKA_ENABLED: {IOKA_ENABLED}")
    
    donation = Donation.query.get_or_404(donation_id)
    
    # Check if the associated user is a guest
    user = User.query.get(donation.user_id)
    if user and user.status == 'active':
        return jsonify({'message': 'Please login to continue with this donation'}), 403
    
    # If Ioka is enabled, create payment order
    if IOKA_ENABLED:
        try:
            # Get location for description
            location = Location.query.get(donation.location_id)
            location_name = location.name if location else 'Unknown'
            description = f"Посадка {donation.tree_count} деревьев в {location_name}"
            
            # Get donor info
            donor_email = donation.donor_info.get('email') if donation.donor_info else None
            donor_name = donation.donor_info.get('full_name') if donation.donor_info else None
            
            # Create Ioka payment order
            payment_result = ioka_service.create_payment_order(
                amount=donation.amount,
                description=description,
                donation_id=donation.id,
                customer_email=donor_email,
                customer_name=donor_name
            )
            
            if payment_result.get('success'):
                # Store Ioka order ID
                donation.payment_order_id = payment_result.get('order_id')
                donation.status = 'awaiting_payment'
                db.session.commit()
                
                return jsonify({
                    'success': True,
                    'checkout_url': payment_result.get('checkout_url'),
                    'order_id': payment_result.get('order_id'),
                    'donation_id': donation.id,
                    'status': donation.status
                }), 200
            else:
                return jsonify({
                    'success': False,
                    'message': payment_result.get('message', 'Failed to create payment')
                }), 500
                
        except Exception as e:
            return jsonify({
                'success': False,
                'message': f'Payment processing error: {str(e)}'
            }), 500
    else:
        # Fallback: mark as completed without payment gateway
        donation.status = 'completed'
        
        new_certificate = Certificate(
            id=str(uuid.uuid4()),
            donation_id=donation.id,
            pdf_url=f"/api/certificates/{donation.id}.pdf"
        )
        db.session.add(new_certificate)
        db.session.commit()

        return jsonify({
            "success": True,
            "donation_id": donation.id,
            "status": donation.status,
            "certificate_id": new_certificate.id,
            "updated_at": datetime.datetime.utcnow().isoformat() + 'Z'
        })

@app.route('/api/users/me/donations', methods=['GET'])
@token_required
def get_user_donations(current_user):
    # First, link any guest donations with the same email
    guest_donations = Donation.query.filter_by(email=current_user.email, user_id=None).all()
    for donation in guest_donations:
        donation.user_id = current_user.id
    if guest_donations:
        db.session.commit()
    
    # Now get all donations for the user
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
        'status': current_user.status,
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
        # Handle case where donation might not exist
        tree_count = donation.tree_count if donation else 0
        location_id = donation.location_id if donation else 'Unknown Location'
        
        certificate_data = {
            "id": certificate.id,
            "donation_id": certificate.donation_id,
            "trees": tree_count,
            "location": location_id,
            "date": certificate.created_date.isoformat() + 'Z' if certificate.created_date else None,
            "pdf_url": f"/api/certificates/{certificate.donation_id}.pdf"
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
        
        # Handle case where user or location might not exist
        # For guest donations, use donor_info from the donation itself
        if user:
            donor_name = user.full_name
            email = user.email
        elif donation.email:  # Guest donation with email
            donor_name = donation.donor_info.get('full_name', 'Guest Donor') if donation.donor_info else 'Guest Donor'
            email = donation.email
        else:  # Fallback for any other case
            donor_name = 'Unknown User'
            email = 'Unknown Email'
        location_name = location.name if location else 'Unknown Location'
        
        donation_data = {
            'id': donation.id,
            'donor_name': donor_name,
            'email': email,
            'location': location_name,
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
    pending_count = Donation.query.filter_by(status='pending').count()
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


# News endpoints
@app.route('/api/news', methods=['GET'])
def get_news():
    # Get all published news, ordered by creation date (newest first)
    news_items = News.query.filter_by(published=True).order_by(News.created_at.desc()).all()
    output = []
    for news in news_items:
        news_data = {
            'id': news.id,
            'title': news.title,
            'content': news.content,
            'image_url': news.image_url,
            'author': news.author,
            'created_at': news.created_at.isoformat() + 'Z',
            'updated_at': news.updated_at.isoformat() + 'Z' if news.updated_at else None,
            'category': news.category
        }
        output.append(news_data)
    return jsonify(output)

@app.route('/api/news/<string:news_id>', methods=['GET'])
def get_news_detail(news_id):
    news_item = News.query.get_or_404(news_id)
    if not news_item.published:
        # Only admin can view unpublished news
        try:
            token = None
            if 'Authorization' in request.headers:
                token = request.headers['Authorization'].split(" ")[1]
            if not token:
                return jsonify({'message': 'Authentication required'}), 401
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['id']).first()
            if not current_user or current_user.role != 'admin':
                return jsonify({'message': 'Admin access required'}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401
    
    news_data = {
        'id': news_item.id,
        'title': news_item.title,
        'content': news_item.content,
        'image_url': news_item.image_url,
        'author': news_item.author,
        'created_at': news_item.created_at.isoformat() + 'Z',
        'updated_at': news_item.updated_at.isoformat() + 'Z' if news_item.updated_at else None,
        'category': news_item.category,
        'published': news_item.published
    }
    return jsonify(news_data)

@app.route('/api/admin/news', methods=['GET'])
@admin_required
def admin_get_all_news(current_user):
    # Admin can see all news (published and unpublished)
    news_items = News.query.order_by(News.created_at.desc()).all()
    output = []
    for news in news_items:
        news_data = {
            'id': news.id,
            'title': news.title,
            'content': news.content,
            'image_url': news.image_url,
            'author': news.author,
            'created_at': news.created_at.isoformat() + 'Z',
            'updated_at': news.updated_at.isoformat() + 'Z' if news.updated_at else None,
            'published': news.published,
            'category': news.category
        }
        output.append(news_data)
    return jsonify(output)

@app.route('/api/admin/news', methods=['POST'])
@admin_required
def admin_create_news(current_user):
    data = request.get_json()
    
    new_news = News(
        id=str(uuid.uuid4()),
        title=data['title'],
        content=data['content'],
        image_url=data.get('image_url', ''),
        author=data.get('author', 'Admin'),
        published=data.get('published', True),
        category=data.get('category', 'general')
    )
    
    db.session.add(new_news)
    db.session.commit()
    
    return jsonify({'id': new_news.id, 'message': 'News created successfully'}), 201

@app.route('/api/admin/news/<string:news_id>', methods=['PUT'])
@admin_required
def admin_update_news(current_user, news_id):
    news_item = News.query.get_or_404(news_id)
    data = request.get_json()
    
    if 'title' in data:
        news_item.title = data['title']
    if 'content' in data:
        news_item.content = data['content']
    if 'image_url' in data:
        news_item.image_url = data['image_url']
    if 'author' in data:
        news_item.author = data['author']
    if 'published' in data:
        news_item.published = data['published']
    if 'category' in data:
        news_item.category = data['category']
    
    db.session.commit()
    return jsonify({'message': 'News updated successfully'})

@app.route('/api/admin/news/<string:news_id>', methods=['DELETE'])
@admin_required
def admin_delete_news(current_user, news_id):
    news_item = News.query.get_or_404(news_id)
    db.session.delete(news_item)
    db.session.commit()
    return jsonify({'message': 'News deleted successfully'})

# Transparency reports endpoints
@app.route('/api/transparency-reports', methods=['GET'])
def get_transparency_reports():
    # Sample transparency report data
    reports = [
        {
            'id': 'report_001',
            'title': 'Ежегодный отчет 2023',
            'type': 'report',
            'thumbnail': '/annual-report-2023.jpg',
            'date': '2024-01-15',
            'views': 234,
            'location': 'Казахстан',
            'description': 'Подробный отчет о деятельности проекта за 2023 год'
        },
        {
            'id': 'photo_001',
            'title': 'Посадка в питомнике',
            'type': 'photo',
            'thumbnail': '/planting-nursery.jpg',
            'date': '2024-03-15',
            'views': 156,
            'location': 'Шортандинский район',
            'description': 'Фотоотчет о посадке деревьев в питомнике'
        },
        {
            'id': 'video_001',
            'title': 'Процесс посадки',
            'type': 'video',
            'thumbnail': '/planting-process.jpg',
            'date': '2024-03-10',
            'views': 289,
            'location': 'Карагандинская область',
            'description': 'Видео о процессе посадки деревьев'
        },
        {
            'id': 'stat_001',
            'title': 'Статистика 2023',
            'type': 'statistics',
            'thumbnail': '/stats-2023.jpg',
            'date': '2024-01-15',
            'views': 178,
            'location': 'Казахстан',
            'description': 'Статистические данные о посаженных деревьях за 2023 год'
        },
        {
            'id': 'photo_002',
            'title': 'Уход за саженцами',
            'type': 'photo',
            'thumbnail': '/care-of-saplings.jpg',
            'date': '2024-04-05',
            'views': 98,
            'location': 'Шортандинский район',
            'description': 'Фотоотчет об уходе за молодыми саженцами'
        },
        {
            'id': 'video_002',
            'title': 'Интервью с волонтером',
            'type': 'video',
            'thumbnail': '/volunteer-interview.jpg',
            'date': '2024-02-20',
            'views': 145,
            'location': 'Карагандинская область',
            'description': 'Интервью с участником проекта'
        }
    ]
    return jsonify(reports)

# Contact form endpoint
@app.route('/api/contact', methods=['POST'])
def submit_contact_form():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'email', 'message']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'message': f'Поле {field} обязательно'}), 400
    
    # Here you would typically send an email or save to a database
    # For now, we'll just log the submission
    print(f"Contact form received: {data}")
    
    # In a real application, you would save this to a database
    # For now, we'll store in memory
    if not hasattr(submit_contact_form, 'submissions'):
        submit_contact_form.submissions = []
    
    submission = {
        'id': f"contact_{int(time.time())}_{uuid.uuid4().hex[:8]}",
        'name': data.get('name'),
        'email': data.get('email'),
        'phone': data.get('phone', ''),
        'message': data.get('message'),
        'created_at': datetime.datetime.utcnow().isoformat() + 'Z'
    }
    
    submit_contact_form.submissions.append(submission)
    
    # Here you would typically send an email notification
    print(f"Contact submission saved: {submission}")
    
    return jsonify({'message': 'Сообщение успешно отправлено'}), 200

@app.route('/api/partnership-inquiry', methods=['POST'])
def submit_partnership_inquiry():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['companyName', 'contactPerson', 'email']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'message': f'Поле {field} обязательно'}), 400
    
    # Create partnership inquiry object
    inquiry = {
        'id': f"inquiry_{int(time.time())}_{uuid.uuid4().hex[:8]}",
        'company_name': data.get('companyName'),
        'contact_person': data.get('contactPerson'),
        'email': data.get('email'),
        'phone': data.get('phone', ''),
        'partnership_type': data.get('partnershipType', ''),
        'message': data.get('message', ''),
        'created_at': datetime.datetime.utcnow().isoformat() + 'Z',
        'status': 'pending'  # Default status
    }
    
    # In a real application, you would save this to the database
    # For now, we'll store in memory
    if not hasattr(submit_partnership_inquiry, 'inquiries'):
        submit_partnership_inquiry.inquiries = []
    
    submit_partnership_inquiry.inquiries.append(inquiry)
    
    # Here you would typically send an email notification
    print(f"Partnership inquiry received: {inquiry}")
    
    return jsonify({'message': 'Заявка на партнерство успешно отправлена', 'inquiry_id': inquiry['id']}), 200

@app.route('/api/admin/partnership-inquiries', methods=['GET'])
@admin_required
def admin_get_partnership_inquiries(current_user):
    # Retrieve all partnership inquiries
    if hasattr(submit_partnership_inquiry, 'inquiries'):
        inquiries = submit_partnership_inquiry.inquiries
    else:
        inquiries = []
    
    # Sort by creation date (newest first)
    sorted_inquiries = sorted(inquiries, key=lambda x: x['created_at'], reverse=True)
    
    return jsonify(sorted_inquiries)


@app.route('/api/admin/contact-submissions', methods=['GET'])
@admin_required
def admin_get_contact_submissions(current_user):
    # Retrieve all contact form submissions
    if hasattr(submit_contact_form, 'submissions'):
        submissions = submit_contact_form.submissions
    else:
        submissions = []
    
    # Sort by creation date (newest first)
    sorted_submissions = sorted(submissions, key=lambda x: x['created_at'], reverse=True)
    
    return jsonify(sorted_submissions)

# Ioka Webhook Endpoint
@app.route('/api/webhooks/ioka', methods=['POST'])
def ioka_webhook():
    """Handle Ioka payment webhook notifications"""
    if not IOKA_ENABLED:
        return jsonify({'message': 'Ioka integration not enabled'}), 503
    
    try:
        # Get raw request body for signature verification
        payload = request.get_data()
        signature = request.headers.get('X-Ioka-Signature', '')
        
        # Verify webhook signature
        if not ioka_service.verify_webhook_signature(payload, signature):
            return jsonify({'message': 'Invalid signature'}), 401
        
        # Parse webhook data
        data = request.get_json()
        event_type = data.get('event')
        order_data = data.get('object', {})
        
        # Extract donation ID from external_id
        donation_id = order_data.get('external_id')
        if not donation_id:
            return jsonify({'message': 'Missing external_id'}), 400
        
        # Find donation
        donation = Donation.query.filter_by(id=donation_id).first()
        if not donation:
            return jsonify({'message': 'Donation not found'}), 404
        
        # Handle different event types
        if event_type == 'payment.succeeded':
            # Payment successful - mark donation as completed
            donation.status = 'completed'
            
            # Create certificate if it doesn't exist
            existing_certificate = Certificate.query.filter_by(donation_id=donation.id).first()
            if not existing_certificate:
                # Generate physical PDF
                pdf_path = generate_certificate_pdf(donation)
                
                new_certificate = Certificate(
                    id=str(uuid.uuid4()),
                    donation_id=donation.id,
                    pdf_url=pdf_path or f"/certificates/{donation.id}.pdf"
                )
                db.session.add(new_certificate)
            
            db.session.commit()
            print(f"Payment succeeded for donation {donation_id}")
            
        elif event_type == 'payment.failed':
            # Payment failed
            donation.status = 'failed'
            db.session.commit()
            print(f"Payment failed for donation {donation_id}")
            
        elif event_type == 'payment.cancelled':
            # Payment cancelled
            donation.status = 'cancelled'
            db.session.commit()
            print(f"Payment cancelled for donation {donation_id}")
        
        # Return success to Ioka
        return jsonify({'success': True}), 200
        
    except Exception as e:
        print(f"Webhook error: {str(e)}")
        return jsonify({'message': f'Webhook processing error: {str(e)}'}), 500

@app.route('/certificates/<path:filename>')
def serve_certificate(filename):
    """Serve certificate PDF files from the static directory"""
    return send_from_directory(os.path.join(app.root_path, 'static', 'certificates'), filename)

@app.route('/api/donations/<string:donation_id>/status', methods=['GET'])
def get_donation_status(donation_id):
    """Check donation status and provide info for the success page"""
    donation = Donation.query.get_or_404(donation_id)
    
    # If it's still awaiting payment, we can optionally check Ioka directly 
    # to be sure in case the webhook is delayed
    if donation.status == 'awaiting_payment' and IOKA_ENABLED and donation.payment_order_id:
        status_result = ioka_service.get_payment_status(donation.payment_order_id)
        if status_result.get('success'):
            ioka_status = status_result.get('status')
            if ioka_status == 'PAID':
                donation.status = 'completed'
                # Ensure certificate is created
                existing_certificate = Certificate.query.filter_by(donation_id=donation.id).first()
                if not existing_certificate:
                    # Generate physical PDF
                    pdf_path = generate_certificate_pdf(donation)
                    
                    new_certificate = Certificate(
                        id=str(uuid.uuid4()),
                        donation_id=donation.id,
                        pdf_url=pdf_path or f"/certificates/{donation.id}.pdf"
                    )
                    db.session.add(new_certificate)
                db.session.commit()
            elif ioka_status in ['CANCELLED', 'EXPIRED']:
                donation.status = 'cancelled'
                db.session.commit()
            elif ioka_status == 'DECLINED':
                donation.status = 'failed'
                db.session.commit()

    user = User.query.get(donation.user_id) if donation.user_id else None
    is_guest = True
    has_account = False
    
    if user:
        is_guest = (user.status == 'guest')
        has_account = (user.status == 'active')
    elif donation.email:
        existing_user = User.query.filter_by(email=donation.email).first()
        if existing_user:
            has_account = (existing_user.status == 'active')
            is_guest = (existing_user.status == 'guest')

    certificate = Certificate.query.filter_by(donation_id=donation.id).first()
    
    # Return frontend proxy URL instead of direct backend link
    certificate_url = f"/api/certificates/{donation.id}.pdf" if certificate else None
    
    return jsonify({
        'id': donation.id,
        'status': donation.status,
        'amount': donation.amount,
        'tree_count': donation.tree_count,
        'email': donation.email,
        'is_guest': is_guest,
        'has_account': has_account,
        'certificate_available': certificate is not None,
        'certificate_url': certificate_url
    })


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
    
    app.run(debug=True, host='0.0.0.0', port=5000)