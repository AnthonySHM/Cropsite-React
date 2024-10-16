import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import AdminEditPage from './pages/AdminEditPage';
import AdminCommentsPage from './pages/AdminCommentsPage';
import AdminCreatePage from './pages/AdminCreatePage';
import CropDetailPage from './pages/CropDetailPage';
import HomePage from './pages/HomePage'; // Added import for HomePage
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} /> {/* Added route for HomePage */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/edit/:id" element={<AdminEditPage />} />
            <Route path="/admin/comments" element={<AdminCommentsPage />} />
            <Route path="/admin/create" element={<AdminCreatePage />} />
            <Route path="/crops/:id" element={<CropDetailPage />} />
            {/* Add more routes as needed */}
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
