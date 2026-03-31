import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarComponent from './CalendarComponent';
import './Sidebar.css';

const Sidebar = ({ isOpen, selectedMenuItem, onMenuSelect }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'employees', label: 'Employees', icon: '👥', path: '/employee-info' },
    { id: 'students', label: 'Students', icon: '📚', path: '/student-info' },
    { id: 'attendance', label: 'Attendance', icon: '🕒', path: '/attendance' },
    { id: 'lead', label: 'Leads', icon: '📌', path: '/lead' },
    { id: 'receipt', label: 'Receipt', icon: '💰', path: '/receipt/cash-in/list' },
    { id: 'customer', label: 'Customer', icon: '🧾', path: '/customer' },
    { id: 'vendor', label: 'Vendor', icon: '🏷️', path: '/vendor' },
    { id: 'interview', label: 'Interview', icon: '🎤', path: '/interview' },
    { id: 'reports', label: 'Reports', icon: '📈', path: '/reports' },
    { id: 'billing', label: 'Billing', icon: '🧾', path: '/billing' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleMenuClick = (item) => {
    if (item.path) {
      navigate(item.path);
    } else {
      onMenuSelect(item.id);
    }
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <nav className="sidebar-menu">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`menu-item ${selectedMenuItem === item.id ? 'active' : ''}`}
                onClick={() => handleMenuClick(item)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-calendar">
        <CalendarComponent />
      </div>
    </aside>
  );
};

export default Sidebar;
