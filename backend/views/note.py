from flask import Blueprint, jsonify, request
from models import Note, EditHistory, db
from datetime import datetime
from models import User

note_bp = Blueprint('note_bp', __name__)

@note_bp.route("/notes", methods=['GET'])
def get_notes():
    """
    Get all notes or a specific note by ID.
    If a query parameter 'note_id' is provided, it fetches a specific note.
    Otherwise, it fetches all notes.
    """
    note_id = request.args.get('note_id')

    if note_id:
        # Fetch a specific note by ID
        note = Note.query.get(note_id)
        if not note:
            return jsonify({"error": "Note not found"}), 404
        return jsonify({
            "id": note.id,
            "title": note.title,
            "content": note.content,
            "created_by": note.created_by,
        }), 200

    # Fetch all notes
    notes = Note.query.all()
    notes_list = [
        {
            "id": note.id,
            "title": note.title,
            "content": note.content,
            "created_by": note.created_by,
        } for note in notes
    ]
    return jsonify(notes_list), 200


@note_bp.route("/notes", methods=['POST'])
def add_notes():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    created_by = data.get('created_by')

    if not title or not content or not created_by:
        return jsonify({"error": "All fields (title, content, created_by) are required"}), 400

    check_title = Note.query.filter_by(title=title).first()
    if check_title:
        return jsonify({"error": "Note with this title already exists"}), 400

    new_note = Note(title=title, content=content, created_by=created_by)
    db.session.add(new_note)
    db.session.commit()
    return jsonify({"success": "Note created successfully"}), 201

@note_bp.route("/notes/<int:note_id>", methods=['PATCH'])
def update_notes(note_id):
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    edited_by = data.get('edited_by')  # User ID of the editor

    if not edited_by:
        return jsonify({"error": "Field 'edited_by' is required"}), 400

    note = Note.query.get(note_id)

    if not note:
        return jsonify({"error": "Note not found"}), 404

    # Check if the title already exists for another note
    check_title = Note.query.filter_by(title=title).first()
    if check_title and check_title.id != note_id:
        return jsonify({"error": "A note with this title already exists"}), 400

    # Update the note
    note.title = title or note.title
    note.content = content or note.content

    # Log the edit in EditHistory
    edit_entry = EditHistory(
        note_id=note_id,
        edited_by=edited_by,
        edit_time=datetime.utcnow()
    )
    db.session.add(edit_entry)
    db.session.commit()

    return jsonify({"success": "Note updated successfully"}), 200

@note_bp.route("/notes/<int:note_id>", methods=['DELETE'])
def delete_notes(note_id):
    note = Note.query.get(note_id)

    if not note:
        return jsonify({"error": "Note not found"}), 404

    db.session.delete(note)
    db.session.commit()
    return jsonify({"success": "Note deleted successfully"}), 200




@note_bp.route("/notes/<int:note_id>/share", methods=['POST'])
def share_note(note_id):
    data = request.get_json()
    user_ids = data.get('user_ids')  # List of user IDs to share the note with

    if not user_ids:
        return jsonify({"error": "Field 'user_ids' is required"}), 400

    note = Note.query.get(note_id)
    if not note:
        return jsonify({"error": "Note not found"}), 404

    # Add users to the shared_with relationship
    for user_id in user_ids:
        user = User.query.get(user_id)
        if user:
            note.shared_with.append(user)

    db.session.commit()
    return jsonify({"success": "Note shared successfully"}), 200