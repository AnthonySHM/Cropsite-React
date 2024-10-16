import React, { useState, useEffect } from 'react';
import HomeButton from './HomeButton'; // Create a HomeButton component
import 'bootstrap/dist/css/bootstrap.min.css';

function Layout({ children }) {
  const [bootstrapLoaded, setBootstrapLoaded] = useState(false);

  useEffect(() => {
    async function loadBootstrap() {
      const bootstrap = await import('bootstrap');
      await bootstrap.Carousel.getOrCreateInstance(document.body);
      setBootstrapLoaded(true);
    }
    loadBootstrap();
  }, []);

  function handleLogout() {
    // Implement auth.clearToken() logic
  }

  return (
    <>
      {bootstrapLoaded ? (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <div className="d-flex align-items-center">
              <HomeButton />
              {/* Add logic to check if user is admin */}
              <a className="btn btn-outline-primary ms-2" href="/admin">Admin Panel</a>
            </div>
            <div className="navbar-nav ms-auto">
              {/* Add logic to check if user is logged in */}
              <button className="btn btn-outline-primary" onClick={handleLogout}>Logout</button>
              <a className="nav-item nav-link" href="/login">Login</a>
              <a className="nav-item nav-link" href="/register">Register</a>
            </div>
          </div>
        </nav>
      ) : (
        <div>Loading...</div>
      )}
      <main>{children}</main>
    </>
  );
}

export default Layout;