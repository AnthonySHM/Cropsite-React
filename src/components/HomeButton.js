import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomeButton() {
  const navigate = useNavigate();

  return (
    <button className="btn btn-primary" onClick={() => navigate('/')}>
      Home
    </button>
  );
}

export default HomeButton;