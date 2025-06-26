import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import { VendorList } from './components/VendorList.jsx';
import { VendorForm } from './components/VendorForm.jsx';
import { GoogleAuth } from './components/GoogleAuth';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    const token = localStorage.getItem('google_token');
    const userData = localStorage.getItem('google_user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

 
  if (!user) {
    return <GoogleAuth onLogin={setUser} />;
  }


  const handleLogout = () => {
    localStorage.removeItem('google_token');
    localStorage.removeItem('google_user');
    setUser(null);
    navigate('/');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ marginBottom: '20px' }}>
        {location.pathname !== '/add' && (
          <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', color: 'blue' }}>
            Vendor List
          </Link>
        )}

        <span style={{ float: 'right' }}>
          Welcome, {user.name || user.email}
          <button
            onClick={handleLogout}
            style={{
              marginLeft: 16,
              padding: '6px 12px',
              background: '#4285F4',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
            Logout
          </button>
        </span>
      </nav>
      <Routes>
        <Route path="/" element={<VendorList />} />
        <Route path="/add" element={<VendorForm />} />
        <Route path="/edit/:id" element={<VendorForm />} />
      </Routes>
    </div>
  );
}

export default App;
