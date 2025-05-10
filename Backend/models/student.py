from db import db

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    student_id = db.Column(db.String(20), unique=True, nullable=False)
    grade = db.Column(db.String(10), nullable=False)
    is_vaccinated = db.Column(db.Boolean, default=False)
    #vaccine_name = db.Column(db.String(100), nullable=True)
    #vaccination_date = db.Column(db.String(20), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "student_id": self.student_id,
            "grade": self.grade,
            "is_vaccinated": self.is_vaccinated
            #"vaccine_name": self.vaccine_name,
            #"vaccination_date": self.vaccination_date
        }
