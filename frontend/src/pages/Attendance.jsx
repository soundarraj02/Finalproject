import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAttendances } from '../utils/attendanceData';
import { getEmployees } from '../utils/employeeData';
import './Attendance.css';

const Attendance = () => {
  const navigate = useNavigate();
  const [employeesCount, setEmployeesCount] = useState(0);
  const [attendancesCount, setAttendancesCount] = useState(0);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const [employees, attendances] = await Promise.all([getEmployees(), getAttendances()]);
        setEmployeesCount(Array.isArray(employees) ? employees.length : 0);
        setAttendancesCount(Array.isArray(attendances) ? attendances.length : 0);
      } catch {
        setEmployeesCount(0);
        setAttendancesCount(0);
      }
    };
    loadSummary();
  }, []);

  return (
    <div className="attendance-page">
      <div className="attendance-container">
        <div className="attendance-header">
          <button className="attendance-link-btn" onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <div className="attendance-title-block">
            <h1>Attendance</h1>
            <p>Register and review employee attendance records.</p>
          </div>
          <button className="attendance-link-btn" onClick={() => navigate('/attendance/attendance-list')}>
            Attendance List
          </button>
        </div>

        <div className="attendance-summary-grid">
          <div className="summary-card">
            <span className="summary-label">Registered Employees</span>
            <strong>{employeesCount}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Attendance Records</span>
            <strong>{attendancesCount}</strong>
          </div>
        </div>

        <div className="attendance-actions-grid">
          <button className="attendance-action-card" onClick={() => navigate('/attendance/add-attendance')}>
            <span className="action-icon">🕒</span>
            <h2>Add Attendance</h2>
            <p>Register in-time, out-time, leave, permission, and comments for an employee.</p>
          </button>

          <button className="attendance-action-card" onClick={() => navigate('/attendance/attendance-list')}>
            <span className="action-icon">📋</span>
            <h2>Attendance List</h2>
            <p>Search all saved attendance records with filters and page navigation.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
