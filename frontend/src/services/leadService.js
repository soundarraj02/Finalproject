import api from './api';

export const getLeads = (rescheduled = false) =>
  api.get('/leads', { params: rescheduled ? { rescheduled: true } : {} }).then((r) => r.data);
export const addLead = (data) => api.post('/leads', data).then((r) => r.data);
export const addLeadsBulk = (data) => api.post('/leads/bulk', data).then((r) => r.data);
export const updateLead = (id, data) => api.put(`/leads/${id}`, data).then((r) => r.data);
export const deleteLead = (id) => api.delete(`/leads/${id}`).then((r) => r.data);
