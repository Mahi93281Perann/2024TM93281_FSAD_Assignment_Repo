from flask import Blueprint, request, jsonify
from db import db
from models.user import User
from models.student import Student
from models.vaccination_drive import VaccinationDrive
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

auth_bp = Blueprint('auth', __name__)

# Sign up endpoint
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing required fields'}), 400

    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'message': 'User already exists!'}), 400

    hashed_password = generate_password_hash(data['password'])
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully!'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error creating user', 'error': str(e)}), 500

# Login endpoint
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    if user.username.lower() != 'admin':
        return jsonify({'message': 'Access denied: Admin only'}), 403

    return jsonify({'message': 'Login successful'}), 200

# Dashboard overview endpoint - no token required
@auth_bp.route('/dashboard', methods=['GET'])
def dashboard_overview():
    total_students = Student.query.count()
    vaccinated_students = Student.query.filter_by(is_vaccinated=True).count()

    vaccination_percentage = (
        (vaccinated_students / total_students) * 100 if total_students > 0 else 0
    )

    today = datetime.date.today()
    cutoff_date = today + datetime.timedelta(days=30)

    upcoming = VaccinationDrive.query.filter(
        VaccinationDrive.drive_date >= today,
        VaccinationDrive.drive_date <= cutoff_date
    ).all()

    upcoming_drives = [
        {
            'drive_name': drive.drive_name,
            'drive_date': drive.drive_date.strftime('%Y-%m-%d'),
            'classes': drive.classes
        }
        for drive in upcoming
    ]

    return jsonify({
        'total_students': 5,
        'vaccinated_students': vaccinated_students,
        'vaccination_percentage': round(vaccination_percentage, 2),
        'upcoming_drives': upcoming_drives
    })
