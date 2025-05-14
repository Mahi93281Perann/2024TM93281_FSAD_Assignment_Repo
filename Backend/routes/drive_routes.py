from flask import Blueprint, request, jsonify
from models.vaccination_drive import VaccinationDrive, db
from datetime import datetime, timedelta


drive_bp = Blueprint('drives', __name__)

# Utility to check date format
def is_valid_date(date_str):
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except:
        return False

# GET all drives
@drive_bp.route('/', methods=['GET'])
def get_drives():
    drives = VaccinationDrive.query.all()
    return jsonify([d.to_dict() for d in drives])

# GET single drive
@drive_bp.route('/<int:id>', methods=['GET'])
def get_drive(id):
    drive = VaccinationDrive.query.get_or_404(id)
    return jsonify(drive.to_dict())

# GET upcoming drives within 30 days
@drive_bp.route('/upcoming', methods=['GET'])
def get_upcoming_drives():
    today = datetime.today().date()
    limit = today + timedelta(days=30)
    drives = VaccinationDrive.query.all()
    upcoming = [d for d in drives if today <= datetime.strptime(d.drive_date, "%Y-%m-%d").date() <= limit]
    upcoming.sort(key=lambda d: datetime.strptime(d.drive_date, "%Y-%m-%d"))
    return jsonify([d.to_dict() for d in upcoming])

# CREATE drive
@drive_bp.route('/', methods=['POST'])
def create_drive():
    data = request.get_json()
    date_str = data.get('drive_date')

    if not is_valid_date(date_str):
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    drive_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    if (drive_date - datetime.today().date()).days < 15:
        return jsonify({"error": "Drive must be scheduled at least 15 days in advance"}), 400

    existing = VaccinationDrive.query.filter_by(drive_date=date_str).first()
    if existing:
        return jsonify({"error": "A drive is already scheduled for this date"}), 409

    drive = VaccinationDrive(
        vaccine_name=data['vaccine_name'],
        drive_date=drive_date,
        available_doses=data['available_doses'],
        applicable_classes=",".join(data['applicable_classes'])
    )
    db.session.add(drive)
    db.session.commit()
    return jsonify(drive.to_dict()), 201

# UPDATE drive (only if not past)
@drive_bp.route('/<int:id>', methods=['PUT'])
def update_drive(id):
    drive = VaccinationDrive.query.get(id)
    if not drive:
        return jsonify({'error': 'Drive not found'}), 404

    if datetime.strptime(drive.drive_date, "%Y-%m-%d").date() < datetime.today().date():
        return jsonify({'error': 'Cannot edit past drives'}), 400

    data = request.get_json()
    if 'vaccine_name' in data:
        drive.vaccine_name = data['vaccine_name']
    if 'available_doses' in data:
        drive.available_doses = data['available_doses']
    if 'applicable_classes' in data:
        drive.applicable_classes = ",".join(data['applicable_classes'])
    if 'drive_date' in data:
        new_date = datetime.strptime(data['drive_date'], "%Y-%m-%d").date()
        if (new_date - datetime.today().date()).days < 15:
            return jsonify({"error": "Drive must be at least 15 days in future"}), 400
        existing = VaccinationDrive.query.filter_by(drive_date=data['drive_date']).first()
        if existing and existing.id != drive.id:
            return jsonify({"error": "Another drive exists on this date"}), 409
        drive.drive_date = data['drive_date']

    db.session.commit()
    return jsonify(drive.to_dict())

# DELETE a drive
@drive_bp.route('/<int:id>', methods=['DELETE'])
def delete_drive(id):
    drive = VaccinationDrive.query.get(id)
    if not drive:
        return jsonify({'error': 'Drive not found'}), 404
    db.session.delete(drive)
    db.session.commit()
    return jsonify({'message': 'Drive deleted'})
