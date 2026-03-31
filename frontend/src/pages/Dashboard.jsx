import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, logoutUser } from '../utils/auth';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DataCards from '../components/DataCards';
import StudentChart from '../components/StudentChart';
import ProfileModal from '../components/ProfileModal';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

  return (
    <div className="admin-dashboard">
      <Header
        userEmail={userInfo?.email}
        onProfileClick={handleProfileClick}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="dashboard-wrapper">
        <Sidebar
          isOpen={isSidebarOpen}
          selectedMenuItem={selectedMenuItem}
          onMenuSelect={setSelectedMenuItem}
        />

        <main className="dashboard-main">
          {selectedMenuItem === 'dashboard' && (
            <div className="dashboard-content">
              <div className="content-header">
                <h1>Dashboard</h1>
                <div className="search-bar">
                  <input type="text" placeholder="Search..." />
                  <button>🔍</button>
                </div>
              </div>

              <DataCards />

              <div className="dashboard-grid">
                <div className="chart-container">
                  <StudentChart />
                </div>
              </div>
            </div>
          )}

          {selectedMenuItem === 'employees' && (
            <div className="content-section">
              <h1>Employees Management</h1>
              <p>Employee management section - Coming soon</p>
            </div>
          )}

          {selectedMenuItem === 'students' && (
            <div className="content-section">
              <h1>Students Management</h1>
              <p>Student management section - Coming soon</p>
            </div>
          )}

          {selectedMenuItem === 'clients' && (
            <div className="content-section">
              <h1>Clients Management</h1>
              <p>Client management section - Coming soon</p>
            </div>
          )}

          {selectedMenuItem === 'invoices' && (
            <div className="content-section">
              <h1>Invoices Management</h1>
              <p>Invoice management section - Coming soon</p>
            </div>
          )}

          {selectedMenuItem === 'reports' && (
            <div className="content-section">
              <h1>Reports</h1>
              <p>Reports section - Coming soon</p>
            </div>
          )}

          {selectedMenuItem === 'settings' && (
            <div className="content-section">
              <h1>Settings</h1>
              <p>Settings section - Coming soon</p>
            </div>
          )}
        </main>
      </div>

      {showProfileModal && (
        <ProfileModal userInfo={userInfo} onClose={handleCloseProfileModal} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Dashboard;
