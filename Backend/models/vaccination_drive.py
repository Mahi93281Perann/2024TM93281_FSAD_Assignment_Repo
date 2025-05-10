from flask_sqlalchemy import SQLAlchemy
from models.student import db

# Unified model (recommended)
class VaccinationDrive(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vaccine_name = db.Column(db.String(100), nullable=False)
    drive_date = db.Column(db.Date, nullable=False)  # use Date instead of String
    available_doses = db.Column(db.Integer, nullable=False)
    applicable_classes = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "vaccine_name": self.vaccine_name,
            "drive_date": self.drive_date.strftime('%Y-%m-%d') if self.drive_date else None,
            "available_doses": self.available_doses,
            "applicable_classes": self.applicable_classes.split(",") if self.applicable_classes else []
        }

