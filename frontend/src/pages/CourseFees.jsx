import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCourseFeePlan, getCourseFeePlans } from '../utils/courseFeeData';
import './CourseFees.css';

const CourseFees = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    setPlans(getCourseFeePlans());
  }, []);

  const reload = () => setPlans(getCourseFeePlans());

  const handleDelete = (courseFeeId) => {
    deleteCourseFeePlan(courseFeeId);
    reload();
  };

  return (
    <div className="course-fees-page">
      <div className="course-fees-topbar">
        <button className="course-fees-left" onClick={() => navigate('/student-info/add-student')}>📝 Add Student</button>
        <button className="course-fees-right" onClick={() => navigate('/student-info/master')}>Master {'>'} Course fees</button>
      </div>
      <div className="course-fees-card">
        <div className="course-fees-header">
          <h2>Plan Course Offering</h2>
          <button className="course-fees-add" onClick={() => navigate('/student-info/master/course-fees/add')}>Add Field</button>
        </div>
        <div className="course-fees-table-wrap">
          <table className="course-fees-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Course</th>
                <th>Fees</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.length === 0 ? (
                <tr><td colSpan={5} className="empty">No course plans found.</td></tr>
              ) : plans.map((plan, index) => (
                <tr key={plan.courseFeeId}>
                  <td>{index + 1}</td>
                  <td>{plan.course}</td>
                  <td>₹{plan.fees}</td>
                  <td>{plan.duration}</td>
                  <td>
                    <button className="action-btn edit" onClick={() => navigate(`/student-info/master/course-fees/edit/${plan.courseFeeId}`)}>Edit</button>
                    <button className="action-btn print" onClick={() => window.print()}>Print</button>
                    <button className="action-btn delete" onClick={() => handleDelete(plan.courseFeeId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseFees;
