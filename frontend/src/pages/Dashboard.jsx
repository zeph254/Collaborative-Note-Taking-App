import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { NoteContext } from '../context/NoteContext';
import { Button } from 'react-bootstrap';

const Dashboard = () => {
  const { notes, loading } = useContext(NoteContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading notes...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Notes</h1>
        <div className="search-and-create">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Link to="/create" className="create-note-button">
            Create Note
          </Link>
        </div>
      </div>

      <div className="notes-grid">
        {filteredNotes.length === 0 ? (
          <div className="no-notes">No notes found. Create one!</div>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className="note-card">
              <Link to={`/notes/${note.id}`} className="note-link">
                <div className="note-content">
                  <h3>{note.title}</h3>
                  <p className="note-preview">
                    {note.content.substring(0, 100)}...
                  </p>
                </div>
              </Link>
              <div className="note-footer">
                {note.shared_with && note.shared_with.length > 0 ? (
                  <div className="shared-with">
                    Shared with {note.shared_with.length} user(s)
                  </div>
                ) : (
                  <div className="private-note">Private</div>
                )}
                <Button
                  variant="success"
                  size="sm"
                  as={Link}
                  to={`/notes/${note.id}/share`}
                >
                  Share
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;