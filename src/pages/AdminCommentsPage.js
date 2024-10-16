import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminCommentsPage() {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadComments() {
      try {
        const response = await axios.get('/api/admin/comments');
        setComments(response.data);
      } catch (err) {
        setError('Failed to load comments');
      }
    }
    loadComments();
  }, []);

  async function deleteComment(commentId) {
    try {
      await axios.delete(`/api/admin/comments/${commentId}`);
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (err) {
      setError('Failed to delete comment');
    }
  }

  return (
    <div className="container-fluid mt-5">
      <h1>Admin Dashboard</h1>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className="nav-link" onClick={() => navigate('/admin?tab=crops')}>Manage Crops</button>
        </li>
        <li className="nav-item">
          <button className="nav-link active">Manage Comments</button>
        </li>
        <li className="nav-item">
          <button className="nav-link" onClick={() => navigate('/admin?tab=users')}>Manage Users</button>
        </li>
      </ul>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>Crop</th>
            <th>Section</th>
            <th>User</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map(comment => (
            <tr key={comment._id}>
              <td>{comment.cropName || 'Unknown Crop'}</td>
              <td>{comment.section || 'Unknown Section'}</td>
              <td>{comment.userName || 'Unknown User'}</td>
              <td>{comment.text}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => deleteComment(comment._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCommentsPage;