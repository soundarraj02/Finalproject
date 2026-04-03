import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Row } from 'react-bootstrap';
import { FaFileInvoice, FaUserTie, FaUsers, FaUserFriends } from '../components/AdminIcons';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { getUserInfo, logoutUser } from '../utils/auth';
import '../components/dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const userInfo = getUserInfo();

  const avatar = useMemo(() => {
    const source = userInfo?.name || userInfo?.email || 'A';
    return source.trim().charAt(0).toUpperCase() || 'A';
  }, [userInfo]);

  const cardRoutes = {
    Employees: '/employee-info',
    Students: '/student-info',
    Clients: '/customer',
    Invoices: '/billing',
  };

  const statCards = [
    { label: 'Employees', value: '24', icon: <FaUserTie />, color: 'card-employees' },
    { label: 'Students', value: '168', icon: <FaUsers />, color: 'card-students' },
    { label: 'Clients', value: '62', icon: <FaUserFriends />, color: 'card-clients' },
    { label: 'Invoices', value: '145', icon: <FaFileInvoice />, color: 'card-invoices' },
  ];

  const searchableTargets = [
    { key: 'student', path: '/student-info' },
    { key: 'attendance', path: '/attendance' },
    { key: 'customer', path: '/customer' },
    { key: 'vendor', path: '/vendor' },
    { key: 'lead', path: '/lead' },
    { key: 'receipt', path: '/receipt/cash-in/list' },
    { key: 'interview', path: '/interview' },
    { key: 'report', path: '/reports' },
    { key: 'bill', path: '/billing' },
    { key: 'employee', path: '/employee-info' },
  ];

  const handleSearch = (query) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return;
    }

    const target = searchableTargets.find((entry) => normalized.includes(entry.key) || entry.key.includes(normalized));
    if (target) {
      navigate(target.path);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className={`layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} avatar={avatar} />

      <div className="main">
        <Topbar
          avatar={avatar}
          onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
          onSearch={handleSearch}
          onOpenNotifications={() => navigate('/interview')}
          onProfile={() => navigate('/student-info/master/admins')}
          onLogout={handleLogout}
        />

        <div className="content">
          <div className="content-header">
            <div>
              <h4>Dashboard Overview</h4>
              <p>Track core operations, billing, and activity from one place.</p>
            </div>
            <button type="button" className="primary-action" onClick={() => navigate('/billing')}>
              Create Invoice
            </button>
          </div>

          <Row className="mb-3">
            {statCards.map((item, index) => (
              <Col md={3} key={index}>
                <Card className={`dash-card clickable-card ${item.color}`} onClick={() => navigate(cardRoutes[item.label])}>
                  <div>
                    <p className="card-label">{item.label}</p>
                    <h5 className="card-value">{item.value}</h5>
                  </div>
                  <div className="icon-box">{item.icon}</div>
                </Card>
              </Col>
            ))}
          </Row>

          <Row>
            <Col md={8}>
              <Card className="box-card">
                <div className="d-flex justify-content-between">
                  <h6>Number of Students per Course</h6>
                  <select>
                    <option>2024</option>
                  </select>
                </div>

                <div className="center-text">No Data Available</div>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="box-card">
                <h6>Calendar Events</h6>
                <small>Important Goals and Events are marked</small>

                <h6 className="text-center mt-3">July 2024</h6>

                <div className="calendar">
                  {Array.from({ length: 31 }, (_, index) => (
                    <div key={index}>{index + 1}</div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

