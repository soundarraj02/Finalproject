import { login as loginRequest } from '../services/authService';

// Password validation utility
export const validatePassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_\-+=\[\]{};:'",.<>?/\\|`~]/.test(password);
  const isLongEnough = password.length >= 8;

  return {
    isValid: hasUpperCase && hasLowerCase && hasNumber && hasSymbol && isLongEnough,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSymbol,
    isLongEnough,
  };
};

// Authentication utility functions
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

// For demo purposes - in production, this would validate with backend
export const authenticateUser = (email, password) => {
  return loginRequest(email, password)
    .then((data) => {
      if (data?.token) {
        setAuthToken(data.token);
        setUserInfo({
          _id: data._id,
          name: data.name,
          email: data.email,
          timestamp: new Date().toISOString(),
        });
        return { success: true, token: data.token, user: data };
      }
      return { success: false, error: 'Invalid credentials' };
    })
    .catch((error) => ({
      success: false,
      error: error?.response?.data?.message || 'Login failed',
    }));
};

export const logoutUser = () => {
  removeAuthToken();
};

// Store user info in session
export const setUserInfo = (userInfo) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

export const getUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};
