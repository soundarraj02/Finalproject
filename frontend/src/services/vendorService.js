import api from './api';

export const getVendors = () => api.get('/vendors').then((r) => r.data);
export const addVendor = (data) => api.post('/vendors', data).then((r) => r.data);
export const updateVendor = (id, data) => api.put(`/vendors/${id}`, data).then((r) => r.data);
export const deleteVendor = (id) => api.delete(`/vendors/${id}`).then((r) => r.data);
