import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import io from 'socket.io-client';
// import './ShareModal.css';

const socket = io('http://localhost:5000'); // Replace with your actual server URL

const ShareModal = ({ show, onClose, noteId, sharedUsers, onShare }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(sharedUsers);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Expected JSON response from server');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users', error);
        // You can display an error message to the user here
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    setSelectedUsers(sharedUsers);
  }, [sharedUsers]);

  const handleCheckboxChange = (user) => {
    const isSelected = selectedUsers.some((selectedUser) => selectedUser.id === user.id);
    setSelectedUsers(isSelected
      ? selectedUsers.filter((selectedUser) => selectedUser.id !== user.id)
      : [...selectedUsers, user]);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    onShare(selectedUsers);
    socket.emit('share-note', { noteId, sharedUsers: selectedUsers });
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered className="share-modal">
      <Modal.Header closeButton>
        <Modal.Title>Share Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-user-input"
        />
        <ul className="user-list">
          {filteredUsers.map((user) => (
            <li key={user.id} className="user-item">
              <Form.Check
                type="checkbox"
                label={user.name}
                checked={selectedUsers.some((selectedUser) => selectedUser.id === user.id)}
                onChange={() => handleCheckboxChange(user)}
              />
            </li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareModal;
