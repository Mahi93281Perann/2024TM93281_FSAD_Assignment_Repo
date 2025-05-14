from flask import Blueprint, request, jsonify
from datetime import datetime
from models.student import Student
from models.vaccination_record import VaccinationRecord
from models.vaccination_drive import VaccinationDrive
from db import db

vaccination_bp = Blueprint('vaccination_bp', __name__)

@vaccination_bp.route('/vaccinate', methods=['POST'])
def mark_vaccinated():
    data = request.json
    student_id = data.get('student_id')
    drive_id = data.get('drive_id')  # 📌 Make sure you're using drive_id here

    if not student_id or not drive_id:
        return jsonify({"error": "Missing student_id or drive_id"}), 400

    try:
        drive_id = int(drive_id)  # 🔥 Convert to integer to avoid SQLAlchemy error
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid drive_id format"}), 400

    student = Student.query.filter_by(id=student_id).first()
    if not student:
        return jsonify({"error": "Student not found"}), 404

    drive = VaccinationDrive.query.get(drive_id)
    if not drive:
        return jsonify({"error": "Vaccination drive not found"}), 404

    # Prevent duplicate vaccination for same vaccine and student
    existing = VaccinationRecord.query.filter_by(student_id=student_id, vaccine_name=drive.vaccine_name).first()
    if existing:
        return jsonify({"message": "Student already vaccinated for this vaccine"}), 409

    record = VaccinationRecord(
        student_id=student_id,
        drive_id=drive_id,
        vaccine_name=drive.vaccine_name,
        date_administered=datetime.now()
    )

    db.session.add(record)

    # Update student table (optional)
    student.is_vaccinated = True
    student.vaccine_name = drive.vaccine_name
    student.vaccination_date = record.date_administered

    db.session.commit()

    return jsonify({"message": "Vaccination recorded", "record": record.to_dict()}), 200

@vaccination_bp.route('/stats/<int:drive_id>', methods=['GET'])
def get_drive_stats(drive_id):
    drive = VaccinationDrive.query.get(drive_id)
    if not drive:
        return jsonify({"error": "Drive not found"}), 404

    # Parse applicable classes
    applicable_classes = drive.applicable_classes.split(",")

    # Get eligible students
    eligible_students = Student.query.filter(Student.grade.in_(applicable_classes)).all()

    # Get vaccinated students for this drive
    from models.vaccination_record import VaccinationRecord
    vaccinated_records = VaccinationRecord.query.filter_by(drive_id=drive_id).all()

    vaccinated_student_ids = set([v.student_id for v in vaccinated_records])
    vaccinated_students = [s for s in eligible_students if s.id in vaccinated_student_ids]

    return jsonify({
        "drive_id": drive_id,
        "vaccine_name": drive.vaccine_name,
        "date": drive.drive_date.strftime("%Y-%m-%d"),
        "eligible_students": len(eligible_students),
        "vaccinated": len(vaccinated_students),
        "coverage_percent": round((len(vaccinated_students) / len(eligible_students)) * 100, 2) if eligible_students else 0,
        "remaining_doses": drive.available_doses
    })