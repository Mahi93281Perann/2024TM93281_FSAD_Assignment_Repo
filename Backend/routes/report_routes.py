from flask import Blueprint, Response
import csv
import io
from models.student import Student
from db import db

report_bp = Blueprint('report', __name__)

@report_bp.route('/reports/students', methods=['GET'])
def export_students_csv():
    output = io.StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow(['ID', 'Name', 'Student ID', 'Grade', 'Is Vaccinated'])

    # Data
    students = Student.query.all()
    for s in students:
        writer.writerow([s.id, s.name, s.student_id, s.grade, 'Yes' if s.is_vaccinated else 'No'])

    output.seek(0)
    return Response(
        output,
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=students_report.csv'}
    )
