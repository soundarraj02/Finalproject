import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudentById, updateStudent, QUALIFICATIONS, MENTORS, STUDENT_STATUS } from '../utils/studentData';
import { getAvailableCourses } from '../utils/courseFeeData';
import './AddStudent.css';

const EditStudent = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [student, setStudent] = useState(null);
  const [courseOptions, setCourseOptions] = useState(() => getAvailableCourses());

  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    email: '',
    address: '',
    contactNumber: '',
    alternateNumber: '',
    gender: '',
    maritalStatus: '',
    qualification: '',
    workExperience: '',
    course: '',
    totalAmount: '',
    remainingAmount: '',
    mentor: '',
    dateOfJoining: '',
    studentStatus: 'Ongoing',
    studentImage: null,
    remarks: '',
  });

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setCourseOptions(getAvailableCourses());
        const foundStudent = await getStudentById(studentId);
        if (foundStudent) {
          setStudent(foundStudent);
          setFormData(foundStudent);
          if (foundStudent.studentImage) {
            setImagePreview(foundStudent.studentImage);
          }
        } else {
          setError('Student not found');
        }
      } catch {
        setError('Student not found');
      }
    };
    loadStudent();
  }, [studentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          studentImage: reader.result,
        }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'firstName',
      'lastName',
      'fatherName',
      'motherName',
      'dob',
      'email',
      'address',
      'contactNumber',
      'gender',
      'maritalStatus',
      'qualification',
      'course',
      'totalAmount',
      'mentor',
      'dateOfJoining',
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`${field.replace(/([A-Z])/g, ' $1').trim()} is required`);
        return false;
      }
    }

    const remaining = parseFloat(formData.remainingAmount) || 0;
    const total = parseFloat(formData.totalAmount) || 0;
    if (remaining > total) {
      setError('Remaining amount cannot be greater than total amount');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await updateStudent(studentId, formData);

      setSuccess('Student updated successfully! Redirecting...');

      setTimeout(() => {
        navigate('/student-info/student-list');
      }, 2000);
    } catch (err) {
      setError('Failed to update student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!student) {
    return (
      <div className="add-student-page">
        <div className="add-student-container">
          <p>{error || 'Loading...'}</p>
          <button className="back-btn" onClick={() => navigate('/student-info/student-list')}>
            ← Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-student-page">
      <div className="add-student-container">
        <div className="form-header">
          <button className="back-btn" onClick={() => navigate('/student-info/student-list')}>
            ← Back
          </button>
          <h1>✏️ Edit Student</h1>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <form onSubmit={handleSubmit} className="student-form">
          {/* Same form as AddStudent but for editing */}
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="studentId">Student ID</label>
                <input
                  id="studentId"
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  disabled
                  className="readonly-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="firstName">
                  First Name <span className="required">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fatherName">
                  Father Name <span className="required">*</span>
                </label>
                <input
                  id="fatherName"
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="motherName">
                  Mother Name <span className="required">*</span>
                </label>
                <input
                  id="motherName"
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dob">
                  Date of Birth <span className="required">*</span>
                </label>
                <input
                  id="dob"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email ID <span className="required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Contact Information</h2>

            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="address">
                  Address <span className="required">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  rows="3"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactNumber">
                  Contact Number <span className="required">*</span>
                </label>
                <input
                  id="contactNumber"
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="alternateNumber">Alternate Number</label>
                <input
                  id="alternateNumber"
                  type="tel"
                  name="alternateNumber"
                  value={formData.alternateNumber}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Personal Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Gender <span className="required">*</span>
                </label>
                <div className="checkbox-group">
                  {['Male', 'Female', 'Others'].map((option) => (
                    <label key={option} className="checkbox-label">
                      <input
                        type="radio"
                        name="gender"
                        value={option}
                        checked={formData.gender === option}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>
                  Marital Status <span className="required">*</span>
                </label>
                <div className="checkbox-group">
                  {['Married', 'Unmarried'].map((option) => (
                    <label key={option} className="checkbox-label">
                      <input
                        type="radio"
                        name="maritalStatus"
                        value={option}
                        checked={formData.maritalStatus === option}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Academic Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="qualification">
                  Qualification <span className="required">*</span>
                </label>
                <select
                  id="qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select Qualification</option>
                  {QUALIFICATIONS.map((qual) => (
                    <option key={qual} value={qual}>
                      {qual}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="workExperience">Work Experience (Years)</label>
                <input
                  id="workExperience"
                  type="number"
                  name="workExperience"
                  min="0"
                  value={formData.workExperience}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="course">
                  Course <span className="required">*</span>
                </label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select Course</option>
                  {courseOptions.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dateOfJoining">
                  Date of Joining <span className="required">*</span>
                </label>
                <input
                  id="dateOfJoining"
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Financial Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="totalAmount">
                  Total Amount <span className="required">*</span>
                </label>
                <input
                  id="totalAmount"
                  type="number"
                  name="totalAmount"
                  min="0"
                  step="0.01"
                  value={formData.totalAmount}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="remainingAmount">Remaining Amount</label>
                <input
                  id="remainingAmount"
                  type="number"
                  name="remainingAmount"
                  min="0"
                  step="0.01"
                  value={formData.remainingAmount}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Additional Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mentor">
                  Mentor <span className="required">*</span>
                </label>
                <select
                  id="mentor"
                  name="mentor"
                  value={formData.mentor}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select Mentor</option>
                  {MENTORS.map((mentor) => (
                    <option key={mentor} value={mentor}>
                      {mentor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="studentStatus">
                  Student Status <span className="required">*</span>
                </label>
                <select
                  id="studentStatus"
                  name="studentStatus"
                  value={formData.studentStatus}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                >
                  {STUDENT_STATUS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="studentImage">Student Image</label>
                <div className="image-upload">
                  <input
                    id="studentImage"
                    type="file"
                    name="studentImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Student" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="remarks">Remarks</label>
                <textarea
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : '✓ Update Student'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/student-info/student-list')}
              disabled={isSubmitting}
            >
              ✕ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
