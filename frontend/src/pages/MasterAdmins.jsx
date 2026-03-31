import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdmins } from '../services/authService';
import { logoutUser } from '../utils/auth';
import './MasterAdmin.css';

const MasterAdmins = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const data = await getAdmins();
        setAdmins(data);
      } catch {
        setAdmins([]);
      }
    };
    loadAdmins();
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="master-admin-page">
      <div className="master-admin-topbar">
        <button className="master-admin-left" onClick={() => navigate('/student-info/master/create-staff')}>➕ Add Admin</button>
        <button className="master-admin-right" onClick={() => navigate('/student-info/master')}>Master {'>'} Admins</button>
      </div>
      <div className="master-admin-card">
        <div className="master-admin-heading">
          <button className="admin-logo-btn" onClick={() => navigate('/dashboard')}>📊 Admin Portal</button>
          <h2>Admins</h2>
        </div>
        <div className="master-admin-table-wrap">
          <table className="master-admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>User Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Date of Joining</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr><td colSpan={7} className="empty">No admin records found.</td></tr>
              ) : admins.map((admin, index) => (
                <tr key={admin._id}>
                  <td>{index + 1}</td>
                  <td>{admin.staffName || admin.name}</td>
                  <td>{admin.username || '-'}</td>
                  <td>{admin.email || '-'}</td>
                  <td>{admin.role}</td>
                  <td>{admin.dateOfJoining || '-'}</td>
                  <td>{admin.comments || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="master-admin-actions between">
          <span className="admin-count">Total records: {admins.length}</span>
          <button className="master-admin-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default MasterAdmins;
