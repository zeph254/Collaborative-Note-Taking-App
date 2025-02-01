import React, { useState, useEffect } from 'react';
// import ReactDiffViewer from 'react-diff-viewer'; // Ensure this is installed

const EditHistory = ({ show, onClose, noteId }) => {
  const [editHistory, setEditHistory] = useState([]);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEditHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/notes/${noteId}/history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEditHistory(data);
      } catch (error) {
        console.error('Error fetching edit history:', error);
        setError('Failed to fetch edit history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (show) { // Only fetch when the modal is shown
      fetchEditHistory();
    } else {
      // Clear selected edit when modal is closed
      setSelectedEdit(null);
    }
  }, [show, noteId]);

  const handleEditSelect = (edit) => {
    setSelectedEdit(edit);
  };

  return (
    show && (
      <div className="edit-history-modal-overlay">
        <div className="edit-history-modal">
          <div className="modal-header">
            <h2 className="modal-title">Edit History</h2>
            <button className="modal-close-button" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <div className="edit-history-container">
              {loading && <p>Loading edit history...</p>}
              {error && <p className="error-message">{error}</p>}
              
              {!loading && !error && editHistory.length === 0 && (
                <p>No edit history available.</p>
              )}
              
              <ul className="edit-list">
                {editHistory.map((edit) => (
                  <li
                    key={edit.id}
                    onClick={() => handleEditSelect(edit)}
                    className={`edit-item ${selectedEdit?.id === edit.id ? 'selected' : ''}`}
                  >
                    {edit.edited_by.name} - {new Date(edit.edit_time).toLocaleString()}
                  </li>
                ))}
              </ul>

              <div className="diff-viewer">
                {selectedEdit && (
                  <div>
                    {/* Check if previous_content exists to prevent errors on the first edit */}
                    {selectedEdit.previous_content ? (
                      <ReactDiffViewer
                        oldValue={selectedEdit.previous_content}
                        newValue={selectedEdit.note.content}
                        splitView={false} // Use inline diff for better readability in modal
                      />
                    ) : (
                      <p>Initial version of the note.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="modal-close-button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditHistory;
