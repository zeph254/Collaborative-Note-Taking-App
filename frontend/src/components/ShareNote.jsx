import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NoteContext } from '../context/NoteContext';
import { UserContext } from '../context/UserContext';
import { Alert, Button, Form, Container, Spinner } from 'react-bootstrap';
import axios from 'axios';

const ShareNote = () => {
  const { id } = useParams(); // Get the note ID from the URL
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const { notes } = useContext(NoteContext);
  const [users, setUsers] = useState([]); // List of all users
  const [selectedUsers, setSelectedUsers] = useState([]); // Users to share the note with
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the note data
  const note = notes.find((note) => note.id === parseInt(id));

  // Fetch all users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        if (!token) {
          throw new Error("Token is missing.");
        }

        const response = await axios.get('http://127.0.0.1:5000/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data);
      } catch (error) {
        setError('Failed to fetch users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle sharing the note
  const handleShareNote = async (e) => {
    e.preventDefault();

    if (selectedUsers.length === 0) {
      setError('Please select at least one user to share the note with.');
      return;
    }

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      if (!token) {
        throw new Error("Token is missing.");
      }

      const response = await axios.post(
        `http://127.0.0.1:5000/notes/${id}/share`,
        { user_ids: selectedUsers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Failed to share the note. Please try again later.');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!note) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">Note not found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1>Share Note: {note.title}</h1>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleShareNote}>
        <Form.Group className="mb-3">
          <Form.Label>Select Users to Share With</Form.Label>
          <Form.Control
            as="select"
            multiple
            value={selectedUsers}
            onChange={(e) =>
              setSelectedUsers(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            required
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.email})
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
          Share Note
        </Button>
      </Form>
    </Container>
  );
};

export default ShareNote;