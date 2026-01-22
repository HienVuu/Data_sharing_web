import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import UploadPage from './pages/UploadPage';
import ContactPage from './pages/ContactPage';
import AdPopup from './components/AdPopup';
import './App.css';

function AppContent() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    alert('Bạn đã đăng xuất thành công.');
    navigate('/login');
    window.location.reload(); 
  };

  return (
    <>
      <AdPopup /> 
      <nav className="navbar">
        <div className="nav-logo">DOCIFY</div>
        <div className="nav-menu">
          <Link to="/" className="nav-link">Trang chủ</Link>
          <Link to="/upload" className="nav-link">Tải tài liệu</Link>
          <Link to="/contact" className="nav-link">Liên hệ</Link>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '14px', color: '#4B5563' }}>
                <strong> Xin Chào</strong>, <strong>{user.username}</strong>

              </span>
              <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#456df2' }}>
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-link">Đăng nhập</Link>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-link nav-link-admin">Quản trị</Link>
          )}
        </div>
      </nav>

      <div style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/document/:id" element={<DetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>

      <footer className="footer">
        <p>© 2026 Hệ thống chia sẻ tài liệu - Docify</p>
      </footer>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;