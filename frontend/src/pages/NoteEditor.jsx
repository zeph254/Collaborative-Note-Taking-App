import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NoteContext } from '../context/NoteContext';
import { UserContext } from '../context/UserContext';
import { Alert, Button, Form, Container } from 'react-bootstrap';

const NoteEditor = () => {
  const { id } = useParams(); // Get the note ID from the URL
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const { notes, createNote, updateNote, deleteNote } = useContext(NoteContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  // Fetch the note data if editing an existing note
  useEffect(() => {
    if (id) {
      const noteToEdit = notes.find((note) => note.id === parseInt(id));
      if (noteToEdit) {
        setTitle(noteToEdit.title);
        setContent(noteToEdit.content);
        setIsEditing(true);
      } else {
        setAlert({ show: true, message: 'Note not found', variant: 'danger' });
        navigate('/dashboard');
      }
    }
  }, [id, notes, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setAlert({ show: true, message: 'Title and content are required', variant: 'danger' });
      return;
    }

    const noteData = {
      title,
      content,
      created_by: currentUser.id,
    };

    try {
      if (isEditing) {
        // Include the 'edited_by' field when updating a note
        await updateNote({ id: parseInt(id), ...noteData, edited_by: currentUser.id });
        setAlert({ show: true, message: 'Note updated successfully', variant: 'success' });
      } else {
        await createNote(noteData);
        setAlert({ show: true, message: 'Note created successfully', variant: 'success' });
      }
      setTimeout(() => navigate('/dashboard'), 1500); // Redirect after 1.5 seconds
    } catch (error) {
      setAlert({ show: true, message: 'Failed to save note. Please try again.', variant: 'danger' });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(parseInt(id));
        setAlert({ show: true, message: 'Note deleted successfully', variant: 'success' });
        setTimeout(() => navigate('/dashboard'), 1500); // Redirect after 1.5 seconds
      } catch (error) {
        setAlert({ show: true, message: 'Failed to delete note. Please try again.', variant: 'danger' });
      }
    }
  };

  return (
    <Container className="mt-4">
      <h1>{isEditing ? 'Edit Note' : 'Create Note'}</h1>

      {/* Alert for success/error messages */}
      {alert.show && (
        <Alert
          variant={alert.variant}
          onClose={() => setAlert({ ...alert, show: false })}
          dismissible
        >
          {alert.message}
        </Alert>
      )}

      <Form onSubmit={handleSave}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            placeholder="Enter note content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="primary" type="submit">
            {isEditing ? 'Update Note' : 'Create Note'}
          </Button>
          {isEditing && (
            <Button variant="danger" onClick={handleDelete}>
              Delete Note
            </Button>
          )}
        </div>
      </Form>
    </Container>
  );
};

export default NoteEditor;