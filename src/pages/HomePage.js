import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function HomePage() {
  const [featuredCrops, setFeaturedCrops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState('0');
  const [error, setError] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  async function fetchCrops(search = '', rating = '0') {
    try {
      const response = await axios.get(`/api/crops?search=${encodeURIComponent(search)}&minRating=${rating}`);
      setFeaturedCrops(response.data);
    } catch (err) {
      console.error('Error fetching crops:', err);
      setError('Failed to load crops.');
    }
  }

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const suggestions = featuredCrops
        .filter(crop => crop.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(crop => crop.name);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, featuredCrops]);

  function handleSearch() {
    fetchCrops(searchQuery, minRating);
  }

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }

  function selectSuggestion(suggestion) {
    setSearchQuery(suggestion);
    handleSearch();
  }

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeydown}
            />
            <select
              className="form-select"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              <option value="0">All Ratings</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5</option>
            </select>
            <button className="btn btn-primary" onClick={handleSearch}>Search</button>
          </div>
          {searchSuggestions.length > 0 && (
            <ul className="list-group mt-2">
              {searchSuggestions.map((suggestion, index) => (
                <li key={index} className="list-group-item" onClick={() => selectSuggestion(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Featured Crops</h2>
      <div className="row">
        {featuredCrops.map(crop => (
          <div className="col-md-4 mb-4" key={crop._id}>
            <div className="card">
              <img src={crop.image} className="card-img-top" alt={crop.name} />
              <div className="card-body">
                <h5 className="card-title">{crop.name}</h5>
                <p className="card-text">Rating: {crop.rating || 'N/A'}</p>
                <Link to={`/crops/${crop._id}`} className="btn btn-primary">View Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;