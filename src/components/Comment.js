import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext

function Comment({ cropId, tab }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth(); // Use your authentication context

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`/api/comments/${cropId}/${tab}`);
      setComments(response.data);
    } catch (err) {
      setError('Failed to load comments');
    }
  }, [cropId, tab]);

  useEffect(() => {
    fetchComments();
  }, [cropId, tab, fetchComments]);
  
  async function handleAddComment() {
    if (!user) {
      setError('You need to register or log in to comment.');
      return;
    }

    try {
      const response = await axios.post('/api/comments', { cropId, tab, content: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment');
    }
  }

  return (
    <div>
      <h3>Comments</h3>
      {error && <p className="text-danger">{error}</p>}
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>{comment.content}</li>
        ))}
      </ul>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
      />
      <button onClick={handleAddComment}>Add Comment</button>
    </div>
  );
}

export default Comment;
