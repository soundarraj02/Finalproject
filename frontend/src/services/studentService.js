import api from './api';

export const getStudents = () => api.get('/students').then((r) => r.data);
export const getNextStudentId = () => api.get('/students/next-id').then((r) => r.data.studentId);
export const getStudentById = (id) => api.get(`/students/${id}`).then((r) => r.data);
export const addStudent = (data) => api.post('/students', data).then((r) => r.data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data).then((r) => r.data);
export const deleteStudent = (id) => api.delete(`/students/${id}`).then((r) => r.data);
