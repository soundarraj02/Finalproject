import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNextEmployeeId } from '../utils/employeeData';
import './MasterSetId.css';

const MasterSetEmployeeId = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');

  const previewId = useMemo(() => employeeId || 'Click Set ID to generate', [employeeId]);

  const handleSetId = () => {
    const newId = getNextEmployeeId();
    setEmployeeId(newId);
    navigate('/student-info/add-employee', { state: { employeeId: newId } });
  };

  return (
    <div className="master-set-page">
      <div className="master-set-topbar">
        <button className="master-left-btn" onClick={() => navigate('/student-info/add-employee')}>
          👤 Add Employee
        </button>
        <button className="master-right-btn" onClick={() => navigate('/student-info/master')}>
          Master {'>'} Employee ID
        </button>
      </div>

      <div className="master-set-card">
        <h2>Set Employee ID</h2>
        <p>Generate Employee ID and continue to Add Employee page.</p>

        <div className="master-id-box">
          <label>Employee ID</label>
          <div className="master-id-value">{previewId}</div>
        </div>

        <div className="master-set-actions">
          <button className="master-primary-btn" onClick={handleSetId}>
            Set ID
          </button>
        </div>
      </div>
    </div>
  );
};

export default MasterSetEmployeeId;
