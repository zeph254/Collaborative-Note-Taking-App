from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, db
from models import Note

user_bp = Blueprint('user_bp', __name__)

@user_bp.route("/users", methods=['GET'])
@jwt_required()
def get_users():
    try:
        users = User.query.all()
        user_list = [{"id": user.id, "username": user.username, "email": user.email} for user in users]
        return jsonify(user_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route("/users/<int:userId>", methods=['GET'])
@jwt_required()
def get_user(user_id):
    """Fetch details of a specific user by ID."""
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email
    }), 200

@user_bp.route("/users/me", methods=['GET'])
@jwt_required()
def get_current_user():
    """Fetch details of the authenticated user."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email
    }), 200

@user_bp.route("/users", methods=['POST'])
def register_user():
    """Register a new user."""
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error": "All fields (username, email, password) are required"}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Check for existing username or email
    check_username = User.query.filter_by(username=username).first()
    check_email = User.query.filter_by(email=email).first()

    if check_username or check_email:
        return jsonify({"error": "Username or email already exists"}), 400

    # Create a new user
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": "User registered successfully"}), 201

@user_bp.route("/users", methods=['PATCH'])
@jwt_required()
def update_user():
    """Update the current authenticated user's details."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    username = data.get('username', user.username)
    email = data.get('email', user.email)
    password = data.get('password')

    # Hash the new password if provided
    hashed_password = generate_password_hash(password) if password else user.password

    # Check for conflicts with other users
    check_username = User.query.filter(User.username == username, User.id != user.id).first()
    check_email = User.query.filter(User.email == email, User.id != user.id).first()

    if check_username or check_email:
        return jsonify({"error": "Username or email already exists"}), 400

    # Update user information
    user.username = username
    user.email = email
    user.password = hashed_password
    db.session.commit()

    return jsonify({"success": "User updated successfully"}), 200

@user_bp.route("/users/<int:user_id>", methods=['DELETE'])
@jwt_required()
def delete_specific_user(user_id):
    """Delete a user by ID (Only self-deletion allowed)."""
    current_user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Allow user to delete their own account only
    if current_user_id != user.id:
        return jsonify({"error": "Unauthorized action"}), 403

    # Reassign notes created by the user to another user (e.g., admin)
    admin_user = User.query.filter_by(role='admin').first()
    if admin_user:
        Note.query.filter_by(created_by=user.id).update({"created_by": admin_user.id})

    # Delete the user
    db.session.delete(user)
    db.session.commit()

    return jsonify({"success": "User deleted successfully"}), 200