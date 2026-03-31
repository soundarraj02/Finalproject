import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentInfo.css';

const EmployeeInfo = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuOptions = [
    {
      id: 'add-employee',
      label: 'Add Employee',
      icon: '👤',
      onClick: () => {
        navigate('/student-info/add-employee');
        setIsDropdownOpen(false);
      },
    },
    {
      id: 'employee-list',
      label: 'Employee List',
      icon: '👥',
      onClick: () => {
        navigate('/student-info/employee-list');
        setIsDropdownOpen(false);
      },
    },
  ];

  return (
    <div className="student-info-page">
      <div className="student-info-container">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        <div className="page-header">
          <h1>👥 Employee Information</h1>
          <p>Manage employee information</p>
        </div>

        <div className="dropdown-container">
          <button
            className="dropdown-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>📋 Select Option</span>
            <span className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`}>▼</span>
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              {menuOptions.map((option) => (
                <button
                  key={option.id}
                  className="dropdown-item"
                  onClick={option.onClick}
                >
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="quick-actions">
          <div className="action-card" onClick={() => navigate('/student-info/add-employee')}>
            <div className="action-icon">👔</div>
            <h3>Add Employee</h3>
            <p>Add a new employee</p>
          </div>

          <div className="action-card" onClick={() => navigate('/student-info/employee-list')}>
            <div className="action-icon">👨‍💼</div>
            <h3>View Employees</h3>
            <p>See all employees</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfo;
