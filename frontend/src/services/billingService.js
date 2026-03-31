import api from './api';

export const getBills = (type) =>
  api.get('/billing', { params: type ? { type } : {} }).then((r) => r.data);
export const addBill = (data) => api.post('/billing', data).then((r) => r.data);
export const deleteBill = (id) => api.delete(`/billing/${id}`).then((r) => r.data);
