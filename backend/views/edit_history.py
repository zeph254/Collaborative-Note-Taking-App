from flask import Blueprint, jsonify, request
from models import EditHistory, User, Note, db

edit_history_bp = Blueprint('edit_history_bp', __name__)

@edit_history_bp.route("/edit_history", methods=['GET'])
def get_edit_history():
    """
    Fetch and return all edit history records from the database.
    """
    edit_history_records = EditHistory.query.all()

    if not edit_history_records:
        return jsonify({"message": "No edit history found"}), 404

    history_list = []
    for record in edit_history_records:
        note = Note.query.get(record.note_id)
        user = User.query.get(record.edited_by)

        history_list.append({
            "id": record.id,
            "note_id": record.note_id,
            "note_title": note.title if note else None,
            "edited_by": record.edited_by,
            "editor_username": user.username if user else None,
            "edit_time": record.edit_time.strftime("%Y-%m-%d %H:%M:%S"),
        })

    return jsonify({"edit_history": history_list}), 200

@edit_history_bp.route("/edit_history/<int:note_id>", methods=['GET'])
def get_edit_history_for_note(note_id):
    """
    Fetch and return the edit history for a specific note.
    """
    edit_history_records = EditHistory.query.filter_by(note_id=note_id).all()

    if not edit_history_records:
        return jsonify({"message": "No edit history found for this note"}), 404

    history_list = []
    for record in edit_history_records:
        user = User.query.get(record.edited_by)

        history_list.append({
            "id": record.id,
            "edited_by": record.edited_by,
            "editor_username": user.username if user else None,
            "edit_time": record.edit_time.strftime("%Y-%m-%d %H:%M:%S"),
        })

    return jsonify({"edit_history": history_list}), 200

