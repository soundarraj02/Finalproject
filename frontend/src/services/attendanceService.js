import api from './api';

export const getAttendance = (params) =>
  api.get('/attendance', { params }).then((r) => r.data);
export const addAttendance = (data) => api.post('/attendance', data).then((r) => r.data);
export const updateAttendance = (id, data) =>
  api.put(`/attendance/${id}`, data).then((r) => r.data);
export const deleteAttendance = (id) =>
  api.delete(`/attendance/${id}`).then((r) => r.data);
