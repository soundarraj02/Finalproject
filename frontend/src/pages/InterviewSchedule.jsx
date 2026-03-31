import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addInterview, INTERVIEW_FOLLOW_UP_OPTIONS } from '../utils/interviewData';
import './InterviewSchedule.css';

const InterviewSchedule = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    interviewDate: '',
    interviewName: '',
    email: '',
    phone: '',
    qualification: '',
    yearOfPassing: '',
    followUp: '',
    scheduledDate: '',
    jobRole: '',
    source: '',
    image: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      handleChange('image', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    if (!formData.interviewDate) return 'Interview date is required.';
    if (!formData.interviewName.trim()) return 'Interview name is required.';
    if (!formData.email.trim()) return 'Email is required.';
    if (!formData.phone.trim()) return 'Phone number is required.';
    if (!formData.qualification.trim()) return 'Qualification is required.';
    if (!formData.yearOfPassing.trim()) return 'Year of passing is required.';
    if (!formData.followUp) return 'Follow up status is required.';
    if (!formData.scheduledDate) return 'Scheduled date is required.';
    if (!formData.jobRole.trim()) return 'Job role is required.';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    const err = validate();
    if (err) { setError(err); setIsSubmitting(false); return; }
    addInterview(formData);
    setSuccess('Interview scheduled successfully. Redirecting...');
    setTimeout(() => navigate('/interview/manage'), 900);
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setFormData({
      interviewDate: '',
      interviewName: '',
      email: '',
      phone: '',
      qualification: '',
      yearOfPassing: '',
      followUp: '',
      scheduledDate: '',
      jobRole: '',
      source: '',
      image: '',
    });
    setImagePreview(null);
    setError('');
    setSuccess('');
  };

  return (
    <div className="schedule-page">
      {/* Top Nav */}
      <div className="schedule-topbar">
        <button className="schedule-nav-btn" onClick={() => navigate('/interview/manage')}>
          📋 Interview List
        </button>
        <span className="schedule-breadcrumb">
          <button className="breadcrumb-link" onClick={() => navigate('/interview')}>
            Interview
          </button>
          {' › Schedule'}
        </span>
      </div>

      {/* Form Card */}
      <div className="schedule-card">
        <div className="schedule-header">
          <h2>📅 Register Students — Interview Schedule</h2>
        </div>

        {error && <div className="schedule-alert error">{error}</div>}
        {success && <div className="schedule-alert success">{success}</div>}

        <form onSubmit={handleSubmit} className="schedule-form">
          {/* Row 1 */}
          <div className="schedule-row">
            <div className="schedule-group">
              <label>Interview Date *</label>
              <input
                type="date"
                value={formData.interviewDate}
                onChange={(e) => handleChange('interviewDate', e.target.value)}
              />
            </div>
            <div className="schedule-group">
              <label>Interview Name *</label>
              <input
                type="text"
                placeholder="Enter name"
                value={formData.interviewName}
                onChange={(e) => handleChange('interviewName', e.target.value)}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="schedule-row">
            <div className="schedule-group">
              <label>Email *</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div className="schedule-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                placeholder="10-digit phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="schedule-row">
            <div className="schedule-group">
              <label>Qualification *</label>
              <input
                type="text"
                placeholder="e.g. B.Tech, MBA"
                value={formData.qualification}
                onChange={(e) => handleChange('qualification', e.target.value)}
              />
            </div>
            <div className="schedule-group">
              <label>Year of Passing *</label>
              <input
                type="text"
                placeholder="e.g. 2023"
                value={formData.yearOfPassing}
                onChange={(e) => handleChange('yearOfPassing', e.target.value)}
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="schedule-row">
            <div className="schedule-group">
              <label>Follow Up Dates *</label>
              <select
                value={formData.followUp}
                onChange={(e) => handleChange('followUp', e.target.value)}
              >
                <option value="">-- Select Status --</option>
                {INTERVIEW_FOLLOW_UP_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="schedule-group">
              <label>Scheduled Date *</label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => handleChange('scheduledDate', e.target.value)}
              />
            </div>
          </div>

          {/* Row 5 */}
          <div className="schedule-row">
            <div className="schedule-group">
              <label>Job Role *</label>
              <input
                type="text"
                placeholder="e.g. Software Engineer"
                value={formData.jobRole}
                onChange={(e) => handleChange('jobRole', e.target.value)}
              />
            </div>
            <div className="schedule-group">
              <label>Source</label>
              <input
                type="text"
                placeholder="e.g. LinkedIn, Referral"
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value)}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="schedule-group">
            <label>Upload Image</label>
            <div className="schedule-image-upload">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <button
                type="button"
                className="schedule-upload-btn"
                onClick={() => fileRef.current.click()}
              >
                📷 Choose Image
              </button>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="schedule-image-preview" />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="schedule-form-actions">
            <button type="button" className="schedule-btn-reset" onClick={handleReset}>
              Reset
            </button>
            <button type="submit" className="schedule-btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Schedule Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewSchedule;
