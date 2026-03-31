import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployees } from '../utils/employeeData';
import { register } from '../services/authService';
import './MasterAdmin.css';

const MasterCreateStaff = () => {
  const navigate = useNavigate();
  const [staffOptions, setStaffOptions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    staffName: '',
    dateOfJoining: '',
    username: '',
    password: '',
    comments: '',
  });

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employees = await getEmployees();
        setStaffOptions(Array.isArray(employees) ? employees : []);
      } catch {
        setStaffOptions([]);
        setError('Failed to load employees for staff selection.');
      }
    };
    loadEmployees();
  }, []);

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!formData.staffName || !formData.dateOfJoining || !formData.username || !formData.password) {
      setError('All required fields must be filled.');
      return;
    }
    setIsSubmitting(true);
    try {
      await register({
        name: formData.staffName,
        username: formData.username,
        password: formData.password,
        role: 'staff',
        staffName: formData.staffName,
        dateOfJoining: formData.dateOfJoining,
        comments: formData.comments,
      });
      setSuccess('Staff admin registered successfully.');
      setTimeout(() => navigate('/student-info/master/admins'), 900);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to register staff admin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="master-admin-page">
      <div className="master-admin-topbar">
        <button className="master-admin-left" onClick={() => navigate('/student-info/add-employee')}>👤 Add Employee</button>
        <button className="master-admin-right" onClick={() => navigate('/student-info/master')}>Master {'>'} Create Staff</button>
      </div>
      <div className="master-admin-card">
        <h2>Register Admin</h2>
        {error && <div className="master-alert error">{error}</div>}
        {success && <div className="master-alert success">{success}</div>}
        <form className="master-admin-form" onSubmit={handleSubmit}>
          <div className="master-admin-grid">
            <div className="master-admin-group">
              <label>Staff Name *</label>
              <select value={formData.staffName} onChange={(e) => handleChange('staffName', e.target.value)}>
                <option value="">-- Select Staff --</option>
                {staffOptions.map((staff, index) => {
                  const name = staff.name || `${staff.firstName || ''} ${staff.lastName || ''}`.trim();
                  return <option key={staff.employeeId || index} value={name}>{name}</option>;
                })}
              </select>
            </div>
            <div className="master-admin-group">
              <label>Date of Joining *</label>
              <input type="date" value={formData.dateOfJoining} onChange={(e) => handleChange('dateOfJoining', e.target.value)} />
            </div>
            <div className="master-admin-group">
              <label>User Name *</label>
              <input value={formData.username} onChange={(e) => handleChange('username', e.target.value)} placeholder="Enter username" />
            </div>
            <div className="master-admin-group">
              <label>Password *</label>
              <input type="password" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} placeholder="Enter password" />
            </div>
            <div className="master-admin-group full">
              <label>Comments</label>
              <textarea rows={3} value={formData.comments} onChange={(e) => handleChange('comments', e.target.value)} placeholder="Enter comments" />
            </div>
          </div>
          <div className="master-admin-actions">
            <button type="submit" className="master-admin-submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Create Staff'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MasterCreateStaff;
