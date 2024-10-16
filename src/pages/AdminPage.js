import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('crops');
  const [crops, setCrops] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'crops') {
      loadCrops();
    } else if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  async function loadCrops() {
    try {
      const response = await axios.get('/api/admin/crops');
      setCrops(response.data);
    } catch (err) {
      setError('Failed to load crops');
    }
  }

  async function loadUsers() {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users');
    }
  }

  function editCrop(crop) {
    navigate(`/admin/edit/${crop._id}`);
  }

  async function deleteCrop(cropId) {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await axios.delete(`/api/admin/crops/${cropId}`);
        loadCrops();
      } catch (err) {
        setError('Failed to delete crop');
      }
    }
  }

  async function deleteUser(userId) {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/admin/users/${userId}`);
        loadUsers();
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  }

  return (
    <div className="container-fluid mt-5">
      <h1>Admin Dashboard</h1>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'crops' ? 'active' : ''}`} onClick={() => setActiveTab('crops')}>
            Manage Crops
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            Manage Users
          </button>
        </li>
      </ul>

      {error && <div className="alert alert-danger">{error}</div>}

      {activeTab === 'crops' && (
        <div>
          <h2>Create New Crop</h2>
          <button className="btn btn-success" onClick={() => navigate('/admin/create')}>Create New Crop</button>
          <h2 className="mt-4">Existing Crops</h2>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search crops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {crops.filter(crop => crop.name.toLowerCase().includes(searchQuery.toLowerCase())).map(crop => (
                <tr key={crop._id}>
                  <td>{crop.name}</td>
                  <td>{crop.rating || 'N/A'}</td>
                  <td>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => editCrop(crop)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteCrop(crop._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2>Manage Users</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteUser(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPage;