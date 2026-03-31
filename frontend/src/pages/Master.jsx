import { useNavigate } from 'react-router-dom';
import './Master.css';

const Master = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Invoice No',
      description: 'Set invoice details and generate invoice ID',
      icon: '🧾',
      path: '/student-info/master/invoice-no',
    },
    {
      title: 'Student ID',
      description: 'Generate and set student ID',
      icon: '📚',
      path: '/student-info/master/student-id',
    },
    {
      title: 'Employee ID',
      description: 'Generate and set employee ID',
      icon: '👤',
      path: '/student-info/master/employee-id',
    },
    {
      title: 'Create Staff',
      description: 'Register staff admin accounts',
      icon: '🛡️',
      path: '/student-info/master/create-staff',
    },
    {
      title: 'Course Fees',
      description: 'Plan course offering, fees, and duration',
      icon: '💳',
      path: '/student-info/master/course-fees',
    },
    {
      title: 'Admins',
      description: 'View website login admins and logout',
      icon: '🔐',
      path: '/student-info/master/admins',
    },
  ];

  return (
    <div className="master-page">
      <div className="master-container">
        <div className="master-header">
          <button className="master-back-btn" onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <h1>Master Dashboard</h1>
          <p>Select a module to set IDs</p>
        </div>

        <div className="master-cards-grid">
          {cards.map((card) => (
            <div key={card.title} className="master-action-card" onClick={() => navigate(card.path)}>
              <div className="master-card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Master;
