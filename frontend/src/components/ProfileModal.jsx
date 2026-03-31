import { useState } from 'react';
import { setUserInfo } from '../utils/auth';
import './ProfileModal.css';

const ProfileModal = ({ userInfo, onClose, onLogout }) => {
  const [formData, setFormData] = useState({
    username: userInfo?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username/Email is required');
      return false;
    }

    if (formData.password || formData.confirmPassword) {
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update user info
      setUserInfo({
        email: formData.username,
        timestamp: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setSuccess('Profile updated successfully!');

      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Update Profile</h2>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        {error && <div className="modal-error">{error}</div>}
        {success && <div className="modal-success">{success}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="username">Username / Email</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter your username or email"
              value={formData.username}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password (Optional)</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Leave empty to keep current password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <small>Leave empty if you don't want to change your password</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div className="modal-password-info">
            <p>Password Requirements:</p>
            <ul>
              <li>✓ At least 8 characters</li>
              <li>✓ Uppercase and lowercase letters</li>
              <li>✓ Numbers and symbols</li>
            </ul>
          </div>

          <div className="modal-actions">
            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
          </div>

          <div className="modal-separator"></div>

          <div className="modal-logout-section">
            <button
              type="button"
              className="logout-btn"
              onClick={onLogout}
              disabled={isLoading}
            >
              Logout
            </button>
            <p className="logout-text">Click here to logout from your account</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
