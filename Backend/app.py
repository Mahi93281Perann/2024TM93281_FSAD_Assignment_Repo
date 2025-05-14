from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from db import db
from datetime import datetime
from models.student import Student
from models.vaccination_drive import VaccinationDrive
from routes.report_routes import report_bp

# Import Blueprints
from routes.auth import auth_bp
from routes.drive_routes import drive_bp
from routes.student_routes import student_bp
from routes.vaccination_routes import vaccination_bp

app = Flask(__name__)

# Config
app.config['SECRET_KEY'] = 'secret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///vaccine.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
CORS(app, resources={r"/*": {"origins": "*"}})

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(student_bp, url_prefix='/students')
app.register_blueprint(drive_bp, url_prefix='/drives')
app.register_blueprint(vaccination_bp, url_prefix='/vaccination')
app.register_blueprint(report_bp)

# Routes
@app.route('/')
def home():
    return "Backend is up and running!"

@app.route('/drives/active', methods=['GET'])
def get_active_drives():
    today = datetime.today().date()
    active_drives = VaccinationDrive.query.filter(VaccinationDrive.drive_date >= today).all()
    return jsonify([d.to_dict() for d in active_drives])

if __name__ == '__main__':
    app.run(debug=True)
