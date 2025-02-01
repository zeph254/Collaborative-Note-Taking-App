import React, { createContext, useState, useEffect } from 'react';

const NoteContext = createContext();

const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = 'http://localhost:5000/notes'; // Replace with your actual API endpoint

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        // Fetch the token from sessionStorage first, fallback to localStorage
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        if (!token) {
          throw new Error("Token is missing. Please log in.");
        }

        const response = await fetch(BASE_URL, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError('Failed to fetch notes. Please log in and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [BASE_URL]);

  const createNote = async (newNote) => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      if (!token) {
        throw new Error("Token is missing.");
      }

      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) {
        throw new Error('Failed to create note.');
      }

      const createdNote = await response.json();
      setNotes((prevNotes) => [...prevNotes, createdNote]);
    } catch (error) {
      console.error('Error creating note:', error);
      setError('Failed to create note. Please try again later.');
    }
  };

  const updateNote = async (updatedNote) => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      if (!token) {
        throw new Error("Token is missing.");
      }

      const response = await fetch(`${BASE_URL}/${updatedNote.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) {
        throw new Error('Failed to update note.');
      }

      const updated = await response.json();
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === updated.id ? updated : note))
      );
    } catch (error) {
      console.error('Error updating note:', error);
      setError('Failed to update note. Please try again later.');
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      if (!token) {
        throw new Error("Token is missing.");
      }

      const response = await fetch(`${BASE_URL}/${noteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete note.');
      }

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      setError('Failed to delete note. Please try again later.');
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        loading,
        error,
        createNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export { NoteProvider, NoteContext };