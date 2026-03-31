import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addStudent, getNextStudentId, QUALIFICATIONS, MENTORS, STUDENT_STATUS } from '../utils/studentData';
import { getAvailableCourses } from '../utils/courseFeeData';

const AddStudent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseOptions, setCourseOptions] = useState(() => getAvailableCourses());

  const [formData, setFormData] = useState({
    studentId: location.state?.studentId || '',
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

  // Generate student ID if not provided
  useEffect(() => {
    const initStudentId = async () => {
      if (!formData.studentId) {
        const newId = await getNextStudentId();
        setFormData((prev) => ({ ...prev, studentId: newId }));
      }
    };

    initStudentId();
    setCourseOptions(getAvailableCourses());
  }, []);

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
      'studentId',
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
      'studentStatus',
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`${field.replace(/([A-Z])/g, ' $1').trim()} is required`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Phone validation
    if (!/^\d{10}$/.test(formData.contactNumber.replace(/[^\d]/g, ''))) {
      setError('Contact number must be 10 digits');
      return false;
    }

    // Amount validation
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add the student
      await addStudent(formData);

      setSuccess('Student registered successfully! Redirecting...');

      // Redirect to student list after 2 seconds
      setTimeout(() => {
        navigate('/student-info/student-list');
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to register student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button className="btn btn-outline-secondary" onClick={() => navigate('/student-info')}>
              Back
            </button>
            <h1 className="h4 m-0">Register Student</h1>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="card-body pt-0">
          <form onSubmit={handleSubmit}>
          <div className="card mb-3">
            <div className="card-body">
            <h2 className="h6">Basic Information</h2>

            <div className="row g-3 mb-3">
              <div className="form-group">
                <label htmlFor="studentId">
                  Student ID <span className="required">*</span>
                </label>
                <input
                  id="studentId"
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  disabled
                  className="readonly-input"
                />
                <small>Auto-generated ID</small>
              </div>

              <div className="form-group">
                <label htmlFor="firstName">
                  First Name <span className="required">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
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
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="form-group">
                <label htmlFor="fatherName">
                  Father Name <span className="required">*</span>
                </label>
                <input
                  id="fatherName"
                  type="text"
                  name="fatherName"
                  placeholder="Enter father's name"
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
                  placeholder="Enter mother's name"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
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
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
          </div>

          <div className="card mb-3">
            <div className="card-body">
            <h2 className="h6">Contact Information</h2>

            <div className="row g-3 mb-3">
              <div className="form-group full-width">
                <label htmlFor="address">
                  Address <span className="required">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  rows="3"
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="form-group">
                <label htmlFor="contactNumber">
                  Contact Number <span className="required">*</span>
                </label>
                <input
                  id="contactNumber"
                  type="tel"
                  name="contactNumber"
                  placeholder="Enter 10-digit number"
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
                  placeholder="Enter alternate number"
                  value={formData.alternateNumber}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
          </div>

          <div className="card mb-3">
            <div className="card-body">
            <h2 className="h6">Personal Details</h2>

            <div className="row g-3 mb-3">
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
          </div>

          <div className="card mb-3">
            <div className="card-body">
            <h2 className="h6">Academic Information</h2>

            <div className="row g-3 mb-3">
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
                  placeholder="Enter years of experience"
                  min="0"
                  value={formData.workExperience}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
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
          </div>

          <div className="card mb-3">
            <div className="card-body">
            <h2 className="h6">Financial Information</h2>

            <div className="row g-3 mb-3">
              <div className="form-group">
                <label htmlFor="totalAmount">
                  Total Amount <span className="required">*</span>
                </label>
                <input
                  id="totalAmount"
                  type="number"
                  name="totalAmount"
                  placeholder="Enter total amount"
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
                  placeholder="Enter remaining amount"
                  min="0"
                  step="0.01"
                  value={formData.remainingAmount}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
          </div>

          <div className="card mb-3">
            <div className="card-body">
            <h2 className="h6">Additional Information</h2>

            <div className="row g-3 mb-3">
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

            <div className="row g-3 mb-3">
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

            <div className="row g-3 mb-3">
              <div className="form-group full-width">
                <label htmlFor="remarks">Remarks</label>
                <textarea
                  id="remarks"
                  name="remarks"
                  placeholder="Enter additional remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows="3"
                />
              </div>
            </div>
          </div>
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : '✓ Register Student'}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate('/student-info')}
              disabled={isSubmitting}
            >
              ✕ Cancel
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
