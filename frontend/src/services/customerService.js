import api from './api';

export const getCustomers = () => api.get('/customers').then((r) => r.data);
export const addCustomer = (data) => api.post('/customers', data).then((r) => r.data);
export const updateCustomer = (id, data) =>
  api.put(`/customers/${id}`, data).then((r) => r.data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`).then((r) => r.data);
