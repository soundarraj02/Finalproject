import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  addLead,
  DETAILS_SENT_OPTIONS,
  FOLLOW_UP_OPTIONS,
  LEAD_SOURCE_OPTIONS,
  getAssignableNamesAsync,
  getAvailableLeadCoursesAsync,
} from '../utils/leadData';
import { QUALIFICATIONS } from '../utils/studentData';
import './AddLead.css';

const AddLead = () => {
  const navigate = useNavigate();
  const [assignableNames, setAssignableNames] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    name: '',
    qualification: '',
    yearOfPassing: '',
    phoneNumber: '',
    location: '',
    followUpStatus: '',
    detailsSent: '',
    assignedTo: '',
    course: '',
    source: '',
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [names, courses] = await Promise.all([
          getAssignableNamesAsync(),
          getAvailableLeadCoursesAsync(),
        ]);
        setAssignableNames(names);
        setAvailableCourses(courses);
      } catch {
        setAssignableNames(['Counsellor 1', 'Counsellor 2', 'Counsellor 3']);
        setAvailableCourses([]);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      'date',
      'name',
      'qualification',
      'yearOfPassing',
      'phoneNumber',
      'location',
      'followUpStatus',
      'detailsSent',
      'assignedTo',
      'course',
      'source',
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return `${field.replace(/([A-Z])/g, ' $1').trim()} is required.`;
      }
    }

    if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      return 'Phone number must be 10 digits.';
    }

    if (!/^\d{4}$/.test(formData.yearOfPassing)) {
      return 'Year of passing must be a valid 4-digit year.';
    }

    return '';
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      addLead(formData);
      setSuccess('Lead added successfully. Redirecting...');
      setTimeout(() => navigate('/lead/lead-list'), 900);
    } catch {
      setError('Failed to add lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-lead-page">
      <div className="add-lead-container">
        <div className="form-header">
          <button className="back-btn" onClick={() => navigate('/lead/lead-list')}>
            📋 Leads
          </button>
          <h1>Register Leads</h1>
          <button className="nav-btn" onClick={() => navigate('/lead')}>
            Leads › Add Lead
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <form className="lead-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Lead Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Date <span className="required">*</span></label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Name <span className="required">*</span></label>
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter lead name" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Qualification <span className="required">*</span></label>
                <select name="qualification" value={formData.qualification} onChange={handleInputChange}>
                  <option value="">Select Qualification</option>
                  {QUALIFICATIONS.map((qualification) => (
                    <option key={qualification} value={qualification}>{qualification}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Year of Passing <span className="required">*</span></label>
                <input name="yearOfPassing" value={formData.yearOfPassing} onChange={handleInputChange} placeholder="e.g. 2024" maxLength="4" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number <span className="required">*</span></label>
                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Enter 10-digit phone number" />
              </div>
              <div className="form-group">
                <label>Location <span className="required">*</span></label>
                <input name="location" value={formData.location} onChange={handleInputChange} placeholder="Enter location" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Following Updates <span className="required">*</span></label>
                <select name="followUpStatus" value={formData.followUpStatus} onChange={handleInputChange}>
                  <option value="">Select Follow Up</option>
                  {FOLLOW_UP_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Details Sent <span className="required">*</span></label>
                <select name="detailsSent" value={formData.detailsSent} onChange={handleInputChange}>
                  <option value="">Select Option</option>
                  {DETAILS_SENT_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Assigned To <span className="required">*</span></label>
                <select name="assignedTo" value={formData.assignedTo} onChange={handleInputChange}>
                  <option value="">Select Assignee</option>
                  {assignableNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Course <span className="required">*</span></label>
                <select name="course" value={formData.course} onChange={handleInputChange}>
                  <option value="">Select Course</option>
                  {availableCourses.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Source <span className="required">*</span></label>
                <select name="source" value={formData.source} onChange={handleInputChange}>
                  <option value="">Select Source</option>
                  {LEAD_SOURCE_OPTIONS.map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/lead/lead-list')}>📋 Leads</button>
            <button type="submit" className="submit-btn" disabled={isSubmitting || loadingOptions}>{isSubmitting ? 'Saving...' : '✅ Register Lead'}</button>
            <button type="button" className="nav-submit-btn" onClick={() => navigate('/lead')}>Leads › Add Lead</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLead;
