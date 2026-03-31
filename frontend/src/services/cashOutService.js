import api from './api';

export const getCashOut = (partyType) =>
  api.get('/cashout', { params: partyType ? { partyType } : {} }).then((r) => r.data);
export const addCashOut = (data) => api.post('/cashout', data).then((r) => r.data);
export const deleteCashOut = (id) => api.delete(`/cashout/${id}`).then((r) => r.data);
