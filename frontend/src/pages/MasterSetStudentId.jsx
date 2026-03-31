import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNextStudentId } from '../utils/studentData';
import './MasterSetId.css';

const MasterSetStudentId = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');

  const previewId = useMemo(() => studentId || 'Click Set ID to generate', [studentId]);

  const handleSetId = async () => {
    const newId = await getNextStudentId();
    setStudentId(newId);
    navigate('/student-info/add-student', { state: { studentId: newId } });
  };

  return (
    <div className="master-set-page">
      <div className="master-set-topbar">
        <button className="master-left-btn" onClick={() => navigate('/student-info/add-student')}>
          📝 Add Student
        </button>
        <button className="master-right-btn" onClick={() => navigate('/student-info/master')}>
          Master {'>'} Student ID
        </button>
      </div>

      <div className="master-set-card">
        <h2>Set Student ID</h2>
        <p>Generate Student ID and continue to Add Student page.</p>

        <div className="master-id-box">
          <label>Student ID</label>
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

export default MasterSetStudentId;
