import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addCourseFeePlan, getCourseFeePlanById, updateCourseFeePlan } from '../utils/courseFeeData';
import './CourseFees.css';

const CourseFeeForm = () => {
  const navigate = useNavigate();
  const { courseFeeId } = useParams();
  const isEdit = Boolean(courseFeeId);
  const [formData, setFormData] = useState({ course: '', fees: '', duration: '' });

  useEffect(() => {
    if (isEdit) {
      const record = getCourseFeePlanById(courseFeeId);
      if (record) setFormData({ course: record.course, fees: record.fees, duration: record.duration });
    }
  }, [courseFeeId, isEdit]);

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.course || !formData.fees || !formData.duration) return;
    if (isEdit) {
      updateCourseFeePlan(courseFeeId, formData);
    } else {
      addCourseFeePlan(formData);
    }
    navigate('/student-info/master/course-fees');
  };

  return (
    <div className="course-fees-page">
      <div className="course-fees-topbar">
        <button className="course-fees-left" onClick={() => navigate('/student-info/add-student')}>📝 Add Student</button>
        <button className="course-fees-right" onClick={() => navigate('/student-info/master')}>Master {'>'} Course fees</button>
      </div>
      <div className="course-fees-card form-card">
        <h2>{isEdit ? 'Edit Course Plan' : 'Add Course Plan'}</h2>
        <form className="course-fees-form" onSubmit={handleSubmit}>
          <div className="course-fees-form-group">
            <label>Course</label>
            <input value={formData.course} onChange={(e) => handleChange('course', e.target.value)} placeholder="Enter course name" />
          </div>
          <div className="course-fees-form-group">
            <label>Fees</label>
            <input type="number" value={formData.fees} onChange={(e) => handleChange('fees', e.target.value)} placeholder="Enter fees" />
          </div>
          <div className="course-fees-form-group">
            <label>Duration</label>
            <input value={formData.duration} onChange={(e) => handleChange('duration', e.target.value)} placeholder="Enter duration" />
          </div>
          <div className="course-fees-form-actions">
            <button type="submit" className="course-fees-add">{isEdit ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFeeForm;
