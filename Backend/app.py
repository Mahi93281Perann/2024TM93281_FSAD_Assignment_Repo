from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from routes.auth import auth_bp  # Import your auth blueprint
from routes.drive_routes import drive_bp
from db import db
from routes.student_routes import student_bp
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"]}})

drives = [
    {"id": 1, "vaccine_name": "Polio", "date": "2025-05-15"},
    {"id": 2, "vaccine_name": "Hepatitis", "date": "2025-06-01"},
]

app.config['SECRET_KEY'] = 'secret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///vaccine.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

from models.student import Student
from models.vaccination_drive import VaccinationDrive
from routes.vaccination_routes import vaccination_bp

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(student_bp, url_prefix='/students')
app.register_blueprint(drive_bp, url_prefix='/drives')
app.register_blueprint(vaccination_bp, url_prefix='/vaccination')

@app.route('/drives/active', methods=['GET'])
def get_active_drives():
    today = datetime.today().date()
    active = [d for d in drives if datetime.strptime(d["date"], "%Y-%m-%d").date() >= today]
    return jsonify(active)

@app.route('/students', methods=['OPTIONS'])
def handle_options():
    # Return a successful response for OPTIONS request (pre-flight)
    return '', 200  # 200 OK for OPTIONS request
    
@app.route('/')
def home():
    return "Backend is up and running!"

# with app.app_context():
#        db.create_all()  # Create tables on first run

if __name__ == '__main__':
    app.run(debug=True)