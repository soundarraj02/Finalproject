import { useLocation, useNavigate } from 'react-router-dom';
import { FaChevronDown } from './AdminIcons';
import './dashboard.css';

export default function Sidebar({ collapsed = false, avatar = 'A' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Student Info', path: '/student-info' },
    { label: 'Attendance', path: '/attendance' },
    { label: 'Customer', path: '/customer' },
    { label: 'Vendors', path: '/vendor' },
    { label: 'Leads', path: '/lead' },
    { label: 'Receipt', path: '/receipt/cash-in/list' },
    { label: 'Interview', path: '/interview' },
    { label: 'Reports', path: '/reports' },
    { label: 'Billing', path: '/billing' },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo-section">
        <img src="/logo.png" alt="logo" />
        <div>
          <h5>KITKAT</h5>
          <small>Software Technologies</small>
        </div>
      </div>

      <div className="admin-section">
        <div className="avatar">{avatar}</div>
        <span>ADMIN</span>
      </div>

      <ul>
        {menuItems.map((item) => (
          <li
            key={item.label}
            onClick={() => navigate(item.path)}
            className={location.pathname.startsWith(item.path) ? 'active' : ''}
          >
            <span>{item.label}</span>
            <FaChevronDown />
          </li>
        ))}
      </ul>
    </div>
  );
}

