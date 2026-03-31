import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addAttendance, BOOLEAN_OPTIONS, WORK_STATUS_OPTIONS } from '../utils/attendanceData';
import { getEmployees } from '../utils/employeeData';
import './AddAttendance.css';

const defaultFormData = {
  employeeId: '',
  employeeName: '',
  workStatus: '',
  permission: 'No',
  leave: 'No',
  inDate: '',
  inTime: '',
  outDate: '',
  outTime: '',
  comments: '',
};

const AddAttendance = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(defaultFormData);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const employeeList = await getEmployees();
        setEmployees(Array.isArray(employeeList) ? employeeList : []);
      } catch {
        setEmployees([]);
        setError('Unable to load employees for attendance.');
      } finally {
        setLoadingEmployees(false);
      }
    };

    loadEmployees();
  }, []);

  const handleInputChange = (field, value) => {
    if (field === 'employeeId') {
      const employee = employees.find((item) => item.employeeId === value);
      setFormData((prev) => ({
        ...prev,
        employeeId: value,
        employeeName: employee
          ? `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || employee.name || ''
          : '',
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.employeeId) return 'Please select an employee.';
    if (!formData.workStatus) return 'Please select work status.';
    if (!formData.inDate) return 'Please select in date.';
    if (!formData.inTime) return 'Please select in time.';
    if (!formData.outDate) return 'Please select out date.';
    if (!formData.outTime) return 'Please select out time.';

    const inDateTime = new Date(`${formData.inDate}T${formData.inTime}`);
    const outDateTime = new Date(`${formData.outDate}T${formData.outTime}`);

    if (Number.isNaN(inDateTime.getTime()) || Number.isNaN(outDateTime.getTime())) {
      return 'Please provide valid in and out date/time values.';
    }

    if (outDateTime < inDateTime) {
      return 'Out date and time must be after in date and time.';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await addAttendance(formData);
      setSuccess('Attendance record saved successfully.');
      setFormData(defaultFormData);

      setTimeout(() => {
        navigate('/attendance/attendance-list');
      }, 800);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save attendance record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingEmployees) {
    return (
      <div className="add-attendance-page">
        <div className="add-attendance-container empty-state-container">
          <div className="attendance-empty-state">
            <h2>Loading Employees...</h2>
            <p>Please wait while employee records are loaded.</p>
          </div>
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="add-attendance-page">
        <div className="add-attendance-container empty-state-container">
          <div className="form-header">
            <button className="back-btn" onClick={() => navigate('/attendance/attendance-list')}>
              📋 Attendance List
            </button>
            <h1>🕒 Register Employee Attendance</h1>
            <button className="nav-btn" onClick={() => navigate('/attendance')}>
              Attendance › Add Attendance
            </button>
          </div>
          <div className="attendance-empty-state">
            <h2>No Employees Available</h2>
            <p>Add employee records first so they appear in the attendance dropdown.</p>
            <button className="primary-action-btn" onClick={() => navigate('/student-info/add-employee')}>
              ➕ Add Employee
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-attendance-page">
      <div className="add-attendance-container">
        <div className="form-header">
          <button className="back-btn" onClick={() => navigate('/attendance/attendance-list')}>
            📋 Attendance List
          </button>
          <h1>🕒 Register Employee Attendance</h1>
          <button className="nav-btn" onClick={() => navigate('/attendance')}>
            Attendance › Add Attendance
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <form className="attendance-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Attendance Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Select Employee <span className="required">*</span>
                </label>
                <select value={formData.employeeId} onChange={(e) => handleInputChange('employeeId', e.target.value)}>
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.employeeId} value={employee.employeeId}>
                      {employee.employeeId} - {`${employee.firstName || ''} ${employee.lastName || ''}`.trim() || employee.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  Status Work <span className="required">*</span>
                </label>
                <select value={formData.workStatus} onChange={(e) => handleInputChange('workStatus', e.target.value)}>
                  <option value="">Select Work Status</option>
                  {WORK_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Permission <span className="required">*</span>
                </label>
                <div className="checkbox-group">
                  {BOOLEAN_OPTIONS.map((option) => (
                    <label key={option} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.permission === option}
                        onChange={() => handleInputChange('permission', option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>
                  Leave <span className="required">*</span>
                </label>
                <div className="checkbox-group">
                  {BOOLEAN_OPTIONS.map((option) => (
                    <label key={option} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.leave === option}
                        onChange={() => handleInputChange('leave', option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  In Date <span className="required">*</span>
                </label>
                <input type="date" value={formData.inDate} onChange={(e) => handleInputChange('inDate', e.target.value)} />
              </div>

              <div className="form-group">
                <label>
                  In Time <span className="required">*</span>
                </label>
                <input type="time" value={formData.inTime} onChange={(e) => handleInputChange('inTime', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Out Date <span className="required">*</span>
                </label>
                <input type="date" value={formData.outDate} onChange={(e) => handleInputChange('outDate', e.target.value)} />
              </div>

              <div className="form-group">
                <label>
                  Out Time <span className="required">*</span>
                </label>
                <input type="time" value={formData.outTime} onChange={(e) => handleInputChange('outTime', e.target.value)} />
              </div>
            </div>

            <div className="form-row full-width">
              <div className="form-group">
                <label>Comments</label>
                <textarea
                  rows="4"
                  placeholder="Add attendance comments"
                  value={formData.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/attendance/attendance-list')} disabled={isSubmitting}>
              📋 Attendance List
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : '✅ Register Attendance'}
            </button>
            <button type="button" className="nav-submit-btn" onClick={() => navigate('/attendance')} disabled={isSubmitting}>
              Attendance › Add Attendance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAttendance;
