import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Comment from '../components/Comment'; // Ensure you have a Comment component

function CropDetailPage() {
  const { id } = useParams();
  const [crop, setCrop] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchCrop() {
      try {
        const response = await axios.get(`/api/crops/${id}`);
        setCrop(response.data);
      } catch (err) {
        setError('Failed to load crop details. Please try again later.');
      }
    }
    fetchCrop();
  }, [id]);

  function getYoutubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  return (
    <div className="container mt-5 pt-4">
      {crop ? (
        <>
          <h1 className="mb-4">{crop.name}</h1>
          <ul className="nav nav-tabs mb-3">
            {['overview', 'planting', 'care', 'harvest', 'economics'].map(tab => (
              <li className="nav-item" key={tab}>
                <button className={`nav-link ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>

          <div className="row">
            <div className="col-md-8">
              <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {crop.images[activeTab] && crop.images[activeTab].length > 0 ? (
                    crop.images[activeTab].map((image, index) => (
                      <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                        <img src={image.url} className="d-block w-100" alt={image.caption} />
                      </div>
                    ))
                  ) : (
                    <div className="carousel-item active">
                      <img src={crop.image} className="d-block w-100" alt={crop.name} />
                    </div>
                  )}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
              <p>{crop[activeTab]}</p>
            </div>

            <div className="col-md-4">
              <h3>Videos</h3>
              {crop.videos && crop.videos[activeTab] && crop.videos[activeTab].length > 0 ? (
                crop.videos[activeTab].map((video, index) => (
                  <div key={index} className="mb-4">
                    <div className="ratio ratio-16x9">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYoutubeId(video.url)}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <h4 className="mt-2">{video.title}</h4>
                    {video.description && <p>{video.description}</p>}
                  </div>
                ))
              ) : (
                <p>No videos available for this section.</p>
              )}
            </div>
          </div>

          <Comment cropId={crop._id} tab={activeTab} />
        </>
      ) : (
        error ? <div className="alert alert-danger">{error}</div> : <p>Loading...</p>
      )}
    </div>
  );
}

export default CropDetailPage;