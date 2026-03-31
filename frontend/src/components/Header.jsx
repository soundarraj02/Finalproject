import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ userEmail, onProfileClick, onToggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="toggle-sidebar-btn" onClick={onToggleSidebar} title="Toggle Sidebar">
          ☰
        </button>
        <div className="logo" onClick={() => navigate('/dashboard')} role="button" tabIndex={0}>
          <h2>📊 Admin Portal</h2>
        </div>
      </div>

      <div className="header-right">
        <div className="profile-section">
          <button className="profile-btn" onClick={onProfileClick} title="Click to edit profile">
            <span className="profile-avatar">👤</span>
            <span className="profile-email">{userEmail?.substring(0, 20) || 'Admin'}</span>
            <span className="dropdown-arrow">▼</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
