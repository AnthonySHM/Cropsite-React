import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminEditPage() {
  const { id } = useParams();
  const [crop, setCrop] = useState({
    _id: '',
    name: '',
    image: '',
    rating: 0,
    overview: '',
    planting: '',
    care: '',
    harvest: '',
    economics: '',
    videos: { overview: [], planting: [], care: [], harvest: [], economics: [] },
    images: { overview: [], planting: [], care: [], harvest: [], economics: [] }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bootstrapLoaded, setBootstrapLoaded] = useState(false);
  const navigate = useNavigate();
  const bootstrapRef = useRef(null);

  useEffect(() => {
    async function fetchCrop() {
      try {
        const response = await axios.get(`/api/admin/crops/${id}`);
        setCrop(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load crop');
        setLoading(false);
      }
    }
    fetchCrop();
  }, [id]);

  useEffect(() => {
    async function loadBootstrap() {
      bootstrapRef.current = await import('bootstrap');
      setBootstrapLoaded(true);
    }
    loadBootstrap();
  }, []);

  async function saveCrop() {
    try {
      const response = await axios.put(`/api/admin/crops/${crop._id}`, crop);
      console.log('Updated crop data:', response.data);
      navigate('/admin');
    } catch (err) {
      setError('Failed to update crop');
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCrop({ ...crop, [name]: value });
  };

  const handleMediaChange = (section, type, media) => {
    if (type === 'video') {
      setCrop({ ...crop, videos: { ...crop.videos, [section]: [...crop.videos[section], media] } });
    } else {
      setCrop({ ...crop, images: { ...crop.images, [section]: [...crop.images[section], media] } });
    }
  };

  const handleMediaDelete = (section, type, index) => {
    if (type === 'video') {
      setCrop({ ...crop, videos: { ...crop.videos, [section]: crop.videos[section].filter((_, i) => i !== index) } });
    } else {
      setCrop({ ...crop, images: { ...crop.images, [section]: crop.images[section].filter((_, i) => i !== index) } });
    }
  };

  const sections = ['overview', 'planting', 'care', 'harvest', 'economics'];

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Edit Crop</h2>
      <form onSubmit={(e) => { e.preventDefault(); saveCrop(); }}>
        <div className="row">
          <div className="col-md-6">
            <h2>Text Content</h2>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={crop.name}
                onChange={handleInputChange}
                required
              />
            </div>
            {sections.map((section) => (
              <div key={section} className="mb-3">
                <label htmlFor={section} className="form-label">{section.charAt(0).toUpperCase() + section.slice(1)}</label>
                <textarea
                  className="form-control"
                  id={section}
                  name={section}
                  value={crop[section]}
                  onChange={handleInputChange}
                  rows={5}
                />
              </div>
            ))}
          </div>
          <div className="col-md-6">
            <h2>Media</h2>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Main Image URL</label>
              <input
                type="text"
                className="form-control"
                id="image"
                name="image"
                value={crop.image}
                onChange={handleInputChange}
              />
            </div>
            {sections.map((section) => (
              <div key={section} className="mb-4">
                <h4>{section.charAt(0).toUpperCase() + section.slice(1)} Media</h4>
                <div className="mb-3">
                  <h5>Videos</h5>
                  {crop.videos[section].map((video, index) => (
                    <div key={index} className="card mb-2">
                      <div className="card-body">
                        <h6>{video.title}</h6>
                        <a href={video.url} target="_blank" rel="noopener noreferrer">{video.url}</a>
                        <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => handleMediaDelete(section, 'video', index)}>Delete</button>
                      </div>
                    </div>
                  ))}
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleMediaChange(section, 'video', { title: 'New Video', url: 'http://example.com' })}>Add Video</button>
                </div>
                <div className="mb-3">
                  <h5>Images</h5>
                  {crop.images[section].map((image, index) => (
                    <div key={index} className="card mb-2">
                      <div className="card-body">
                        <img src={image.url} alt={image.caption} className="img-thumbnail mb-2" style={{ maxHeight: '100px' }} />
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleMediaDelete(section, 'image', index)}>Delete</button>
                      </div>
                    </div>
                  ))}
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleMediaChange(section, 'image', { url: 'http://example.com/image.jpg', caption: 'New Image' })}>Add Image</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}

export default AdminEditPage;