import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validatePassword, authenticateUser, setUserInfo } from '../utils/auth';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordValidation = validatePassword(password);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate identifier
    if (!email.trim()) {
      setError('Please enter email or username');
      setIsLoading(false);
      return;
    }

    // Validate password
    if (!passwordValidation.isValid) {
      setError('Password does not meet all requirements');
      setIsLoading(false);
      return;
    }

    // Authenticate user (in production, this would call a backend API)
    try {
      const result = await authenticateUser(email, password);
      if (result.success) {
        // Store user info
        setUserInfo(result.user || { email, timestamp: new Date().toISOString() });
        // Redirect to dashboard or home page
        navigate('/dashboard');
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Admin Login</h1>
          <p>Secure Access Required</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="text"
              placeholder="Enter your email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Password validation requirements */}
          {password && (
            <div className="password-requirements">
              <p className="requirements-title">Password Requirements:</p>
              <div className={`requirement ${passwordValidation.hasUpperCase ? 'met' : 'unmet'}`}>
                <span className="status">✓</span> Uppercase letter (A-Z)
              </div>
              <div className={`requirement ${passwordValidation.hasLowerCase ? 'met' : 'unmet'}`}>
                <span className="status">✓</span> Lowercase letter (a-z)
              </div>
              <div className={`requirement ${passwordValidation.hasNumber ? 'met' : 'unmet'}`}>
                <span className="status">✓</span> Number (0-9)
              </div>
              <div className={`requirement ${passwordValidation.hasSymbol ? 'met' : 'unmet'}`}>
                <span className="status">✓</span> Symbol (!@#$%^&*etc.)
              </div>
              <div className={`requirement ${passwordValidation.isLongEnough ? 'met' : 'unmet'}`}>
                <span className="status">✓</span> Minimum 8 characters
              </div>
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading || !email || !password || !passwordValidation.isValid}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
