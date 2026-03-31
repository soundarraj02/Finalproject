import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // In production, this would send an API request to backend
      // to send a password reset email
      console.log('Password reset email would be sent to:', email);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      setSubmitted(true);

      // Auto redirect after 5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <Link to="/login" className="back-link">
            ← Back to Login
          </Link>
          <h1>Reset Password</h1>
          <p>Enter your email address and we'll send you a link to reset your password</p>
        </div>

        {!submitted ? (
          <>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <small>We'll send a password reset link to this email</small>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading || !email}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Check Your Email</h2>
            <p>We've sent a password reset link to <strong>{email}</strong></p>
            <p className="small-text">Click the link in the email to reset your password. The link will expire in 24 hours.</p>
            <p className="redirect-text">Redirecting to login in a few seconds...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
