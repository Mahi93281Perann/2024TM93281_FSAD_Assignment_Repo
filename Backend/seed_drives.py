from app import app
from db import db
from models.vaccination_drive import VaccinationDrive
from datetime import datetime

# Sample data
sample_drives = [
    {
        "vaccine_name": "Polio",
        "drive_date": datetime(2025, 5, 15),
        "available_doses": 100,
        "applicable_classes": "1,2,3"
    },
    {
        "vaccine_name": "Hepatitis",
        "drive_date": datetime(2025, 6, 1),
        "available_doses": 80,
        "applicable_classes": "4,5"
    }
]

# Insert into DB
with app.app_context():
    for drive in sample_drives:
        existing = VaccinationDrive.query.filter_by(
            vaccine_name=drive["vaccine_name"],
            drive_date=drive["drive_date"]
        ).first()
        if not existing:
            new_drive = VaccinationDrive(**drive)
            db.session.add(new_drive)

    db.session.commit()
    print("✅ Sample vaccination drives inserted.")
