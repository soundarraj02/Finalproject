import { useState } from 'react';
import { FaBars, FaEnvelope, FaExpand, FaSearch } from './AdminIcons';
import './dashboard.css';

export default function Topbar({
  avatar = 'A',
  onToggleSidebar,
  onSearch,
  onOpenNotifications,
  onProfile,
  onLogout,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter' && onSearch) {
      onSearch(query);
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      return;
    }

    await document.exitFullscreen();
  };

  return (
    <div className="topbar">
      <button type="button" className="icon-button" onClick={onToggleSidebar} title="Toggle sidebar">
        <FaBars />
      </button>

      <div className="search-box">
        <FaSearch />
        <input
          placeholder="Search..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
      </div>

      <div className="top-icons">
        <button type="button" className="icon-button" onClick={onOpenNotifications} title="Notifications">
          <FaEnvelope />
        </button>
        <button type="button" className="icon-button" onClick={toggleFullscreen} title="Toggle fullscreen">
          <FaExpand />
        </button>

        <div className="profile" onClick={() => setOpen(!open)}>
          {avatar}

          {open && (
            <div className="dropdown">
              <p onClick={onProfile}>Profile</p>
              <p onClick={onLogout}>Logout</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
