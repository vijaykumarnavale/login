// components/Dashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('home');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token on logout
    navigate('/login'); // Redirect to login page
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    // You can also use navigate to redirect to different routes if needed
    navigate(`/${menu}`);
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li
            className={selectedMenu === 'home' ? 'active' : ''}
            onClick={() => handleMenuClick('home')}
          >
            Home
          </li>
          <li
            className={selectedMenu === 'profile' ? 'active' : ''}
            onClick={() => handleMenuClick('profile')}
          >
            Profile
          </li>
          <li
            className={selectedMenu === 'settings' ? 'active' : ''}
            onClick={() => handleMenuClick('settings')}
          >
            Settings
          </li>
          <li
            className={selectedMenu === 'logout' ? 'active' : ''}
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </div>
      <div className="content">
        {selectedMenu === 'home' && <h3>Welcome to the Home Page!</h3>}
        {selectedMenu === 'profile' && <h3>Profile Page</h3>}
        {selectedMenu === 'settings' && <h3>Settings Page</h3>}
        {selectedMenu === 'logout' && <h3>Logout</h3>}
      </div>
    </div>
  );
};

export default Dashboard;
