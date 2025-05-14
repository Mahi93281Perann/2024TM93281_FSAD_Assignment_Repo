from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from models.student import db

class VaccinationRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    drive_id = db.Column(db.Integer, db.ForeignKey('vaccination_drive.id'), nullable=False)
    vaccine_name = db.Column(db.String(100), nullable=False)
    date_administered = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    student = db.relationship('Student', backref='vaccination_records')
    drive = db.relationship('VaccinationDrive', backref='vaccinated_students')

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "drive_id": self.drive_id,
            "vaccine_name": self.vaccine_name,
            "date": self.date_administered.strftime('%Y-%m-%d')
        }
