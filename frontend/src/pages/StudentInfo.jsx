import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentInfo = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuOptions = [
    {
      id: 'add-student',
      label: 'Add Student',
      icon: '➕',
      onClick: () => {
        navigate('/student-info/add-student');
        setIsDropdownOpen(false);
      },
    },
    {
      id: 'student-list',
      label: 'Student List',
      icon: '📋',
      onClick: () => {
        navigate('/student-info/student-list');
        setIsDropdownOpen(false);
      },
    },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h1 className="h4 mb-1">Student Information</h1>
          <p className="text-muted mb-3">Manage student information</p>

          <div className="dropdown mb-3">
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Select Option
            </button>
            {isDropdownOpen && (
              <ul className="dropdown-menu show position-static mt-2">
                {menuOptions.map((option) => (
                  <li key={option.id}>
                    <button className="dropdown-item" onClick={option.onClick}>
                      {option.icon} {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="card h-100 border-primary" role="button" onClick={() => navigate('/student-info/add-student')}>
                <div className="card-body">
                  <h3 className="h6">Add Student</h3>
                  <p className="mb-0 text-muted">Register a new student</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100 border-success" role="button" onClick={() => navigate('/student-info/student-list')}>
                <div className="card-body">
                  <h3 className="h6">View Students</h3>
                  <p className="mb-0 text-muted">See all registered students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfo;
