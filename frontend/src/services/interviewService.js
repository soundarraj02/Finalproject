import api from './api';

export const getInterviews = () => api.get('/interviews').then((r) => r.data);
export const addInterview = (data) => api.post('/interviews', data).then((r) => r.data);
export const updateInterview = (id, data) => api.put(`/interviews/${id}`, data).then((r) => r.data);
export const deleteInterview = (id) => api.delete(`/interviews/${id}`).then((r) => r.data);
