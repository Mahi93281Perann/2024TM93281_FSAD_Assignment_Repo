from flask import Blueprint, request, jsonify, send_file
from models.student import Student
import pandas as pd
import io
from db import db
from models.vaccination_record import VaccinationRecord
from models.vaccination_drive import VaccinationDrive
from datetime import datetime
from io import StringIO  # For handling CSV in memory
import csv  # Python's built-in CSV library

student_bp = Blueprint('student', __name__)

# GET all students
@student_bp.route('/', methods=['GET'])
def get_all_students():
    students = Student.query.all()
    return jsonify([s.to_dict() for s in students])

# GET single student
@student_bp.route('/<int:id>', methods=['GET'])
def get_student(id):
    student = Student.query.get(id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    return jsonify(student.to_dict())

# CREATE student
@student_bp.route('/', methods=['POST'])
def add_student():
    data = request.get_json()
    new_student = Student(
        name=data['name'],
        student_id=data['student_id'],
        grade=data['grade']
    )
    
    db.session.add(new_student)
    db.session.commit()
    return jsonify(new_student.to_dict()), 201

# UPDATE student
@student_bp.route('/<int:id>', methods=['PUT'])
@student_bp.route('/<int:id>', methods=['PUT'])
def update_student(id):
    student = Student.query.get_or_404(id)  # Better error handling
    data = request.get_json()

    # Update all fields safely
    for field in ['name', 'student_id', 'grade', 'is_vaccinated', 'vaccine_name', 'vaccination_date']:
        if field in data:
            setattr(student, field, data[field])

    db.session.commit()
    return jsonify(student.to_dict())

# DELETE student
@student_bp.route('/<int:id>', methods=['DELETE'])
def delete_student(id):
    student = Student.query.get_or_404(id)
    db.session.delete(student)
    db.session.commit()
    return jsonify({"message": "Student deleted"})

# Bulk CSV Upload
from flask import request, jsonify
import csv
from io import StringIO
from models.student import Student
from db import db
from sqlalchemy.exc import IntegrityError

@student_bp.route('/upload', methods=['POST'])
def upload_students():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if not file.filename.endswith('.csv'):
        return jsonify({"error": "Only CSV files allowed"}), 400

    stream = StringIO(file.stream.read().decode("UTF8"), newline=None)
    csv_input = csv.DictReader(stream)  # This will read rows as dictionaries
    added, skipped = 0, 0

    for row in csv_input:
        # Ensure that the keys are in the expected format
        if 'name' not in row or 'student_id' not in row or 'grade' not in row:
            skipped += 1
            continue
        
        name, student_id, grade = row['name'], row['student_id'], row['grade']

        # Avoid duplicates
        existing = Student.query.filter_by(student_id=student_id).first()
        if existing:
            skipped += 1
            continue

        new_student = Student(name=name, student_id=student_id, grade=grade)
        db.session.add(new_student)
        added += 1

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Database error"}), 500

    return jsonify({"message": f"{added} students added, {skipped} skipped."}), 200

    
    # Mark Student Vaccinated
@student_bp.route('/<int:student_id>/vaccinate', methods=['POST'])
def mark_student_vaccinated(student_id):
    data = request.json
    drive_id = data.get('drive_id')

    if not drive_id:
        return jsonify({'error': 'drive_id is required'}), 400

    student = Student.query.get(student_id)
    drive = VaccinationDrive.query.get(drive_id)

    if not student or not drive:
        return jsonify({'error': 'Invalid student or drive ID'}), 404

    if drive.date < datetime.utcnow().date():
        return jsonify({'error': 'Cannot vaccinate for past drives'}), 400

    # Check if already vaccinated in this drive
    existing = VaccinationRecord.query.filter_by(student_id=student_id, drive_id=drive_id).first()
    if existing:
        return jsonify({'error': 'Student already vaccinated for this drive'}), 400

    record = VaccinationRecord(
        student_id=student_id,
        drive_id=drive_id,
        vaccine_name=drive.vaccine_name
    )

    student.vaccination_status = True

    db.session.add(record)
    db.session.commit()

    return jsonify({'message': 'Student marked as vaccinated'}), 200

@student_bp.route('/report/download', methods=['GET'])
def download_report_csv():
    vaccine_filter = request.args.get('vaccine')  # Optional

    query = db.session.query(
        Student.id,
        Student.name,
        Student.class_name,
        Student.vaccination_status,
        VaccinationRecord.vaccine_name,
        VaccinationRecord.date_administered
    ).join(VaccinationRecord, VaccinationRecord.student_id == Student.id)

    if vaccine_filter:
        query = query.filter(VaccinationRecord.vaccine_name.ilike(f'%{vaccine_filter}%'))

    results = query.all()

    # Create CSV in-memory
    si = StringIO()
    writer = csv.writer(si)
    writer.writerow(["Student ID", "Name", "Class", "Vaccination Status", "Vaccine", "Date Administered"])

    for row in results:
        writer.writerow([
            row.id,
            row.name,
            row.class_name,
            row.vaccination_status,
            row.vaccine_name,
            row.date_administered.strftime("%Y-%m-%d")
        ])

    # Move to the start of the stream
    si.seek(0)

    return send_file(
        si,
        mimetype='text/csv',
        as_attachment=True,
        download_name='vaccination_report.csv'
    )

@student_bp.route('/download', methods=['GET'])
def download_students():
    students = Student.query.all()

    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow(['ID', 'Name', 'Student ID', 'Grade'])

    # Write student data
    for student in students:
        writer.writerow([
            student.id,
            student.name,
            student.student_id,
            student.grade
        ])

    output.seek(0)

    return send_file(
        io.BytesIO(output.getvalue().encode()),
        mimetype='text/csv',
        as_attachment=True,
        download_name='students.csv'
    )

