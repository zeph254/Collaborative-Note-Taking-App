from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from models import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from datetime import timedelta

app = Flask(__name__)

# Enable CORS properly
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")

# Setup Database and JWT Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
migrate = Migrate(app, db)
db.init_app(app)

jwt = JWTManager(app)
app.config['JWT_SECRET_KEY'] = "hfwhschskfhir"
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Register Blueprints
from views import *
app.register_blueprint(auth_bp)
app.register_blueprint(note_bp)
app.register_blueprint(user_bp)
app.register_blueprint(edit_history_bp)

# Run the server
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
