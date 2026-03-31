import api from './api';

export const getEmployees = () => api.get('/employees').then((r) => r.data);
export const getEmployeeById = (id) => api.get(`/employees/${id}`).then((r) => r.data);
export const addEmployee = (data) => api.post('/employees', data).then((r) => r.data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data).then((r) => r.data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`).then((r) => r.data);
