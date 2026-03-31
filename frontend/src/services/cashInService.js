import api from './api';

export const getCashIn = (partyType) =>
  api.get('/cashin', { params: partyType ? { partyType } : {} }).then((r) => r.data);
export const addCashIn = (data) => api.post('/cashin', data).then((r) => r.data);
export const deleteCashIn = (id) => api.delete(`/cashin/${id}`).then((r) => r.data);
