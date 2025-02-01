import React, { useContext, useState } from 'react';
import { NoteContext } from '../context/NoteContext';

export default function CreateNote() {
  const { createNote } = useContext(NoteContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if the fields are filled
    if (!title || !content || !createdBy) {
      setError('All fields are required');
      return;
    }

    // Ensure createdBy is a valid number
    if (isNaN(createdBy) || createdBy.trim() === '') {
      setError('Created By must be a valid user ID');
      return;
    }

    const newNote = { title, content, created_by: Number(createdBy) }; // Ensure createdBy is a number
    
    try {
      await createNote(newNote);
      setTitle('');
      setContent('');
      setCreatedBy('');
      setError(null);
    } catch (err) {
      setError('Failed to create note');
    }
  };

  return (
    <div>
      {/* Button trigger modal */}
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Create Note
      </button>

      {/* Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Create Note
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Note"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Created By"
                    value={createdBy}
                    onChange={(e) => setCreatedBy(e.target.value)}
                    required
                  />
                </div>
                {error && <div className="text-danger mb-3">{error}</div>}
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
