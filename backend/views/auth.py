from flask import Blueprint,jsonify,request
from models import db,User,Tokenlocklist
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt, jwt_required, get_jwt_identity
from datetime import datetime, timezone

auth_bp = Blueprint('auth_bp', __name__)


@auth_bp.route("/login" , methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']


    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)

        return jsonify({"access_token": access_token}),200

    else:
        return jsonify({"error": "user doesn't exist/Invalid email or password"}), 401
    
@auth_bp.route("/current_user" )
@jwt_required()
def current_user():
    current_user_id = get_jwt_identity()

    user = User.query.filter_by(id=current_user_id).first()
    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        
    }
    return jsonify(user_data),200

@auth_bp.route("/logout" , methods=['DELETE'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(Tokenlocklist(jti=jti, created_at=now))
    db.session.commit()
    return jsonify({"message": "Successfully logged out"}),200


    

