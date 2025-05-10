from flask import Blueprint, request, jsonify
from datetime import datetime
from models.student import Student
from models.vaccination_record import VaccinationRecord
from models.vaccination_drive import VaccinationDrive
from db import db

vaccination_bp = Blueprint('vaccination_bp', __name__)

@vaccination_bp.route('/active-vaccines', methods=['GET'])
def get_active_vaccines():
    today = datetime.now().date()
    drives = VaccinationDrive.query.filter(VaccinationDrive.drive_date >= today).all()
    vaccines = list({drive.vaccine_name for drive in drives})  # Unique vaccine names
    return jsonify(vaccines)

@vaccination_bp.route('/vaccinate', methods=['POST'])
def mark_vaccinated():
    data = request.json
    student_id = data.get('student_id')
    vaccine_name = data.get('vaccine_name')

    if not student_id or not vaccine_name:
        return jsonify({"error": "Missing student_id or vaccine_name"}), 400

    student = Student.query.filter_by(id=student_id).first()
    if not student:
        return jsonify({"error": "Student not found"}), 404

    existing = VaccinationRecord.query.filter_by(student_id=student_id, vaccine_name=vaccine_name).first()
    if existing:
        return jsonify({"message": "Student already vaccinated for this vaccine"}), 409

    record = VaccinationRecord(
        student_id=student_id,
        vaccine_name=vaccine_name,
        vaccination_date=datetime.now().strftime('%Y-%m-%d')
    )
    db.session.add(record)

    # Update student info (optional but helpful for display)
    student.is_vaccinated = True
    student.vaccine_name = vaccine_name
    student.vaccination_date = record.vaccination_date

    db.session.commit()
    return jsonify({"message": "Vaccination recorded", "record": record.to_dict()}), 200
