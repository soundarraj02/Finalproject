import api from './api';

export const login = (identifier, password) =>
  api.post('/auth/login', { identifier, password }).then((r) => r.data);

export const register = (payloadOrName, email, password) => {
  const payload =
    typeof payloadOrName === 'object'
      ? payloadOrName
      : { name: payloadOrName, email, password };
  return api.post('/auth/register', payload).then((r) => r.data);
};

export const getMe = () => api.get('/auth/me').then((r) => r.data);

export const getAdmins = () => api.get('/auth/admins').then((r) => r.data);
